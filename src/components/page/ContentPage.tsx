import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { JsonLd } from '@/components/ui/JsonLd';
import { getPage, getSite, HOME_SLUG, pathForSlug } from '@/lib/content/loader';
import { breadcrumbJsonLd } from '@/lib/seo';
import { absoluteUrl, getSiteUrl } from '@/lib/site-url';

/** Renders the content page stored in `content/pages/<slug>.json`. */
export function ContentPage({ slug }: { slug: string }) {
  const site = getSite();
  const page = getPage(slug);
  const origin = getSiteUrl();
  const pathname = pathForSlug(slug);

  return (
    <>
      {slug === HOME_SLUG ? null : (
        <JsonLd
          data={breadcrumbJsonLd(
            [
              { name: site.ui.breadcrumbHome, pathname: '/' },
              { name: page.title, pathname },
            ],
            origin,
          )}
        />
      )}
      <SectionRenderer
        sections={page.sections}
        context={{ site, pageUrl: absoluteUrl(pathname, origin) }}
      />
    </>
  );
}
