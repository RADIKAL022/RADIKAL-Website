import { Fragment, type ReactNode } from 'react';

import { TONES } from '@/lib/design/tones';
import { type InlineNode, parseMarkdown } from '@/lib/markdown';
import type { Tone } from '@/types/content';

import { SmartLink } from './SmartLink';

interface MarkdownProps {
  source: string;
  tone: Tone;
  /**
   * Level for Markdown "#" and "##" headings: one below the heading the text sits under, so the
   * page outline stays in order (3 under a section h2, 4 inside a card titled with an h3).
   * "###" and deeper are one level smaller still.
   */
  headingBase?: 3 | 4;
  className?: string;
}

const HEADING_TAGS = { 3: 'h3', 4: 'h4', 5: 'h5' } as const;
const HEADING_SIZES = { 3: 'text-h3', 4: 'text-lead', 5: 'text-body font-semibold' } as const;

/** Renders CMS Markdown as React elements (never raw HTML). */
export function Markdown({ source, tone, headingBase = 3, className = '' }: MarkdownProps) {
  const linkClass = TONES[tone].link;
  return (
    <div className={`space-y-5 ${className}`}>
      {parseMarkdown(source).map((block, index) => {
        if (block.kind === 'paragraph') {
          return <p key={index}>{renderInline(block.children, linkClass)}</p>;
        }
        if (block.kind === 'heading') {
          const level = block.level <= 2 ? headingBase : ((headingBase + 1) as 4 | 5);
          const Tag = HEADING_TAGS[level];
          return (
            <Tag key={index} className={`pt-2 ${HEADING_SIZES[level]}`}>
              {renderInline(block.children, linkClass)}
            </Tag>
          );
        }
        if (block.kind === 'quote') {
          return (
            <blockquote
              key={index}
              className="border-l-2 border-current/40 pl-5 font-display text-lead italic"
            >
              {renderInline(block.children, linkClass)}
            </blockquote>
          );
        }
        const ListTag = block.ordered ? 'ol' : 'ul';
        return (
          <ListTag
            key={index}
            className={`space-y-2 pl-6 ${block.ordered ? 'list-decimal' : 'list-disc'}`}
          >
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{renderInline(item, linkClass)}</li>
            ))}
          </ListTag>
        );
      })}
    </div>
  );
}

function renderInline(nodes: InlineNode[], linkClass: string): ReactNode {
  return nodes.map((node, index) => {
    switch (node.kind) {
      case 'text':
        return <Fragment key={index}>{node.value}</Fragment>;
      case 'break':
        return <br key={index} />;
      case 'strong':
        return <strong key={index}>{renderInline(node.children, linkClass)}</strong>;
      case 'em':
        return <em key={index}>{renderInline(node.children, linkClass)}</em>;
      case 'link':
        return (
          <SmartLink key={index} href={node.href} className={linkClass}>
            {renderInline(node.children, linkClass)}
          </SmartLink>
        );
    }
  });
}
