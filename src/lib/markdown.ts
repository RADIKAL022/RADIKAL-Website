/**
 * A deliberately small Markdown parser for content copy. It supports exactly what the
 * content uses (paragraphs, headings, quotes, bullet and numbered lists,
 * links, bold, italic, line breaks) and returns a tree that React renders without `dangerouslySetInnerHTML`,
 * so CMS content can never inject HTML or scripts.
 */

export type InlineNode =
  | { kind: 'text'; value: string }
  | { kind: 'strong'; children: InlineNode[] }
  | { kind: 'em'; children: InlineNode[] }
  | { kind: 'link'; href: string; children: InlineNode[] }
  | { kind: 'break' };

export type BlockNode =
  | { kind: 'paragraph'; children: InlineNode[] }
  | { kind: 'heading'; level: number; children: InlineNode[] }
  | { kind: 'quote'; children: InlineNode[] }
  | { kind: 'list'; ordered: boolean; items: InlineNode[][] };

const SAFE_HREF = /^(\/(?!\/)|https?:\/\/|mailto:|tel:|#)/i;
const BULLET = /^\s*[-*+]\s+/;
const NUMBERED = /^\s*\d+[.)]\s+/;
/** ATX heading: up to three spaces, 1–6 `#`, a space, the text, optional closing `#`s. */
const HEADING = /^ {0,3}(#{1,6})\s+(.*?)(?:\s+#+)?\s*$/;
const QUOTE = /^ {0,3}>\s?/;

/** Returns true when `href` is a link target we are willing to render. */
export function isSafeHref(href: string): boolean {
  return SAFE_HREF.test(href.trim());
}

/** Parses Markdown into block nodes. */
export function parseMarkdown(source: string): BlockNode[] {
  const blocks: BlockNode[] = [];
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  let paragraph: string[] = [];
  // Declared via `as` so TypeScript does not narrow it to `null` (the closures reassign it).
  let list = null as { ordered: boolean; items: string[] } | null;
  let quote: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ kind: 'paragraph', children: parseInline(paragraph.join('\n')) });
      paragraph = [];
    }
  };
  const flushQuote = () => {
    if (quote.length > 0) {
      blocks.push({ kind: 'quote', children: parseInline(quote.join('\n')) });
      quote = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push({
        kind: 'list',
        ordered: list.ordered,
        items: list.items.map((item) => parseInline(item)),
      });
      list = null;
    }
  };

  for (const line of lines) {
    if (line.trim() === '') {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }
    const heading = HEADING.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      flushQuote();
      blocks.push({
        kind: 'heading',
        level: heading[1]?.length ?? 1,
        children: parseInline(heading[2] ?? ''),
      });
      continue;
    }
    if (QUOTE.test(line)) {
      flushParagraph();
      flushList();
      quote.push(line.replace(QUOTE, '').trim());
      continue;
    }
    flushQuote();
    const ordered = NUMBERED.test(line);
    if (ordered || BULLET.test(line)) {
      flushParagraph();
      if (list?.ordered !== ordered) flushList();
      list ??= { ordered, items: [] };
      list.items.push(line.replace(ordered ? NUMBERED : BULLET, ''));
      continue;
    }
    if (list) {
      // A non-bullet line directly after a bullet continues that item.
      const last = list.items.length - 1;
      list.items[last] = `${list.items[last] ?? ''} ${line.trim()}`;
      continue;
    }
    paragraph.push(line.trim());
  }
  flushParagraph();
  flushList();
  flushQuote();
  return blocks;
}

/** Parses inline Markdown (links, bold, italic, hard line breaks). */
export function parseInline(source: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let text = '';
  let i = 0;

  const pushText = () => {
    if (text) {
      nodes.push({ kind: 'text', value: text });
      text = '';
    }
  };

  while (i < source.length) {
    const rest = source.slice(i);

    if (rest.startsWith('\\') && rest.length > 1) {
      text += rest.charAt(1);
      i += 2;
      continue;
    }

    if (rest.startsWith('\n')) {
      pushText();
      nodes.push({ kind: 'break' });
      i += 1;
      continue;
    }

    const link = /^\[([^\]]+)\]\(([^)\s]+)\)/.exec(rest);
    if (link) {
      const [match, label = '', href = ''] = link;
      pushText();
      if (isSafeHref(href)) {
        nodes.push({ kind: 'link', href, children: parseInline(label) });
      } else {
        nodes.push(...parseInline(label));
      }
      i += match.length;
      continue;
    }

    const strong = /^(\*\*|__)(?=\S)([\s\S]*?\S)\1/.exec(rest);
    if (strong) {
      pushText();
      nodes.push({ kind: 'strong', children: parseInline(strong[2] ?? '') });
      i += strong[0].length;
      continue;
    }

    const em = /^(\*|_)(?=\S)([\s\S]*?\S)\1(?![*_\w])/.exec(rest);
    // `_` only opens emphasis at a word boundary, so snake_case words stay literal.
    const prevIsWord = i > 0 && /\w/.test(source.charAt(i - 1));
    if (em && !(em[1] === '_' && prevIsWord)) {
      pushText();
      nodes.push({ kind: 'em', children: parseInline(em[2] ?? '') });
      i += em[0].length;
      continue;
    }

    text += rest.charAt(0);
    i += 1;
  }
  pushText();
  return nodes;
}
