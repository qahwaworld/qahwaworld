import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import dynamic from 'next/dynamic';
import { getArticleBySlug, getAuthorPostCount } from '@/lib/actions/article/articleAction';
import { fetchPreviewPostBySlug, fetchPreviewPostById } from '@/lib/actions/article/previewAction';
import { ArticleDetailPage } from '@/components/article';
import { ArticleLanguageHandler } from '@/components/article/ArticleLanguageHandler';
import { stripHtml, calculateReadTime, formatDate } from '@/lib/utils';
import { Article } from '@/types';
import { Metadata } from 'next';
import { getHomepageAdBanner } from '@/lib/actions/home/homeAction';
import { getArticlesByCategory } from '@/lib/actions/category/getArticlesByCategory';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { PageSEO } from '@/lib/actions/seo/pagesSeoAction';
import { getLocalizedPath } from '@/lib/localization';
import { getTranslations } from '@/lib/translations';

// Dynamically import PreviewBanner (client component)
const PreviewBanner = dynamic(() => import('@/components/PreviewBanner'), {
  ssr: true,
});

interface Props {
    params: Promise<{ category: string; slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    locale?: string;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qahwaworld.com';

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
    opengraphType: articleSeo.opengraphType || 'article',
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
 * Generate NewsArticle schema
 */
function generateNewsArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  category,
  url,
  locale = 'en',
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  category: string;
  url: string;
  locale?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Qahwa World',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/qahwaworld-logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: category,
    inLanguage: locale,
  };
}

