import React from "react";
import { ArticleCardSkeleton } from "./ArticleCardSkeleton";

interface ArticleListSkeletonProps {
  count?: number;
}

export const ArticleListSkeleton: React.FC<ArticleListSkeletonProps> = ({
  count = 5,
}) => {
  return (
    <div className="space-y-6">
      <ArticleCardSkeleton variant="horizontal" count={count} />
    </div>
  );
};

