import { notFound } from 'next/navigation';
import { getArticlesByAuthor } from '@/lib/actions/author/getArticlesByAuthor';
import { getAuthorPostCount } from '@/lib/actions/article/articleAction';
import { getHomepageAdBanner } from '@/lib/actions/home/homeAction';
import { getAuthorSEO } from '@/lib/actions/author/getAuthorSEO';
import { AuthorContent } from '@/components/author';
import { calculateReadTime, formatDate, stripHtml, normalizeUrl } from '@/lib/utils';
import { getTranslations, getCategoryTranslation } from '@/lib/translations';
import { getLocalizedPath } from '@/lib/localization';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ChevronLeft, User } from 'lucide-react';
import { Article } from '@/types';
import { Metadata } from 'next';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { PageSEO } from '@/lib/actions/seo/pagesSeoAction';

interface Props {
  params: Promise<{ id: string }>;
  locale?: string;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qahwaworld.com';

/**
 * Convert author SEO to PageSEO format for JsonLdSchema component
 * Also enhances the schema with author image from authorInfo if available
 */
function convertAuthorSeoToPageSeo(authorSeo: any, authorImage?: { altText: string; sourceUrl: string } | null): PageSEO | null {
  if (!authorSeo) return null;

  // Enhance schema with author image if available
  let enhancedSchemaRaw = authorSeo.schema?.raw || '';
  if (authorImage?.sourceUrl && enhancedSchemaRaw) {
    try {
      let schema: any;
      if (typeof enhancedSchemaRaw === 'string') {
        schema = JSON.parse(enhancedSchemaRaw);
      } else {
        schema = enhancedSchemaRaw;
      }

      // Update Person schema image if it exists
      if (schema['@graph'] && Array.isArray(schema['@graph'])) {
        schema['@graph'].forEach((item: any) => {
          if (item['@type'] === 'Person' && item.image) {
            // Update the image URL to use author image from authorInfo
            if (typeof item.image === 'object' && item.image.url) {
              item.image.url = authorImage.sourceUrl;
              item.image.contentUrl = authorImage.sourceUrl;
            } else if (typeof item.image === 'string') {
              item.image = authorImage.sourceUrl;
            }
            // Also update if image is an object with @id
            if (item.image && typeof item.image === 'object' && item.image['@id']) {
              const imageId = item.image['@id'];
              // Find and update the ImageObject if it exists
              schema['@graph'].forEach((graphItem: any) => {
                if (graphItem['@id'] === imageId && graphItem['@type'] === 'ImageObject') {
                  graphItem.url = authorImage.sourceUrl;
                  graphItem.contentUrl = authorImage.sourceUrl;
                }
              });
            }
          }
        });
      } else if (schema['@type'] === 'Person' && schema.image) {
        // Handle single Person object (not in @graph)
        if (typeof schema.image === 'object' && schema.image.url) {
          schema.image.url = authorImage.sourceUrl;
          schema.image.contentUrl = authorImage.sourceUrl;
        } else if (typeof schema.image === 'string') {
          schema.image = authorImage.sourceUrl;
        }
      }

      enhancedSchemaRaw = JSON.stringify(schema);
    } catch (error) {
      // Continue with original schema if enhancement fails
    }
  }

  return {
    title: authorSeo.title || '',
    metaDesc: authorSeo.metaDesc || '',
    metaKeywords: '', // Author SEO doesn't have metaKeywords
    canonical: authorSeo.canonical || '',
    opengraphTitle: authorSeo.opengraphTitle || '',
    opengraphDescription: authorSeo.opengraphDescription || '',
    opengraphUrl: authorSeo.canonical || '',
    opengraphImage: authorSeo.opengraphImage ? {
      sourceUrl: authorSeo.opengraphImage.sourceUrl || '',
    } : null,
    opengraphType: 'profile',
    opengraphSiteName: 'Qahwa World',
    opengraphAuthor: '',
    opengraphPublisher: '',
    opengraphPublishedTime: '',
    opengraphModifiedTime: '',
    twitterTitle: authorSeo.twitterTitle || authorSeo.opengraphTitle || '',
    twitterDescription: authorSeo.twitterDescription || authorSeo.opengraphDescription || '',
    twitterImage: authorSeo.twitterImage ? {
      sourceUrl: authorSeo.twitterImage.sourceUrl || '',
    } : null,
    readingTime: 0,
    metaRobotsNoindex: authorSeo.metaRobotsNoindex || 'index',
    metaRobotsNofollow: authorSeo.metaRobotsNofollow || 'follow',
    breadcrumbs: [],
    schema: authorSeo.schema ? {
      pageType: authorSeo.schema.pageType || [],
      raw: enhancedSchemaRaw,
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

export async function generateMetadata({ params, locale = 'en' }: Props): Promise<Metadata> {
  const { id } = await params;
  const authorId = parseInt(id, 10);
  
  if (isNaN(authorId)) {
    return {
      title: 'Author Not Found - Qahwa World',
    };
  }

  try {
    // Fetch author SEO data
    const authorSEOData = await getAuthorSEO(authorId);
    
    // Fallback to articles if SEO data not available
    const { articles } = await getArticlesByAuthor(authorId, locale, 1);
    const authorName = articles[0]?.author?.node?.name || 'Unknown Author';
    
    const seoData = authorSEOData?.seo;
    const authorUrl = `${siteUrl}${getLocalizedPath(`/author/${authorId}`, locale)}`;
    
    const title = seoData?.title 
      ? `${seoData.title} - Qahwa World`
      : `${authorName} - Qahwa World`;
    const description = seoData?.metaDesc || `Browse all articles by ${authorName} on Qahwa World`;
    // Canonical URL should always match the current page URL (with correct locale prefix)
    const canonical = authorUrl;
    const ogTitle = seoData?.opengraphTitle || title;
    const ogDescription = seoData?.opengraphDescription || description;
    const ogUrl = normalizeUrl(seoData?.canonical) || authorUrl;
    const ogImage = seoData?.opengraphImage?.sourceUrl || 
                   authorSEOData?.authorInfo?.authorImage?.node?.sourceUrl ||
                   articles[0]?.author?.node?.authorInfo?.authorImage?.node?.sourceUrl;
    const ogType = 'profile' as const;
    const twitterTitle = seoData?.twitterTitle || ogTitle;
    const twitterDescription = seoData?.twitterDescription || ogDescription;
    const twitterImage = seoData?.twitterImage?.sourceUrl || ogImage;

    return {
      title,
      description,
      keywords: `${authorName}, author, qahwa world, coffee, articles`,
      alternates: {
        canonical,
      },
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: ogUrl,
        siteName: 'Qahwa World',
        type: ogType,
        ...(ogImage && {
          images: [{
            url: ogImage,
            alt: authorName,
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
  } catch (error) {
    return {
      title: 'Author - Qahwa World',
    };
  }
}

export default async function AuthorPage({ params, locale = 'en' }: Props) {
  const { id } = await params;
  const authorId = parseInt(id, 10);
  
  if (isNaN(authorId)) {
    notFound();
  }

  const t = getTranslations(locale);
  const getPath = (path: string) => getLocalizedPath(path, locale);

  try {
    // Fetch initial 12 articles
    const { articles: backendArticles, pageInfo } = await getArticlesByAuthor(
      authorId,
      locale,
      12
    );

    if (!backendArticles || backendArticles.length === 0) {
      return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl text-gray-600 dark:text-gray-400 mb-4">
              {locale === 'ar'
                ? 'لا توجد مقالات لهذا المؤلف'
                : locale === 'ru'
                  ? 'Статей этого автора не найдено'
                  : 'No articles found for this author'}
            </h1>
            <Link
              href={getPath(`/`)}
              className="bg-amber-700 hover:bg-amber-800 px-4 py-2 inline-block text-white rounded-md"
            >
              {t.home}
            </Link>
          </div>
        </div>
      );
    }

    // Fetch author SEO data
    const authorSEOData = await getAuthorSEO(authorId);
    
    // Get author info from first article or SEO data
    const authorInfo = backendArticles[0]?.author?.node;
    const authorName = authorInfo?.name || 'Unknown Author';
    const authorBio = authorInfo?.authorInfo;
    // Use author image from SEO data if available, otherwise from article
    const authorImage = authorSEOData?.authorInfo?.authorImage?.node || 
                       authorInfo?.authorInfo?.authorImage?.node;
    const authorSlug = authorInfo?.slug;

    // Convert author SEO to PageSEO format for JsonLdSchema
    // Pass author image to ensure it's used in the schema
    const pageSeoData = authorSEOData?.seo 
      ? convertAuthorSeoToPageSeo(authorSEOData.seo, authorImage) 
      : null;

    // Generate breadcrumb schema
    const authorUrl = `${siteUrl}${getLocalizedPath(`/author/${authorId}`, locale)}`;
    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t.home, url: `${siteUrl}${getLocalizedPath('/', locale)}` },
      { name: authorName, url: authorUrl },
    ]);

    // Fetch total post count for the author
    let totalPostCount: number | undefined;
    if (authorSlug) {
      try {
        const count = await getAuthorPostCount(authorSlug);
        if (count !== null) {
          totalPostCount = count;
        }
      } catch (error) {
        // Continue without post count if fetch fails
      }
    }

    // Map backend articles to frontend Article type
    const articles: Article[] = backendArticles.map((a) => {
      const matchingCategory = a.categories?.nodes?.[0];
      const categoryNameFromWP = matchingCategory?.name || '';
      
      // Find the category slug that matches the current locale
      let categorySlug = matchingCategory?.slug || '';
      if (matchingCategory?.translations && matchingCategory.translations.length > 0) {
        // Find translation that matches current locale
        const localeTranslation = matchingCategory.translations.find(
          (t) => t.languageCode?.toLowerCase() === locale.toLowerCase()
        );
        if (localeTranslation?.slug) {
          categorySlug = localeTranslation.slug;
        }
      }
      
      // Translate category name based on locale
      const categoryName = getCategoryTranslation(categoryNameFromWP, locale);

      return {
        id: a.id,
        title: a.title,
        excerpt: a.excerpt,
        category: categoryName,
        categorySlug: categorySlug,
        image: a.featuredImage?.node?.sourceUrl || '',
        date: formatDate(a.date, locale),
        author: a.author?.node?.name || '',
        authorId: a.author?.node?.databaseId,
        readTime: calculateReadTime(a.content || '', locale),
        featured: false,
        tags: a.tags?.nodes?.map((t: { name: string; slug: string }) => ({
          name: t.name,
          slug: t.slug,
        })) || [],
        content: a.content,
        slug: a.slug,
      };
    });

    // Fetch ad banners
    const adBanners = await getHomepageAdBanner();
    const authorAd = adBanners.find(banner => banner.name === 'author_ad');

    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* JSON-LD Schemas */}
        {pageSeoData && <JsonLdSchema seoData={pageSeoData} />}
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
              <span className="text-gray-900 dark:text-gray-100">{authorName}</span>
            </div>
          </div>
        </div>

        {/* Author Header */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-start gap-6">
              {authorImage ? (
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 shadow-lg relative">
                  <Image
                    src={authorImage.sourceUrl}
                    alt={authorImage.altText || authorName}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-amber-700 to-amber-800 rounded-full flex items-center justify-center text-white text-3xl shrink-0 shadow-lg">
                  <User className="w-12 h-12" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                  {authorName}
                </h1>
                {authorBio && (
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl mb-4">
                    {locale === 'ar' && authorBio.authorBioAr
                      ? authorBio.authorBioAr
                      : locale === 'ru' && authorBio.authorBioRu
                        ? authorBio.authorBioRu
                        : authorBio.authorBioEn || ''}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {totalPostCount !== undefined ? totalPostCount : articles.length}{' '}
                  {locale === 'ar'
                    ? (totalPostCount !== undefined ? totalPostCount : articles.length) === 1
                      ? 'مقال'
                      : 'مقالاً'
                    : locale === 'ru'
                      ? (totalPostCount !== undefined ? totalPostCount : articles.length) === 1
                        ? 'статья'
                        : (totalPostCount !== undefined ? totalPostCount : articles.length) >= 2 && (totalPostCount !== undefined ? totalPostCount : articles.length) <= 4
                          ? 'статьи'
                          : 'статей'
                      : (totalPostCount !== undefined ? totalPostCount : articles.length) === 1
                        ? 'article'
                        : 'articles'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Banner Ad */}
          {authorAd && (
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 mb-8 rounded-lg">
              <div className="w-full max-w-5xl mx-auto center">
                <div dangerouslySetInnerHTML={{ __html: authorAd.content }} />
              </div>
            </div>
          )}

          {/* Articles with Load More */}
          <AuthorContent
            initialArticles={articles}
            authorId={authorId}
            locale={locale}
            initialHasNextPage={pageInfo.hasNextPage}
            initialEndCursor={pageInfo.endCursor}
          />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

