import { ArticleCardSkeleton } from '@/components/article/ArticleCardSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/components/ui/utils';

const EnhancedSkeleton = ({ className, ...props }: React.ComponentProps<"div">) => (
  <Skeleton className={cn("bg-gray-200 dark:bg-gray-700", className)} {...props} />
);

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Top Banner Ad Skeleton */}
      <div className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-4">
            <EnhancedSkeleton className="w-full max-w-5xl h-24" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Sidebar Skeleton */}
            <aside className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 px-6 py-6 sticky top-24">
                <EnhancedSkeleton className="w-full h-96" />
              </div>
            </aside>

            {/* Center Content Skeleton */}
            <main className="lg:col-span-6 lg:border-x dark:lg:border-gray-700 lg:px-6">
              {/* Featured Article Skeleton */}
              <div className="bg-white dark:bg-transparent py-6 mb-8">
                <EnhancedSkeleton className="h-5 w-24 mb-4" />
                <EnhancedSkeleton className="h-10 w-full mb-4" />
                <EnhancedSkeleton className="w-full aspect-video mb-6" />
                <EnhancedSkeleton className="h-4 w-full mb-2" />
                <EnhancedSkeleton className="h-4 w-5/6 mb-4" />
                <EnhancedSkeleton className="h-10 w-32" />
              </div>

              {/* Articles Grid Skeleton */}
              <div className="mt-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ArticleCardSkeleton variant="default" count={8} />
                </div>
              </div>
            </main>

            {/* Right Sidebar - Trending Skeleton */}
            <aside className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 px-6 py-6 sticky top-24">
                <EnhancedSkeleton className="h-6 w-32 mb-6" />
                <div className="space-y-6">
                  <ArticleCardSkeleton variant="small" count={5} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Category Sections Skeleton */}
      <section className="py-8 border-b dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <EnhancedSkeleton className="h-8 w-48" />
            <EnhancedSkeleton className="h-5 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ArticleCardSkeleton variant="default" count={4} />
          </div>
        </div>
      </section>
    </div>
  );
}

