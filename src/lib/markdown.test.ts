import { describe, expect, it } from 'vitest';

import { type InlineNode, isSafeHref, parseInline, parseMarkdown } from './markdown';

/** Visible text of inline nodes (for assertions). */
function text(nodes: InlineNode[]): string {
  return nodes
    .map((node) => {
      if (node.kind === 'text') return node.value;
      if (node.kind === 'break') return ' ';
      return text(node.children);
    })
    .join('');
}

describe('parseMarkdown', () => {
  it('splits paragraphs on blank lines', () => {
    const blocks = parseMarkdown('One.\n\nTwo.');
    expect(blocks).toEqual([
      { kind: 'paragraph', children: [{ kind: 'text', value: 'One.' }] },
      { kind: 'paragraph', children: [{ kind: 'text', value: 'Two.' }] },
    ]);
  });

  it('parses bullet and numbered lists', () => {
    const blocks = parseMarkdown('- a\n- b\n\n1. c\n2. d');
    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toMatchObject({ kind: 'list', ordered: false });
    expect(blocks[1]).toMatchObject({ kind: 'list', ordered: true });
  });

  it('keeps single line breaks inside a paragraph', () => {
    const [block] = parseMarkdown('line one\nline two');
    expect(block).toMatchObject({
      kind: 'paragraph',
      children: [{ kind: 'text' }, { kind: 'break' }, { kind: 'text' }],
    });
  });

  it('handles Windows line endings', () => {
    expect(parseMarkdown('a\r\n\r\nb')).toHaveLength(2);
  });

  it('parses headings (indented up to three spaces, optional closing #s)', () => {
    const blocks = parseMarkdown('# One\n   ## Two ##\n###### Six\nText');
    expect(blocks.map((block) => block.kind)).toEqual([
      'heading',
      'heading',
      'heading',
      'paragraph',
    ]);
    expect(blocks[1]).toMatchObject({ kind: 'heading', level: 2 });
    expect(blocks[1]?.kind === 'heading' && text(blocks[1].children)).toBe('Two');
    expect(blocks[2]).toMatchObject({ level: 6 });
  });

  it('needs a space after # (so "#tag" stays text)', () => {
    expect(parseMarkdown('#therootingproject')).toMatchObject([{ kind: 'paragraph' }]);
  });

  it('parses block quotes over several lines', () => {
    const blocks = parseMarkdown('> The solution\n> is in the roots.\n\nAfter');
    expect(blocks[0]).toMatchObject({ kind: 'quote' });
    expect(blocks[0]?.kind === 'quote' && text(blocks[0].children)).toBe(
      'The solution is in the roots.',
    );
    expect(blocks[1]).toMatchObject({ kind: 'paragraph' });
  });
});

describe('parseInline', () => {
  it('parses bold, italic and links', () => {
    expect(parseInline('**bold** and *it* [link](/our-story)')).toEqual([
      { kind: 'strong', children: [{ kind: 'text', value: 'bold' }] },
      { kind: 'text', value: ' and ' },
      { kind: 'em', children: [{ kind: 'text', value: 'it' }] },
      { kind: 'text', value: ' ' },
      { kind: 'link', href: '/our-story', children: [{ kind: 'text', value: 'link' }] },
    ]);
  });

  it('drops unsafe link targets but keeps the text', () => {
    expect(parseInline('[click](javascript:alert(1))')).toEqual([
      { kind: 'text', value: 'click' },
      { kind: 'text', value: ')' },
    ]);
  });

  it('never produces HTML from raw tags', () => {
    expect(parseInline('<script>alert(1)</script>')).toEqual([
      { kind: 'text', value: '<script>alert(1)</script>' },
    ]);
  });

  it('leaves lone asterisks, snake_case and brackets alone', () => {
    const source = '*Note: see [enter date] and snake_case_name';
    expect(parseInline(source)).toEqual([{ kind: 'text', value: source }]);
  });

  it('supports backslash escapes', () => {
    expect(text(parseInline('\\*not italic\\*'))).toBe('*not italic*');
  });
});

describe('isSafeHref', () => {
  it('allows site paths, http(s), mailto, tel and anchors only', () => {
    expect(isSafeHref('/a')).toBe(true);
    expect(isSafeHref('https://a.b')).toBe(true);
    expect(isSafeHref('mailto:a@b.c')).toBe(true);
    expect(isSafeHref('tel:123')).toBe(true);
    expect(isSafeHref('#x')).toBe(true);
    expect(isSafeHref('//evil.example')).toBe(false);
    expect(isSafeHref('JavaScript:alert(1)')).toBe(false);
  });
});
