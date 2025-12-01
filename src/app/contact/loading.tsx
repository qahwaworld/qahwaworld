import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/components/ui/utils';

const EnhancedSkeleton = ({ className, ...props }: React.ComponentProps<"div">) => (
  <Skeleton className={cn("bg-gray-200 dark:bg-gray-700", className)} {...props} />
);

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header Skeleton */}
        <div className="mb-12 text-center">
          <EnhancedSkeleton className="h-12 w-64 mx-auto mb-4" />
          <EnhancedSkeleton className="h-6 w-96 mx-auto mb-2" />
          <EnhancedSkeleton className="h-6 w-80 mx-auto" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form Skeleton */}
            <div>
              <EnhancedSkeleton className="h-8 w-48 mb-6" />
              <div className="space-y-4">
                <EnhancedSkeleton className="h-12 w-full" />
                <EnhancedSkeleton className="h-12 w-full" />
                <EnhancedSkeleton className="h-12 w-full" />
                <EnhancedSkeleton className="h-32 w-full" />
                <EnhancedSkeleton className="h-12 w-32" />
              </div>
            </div>

            {/* Contact Info Skeleton */}
            <div>
              <EnhancedSkeleton className="h-8 w-48 mb-6" />
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i}>
                    <EnhancedSkeleton className="h-6 w-32 mb-2" />
                    <EnhancedSkeleton className="h-4 w-full mb-1" />
                    <EnhancedSkeleton className="h-4 w-5/6" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

