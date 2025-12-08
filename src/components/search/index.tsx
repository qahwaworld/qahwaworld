import React from 'react';
import Link from 'next/link';
import { getLocalizedPath } from '@/lib/localization';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { SEO } from '../SEO';
import { SearchContent } from './SearchContent';
import { getTranslations, getCategoryTranslation } from '@/lib/translations';
import { searchArticles } from '@/lib/actions/blog/searchActions';
import { Article } from '@/types';
import { stripHtml, calculateReadTime, formatDate } from '@/lib/utils';

interface SearchResultsPageProps {
  query?: string;
  locale: string;
}

const SearchResultsPage = async ({ query = '', locale }: SearchResultsPageProps) => {
  const t = getTranslations(locale);
  const getPath = (path: string) => getLocalizedPath(path, locale);
  
  // Fetch search results from WordPress
  let results: Article[] = [];
  let searchResult;
  
  if (query && query.trim()) {
    searchResult = await searchArticles(query.trim(), 50, undefined, locale);
    
    // Transform WordPress data to Article format
    results = searchResult.articles.map((article) => {
      const primaryCategory = article.categories.nodes[0];
      const categoryNameFromWP = primaryCategory?.name || 'Uncategorized';
      // Translate category name based on locale
      const categoryName = getCategoryTranslation(categoryNameFromWP, locale);
      return {
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        image: article.featuredImage?.node.sourceUrl || '/images/placeholder.jpg',
        category: categoryName,
        categorySlug: primaryCategory?.slug || 'uncategorized',
        author: article.author.node.name,
        date: formatDate(article.date, locale),
        readTime: calculateReadTime(article.content, locale),
        tags: article.tags.nodes.map(tag => ({ name: tag.name, slug: tag.slug })),
        slug: article.slug,
      };
    });
  }

  // Extract unique categories from search results dynamically
  // Get unique category names (already translated above)
  const uniqueCategories = Array.from(
    new Set(results.map(article => article.category).filter(Boolean))
  ).sort();
  
  // Translate "All" based on locale
  const allText = locale === 'ar' ? 'الكل' : locale === 'ru' ? 'Все' : 'All';
  const categories = [allText, ...uniqueCategories];

  return (
    <>
      <SEO 
        title={`Search${query ? `: ${query}` : ''} - Qahwa World`}
        description={`Search results for "${query}" on Qahwa World - ${results.length} articles found`}
        keywords={`search, coffee articles, ${query}`}
      />
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href={getPath(`/`)} className="hover:text-amber-700 dark:hover:text-amber-500">
                {t.home}
              </Link>
              {locale === 'ar' ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="text-gray-900 dark:text-gray-100">{t.searchResults}</span>
            </div>
          </div>
        </div>

        {/* Search Header */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border-b dark:border-gray-700">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                {t.searchResults}
              </h1>
              {query && (
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto px-4 py-8">
          <SearchContent 
            initialResults={results} 
            locale={locale}
            categories={categories}
          />
        </div>
      </div>
    </>
  );
};

export { SearchResultsPage };
