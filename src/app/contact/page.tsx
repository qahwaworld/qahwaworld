import { Metadata } from 'next';
import { cache } from 'react';
import { ContactPage } from '@/components/contact';
import { getContactPageData } from '@/lib/actions/contact/contactAction';
import { getPagesSeo } from '@/lib/actions/seo/pagesSeoAction';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { normalizeUrl } from '@/lib/utils';

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
 * Generate metadata for the contact page using WordPress SEO data
 */
export async function generateMetadata(): Promise<Metadata> {
  // Get contact page ID from environment variable or use null to fetch by language only
  const contactPageId = process.env.NEXT_PUBLIC_CONTACT_PAGE_ID 
    ? parseInt(process.env.NEXT_PUBLIC_CONTACT_PAGE_ID, 10) 
    : null;
  
  // Fetch SEO data from WordPress (cached)
  const seoData = await getCachedSeoData('en', contactPageId);
  
  // Default values
  const defaultTitle = 'Contact Us - Qahwa World';
  const defaultDescription = 'Get in touch with Qahwa World. Contact us for inquiries, feedback, or to learn more about our coffee news and stories.';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qahwaworld.com';
  
  // Use SEO data if available, otherwise use defaults
  const title = seoData?.title 
    ? getLocalizedText(seoData.title, 'en') 
    : defaultTitle;
  
  const description = seoData?.metaDesc || defaultDescription;
  const keywords = seoData?.metaKeywords || 'contact, contact us, qahwa world, coffee, inquiry, feedback';
  // Canonical URL should always match the current page URL
  const canonical = `${siteUrl}/contact`;
  
  // Open Graph data
  const ogTitle = seoData?.opengraphTitle 
    ? getLocalizedText(seoData.opengraphTitle, 'en')
    : title;
  const ogDescription = seoData?.opengraphDescription || description;
  const ogUrl = normalizeUrl(seoData?.opengraphUrl) || canonical;
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

export default async function ContactRoute() {
  // Get contact page ID from environment variable or use null to fetch by language only
  const contactPageId = process.env.NEXT_PUBLIC_CONTACT_PAGE_ID 
    ? parseInt(process.env.NEXT_PUBLIC_CONTACT_PAGE_ID, 10) 
    : null;
  
  const language = 'en'; // Default language for /contact route
  const contactData = await getContactPageData(language);
  
  // Fetch SEO data for JSON-LD schema (cached - same request as generateMetadata)
  const seoData = await getCachedSeoData('en', contactPageId);

  return (
    <>
      <JsonLdSchema seoData={seoData} />
      <ContactPage contactData={contactData} language={language} />
    </>
  );
}
