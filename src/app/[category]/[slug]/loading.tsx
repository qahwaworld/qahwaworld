import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/components/ui/utils';
import { ArticleCardSkeleton } from '@/components/article/ArticleCardSkeleton';

const EnhancedSkeleton = ({ className, ...props }: React.ComponentProps<"div">) => (
  <Skeleton className={cn("bg-gray-200 dark:bg-gray-700", className)} {...props} />
);

export default function ArticleLoading() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <EnhancedSkeleton className="h-4 w-16" />
            <EnhancedSkeleton className="h-4 w-4" />
            <EnhancedSkeleton className="h-4 w-32" />
            <EnhancedSkeleton className="h-4 w-4" />
            <EnhancedSkeleton className="h-4 w-48" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content */}
          <article className="lg:col-span-8">
            {/* Article Header Skeleton */}
            <div className="mb-6">
              <EnhancedSkeleton className="h-5 w-24 mb-4" />
              <EnhancedSkeleton className="h-10 w-full mb-4" />
              <EnhancedSkeleton className="h-10 w-5/6 mb-4" />
              <div className="flex items-center gap-4 mb-6">
                <EnhancedSkeleton className="h-4 w-32" />
                <EnhancedSkeleton className="h-4 w-32" />
                <EnhancedSkeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Featured Image Skeleton */}
            <EnhancedSkeleton className="w-full aspect-video mb-8 rounded-lg" />

            {/* Article Content Skeleton */}
            <div className="prose dark:prose-invert max-w-none mb-8">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="mb-4">
                  <EnhancedSkeleton className="h-4 w-full mb-2" />
                  <EnhancedSkeleton className="h-4 w-full mb-2" />
                  <EnhancedSkeleton className={i % 3 === 0 ? "h-4 w-5/6" : "h-4 w-full"} />
                </div>
              ))}
            </div>

            {/* Tags Skeleton */}
            <div className="flex flex-wrap gap-2 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <EnhancedSkeleton key={i} className="h-8 w-24" />
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Related Articles Skeleton */}
              <div>
                <EnhancedSkeleton className="h-6 w-48 mb-4" />
                <div className="space-y-4">
                  <ArticleCardSkeleton variant="small" count={5} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

