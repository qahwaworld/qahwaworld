import { Metadata } from 'next';
import { getArticlesByTag } from '@/lib/actions/tag/getArticlesByTag';
import { getHomepageAdBanner } from '@/lib/actions/home/homeAction';
import { calculateReadTime } from '@/lib/utils';
import { getTranslations } from '@/lib/translations';
import { getLocalizedPath } from '@/lib/localization';
import Link from 'next/link';
import { CategoryContent } from '@/components/category/CategoryContent';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { PageSEO } from '@/lib/actions/seo/pagesSeoAction';

interface Props {
  params: Promise<{ tag: string }>;
  locale?: string;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qahwaworld.com';

/**
 * Generate CollectionPage schema for tag
 */
function generateCollectionPageSchema(
  tagName: string,
  description: string,
  url: string,
  articles: Array<{ title: string; slug: string; categorySlug: string }>,
  locale: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${tagName}`,
    description: description,
    url: url,
    inLanguage: locale,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.slice(0, 10).map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}${getLocalizedPath(`/${article.categorySlug}/${article.slug}`, locale)}`,
        name: article.title,
      })),
    },
  };
}

/**
 * Generate BreadcrumbList schema
 */
function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Convert article SEO to PageSEO format for JsonLdSchema component
 */
function convertArticleSeoToPageSeo(articleSeo: any): PageSEO | null {
  if (!articleSeo) return null;

  return {
    title: articleSeo.title || '',
    metaDesc: articleSeo.metaDesc || '',
    metaKeywords: articleSeo.metaKeywords || '',
    canonical: articleSeo.canonical || '',
    opengraphTitle: articleSeo.opengraphTitle || '',
    opengraphDescription: articleSeo.opengraphDescription || '',
    opengraphUrl: articleSeo.opengraphUrl || '',
    opengraphImage: articleSeo.opengraphImage ? {
      sourceUrl: articleSeo.opengraphImage.sourceUrl || '',
    } : null,
    opengraphType: articleSeo.opengraphType || 'website',
    opengraphSiteName: articleSeo.opengraphSiteName || 'Qahwa World',
    opengraphAuthor: articleSeo.opengraphAuthor || '',
    opengraphPublisher: articleSeo.opengraphPublisher || '',
    opengraphPublishedTime: articleSeo.opengraphPublishedTime || '',
    opengraphModifiedTime: articleSeo.opengraphModifiedTime || '',
    twitterTitle: articleSeo.opengraphTitle || '',
    twitterDescription: articleSeo.twitterDescription || '',
    twitterImage: articleSeo.twitterImage ? {
      sourceUrl: articleSeo.twitterImage.sourceUrl || '',
    } : null,
    readingTime: articleSeo.readingTime || 0,
    metaRobotsNoindex: articleSeo.metaRobotsNoindex || 'index',
    metaRobotsNofollow: articleSeo.metaRobotsNofollow || 'follow',
    breadcrumbs: [],
    schema: articleSeo.schema ? {
      pageType: articleSeo.schema.pageType ? [articleSeo.schema.pageType] : [],
      raw: articleSeo.schema.raw || '',
    } : {
      pageType: [],
      raw: '',
    },
  };
}

