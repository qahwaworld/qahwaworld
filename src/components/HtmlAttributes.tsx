'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function HtmlAttributes() {
  const pathname = usePathname();

  useEffect(() => {
    // Detect language from pathname - check for complete path segments
    let lang = 'en';
    let dir: 'ltr' | 'rtl' = 'ltr';

    if (pathname === '/ar' || pathname.startsWith('/ar/')) {
      lang = 'ar';
      dir = 'rtl';
    } else if (pathname === '/ru' || pathname.startsWith('/ru/')) {
      lang = 'ru';
      dir = 'ltr';
    }

    // Update HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [pathname]);

  return null;
}

