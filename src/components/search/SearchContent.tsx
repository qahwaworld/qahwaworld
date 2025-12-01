'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getLocalizedPath } from '@/lib/localization';
import { Article } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface SearchContentProps {
  initialResults: Article[];
  locale: string;
  categories: string[];
}

export const SearchContent: React.FC<SearchContentProps> = ({
  initialResults,
  locale,
  categories
}) => {
  const router = useRouter();
  const getPath = (path: string) => getLocalizedPath(path, locale);
  const [results, setResults] = useState<Article[]>(initialResults);
  // Initialize with first category (which is "All" in the appropriate language)
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || 'All');

  useEffect(() => {
    // Check if selected category is "All" (in any language)
    const allTexts = ['All', 'الكل', 'Все'];
    if (allTexts.includes(selectedCategory) || selectedCategory === categories[0]) {
      setResults(initialResults);
    } else {
      setResults(initialResults.filter(a => a.category === selectedCategory));
    }
  }, [selectedCategory, initialResults, categories]);

  return (
    <>
      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 'bg-amber-700 hover:bg-amber-800' : ''}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No articles found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((article) => {
            const categorySlug = article.categorySlug || article.category.toLowerCase().replace(/\s+/g, '-');
            return (
            <div
              key={article.id}
              className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => {
                router.push(getPath(`/${categorySlug}/${article.slug || article.id}`));
              }}
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-amber-700 hover:bg-amber-800">
                  {article.category}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <div 
                  className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3"
                  dangerouslySetInnerHTML={{ __html: article.excerpt }}
                />
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                  <span>{article.date}</span>
                </div>
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                    {article.tags.slice(0, 3).map((tag, index) => {
                      const tagName = typeof tag === 'string' ? tag : tag.name;
                      const tagSlug = typeof tag === 'string' ? tag : tag.slug;
                      return (
                        <Link
                          key={index}
                          href={getPath(`/tag/${encodeURIComponent(tagSlug)}`)}
                        >
                          <Badge variant="outline" className="text-xs hover:bg-accent">
                            {tagName}
                          </Badge>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </>
  );
};
