import { NextResponse } from 'next/server';
import { getSitemapData } from '@/lib/actions/sitemap/sitemapAction';
import { generateSitemapXml, buildSitemapUrls } from '../sitemapUtils';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qahwaworld.com';

// Static generation: sitemap is cached at build time
// Cache is refreshed only when revalidatePath() is called from the admin webhook
export const revalidate = false;

export async function GET() {
  return generateLanguageSitemap('ar', siteUrl);
}

async function generateLanguageSitemap(lang: string, siteUrl: string) {
  try {
    const normalizedLang = lang.toLowerCase();
    
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

    const urls = buildSitemapUrls(normalizedLang, sitemapData, siteUrl);
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

