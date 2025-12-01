import { NextResponse } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qahwaworld.com';

// Static generation: sitemap is cached at build time
// Cache is refreshed only when revalidatePath() is called from the admin webhook
export const revalidate = false;

/**
 * Generate sitemap index XML that lists all language-specific sitemaps
 */
function generateSitemapIndex(languages: string[]): string {
  const sitemapEntries = languages
    .map(
      (lang) => `  <sitemap>
    <loc>${siteUrl}/sitemap/${lang}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

export async function GET() {
  try {
    // List all supported languages
    const languages = ['en', 'ar', 'ru'];
    
    // Generate sitemap index
    const sitemapIndex = generateSitemapIndex(languages);

    return new NextResponse(sitemapIndex, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    
    // Return minimal sitemap index on error
    const minimalSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</sitemapindex>`;

    return new NextResponse(minimalSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}

