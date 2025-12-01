import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/components/ui/utils';

const EnhancedSkeleton = ({ className, ...props }: React.ComponentProps<"div">) => (
  <Skeleton className={cn("bg-gray-200 dark:bg-gray-700", className)} {...props} />
);

export default function FAQLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header Skeleton */}
        <div className="mb-12 text-center">
          <EnhancedSkeleton className="h-12 w-64 mx-auto mb-4" />
          <EnhancedSkeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* FAQ Items Skeleton */}
        <div className="max-w-3xl mx-auto space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border dark:border-gray-700 rounded-lg p-6">
              <EnhancedSkeleton className="h-6 w-full mb-3" />
              <EnhancedSkeleton className="h-4 w-full mb-2" />
              <EnhancedSkeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