export async function generateMetadata({ params, locale = 'en' }: Props): Promise<Metadata> {
    const { slug, category } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const decodedCategory = decodeURIComponent(category);
    const articleData = await getArticleBySlug(decodedSlug);

    if (!articleData) {
        return {
            title: 'Article Not Found - Qahwa World',
        };
    }

    const seoData = articleData.seo;
    const articleUrl = `${siteUrl}${getLocalizedPath(`/${decodedCategory}/${decodedSlug}`, locale)}`;
    
    const title = seoData?.title 
        ? `${seoData.title} - Qahwa World`
        : `${articleData.title} - Qahwa World`;
    const description = seoData?.metaDesc || stripHtml(articleData.excerpt).slice(0, 160);
    const canonical = seoData?.canonical || articleUrl;
    const ogTitle = seoData?.opengraphTitle || title;
    const ogDescription = seoData?.opengraphDescription || description;
    const ogUrl = seoData?.opengraphUrl || articleUrl;
    const ogImage = seoData?.opengraphImage?.sourceUrl || articleData.featuredImage?.node?.sourceUrl;
    const ogType = (seoData?.opengraphType === 'article' ? 'article' : 'article') as 'article';
    const twitterTitle = seoData?.opengraphTitle || ogTitle;
    const twitterDescription = seoData?.twitterDescription || ogDescription;
    const twitterImage = seoData?.twitterImage?.sourceUrl || ogImage;
    const publishedTime = seoData?.opengraphPublishedTime || articleData.date;
    const modifiedTime = seoData?.opengraphModifiedTime || articleData.date;

    return {
        title,
        description,
        keywords: seoData?.metaKeywords || `${articleData.title}, coffee, qahwa, articles`,
        alternates: {
            canonical,
        },
        openGraph: {
            title: ogTitle,
            description: ogDescription,
            url: ogUrl,
            siteName: seoData?.opengraphSiteName || 'Qahwa World',
            type: ogType,
            publishedTime: publishedTime,
            modifiedTime: modifiedTime,
            authors: [articleData.author.node.name],
            ...(ogImage && {
                images: [{
                    url: ogImage,
                    alt: articleData.title,
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
// Enable static generation at build time
// Cache is only refreshed when content is updated/deleted via revalidation webhook
export const dynamicParams = true;

// Static generation: data is cached at build time
// Cache is refreshed only when revalidatePath() is called from the admin webhook
// Note: Preview mode (draft mode) automatically bypasses static cache and renders dynamically
export const revalidate = false;

export default async function Page({ params, searchParams, locale = 'en' }: Props) {
    const { category: categorySlug, slug } = await params;
    // Decode the slug to handle non-Latin characters
    const decodedSlug = decodeURIComponent(slug);
    // Decode the category slug to handle non-Latin characters (e.g., Arabic, Russian)
    const decodedCategorySlug = decodeURIComponent(categorySlug);
    
    // Check if we're in draft/preview mode
    const { isEnabled: isDraftMode } = await draftMode();
    
    // Only get searchParams if in draft mode (to avoid static generation issues)
    let token: string | undefined;
    let previewId: string | undefined;
    if (isDraftMode) {
      const resolvedSearchParams = await searchParams;
      token = typeof resolvedSearchParams.token === 'string' ? resolvedSearchParams.token : undefined;
      previewId = typeof resolvedSearchParams.preview_id === 'string' ? resolvedSearchParams.preview_id : undefined;
    }
    
    // Fetch the article (use preview API if in draft mode)
    let articleData;
    
    if (isDraftMode) {
      // Check if slug is actually a numeric ID (for preview mode)
      const isNumericId = /^\d+$/.test(decodedSlug);
      const useId = previewId || (isNumericId ? decodedSlug : null);
      
      if (useId) {
        articleData = await fetchPreviewPostById(useId, token);
      } else {
        articleData = await fetchPreviewPostBySlug(decodedSlug, token);
      }
    } else {
      articleData = await getArticleBySlug(decodedSlug);
    }

    if (!articleData) {
        console.error('❌ Article not found:', decodedSlug);
        notFound();
    }

    // Verify the article belongs to the correct category (skip check in preview mode for drafts)
    if (!isDraftMode && articleData.categories.nodes.length > 0) {
        const categoryMatch = articleData.categories.nodes.find(cat => 
            cat.slug === decodedCategorySlug
        );
        if (!categoryMatch) {
            console.error('❌ Category mismatch:', { expected: decodedCategorySlug, actual: articleData.categories.nodes.map(c => c.slug) });
            notFound();
        }
    }

    // Find the correct category node for display (current language or fallback)
    const primaryCategory = articleData.categories.nodes.find(cat => 
        cat.slug === decodedCategorySlug
    ) || articleData.categories.nodes[0];

    // Collect all translations from all category nodes
    const allCategoryTranslations = articleData.categories.nodes
        .flatMap(cat => cat.translations || [])
        .filter((v, i, a) => v && a.findIndex(t => t.language.code === v.language.code) === i);

    // Fetch author post count
    let authorPostCount: number | undefined;
    try {
        const count = await getAuthorPostCount(articleData.author.node.slug);
        if (count !== null) {
            authorPostCount = count;
        }
    } catch (error) {
        // Continue without post count if fetch fails
    }

    const article: Article = {
        id: articleData.id,
        title: articleData.title,
        excerpt: articleData.excerpt,
        content: articleData.content,
        image: articleData.featuredImage?.node.sourceUrl || '/images/placeholder.jpg',
        category: primaryCategory?.name || 'Uncategorized',
        categorySlug: primaryCategory?.slug || decodedCategorySlug,
        author: articleData.author.node.name,
        authorId: articleData.author.node.databaseId,
        authorSlug: articleData.author.node.slug,
        authorBio: articleData.author.node.authorInfo ? {
            en: articleData.author.node.authorInfo.authorBioEn,
            ar: articleData.author.node.authorInfo.authorBioAr,
            ru: articleData.author.node.authorInfo.authorBioRu,
        } : undefined,
        authorImage: articleData.author.node.authorInfo?.authorImage?.node,
        authorPostCount: authorPostCount,
        date: formatDate(articleData.date, locale),
        readTime: calculateReadTime(articleData.content),
        tags: articleData.tags.nodes.map(tag => ({ name: tag.name, slug: tag.slug })),
        slug: articleData.slug,
        galleryImages: articleData.postAdvancePost?.galleryImages?.nodes || [],
        contentAfterGallery: articleData.postAdvancePost?.contentAfterGallery,
    };

    // Fetch related articles from the same category
    let relatedArticles: Article[] = [];
    try {
        const { articles: categoryArticles } = await getArticlesByCategory(decodedCategorySlug, locale, 10);
        // Transform WordPress articles to Article type and exclude current article
        relatedArticles = categoryArticles
            .filter(wpArticle => wpArticle.id !== articleData.id)
            .slice(0, 5)
            .map(wpArticle => {
                // Find the category that matches the current locale's category slug
                const matchingCategory = wpArticle.categories?.nodes?.find(cat => cat.slug === decodedCategorySlug) 
                    || wpArticle.categories?.nodes?.[0];
                const categoryName = matchingCategory?.name || 'Uncategorized';
                const relatedCategorySlug = matchingCategory?.slug || decodedCategorySlug;
                
                return {
                    id: wpArticle.id,
                    title: wpArticle.title,
                    excerpt: wpArticle.excerpt,
                    content: wpArticle.content || '',
                    image: wpArticle.featuredImage?.node?.sourceUrl || '/images/placeholder.jpg',
                    category: categoryName,
                    categorySlug: relatedCategorySlug,
                    author: wpArticle.author?.node?.name || 'Unknown',
                    authorId: wpArticle.author?.node?.databaseId,
                    date: formatDate(wpArticle.date, locale),
                    readTime: calculateReadTime(wpArticle.content || ''),
                    tags: wpArticle.tags?.nodes?.map(tag => ({ name: tag.name, slug: tag.slug })) || [],
                    slug: wpArticle.slug,
                };
            });
    } catch (error) {
        // Fallback to empty array if fetch fails
        relatedArticles = [];
    }

    // Fetch ad banners
    const adBanners = await getHomepageAdBanner();
    const postAd = adBanners.find(banner => banner.name === 'post_ad');

    // Convert article SEO to PageSEO format for JsonLdSchema
    const pageSeoData = articleData.seo 
        ? convertArticleSeoToPageSeo(articleData.seo) 
        : null;

    // Check if WordPress schema already contains NewsArticle/Article schema
    let hasArticleSchema = false;
    if (articleData.seo?.schema?.raw) {
        try {
            const wpSchema = typeof articleData.seo.schema.raw === 'string' 
                ? JSON.parse(articleData.seo.schema.raw) 
                : articleData.seo.schema.raw;
            
            // Check if schema contains NewsArticle or Article type
            if (wpSchema['@graph'] && Array.isArray(wpSchema['@graph'])) {
                hasArticleSchema = wpSchema['@graph'].some((item: any) => 
                    item['@type'] === 'NewsArticle' || item['@type'] === 'Article'
                );
            } else if (wpSchema['@type'] === 'NewsArticle' || wpSchema['@type'] === 'Article') {
                hasArticleSchema = true;
            }
        } catch (error) {
            // If parsing fails, assume no schema and use our manual one
        }
    }

    // Generate schemas
    const t = getTranslations(locale);
    const articleUrl = `${siteUrl}${getLocalizedPath(`/${decodedCategorySlug}/${decodedSlug}`, locale)}`;
    const categoryUrl = `${siteUrl}${getLocalizedPath(`/${decodedCategorySlug}`, locale)}`;
    
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: t.home, url: `${siteUrl}${getLocalizedPath('/', locale)}` },
        { name: primaryCategory?.name || 'Category', url: categoryUrl },
        { name: articleData.title, url: articleUrl },
    ]);

    // Only generate NewsArticle schema if WordPress doesn't already have one
    const newsArticleSchema = !hasArticleSchema ? generateNewsArticleSchema({
        title: articleData.title,
        description: stripHtml(articleData.excerpt),
        image: articleData.featuredImage?.node?.sourceUrl || '',
        datePublished: articleData.date,
        dateModified: articleData.date,
        authorName: articleData.author.node.name,
        category: primaryCategory?.name || 'Uncategorized',
        url: articleUrl,
        locale: locale,
    }) : null;

    return (
        <>
            {/* Preview Banner - Only shown in draft mode */}
            {isDraftMode && <PreviewBanner />}
            
            {/* Add spacing when preview banner is visible */}
            {isDraftMode && <div className="h-16" />}
            
            {/* JSON-LD Schemas */}
            {pageSeoData && <JsonLdSchema seoData={pageSeoData} />}
            {newsArticleSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
                />
            )}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            
            <ArticleLanguageHandler
                translations={articleData.translations || []}
                categorySlug={decodedCategorySlug}
                categoryTranslations={allCategoryTranslations}
            />
            <ArticleDetailPage article={article} locale={locale} postAd={postAd} relatedArticles={relatedArticles} />
        </>
    );
}
