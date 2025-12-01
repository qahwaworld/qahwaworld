'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { FullScreenLoader } from './FullScreenLoader';

export const NavigationLoader: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPathnameRef = useRef<string>('');
  const prevSearchParamsRef = useRef<string>('');

  // Handle initial page load
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      // Show loader briefly on initial load
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [initialLoad]);

  // Handle route changes
  useEffect(() => {
    try {
      const searchParamsString = searchParams?.toString() || '';
      const currentPath = pathname + searchParamsString;
      const prevPath = prevPathnameRef.current + prevSearchParamsRef.current;

      // Only show loader if path actually changed (not on initial load)
      if (currentPath !== prevPath && prevPath !== '' && !initialLoad) {
        setLoading(true);

        // Hide loader after a short delay to allow page to render
        const timer = setTimeout(() => {
          setLoading(false);
        }, 400);

        return () => clearTimeout(timer);
      }

      // Update refs
      prevPathnameRef.current = pathname;
      prevSearchParamsRef.current = searchParamsString;
    } catch (error) {
      // Fallback: only use pathname if searchParams fails
      const currentPath = pathname;
      const prevPath = prevPathnameRef.current;

      if (currentPath !== prevPath && prevPath !== '' && !initialLoad) {
        setLoading(true);
        const timer = setTimeout(() => {
          setLoading(false);
        }, 400);
        return () => clearTimeout(timer);
      }

      prevPathnameRef.current = pathname;
    }
  }, [pathname, searchParams, initialLoad]);

  // Show loader on initial load or route changes
  const showLoader = initialLoad || loading;

  return <FullScreenLoader isLoading={showLoader} message="Loading page..." />;
};

