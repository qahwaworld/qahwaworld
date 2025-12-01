'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Skeleton } from './ui/skeleton';
import { cn } from './ui/utils';

interface PageLoaderProps {
  children: React.ReactNode;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Show loader when route changes
    setLoading(true);

    // Hide loader after a short delay to ensure smooth transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-white dark:bg-gray-900 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            {/* Logo or Icon Skeleton */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-amber-700 border-t-transparent animate-spin" />
            </div>
            
            {/* Loading Text */}
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-3 w-24 bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-amber-700 animate-[loading_1.5s_ease-in-out_infinite] rounded-full" />
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

// Add keyframes for progress bar animation
const style = document.createElement('style');
style.textContent = `
  @keyframes loading {
    0% {
      width: 0%;
      transform: translateX(0);
    }
    50% {
      width: 70%;
      transform: translateX(0);
    }
    100% {
      width: 100%;
      transform: translateX(100%);
    }
  }
`;
if (typeof document !== 'undefined' && !document.head.querySelector('#page-loader-styles')) {
  style.id = 'page-loader-styles';
  document.head.appendChild(style);
}

