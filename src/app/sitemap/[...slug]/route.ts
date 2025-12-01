import { NextResponse } from 'next/server';
import { getSitemapData } from '@/lib/actions/sitemap/sitemapAction';
import { getLocalizedPath } from '@/lib/localization';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qahwaworld.com';

// Revalidate sitemap every hour
// Static generation: sitemap is cached at build time
// Cache is refreshed only when revalidatePath() is called from the admin webhook
export const revalidate = false;

// Route matcher to ensure .xml files are handled by this route
export const dynamic = 'force-dynamic';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

/**
 * Format date to ISO 8601 format for sitemap
 */
function formatDate(dateString: string | null | undefined): string {
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
function generateSitemapXml(urls: SitemapUrl[]): string {
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

interface RouteParams {
  params: Promise<{ slug: string[] }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    
    // Handle different URL formats:
    // - /sitemap/en.xml -> slug = ['en', 'xml']
    // - /sitemap/en -> slug = ['en']
    let lang: string;
    
    if (slug.length === 0) {
      return new NextResponse('Invalid sitemap URL', { status: 404 });
    }
    
    // Extract language from slug
    // If slug is ['en', 'xml'], take 'en'
    // If slug is ['en.xml'], extract 'en' from 'en.xml'
    const firstSegment = slug[0];
    
    if (firstSegment.includes('.')) {
      // Handle case like 'en.xml'
      lang = firstSegment.split('.')[0];
    } else {
      // Handle case like ['en', 'xml'] or just ['en']
      lang = firstSegment;
    }
    
    const normalizedLang = lang.toLowerCase();
    
    // Validate language
    const validLanguages = ['en', 'ar', 'ru'];
    if (!validLanguages.includes(normalizedLang)) {
      return new NextResponse('Invalid language', { status: 404 });
    }

    // Fetch sitemap data for the language
    const sitemapData = await getSitemapData(normalizedLang);
    
    if (!sitemapData) {
      // Return minimal sitemap on error
      const minimalSitemap = generateSitemapXml([]);
      return new NextResponse(minimalSitemap, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
        },
      });
    }

    const urls: SitemapUrl[] = [];
    const getPath = (path: string) => getLocalizedPath(path, normalizedLang);

    // Add homepage
    urls.push({
      loc: normalizedLang === 'en' ? siteUrl : `${siteUrl}/${normalizedLang}`,
      lastmod: formatDate(new Date().toISOString()),
      changefreq: 'daily',
      priority: '1.0',
    });

    // Add static pages (about, contact, privacy, faq)
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

    // Add tags page
    urls.push({
      loc: `${siteUrl}${getPath('/tags')}`,
      lastmod: formatDate(new Date().toISOString()),
      changefreq: 'weekly',
      priority: '0.7',
    });

    // Add search page
    urls.push({
      loc: `${siteUrl}${getPath('/search')}`,
      lastmod: formatDate(new Date().toISOString()),
      changefreq: 'weekly',
      priority: '0.6',
    });

    // Add WordPress pages
    sitemapData.pages.nodes.forEach((page) => {
      // Skip special pages that are handled by Next.js routes
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

    // Add posts (articles) - URL structure: /[category]/[slug] or /[lang]/[category]/[slug]
    sitemapData.posts.nodes.forEach((post) => {
      // Get the first category slug
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
    sitemapData.categories.nodes.forEach((category) => {
      // Filter out system categories
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
    sitemapData.tags.nodes.forEach((tag) => {
      const tagPath = `/tag/${tag.slug}`;
      urls.push({
        loc: `${siteUrl}${getPath(tagPath)}`,
        lastmod: formatDate(new Date().toISOString()),
        changefreq: 'weekly',
        priority: '0.7',
      });
    });

    // Generate XML
    const sitemapXml = generateSitemapXml(urls);

    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return minimal sitemap on error
    const minimalSitemap = generateSitemapXml([]);
    return new NextResponse(minimalSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}

