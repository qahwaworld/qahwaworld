import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticlesByCategory } from '@/lib/actions/category/getArticlesByCategory';
import { getHomepageAdBanner } from '@/lib/actions/home/homeAction';
import { calculateReadTime, stripHtml } from '@/lib/utils';
import { getTranslations, getCategoryTranslation } from '@/lib/translations';
import { getLocalizedPath } from '@/lib/localization';
import Link from 'next/link';
import { CategoryContent } from '@/components/category/CategoryContent';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import CategoryLanguageHandler from '@/components/category/CategoryLanguageHandler';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { PageSEO } from '@/lib/actions/seo/pagesSeoAction';

interface Props {
  params: Promise<{ category: string }>;
  locale?: string;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qahwaworld.com';

/**
 * Generate CollectionPage schema for category
 */
function generateCollectionPageSchema(
  categoryName: string,
  description: string,
  url: string,
  articles: Array<{ title: string; slug: string; categorySlug: string }>,
  locale: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryName,
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
 * Generate metadata for category page
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const locale = 'en';
  
  const { articles: backendArticles } = await getArticlesByCategory(decodedCategory, locale, 1);
  
  if (!backendArticles || backendArticles.length === 0) {
    const categoryName = getCategoryTranslation(decodedCategory, locale);
    return {
      title: `${categoryName} - Qahwa World`,
      description: `Browse articles in ${categoryName} category`,
    };
  }

  const firstArticle = backendArticles[0];
  const matchingCategory = firstArticle.categories?.nodes?.find(cat => cat.slug === decodedCategory) 
    || firstArticle.categories?.nodes?.[0];
  const categoryName = matchingCategory?.name || getCategoryTranslation(decodedCategory, locale);
  
  // Use SEO data from first article if available
  const seoData = firstArticle.seo;
  const categoryUrl = `${siteUrl}${getLocalizedPath(`/${decodedCategory}`, locale)}`;
  
  const title = seoData?.title 
    ? `${seoData.title} - Qahwa World`
    : `${categoryName} - Qahwa World`;
  const description = seoData?.metaDesc || `Browse articles in ${categoryName} category on Qahwa World`;
  const canonical = seoData?.canonical || categoryUrl;
  const ogTitle = seoData?.opengraphTitle || title;
  const ogDescription = seoData?.opengraphDescription || description;
  const ogUrl = seoData?.opengraphUrl || categoryUrl;
  const ogImage = seoData?.opengraphImage?.sourceUrl || firstArticle.featuredImage?.node?.sourceUrl;
  const ogType = (seoData?.opengraphType === 'article' ? 'article' : 'website') as 'website' | 'article';
  const twitterTitle = seoData?.opengraphTitle || ogTitle;
  const twitterDescription = seoData?.twitterDescription || ogDescription;
  const twitterImage = seoData?.twitterImage?.sourceUrl || ogImage;

  return {
    title,
    description,
    keywords: seoData?.metaKeywords || `${categoryName}, coffee, qahwa, articles`,
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
          alt: categoryName,
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

export default async function CategoryRoute({ params, locale = 'en' }: Props) {
  const { category } = await params;
  // Decode the category slug to handle URL-encoded characters (e.g., Arabic, Russian)
  const decodedCategory = decodeURIComponent(category);
  const t = getTranslations(locale);
  const getPath = (path: string) => getLocalizedPath(path, locale);


  // Fetch initial 12 articles from backend (use decoded category for API call)
  const { articles: backendArticles, pageInfo } = await getArticlesByCategory(decodedCategory, locale, 12);
  
  // If no articles found, we need to determine if the category exists or not
  // WordPress GraphQL returns empty array for both:
  // 1. Category exists but has no articles
  // 2. Category doesn't exist
  // 
  // We check if the category translation found a match - if not, it's likely invalid
  if (!backendArticles || backendArticles.length === 0) {
    const categoryTranslation = getCategoryTranslation(decodedCategory, locale);
    
    // If getCategoryTranslation returns the same value as input, no translation was found
    // This means the category slug doesn't match any known category in our translation map
    // For invalid slugs like "dsds", this will be true
    const normalizedCategory = decodedCategory.toLowerCase().trim();
    const normalizedTranslation = categoryTranslation.toLowerCase().trim();
    const isUnknownCategory = normalizedTranslation === normalizedCategory;
    
    // If category is unknown (not in translation map) and has no articles, show 404
    // This handles cases like random slugs (dsds, test123, etc.)
    // Note: This assumes all valid categories are in the translation map
    // If you add new categories to WordPress, make sure to add them to translations.ts
    if (isUnknownCategory) {
      notFound();
    }
  }
  
  // Map backend articles to frontend Article type
  const articles = backendArticles.map((a) => {
    // Find the category that matches the current locale's category slug
    const matchingCategory = a.categories?.nodes?.find(cat => cat.slug === decodedCategory) 
      || a.categories?.nodes?.[0];
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
      tags: a.tags?.nodes?.map((t: { name: string }) => t.name) || [],
      content: a.content,
      slug: a.slug,
    };
  });
  // Collect all category translations from all category nodes
  // Find the category node that matches the current categorySlug, or use all categories
  const allCategoryTranslations = backendArticles
    .flatMap(article => article.categories?.nodes || [])
    .flatMap(cat => cat.translations || [])
    .filter((v, i, a) => v && a.findIndex(t => t.languageCode === v.languageCode && t.slug === v.slug) === i);
  
  // Try to find translations from the category node that matches the current slug
  const matchingCategory = backendArticles
    .flatMap(article => article.categories?.nodes || [])
    .find(cat => cat.slug === decodedCategory);
  
  const categoryTranslations = matchingCategory?.translations || allCategoryTranslations;
  
  // Get the category name for display (use the matching category's name, or fallback to translation)
  const categoryName = matchingCategory?.name || getCategoryTranslation(decodedCategory, locale);

  // Get SEO data from first article if available
  const firstArticleSeo = backendArticles[0]?.seo;
  const pageSeoData = firstArticleSeo ? convertArticleSeoToPageSeo(firstArticleSeo) : null;

  // Generate schemas
  const categoryUrl = `${siteUrl}${getLocalizedPath(`/${decodedCategory}`, locale)}`;
  const collectionSchema = articles.length > 0 
    ? generateCollectionPageSchema(
        categoryName,
        firstArticleSeo?.metaDesc || `Browse articles in ${categoryName} category`,
        categoryUrl,
        articles,
        locale
      )
    : null;
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: t.home, url: `${siteUrl}${getLocalizedPath('/', locale)}` },
    { name: categoryName, url: categoryUrl },
  ]);

  // Fetch ad banners
  const adBanners = await getHomepageAdBanner();
  const categoryAd = adBanners.find(banner => banner.name === 'category_ad');

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
      
      <CategoryLanguageHandler
        categorySlug={decodedCategory}
        categoryTranslations={categoryTranslations}
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
            <span className="text-gray-900 dark:text-gray-100">
              {categoryName}
            </span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
            {categoryName}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Banner Ad */}
        {categoryAd && (
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 mb-8 rounded-lg">
            <div className="w-full max-w-5xl mx-auto center">
              <div dangerouslySetInnerHTML={{ __html: categoryAd.content }} />
            </div>
          </div>
        )}

        {/* No Articles Message */}
        {(!articles || articles.length === 0) ? (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              No articles found in this category
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
            categorySlug={decodedCategory}
            initialHasNextPage={pageInfo.hasNextPage}
            initialEndCursor={pageInfo.endCursor}
          />
        )}
      </div>
    </div>
  );
}
