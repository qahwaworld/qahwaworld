import { Metadata } from 'next';
import TagRoute from '@/app/tag/[tag]/page';
import { getArticlesByTag } from '@/lib/actions/tag/getArticlesByTag';
import { getLocalizedPath } from '@/lib/localization';
import { normalizeUrl } from '@/lib/utils';

interface Props {
  params: Promise<{ tag: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qahwaworld.com';

/**
 * Generate metadata for Arabic tag page
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const locale = 'ar';
  
  const { articles: backendArticles } = await getArticlesByTag(decodedTag, locale, 1);
  
  if (!backendArticles || backendArticles.length === 0) {
    return {
      title: `#${decodedTag} - Qahwa World`,
      description: `تصفح المقالات الموسومة بـ ${decodedTag}`,
    };
  }

  const firstArticle = backendArticles[0];
  const firstArticleWithTag = backendArticles.find(a => 
    a.tags?.nodes?.some(t => t.slug === decodedTag)
  );
  const matchingTagFromBackend = firstArticleWithTag?.tags?.nodes?.find(t => t.slug === decodedTag);
  const tagName = matchingTagFromBackend?.name || decodedTag;
  
  // Use SEO data from first article if available
  const seoData = firstArticle.seo;
  const tagUrl = `${siteUrl}${getLocalizedPath(`/tag/${decodedTag}`, locale)}`;
  
  const title = seoData?.title 
    ? `${seoData.title} - Qahwa World`
    : `#${tagName} - Qahwa World`;
  const description = seoData?.metaDesc || `تصفح جميع المقالات الموسومة بـ "${tagName}" على Qahwa World`;
  const canonical = normalizeUrl(seoData?.canonical) || tagUrl;
  const ogTitle = seoData?.opengraphTitle || title;
  const ogDescription = seoData?.opengraphDescription || description;
  const ogUrl = normalizeUrl(seoData?.opengraphUrl) || tagUrl;
  const ogImage = seoData?.opengraphImage?.sourceUrl || firstArticle.featuredImage?.node?.sourceUrl;
  const ogType = (seoData?.opengraphType === 'article' ? 'article' : 'website') as 'website' | 'article';
  const twitterTitle = seoData?.opengraphTitle || ogTitle;
  const twitterDescription = seoData?.twitterDescription || ogDescription;
  const twitterImage = seoData?.twitterImage?.sourceUrl || ogImage;

  return {
    title,
    description,
    keywords: seoData?.metaKeywords || `${tagName}, قهوة, قهوة عربية, مقالات, وسم`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: ogUrl,
      siteName: seoData?.opengraphSiteName || 'Qahwa World',
      type: ogType,
      ...(ogImage && {
        images: [{
          url: ogImage,
          alt: `#${tagName}`,
        }],
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
    robots: {
      index: seoData?.metaRobotsNoindex === 'noindex' ? false : true,
      follow: seoData?.metaRobotsNofollow === 'nofollow' ? false : true,
    },
  };
}

export default async function ArabicTagRoute({ params }: Props) {
  return <TagRoute params={params} locale="ar" />;
}
