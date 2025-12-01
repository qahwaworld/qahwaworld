import { NextResponse } from 'next/server';
import { getLatestPostsForNewsSitemap } from '@/lib/actions/sitemap/newsSitemapAction';
import { getLocalizedPath } from '@/lib/localization';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qahwaworld.com';
const siteName = 'Qahwa World';

// Static generation: news sitemap is cached at build time
// Cache is refreshed only when revalidatePath() is called from the admin webhook
export const revalidate = false;

/**
 * Format date to W3C format (ISO 8601) for news sitemap
 */
function formatDate(dateString: string): string {
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
 * Get language code for news sitemap (Google News format)
 */
function getNewsLanguageCode(langCode: string): string {
  const languageMap: Record<string, string> = {
    'en': 'en',
    'ar': 'ar',
    'ru': 'ru',
  };
  return languageMap[langCode.toLowerCase()] || 'en';
}

/**
 * Generate Google News Sitemap XML
 */
function generateNewsSitemapXml(
  posts: Array<{
    databaseId: number;
    title: string;
    slug: string;
    date: string;
    language: string;
    categories: {
      nodes: Array<{
        slug: string;
      }>;
    };
  }>,
  lang: string = 'ru'
): string {
  const normalizedLang = lang.toLowerCase();
  const newsLang = getNewsLanguageCode(normalizedLang);
  
  const urlEntries = posts
    .map((post) => {
      const categorySlug = post.categories?.nodes?.[0]?.slug || 'news';
      
      // Build URL with language prefix
      const articlePath = `/${categorySlug}/${post.slug}`;
      const fullPath = getLocalizedPath(articlePath, normalizedLang);
      const url = `${siteUrl}${fullPath}`;
      
      const publicationDate = formatDate(post.date);
      const title = escapeXml(post.title);

      return `  <url>
    <loc>${escapeXml(url)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(siteName)}</news:name>
        <news:language>${newsLang}</news:language>
      </news:publication>
      <news:publication_date>${publicationDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlEntries}
</urlset>`;
}

export async function GET() {
  try {
    // Fetch latest 50 posts for Russian
    const posts = await getLatestPostsForNewsSitemap('ru', 50);

    // Generate XML
    const newsSitemapXml = generateNewsSitemapXml(posts, 'ru');

    return new NextResponse(newsSitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error generating news sitemap:', error);
    
    // Return minimal sitemap on error
    const minimalSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`;

    return new NextResponse(minimalSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}

