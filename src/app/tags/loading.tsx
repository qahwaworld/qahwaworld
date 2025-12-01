import { ArticleGridSkeleton } from '@/components/article/ArticleGridSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/components/ui/utils';

const EnhancedSkeleton = ({ className, ...props }: React.ComponentProps<"div">) => (
  <Skeleton className={cn("bg-gray-200 dark:bg-gray-700", className)} {...props} />
);

export default function TagsLoading() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Skeleton */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <EnhancedSkeleton className="h-10 w-48 mb-3" />
          <EnhancedSkeleton className="h-4 w-96" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tags Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
              <EnhancedSkeleton className="h-6 w-full mb-2" />
              <EnhancedSkeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

