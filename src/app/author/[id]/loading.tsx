import { ArticleGridSkeleton } from '@/components/article/ArticleGridSkeleton';

export default function AuthorLoading() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Author Header Skeleton */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="flex-1">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
              <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* View Toggle Skeleton */}
        <div className="flex justify-end mb-6">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Articles Grid Skeleton */}
        <ArticleGridSkeleton count={12} />
      </div>
    </div>
  );
}