/**
 * Generate metadata for tag page
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const locale = 'en';
  
  const { articles: backendArticles } = await getArticlesByTag(decodedTag, locale, 1);
  
  if (!backendArticles || backendArticles.length === 0) {
    return {
      title: `${decodedTag} - Qahwa World`,
      description: `Browse articles tagged with ${decodedTag}`,
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
    : `${tagName} - Qahwa World`;
  const description = seoData?.metaDesc || `Browse all articles tagged with "${tagName}" on Qahwa World`;
  const canonical = seoData?.canonical || tagUrl;
  const ogTitle = seoData?.opengraphTitle || title;
  const ogDescription = seoData?.opengraphDescription || description;
  const ogUrl = seoData?.opengraphUrl || tagUrl;
  const ogImage = seoData?.opengraphImage?.sourceUrl || firstArticle.featuredImage?.node?.sourceUrl;
  const ogType = (seoData?.opengraphType === 'article' ? 'article' : 'website') as 'website' | 'article';
  const twitterTitle = seoData?.opengraphTitle || ogTitle;
  const twitterDescription = seoData?.twitterDescription || ogDescription;
  const twitterImage = seoData?.twitterImage?.sourceUrl || ogImage;

  return {
    title,
    description,
    keywords: seoData?.metaKeywords || `${tagName}, coffee, qahwa, articles, tag`,
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
          alt: `${tagName}`,
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

export default async function TagRoute({ params, locale = 'en' }: Props) {
  const { tag } = await params;
  // Decode the tag slug to handle URL-encoded characters (e.g., Arabic, Russian)
  const decodedTag = decodeURIComponent(tag);
  const t = getTranslations(locale);
  const getPath = (path: string) => getLocalizedPath(path, locale);

  // Fetch initial 12 articles from backend (use decoded tag for API call)
  const { articles: backendArticles, pageInfo } = await getArticlesByTag(decodedTag, locale, 12);
  // Map backend articles to frontend Article type
  const articles = backendArticles.map((a) => {
    // Find the tag that matches the current locale's tag slug
    const matchingTag = a.tags?.nodes?.find(t => t.slug === decodedTag) 
      || a.tags?.nodes?.[0];
    const tagName = matchingTag?.name || '';
    const tagSlug = matchingTag?.slug || '';
    
    // Find the category that matches the current locale (for proper category slug in links)
    const matchingCategory = a.categories?.nodes?.[0];
    const categoryName = matchingCategory?.name || '';
    const categorySlug = matchingCategory?.slug || '';
    
    return {
      id: a.id,
      title: a.title,
      excerpt: a.excerpt,
      category: categoryName,
      categorySlug: categorySlug,
      image: a.featuredImage?.node?.sourceUrl || '',
      date: a.date,
      author: a.author?.node?.name || '',
      readTime: calculateReadTime(a.content || ''),
      featured: a.articleDetails?.featured,
      tags: a.tags?.nodes?.map((t: { name: string; slug: string }) => ({ name: t.name, slug: t.slug })) || [],
      content: a.content,
      slug: a.slug,
    };
  });

  // Get the tag name for display (use the matching tag from backend articles)
  const firstArticleWithTag = backendArticles.find(a => 
    a.tags?.nodes?.some(t => t.slug === decodedTag)
  );
  const matchingTagFromBackend = firstArticleWithTag?.tags?.nodes?.find(t => t.slug === decodedTag);
  const tagName = matchingTagFromBackend?.name || decodedTag;

  // Get SEO data from first article if available
  const firstArticleSeo = backendArticles[0]?.seo;
  const pageSeoData = firstArticleSeo ? convertArticleSeoToPageSeo(firstArticleSeo) : null;

  // Generate schemas
  const tagUrl = `${siteUrl}${getLocalizedPath(`/tag/${decodedTag}`, locale)}`;
  const collectionSchema = articles.length > 0 
    ? generateCollectionPageSchema(
        tagName,
        firstArticleSeo?.metaDesc || `Browse all articles tagged with "${tagName}"`,
        tagUrl,
        articles,
        locale
      )
    : null;
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: t.home, url: `${siteUrl}${getLocalizedPath('/', locale)}` },
    { name: t.tags, url: `${siteUrl}${getLocalizedPath('/tags', locale)}` },
    { name: `${tagName}`, url: tagUrl },
  ]);

  // Fetch ad banners
  const adBanners = await getHomepageAdBanner();
  const tagAd = adBanners.find(banner => banner.name === 'tag_ad');

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* JSON-LD Schemas */}
      {pageSeoData && <JsonLdSchema seoData={pageSeoData} />}
      {collectionSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link
              href={getPath(`/`)}
              className="hover:text-amber-700 dark:hover:text-amber-500"
            >
              {t.home}
            </Link>
            {locale === 'ar' ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <Link
              href={getPath(`/tags`)}
              className="hover:text-amber-700 dark:hover:text-amber-500"
            >
              {t.tags}
            </Link>
            {locale === 'ar' ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <span className="text-gray-900 dark:text-gray-100">
              {tagName}
            </span>
          </div>
        </div>
      </div>

      {/* Tag Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
            {tagName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            {locale === 'ar'
              ? `تصفح جميع المقالات الموسومة بـ "${tagName}"`
              : locale === 'ru'
                ? `Просмотр всех статей с тегом "${tagName}"`
                : `Browse all articles tagged with "${tagName}"`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Banner Ad */}
        {tagAd && (
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 mb-8 rounded-lg">
            <div className="w-full max-w-5xl mx-auto center">
              <div dangerouslySetInnerHTML={{ __html: tagAd.content }} />
            </div>
          </div>
        )}

        {/* No Articles Message */}
        {(!articles || articles.length === 0) ? (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              {locale === 'ar'
                ? 'لا توجد مقالات بهذا الوسم'
                : locale === 'ru'
                  ? 'Статей с этим тегом не найдено'
                  : 'No articles found with this tag'}
            </h3>
            <Link
              href={getPath(`/`)}
              className="bg-amber-700 hover:bg-amber-800 px-4 py-2 inline-block text-white rounded-md"
            >
              {t.home}
            </Link>
          </div>
        ) : (
          <CategoryContent
            initialArticles={articles}
            locale={locale}
            tagSlug={decodedTag}
            initialHasNextPage={pageInfo.hasNextPage}
            initialEndCursor={pageInfo.endCursor}
          />
        )}
      </div>
    </div>
  );
}
