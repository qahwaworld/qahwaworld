import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/components/ui/utils';

const EnhancedSkeleton = ({ className, ...props }: React.ComponentProps<"div">) => (
  <Skeleton className={cn("bg-gray-200 dark:bg-gray-700", className)} {...props} />
);

export default function PrivacyLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header Skeleton */}
        <div className="mb-12 text-center">
          <EnhancedSkeleton className="h-12 w-64 mx-auto mb-4" />
          <EnhancedSkeleton className="h-6 w-96 mx-auto mb-2" />
          <EnhancedSkeleton className="h-4 w-48 mx-auto" />
        </div>

        {/* Content Sections Skeleton */}
        <div className="max-w-4xl mx-auto space-y-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <EnhancedSkeleton className="h-8 w-64 mb-4" />
              <EnhancedSkeleton className="h-4 w-full mb-2" />
              <EnhancedSkeleton className="h-4 w-full mb-2" />
              <EnhancedSkeleton className="h-4 w-5/6 mb-4" />
              {i % 2 === 0 && (
                <>
                  <EnhancedSkeleton className="h-4 w-full mb-2" />
                  <EnhancedSkeleton className="h-4 w-4/5" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

