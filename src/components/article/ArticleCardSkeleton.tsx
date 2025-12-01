import React from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "../ui/utils";

// Enhanced skeleton with better visibility
const EnhancedSkeleton = ({ className, ...props }: React.ComponentProps<"div">) => (
  <Skeleton className={cn("bg-gray-200 dark:bg-gray-700", className)} {...props} />
);

interface ArticleCardSkeletonProps {
  variant?: "default" | "small" | "featured" | "horizontal";
  count?: number;
}

export const ArticleCardSkeleton: React.FC<ArticleCardSkeletonProps> = ({
  variant = "default",
  count = 1,
}) => {
  if (variant === "small") {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex gap-3">
            <EnhancedSkeleton className="w-24 h-24 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <EnhancedSkeleton className="h-4 w-16 mb-2" />
              <EnhancedSkeleton className="h-4 w-full mb-1" />
              <EnhancedSkeleton className="h-4 w-3/4 mb-1" />
              <EnhancedSkeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === "featured") {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="cursor-pointer">
            <EnhancedSkeleton className="w-full h-96 mb-4" />
            <EnhancedSkeleton className="h-5 w-24 mb-3" />
            <EnhancedSkeleton className="h-8 w-full mb-2" />
            <EnhancedSkeleton className="h-8 w-3/4 mb-3" />
            <EnhancedSkeleton className="h-4 w-full mb-1" />
            <EnhancedSkeleton className="h-4 w-5/6 mb-3" />
            <div className="flex items-center gap-4">
              <EnhancedSkeleton className="h-4 w-24" />
              <EnhancedSkeleton className="h-4 w-24" />
              <EnhancedSkeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === "horizontal") {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex gap-4 border overflow-hidden">
            <EnhancedSkeleton className="w-48 h-32 flex-shrink-0" />
            <div className="flex-1 min-w-0 p-4">
              <EnhancedSkeleton className="h-5 w-24 mb-2" />
              <EnhancedSkeleton className="h-6 w-full mb-2" />
              <EnhancedSkeleton className="h-6 w-3/4 mb-4" />
              <div className="flex items-center gap-3">
                <EnhancedSkeleton className="h-4 w-20" />
                <EnhancedSkeleton className="h-4 w-20" />
                <EnhancedSkeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  // Default variant
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="cursor-pointer">
          <EnhancedSkeleton className="w-full h-48 mb-3" />
          <EnhancedSkeleton className="h-5 w-24 mb-2" />
          <EnhancedSkeleton className="h-6 w-full mb-2" />
          <EnhancedSkeleton className="h-6 w-3/4 mb-3" />
          <EnhancedSkeleton className="h-4 w-full mb-1" />
          <EnhancedSkeleton className="h-4 w-5/6 mb-3" />
          <div className="flex items-center gap-3">
            <EnhancedSkeleton className="h-3 w-20" />
            <EnhancedSkeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </>
  );
};

