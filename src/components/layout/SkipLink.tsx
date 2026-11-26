/** First focusable element on every page; jumps keyboard users past the header. */
export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="sr-only z-50 rounded-control bg-forest px-4 py-3 text-cream focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
    >
      {label}
    </a>
  );
}
