'use client';

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { DIALOG_MOTION } from '@/lib/design/motion';

export interface LightboxLabels {
  close: string;
  previous: string;
  next: string;
}

/**
 * State for a full-size viewer built on the native <dialog> element, which traps focus, closes
 * on Escape and returns focus to the control that opened it. Arrow keys step through the items.
 */
export function useLightbox(count: number) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<number | null>(null);

  const open = (index: number) => {
    setCurrent(index);
    dialogRef.current?.showModal();
  };
  const close = () => {
    dialogRef.current?.close();
  };
  const step = useCallback(
    (delta: number) => {
      setCurrent((index) => (index === null ? index : (index + delta + count) % count));
    },
    [count],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    // `current` is kept after closing so the item stays visible while the dialog fades out.
    dialog.addEventListener('keydown', onKey);
    return () => {
      dialog.removeEventListener('keydown', onKey);
    };
  }, [step]);

  return { dialogRef, current, open, close, step };
}

interface LightboxDialogProps {
  lightbox: ReturnType<typeof useLightbox>;
  /** Number of items, to decide whether Previous / Next are shown. */
  count: number;
  /** Accessible name of the dialog (usually the active image's alt text). */
  label: string | undefined;
  labels: LightboxLabels;
  /** The active item (the last one shown stays rendered while the dialog is closed). */
  children: ReactNode;
}

const CONTROL = 'min-h-11 min-w-11 rounded-control bg-cream px-4 py-2 text-forest hover:bg-mint';

/** Full-screen dialog with Close, Previous and Next around the active item; fades in and out. */
export function LightboxDialog({ lightbox, count, label, labels, children }: LightboxDialogProps) {
  const { dialogRef, close, step } = lightbox;
  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      className={`m-auto h-full max-h-none w-full max-w-none bg-forest/95 p-4 text-cream backdrop:bg-forest/80 sm:p-8 ${DIALOG_MOTION}`}
    >
      {children ? (
        <div className="flex h-full flex-col gap-4">
          <div className="flex justify-end">
            <button type="button" onClick={close} className={CONTROL}>
              {labels.close}
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1">{children}</div>
          {count > 1 ? (
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  step(-1);
                }}
                className={CONTROL}
              >
                {labels.previous}
              </button>
              <button
                type="button"
                onClick={() => {
                  step(1);
                }}
                className={CONTROL}
              >
                {labels.next}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
