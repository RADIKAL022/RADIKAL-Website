'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { SocialIcon } from '@/components/layout/SocialIcon';
import { SmartLink } from '@/components/ui/SmartLink';
import { staggerDelay } from '@/lib/design/motion';
import type { ImageData, SocialPost } from '@/types/content';

import { LightboxDialog, type LightboxLabels, useLightbox } from './Lightbox';

interface PostFeedProps {
  posts: SocialPost[];
  /** Posts shown before the "Load more" button; all when undefined. */
  visible: number | undefined;
  loadMoreLabel: string | undefined;
  /** Account shown above each post in the full-size view. */
  account: { name: string | undefined; image: ImageData | undefined };
  labels: LightboxLabels & { viewPost: string };
  /** Classes of the section's primary button, so "Load more" matches the other buttons. */
  buttonClass: string;
}

/**
 * Instagram-style grid of posts: square tiles (large ones span two columns and two rows), the
 * caption on hover or focus, and a viewer with the full text. Posts revealed by "Load more"
 * rise in one after another. Replaces the Wix Instagram widget
 * with static content: no third-party script, no tracking, no expiring image URLs.
 */
export function PostFeed({
  posts,
  visible,
  loadMoreLabel,
  account,
  labels,
  buttonClass,
}: PostFeedProps) {
  const lightbox = useLightbox(posts.length);
  const [expanded, setExpanded] = useState(false);
  const firstRevealed = useRef<HTMLButtonElement>(null);

  const limit = visible ?? posts.length;
  const canLoadMore = !expanded && limit < posts.length && Boolean(loadMoreLabel);
  const shown = canLoadMore ? posts.slice(0, limit) : posts;
  const active = lightbox.current === null ? undefined : posts[lightbox.current];

  // After "Load more", move focus to the first new post so keyboard users continue from there.
  useEffect(() => {
    if (expanded) firstRevealed.current?.focus();
  }, [expanded]);

  return (
    <div className="flex flex-col items-center gap-10">
      <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {shown.map((post, index) => (
          <li
            key={post.image.src}
            className={
              [post.large && 'col-span-2 row-span-2', index >= limit && 'animate-rise']
                .filter(Boolean)
                .join(' ') || undefined
            }
            style={index >= limit ? staggerDelay(index - limit) : undefined}
          >
            <button
              ref={index === limit ? firstRevealed : undefined}
              type="button"
              onClick={() => {
                lightbox.open(index);
              }}
              className="group relative block aspect-square w-full overflow-hidden bg-white"
            >
              <Image
                src={post.image.src}
                alt={post.image.alt}
                fill
                sizes={
                  post.large ? '(min-width: 640px) 50vw, 100vw' : '(min-width: 640px) 25vw, 50vw'
                }
                className="object-cover"
              />
              {post.caption ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center bg-black/60 p-4 text-center text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-6 sm:text-lead"
                >
                  <span className={post.large ? 'line-clamp-6' : 'line-clamp-4'}>
                    {post.caption}
                  </span>
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {canLoadMore ? (
        <button
          type="button"
          onClick={() => {
            setExpanded(true);
          }}
          className={`inline-flex min-h-12 items-center justify-center rounded-control px-8 py-3 ${buttonClass}`}
        >
          {loadMoreLabel}
        </button>
      ) : null}

      <LightboxDialog
        lightbox={lightbox}
        count={posts.length}
        label={active?.image.alt}
        labels={labels}
      >
        {active ? (
          <article className="m-auto flex max-h-full w-full max-w-md flex-col overflow-y-auto bg-cream text-forest md:w-auto md:max-w-none md:flex-row md:overflow-hidden">
            <div className="relative aspect-square w-full shrink-0 bg-white md:h-[min(75vh,36rem)] md:w-auto">
              <Image
                src={active.image.src}
                alt={active.image.alt}
                fill
                sizes="(min-width: 768px) 36rem, 100vw"
                className="object-contain"
              />
            </div>
            <div className="flex flex-col gap-4 p-6 md:h-[min(75vh,36rem)] md:w-80 md:overflow-y-auto">
              {account.name || active.date || active.href ? (
                <header className="flex items-center gap-3 border-b border-current/20 pb-4">
                  {account.image ? (
                    <Image
                      src={account.image.src}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 shrink-0 bg-white object-contain"
                    />
                  ) : null}
                  <div className="flex flex-1 flex-col">
                    {account.name ? <span>{account.name}</span> : null}
                    {active.date ? <span className="text-sm text-moss">{active.date}</span> : null}
                  </div>
                  {active.href ? (
                    <SmartLink
                      href={active.href}
                      aria-label={labels.viewPost}
                      className="flex size-11 shrink-0 items-center justify-center rounded-control hover:bg-mint"
                    >
                      <SocialIcon platform="instagram" />
                    </SmartLink>
                  ) : null}
                </header>
              ) : null}
              {active.caption ? <p className="whitespace-pre-line">{active.caption}</p> : null}
            </div>
          </article>
        ) : null}
      </LightboxDialog>
    </div>
  );
}
