import { Metadata } from 'next';
import { TagsPage } from '@/components/tags';
import { getAllTags } from '@/lib/actions/tag/getArticlesByTag';
import { getTranslations } from '@/lib/translations';
import { getLocalizedPath } from '@/lib/localization';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qahwaworld.com';

/**
 * Generate CollectionPage schema for tags
 */
function generateCollectionPageSchema(
  title: string,
  description: string,
  url: string,
  tags: Array<{ name: string; slug: string }>,
  locale: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: description,
    url: url,
    inLanguage: locale,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: tags.slice(0, 50).map((tag, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}${getLocalizedPath(`/tag/${tag.slug}`, locale)}`,
        name: tag.name,
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

export async function generateMetadata(): Promise<Metadata> {
  const locale = 'ar';
  const t = getTranslations(locale);
  const tagsUrl = `${siteUrl}${getLocalizedPath('/tags', locale)}`;
  
  // Localized descriptions
  const descriptions: Record<string, string> = {
    en: 'Explore all article tags and topics on Qahwa World. Browse articles by tags and discover coffee-related content.',
    ar: 'استكشف جميع وسوم المقالات والمواضيع على Qahwa World. تصفح المقالات حسب الوسوم واكتشف المحتوى المتعلق بالقهوة.',
    ru: 'Изучайте все теги статей и темы на Qahwa World. Просматривайте статьи по тегам и открывайте контент о кофе.',
  };
  
  const keywords: Record<string, string> = {
    en: 'coffee tags, topics, categories, qahwa, coffee articles',
    ar: 'وسوم القهوة، مواضيع، فئات، قهوة، مقالات القهوة',
    ru: 'теги кофе, темы, категории, кахва, статьи о кофе',
  };
  
  return {
    title: `${t.allTags} - Qahwa World`,
    description: descriptions[locale] || descriptions.en,
    keywords: keywords[locale] || keywords.en,
    alternates: {
      canonical: tagsUrl,
    },
    openGraph: {
      title: `${t.allTags} - Qahwa World`,
      description: descriptions[locale] || descriptions.en,
      url: tagsUrl,
      siteName: 'Qahwa World',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t.allTags} - Qahwa World`,
      description: descriptions[locale] || descriptions.en,
    },
  };
}

export default async function TagsRoute() {
  const locale = 'ar';
  const t = getTranslations(locale);
  const tags = await getAllTags(locale);
  
  // Generate schemas for SEO
  const tagsUrl = `${siteUrl}${getLocalizedPath('/tags', locale)}`;
  // Localized descriptions for schema
  const schemaDescriptions: Record<string, string> = {
    en: 'Explore all article tags and topics on Qahwa World',
    ar: 'استكشف جميع وسوم المقالات والمواضيع على Qahwa World',
    ru: 'Изучайте все теги статей и темы на Qahwa World',
  };
  
  const collectionSchema = tags.length > 0 
    ? generateCollectionPageSchema(
        t.allTags,
        schemaDescriptions[locale] || schemaDescriptions.en,
        tagsUrl,
        tags,
        locale
      )
    : null;
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: t.home, url: `${siteUrl}${getLocalizedPath('/', locale)}` },
    { name: t.allTags, url: tagsUrl },
  ]);

  return (
    <>
      {/* JSON-LD Schemas */}
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
      <TagsPage initialTags={tags} locale={locale} />
    </>
  );
}
