import { ArticleGridSkeleton } from '@/components/article/ArticleGridSkeleton';

export default function SearchLoading() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
          <div className="h-10 w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Category Filter Skeleton */}
        <div className="mb-8 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </div>

        {/* Articles Grid Skeleton */}
        <ArticleGridSkeleton count={9} />
      </div>
    </div>
  );
}

