import { Metadata } from 'next';
import { cache } from 'react';
import { HomePage } from '@/components/home';
import { getPagesSeo } from '@/lib/actions/seo/pagesSeoAction';
import { JsonLdSchema } from '@/components/JsonLdSchema';

// Cache the SEO data fetch to avoid duplicate calls
const getCachedSeoData = cache(async (language: string, id: number | null = null) => {
  return await getPagesSeo(language, id);
});

/**
 * Helper function to extract localized text from WordPress format
 * Format: [:ar]Arabic[:en]English[:ru]Russian[:]
 */
function getLocalizedText(text: string = '', locale: string = 'en'): string {
  if (!text) return '';
  
  // If text doesn't contain localization markers, return as is
  if (!text.includes('[:')) return text;
  
  const localeMap: Record<string, string> = {
    'ar': 'ar',
    'en': 'en',
    'ru': 'ru',
  };
  
  const targetLocale = localeMap[locale.toLowerCase()] || 'en';
  const pattern = new RegExp(`\\[:${targetLocale}\\]([^\\[]*)(?=\\[:|$)`, 'g');
  const match = pattern.exec(text);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // Fallback: try to extract any text between markers
  const fallbackPattern = /\[:[^\]]+\]([^\[]+)/g;
  const fallbackMatch = fallbackPattern.exec(text);
  if (fallbackMatch && fallbackMatch[1]) {
    return fallbackMatch[1].trim();
  }
  
  // Last resort: return text without markers
  return text.replace(/\[:[^\]]+\]/g, '').trim();
}

/**
 * Generate metadata for the home page using WordPress SEO data
 */
export async function generateMetadata(): Promise<Metadata> {
  // Get home page ID from environment variable or use null to fetch by language only
  // If you know the specific home page ID, set NEXT_PUBLIC_HOME_PAGE_ID in your .env file
  const homePageId = parseInt(process.env.NEXT_PUBLIC_HOME_PAGE_ID || '1214');

  
  // Fetch SEO data from WordPress (cached)
  // Pass page ID if available, otherwise fetch by language only
  const seoData = await getCachedSeoData('en', homePageId);
  
  // Default values
  const defaultTitle = 'Qahwa World - Coffee Culture & News';
  const defaultDescription = 'Explore global coffee news, trends, interviews, and specialty stories. Qahwa World is your gateway to the coffee industry.';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qahwaworld.com';
  
  // Use SEO data if available, otherwise use defaults
  const title = seoData?.title 
    ? getLocalizedText(seoData.title, 'en') 
    : defaultTitle;
  
  const description = seoData?.metaDesc || defaultDescription;
  const keywords = seoData?.metaKeywords || 'coffee, qahwa, coffee news, brewing, coffee culture, barista, coffee community';
  const canonical = seoData?.canonical || siteUrl;
  
  // Open Graph data
  const ogTitle = seoData?.opengraphTitle 
    ? getLocalizedText(seoData.opengraphTitle, 'en')
    : title;
  const ogDescription = seoData?.opengraphDescription || description;
  const ogUrl = seoData?.opengraphUrl || canonical;
  const ogImage = seoData?.opengraphImage?.sourceUrl;
  const ogSiteName = seoData?.opengraphSiteName 
    ? getLocalizedText(seoData.opengraphSiteName, 'en')
    : 'Qahwa World';
  const ogType = seoData?.opengraphType || 'website';
  
  // Twitter data
  const twitterTitle = seoData?.twitterTitle || ogTitle;
  const twitterDescription = seoData?.twitterDescription || ogDescription;
  const twitterImage = seoData?.twitterImage?.sourceUrl || ogImage;
  
  // Robots meta
  const robots = {
    index: seoData?.metaRobotsNoindex === 'noindex' ? false : true,
    follow: seoData?.metaRobotsNofollow === 'nofollow' ? false : true,
  };
  
  // Build metadata object
  const metadata: Metadata = {
    title,
    description,
    keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined,
    alternates: {
      canonical,
    },
    robots,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: ogUrl,
      siteName: ogSiteName,
      type: ogType as 'website' | 'article',
      ...(ogImage && {
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: ogTitle,
          },
        ],
      }),
      ...(seoData?.opengraphPublishedTime && {
        publishedTime: seoData.opengraphPublishedTime,
      }),
      ...(seoData?.opengraphModifiedTime && {
        modifiedTime: seoData.opengraphModifiedTime,
      }),
      ...(seoData?.opengraphPublisher && {
        locale: 'en_US',
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      ...(twitterImage && {
        images: [twitterImage],
      }),
    },
  };
  
  return metadata;
}

export default async function RootHomePage() {
  // Get home page ID from environment variable or use null to fetch by language only
  const homePageId = parseInt(process.env.NEXT_PUBLIC_HOME_PAGE_ID || '1214');
  
  // Fetch SEO data for JSON-LD schema (cached - same request as generateMetadata)
  const seoData = await getCachedSeoData('en', homePageId);
  
  return (
    <>
      <JsonLdSchema seoData={seoData} />
      <HomePage locale="en" />
    </>
  );
}
