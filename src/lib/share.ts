export type SharePlatform = 'facebook' | 'x' | 'whatsapp';

/** Share URLs for a page, matching the share buttons of the original donation widgets. */
export function shareUrls(pageUrl: string): Record<SharePlatform, string> {
  const encoded = encodeURIComponent(pageUrl);
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    x: `https://twitter.com/intent/tweet?url=${encoded}`,
    whatsapp: `https://api.whatsapp.com/send/?text=${encoded}`,
  };
}
