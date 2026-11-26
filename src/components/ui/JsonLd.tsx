import { serializeJsonLd } from '@/lib/seo';

/** Embeds structured data for search engines. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be raw JSON; serializeJsonLd escapes `<` so content cannot break out.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
