import { getLocalizedPath } from '@/lib/localization';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

/**
 * Format date to ISO 8601 format for sitemap
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return new Date().toISOString();
  }
  try {
    return new Date(dateString).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate sitemap XML
 */
export function generateSitemapXml(urls: SitemapUrl[]): string {
  const urlEntries = urls
    .map(
      (url) => `    <url>
      <loc>${escapeXml(url.loc)}</loc>
      <lastmod>${url.lastmod}</lastmod>
      <changefreq>${url.changefreq}</changefreq>
      <priority>${url.priority}</priority>
    </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Build sitemap URLs for a specific language
 */
export function buildSitemapUrls(lang: string, sitemapData: any, siteUrl: string): SitemapUrl[] {
  const urls: SitemapUrl[] = [];
  const getPath = (path: string) => getLocalizedPath(path, lang);

  // Add homepage
  urls.push({
    loc: lang === 'en' ? siteUrl : `${siteUrl}/${lang}`,
    lastmod: formatDate(new Date().toISOString()),
    changefreq: 'daily',
    priority: '1.0',
  });

  // Add static pages
  const staticPages = [
    { slug: 'about', priority: '0.8' },
    { slug: 'contact', priority: '0.8' },
    { slug: 'privacy', priority: '0.7' },
    { slug: 'faq', priority: '0.7' },
  ];

  staticPages.forEach((page) => {
    urls.push({
      loc: `${siteUrl}${getPath(`/${page.slug}`)}`,
      lastmod: formatDate(new Date().toISOString()),
      changefreq: 'monthly',
      priority: page.priority,
    });
  });

  // Add tags and search pages
  urls.push({
    loc: `${siteUrl}${getPath('/tags')}`,
    lastmod: formatDate(new Date().toISOString()),
    changefreq: 'weekly',
    priority: '0.7',
  });

  urls.push({
    loc: `${siteUrl}${getPath('/search')}`,
    lastmod: formatDate(new Date().toISOString()),
    changefreq: 'weekly',
    priority: '0.6',
  });

  // Add WordPress pages
  sitemapData.pages.nodes.forEach((page: any) => {
    const specialPages = ['about', 'contact', 'privacy-policy', 'privacy', 'faq'];
    if (!specialPages.includes(page.slug.toLowerCase())) {
      urls.push({
        loc: `${siteUrl}${getPath(`/${page.slug}`)}`,
        lastmod: formatDate(page.date),
        changefreq: 'monthly',
        priority: '0.8',
      });
    }
  });

  // Add posts (articles)
  sitemapData.posts.nodes.forEach((post: any) => {
    const categorySlug = post.categories?.nodes?.[0]?.slug || 'news';
    const articlePath = `/${categorySlug}/${post.slug}`;
    urls.push({
      loc: `${siteUrl}${getPath(articlePath)}`,
      lastmod: formatDate(post.date),
      changefreq: 'weekly',
      priority: '0.9',
    });
  });

  // Add category pages
  sitemapData.categories.nodes.forEach((category: any) => {
    const systemCategories = ['uncategorized', 'uncategorized-ru', 'uncategorized-ar', 'category-ru', 'без-категории'];
    if (!systemCategories.includes(category.slug.toLowerCase())) {
      const categoryPath = `/${category.slug}`;
      urls.push({
        loc: `${siteUrl}${getPath(categoryPath)}`,
        lastmod: formatDate(new Date().toISOString()),
        changefreq: 'daily',
        priority: '0.8',
      });
    }
  });

  // Add tag pages
  sitemapData.tags.nodes.forEach((tag: any) => {
    const tagPath = `/tag/${tag.slug}`;
    urls.push({
      loc: `${siteUrl}${getPath(tagPath)}`,
      lastmod: formatDate(new Date().toISOString()),
      changefreq: 'weekly',
      priority: '0.7',
    });
  });

  return urls;
}

