import React from "react";
import { ArticleCardSkeleton } from "./ArticleCardSkeleton";

interface ArticleGridSkeletonProps {
  count?: number;
}

export const ArticleGridSkeleton: React.FC<ArticleGridSkeletonProps> = ({
  count = 6,
}) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ArticleCardSkeleton variant="default" count={count} />
    </div>
  );
};

