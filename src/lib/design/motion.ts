/**
 * Open / close animation for full-screen <dialog> overlays (menu, lightboxes): the dialog and its
 * backdrop fade, using `@starting-style` and discrete transitions so closing animates too.
 * Pure CSS: browsers without support simply show and hide instantly. A fade is not movement,
 * so it also runs for visitors who ask for reduced motion; anything that slides is `motion-safe:`.
 */
export const DIALOG_MOTION = [
  'opacity-0 transition-[opacity,translate,display,overlay] duration-300 ease-out transition-discrete',
  'open:opacity-100 starting:open:opacity-0',
  'backdrop:opacity-0 backdrop:transition-[opacity,display,overlay] backdrop:duration-300 backdrop:transition-discrete',
  'open:backdrop:opacity-100 starting:open:backdrop:opacity-0',
].join(' ');

/** Delay for the n-th item of a staggered entrance (used with `animate-rise`). */
export function staggerDelay(index: number, stepMs = 70): { animationDelay: string } {
  return { animationDelay: `${String(index * stepMs)}ms` };
}
