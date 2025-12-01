import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/components/ui/utils';

const EnhancedSkeleton = ({ className, ...props }: React.ComponentProps<"div">) => (
  <Skeleton className={cn("bg-gray-200 dark:bg-gray-700", className)} {...props} />
);

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header Skeleton */}
        <div className="mb-12 text-center">
          <EnhancedSkeleton className="h-12 w-64 mx-auto mb-4" />
          <EnhancedSkeleton className="h-6 w-96 mx-auto mb-2" />
          <EnhancedSkeleton className="h-6 w-80 mx-auto" />
        </div>

        {/* Content Sections Skeleton */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section 1 */}
          <div>
            <EnhancedSkeleton className="h-8 w-48 mb-4" />
            <EnhancedSkeleton className="h-4 w-full mb-2" />
            <EnhancedSkeleton className="h-4 w-full mb-2" />
            <EnhancedSkeleton className="h-4 w-5/6 mb-4" />
            <EnhancedSkeleton className="h-64 w-full rounded-lg" />
          </div>

          {/* Section 2 */}
          <div>
            <EnhancedSkeleton className="h-8 w-48 mb-4" />
            <EnhancedSkeleton className="h-4 w-full mb-2" />
            <EnhancedSkeleton className="h-4 w-full mb-2" />
            <EnhancedSkeleton className="h-4 w-4/5" />
          </div>

          {/* Section 3 - Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center">
                <EnhancedSkeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                <EnhancedSkeleton className="h-6 w-32 mx-auto mb-2" />
                <EnhancedSkeleton className="h-4 w-full mb-1" />
                <EnhancedSkeleton className="h-4 w-5/6 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

