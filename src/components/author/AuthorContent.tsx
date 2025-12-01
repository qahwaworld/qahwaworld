'use client';

import React, { useState } from 'react';
import { Article } from '@/types';
import { ArticleGrid } from '../category/ArticleGrid';
import { ArticleList } from '../category/ArticleList';
import { ViewToggle } from '../category/ViewToggle';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { ArticleGridSkeleton } from '../article/ArticleGridSkeleton';
import { ArticleListSkeleton } from '../article/ArticleListSkeleton';

interface AuthorContentProps {
  initialArticles: Article[];
  authorId: number;
  locale: string;
  initialHasNextPage: boolean;
  initialEndCursor: string | null;
}

export const AuthorContent: React.FC<AuthorContentProps> = ({
  initialArticles,
  authorId,
  locale,
  initialHasNextPage,
  initialEndCursor,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [endCursor, setEndCursor] = useState(initialEndCursor);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (!hasNextPage || loading || !endCursor) return;

    setLoading(true);
    try {
      const url = new URL('/api/articles/author', window.location.origin);
      url.searchParams.set('authorId', authorId.toString());
      url.searchParams.set('language', locale);
      if (endCursor) {
        url.searchParams.set('after', endCursor);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Failed to fetch more articles');
      }

      const data = await response.json();

      if (data.articles && Array.isArray(data.articles)) {
        setArticles((prev) => [...prev, ...data.articles]);
        setHasNextPage(data.pageInfo?.hasNextPage ?? false);
        setEndCursor(data.pageInfo?.endCursor ?? null);
      }
    } catch (error) {
      // Error loading more articles
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {viewMode === 'grid' ? (
        <>
          <ArticleGrid articles={articles} locale={locale} />
          {loading && (
            <div className="mt-8">
              <ArticleGridSkeleton count={6} />
            </div>
          )}
        </>
      ) : (
        <>
          <ArticleList articles={articles} locale={locale} />
          {loading && (
            <div className="mt-8">
              <ArticleListSkeleton count={3} />
            </div>
          )}
        </>
      )}

      {/* Load More Button */}
      {hasNextPage && (
        <div className="text-center mt-12">
          <Button
            onClick={loadMore}
            disabled={loading}
            className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2 inline" />
                {locale === 'ar' ? 'جاري التحميل...' : locale === 'ru' ? 'Загрузка...' : 'Loading...'}
              </>
            ) : (
              locale === 'ar' ? 'تحميل المزيد' : locale === 'ru' ? 'Загрузить еще' : 'Load More'
            )}
          </Button>
        </div>
      )}
    </>
  );
};

