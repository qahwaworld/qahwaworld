'use client';

import React from 'react';
import { Skeleton } from './ui/skeleton';

interface FullScreenLoaderProps {
  isLoading?: boolean;
  message?: string;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ 
  isLoading = true,
  message = 'Loading...'
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo/Spinner */}
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="w-20 h-20 rounded-full border-4 border-gray-200 dark:border-gray-700" />
          <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-amber-700 border-t-transparent animate-spin" />
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-2 rounded-full bg-amber-700/20 animate-pulse" />
        </div>
        
        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {message}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please wait...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full"
            style={{
              animation: 'loading 1.5s ease-in-out infinite'
            }}
          />
        </div>

        {/* Loading Dots */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-amber-700 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-amber-700 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-amber-700 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};

