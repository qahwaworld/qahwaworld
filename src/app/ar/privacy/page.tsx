import { Metadata } from 'next';
import { cache } from 'react';
import { PrivacyPage } from '@/components/privacy';
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
function getLocalizedText(text: string = '', locale: string = 'ar'): string {
  if (!text) return '';
  
  // If text doesn't contain localization markers, return as is
  if (!text.includes('[:')) return text;
  
  const localeMap: Record<string, string> = {
    'ar': 'ar',
    'en': 'en',
    'ru': 'ru',
  };
  
  const targetLocale = localeMap[locale.toLowerCase()] || 'ar';
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
 * Generate metadata for the Arabic privacy page using WordPress SEO data
 */
export async function generateMetadata(): Promise<Metadata> {
  // Get privacy page ID from environment variable or use null to fetch by language only
  const privacyPageId = process.env.NEXT_PUBLIC_PRIVACY_PAGE_ID 
    ? parseInt(process.env.NEXT_PUBLIC_PRIVACY_PAGE_ID, 10) 
    : null;
  
  // Fetch SEO data from WordPress (cached) for Arabic
  const seoData = await getCachedSeoData('ar', privacyPageId);
  
  // Default values
  const defaultTitle = 'سياسة الخصوصية - عالم القهوة';
  const defaultDescription = 'اقرأ سياسة الخصوصية لعالم القهوة لفهم كيفية جمع واستخدام وحماية معلوماتك الشخصية.';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qahwaworld.com';
  
  // Use SEO data if available, otherwise use defaults
  const title = seoData?.title 
    ? getLocalizedText(seoData.title, 'ar') 
    : defaultTitle;
  
  const description = seoData?.metaDesc || defaultDescription;
  const keywords = seoData?.metaKeywords || 'سياسة الخصوصية، حماية البيانات، المعلومات الشخصية، ملفات تعريف الارتباط';
  const canonical = seoData?.canonical || `${siteUrl}/ar/privacy`;
  
  // Open Graph data
  const ogTitle = seoData?.opengraphTitle 
    ? getLocalizedText(seoData.opengraphTitle, 'ar')
    : title;
  const ogDescription = seoData?.opengraphDescription || description;
  const ogUrl = seoData?.opengraphUrl || canonical;
  const ogImage = seoData?.opengraphImage?.sourceUrl;
  const ogSiteName = seoData?.opengraphSiteName 
    ? getLocalizedText(seoData.opengraphSiteName, 'ar')
    : 'عالم القهوة';
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
      locale: 'ar_SA',
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

interface Props {
  params: Promise<{  }>;
}

export default async function PrivacyRoute({ params }: Props) {
  const {} = await params;
  
  // Get privacy page ID from environment variable or use null to fetch by language only
  const privacyPageId = process.env.NEXT_PUBLIC_PRIVACY_PAGE_ID 
    ? parseInt(process.env.NEXT_PUBLIC_PRIVACY_PAGE_ID, 10) 
    : null;
  
  // Fetch SEO data for JSON-LD schema (cached - same request as generateMetadata)
  const seoData = await getCachedSeoData('ar', privacyPageId);
  
  return (
    <>
      <JsonLdSchema seoData={seoData} />
      <PrivacyPage locale="ar" />
    </>
  );
}
