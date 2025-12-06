'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Toaster } from '@/components/ui/sonner';
import { NavigationLoader } from '@/components/NavigationLoader';
import { PopAdModal } from '@/components/PopAdModal';
import { Language } from '@/types';
import { Category, LogoData } from '@/lib/actions/site/headerMenuAction';

interface LocaleWrapperProps {
  children: React.ReactNode;
  menuData: {
    en: Category[];
    ar: Category[];
    ru: Category[];
  };
  mobileMenuData: {
    en: Category[];
    ar: Category[];
    ru: Category[];
  };
  mobilePagesMenuData: {
    en: Category[];
    ar: Category[];
    ru: Category[];
  };
  footerCategoriesMenuData: {
    en: Category[];
    ar: Category[];
    ru: Category[];
  };
  footerPagesMenuData: {
    en: Category[];
    ar: Category[];
    ru: Category[];
  };
  logoData: LogoData | null;
}

export function LocaleWrapper({ children, menuData, mobileMenuData, mobilePagesMenuData, footerCategoriesMenuData, footerPagesMenuData, logoData }: LocaleWrapperProps) {
  const pathname = usePathname();

  // Detect locale from pathname - check for complete path segments to avoid matching '/ar' in '/article'
  let locale: Language = 'en';
  if (pathname === '/ar' || pathname.startsWith('/ar/')) {
    locale = 'ar';
  } else if (pathname === '/ru' || pathname.startsWith('/ru/')) {
    locale = 'ru';
  }

  return (
    <LanguageProvider initialLanguage={locale}>
      <Suspense fallback={null}>
        <NavigationLoader />
      </Suspense>
      <div className="min-h-screen flex flex-col">
        <Header key={locale} locale={locale} language={locale} menuData={menuData} mobileMenuData={mobileMenuData} mobilePagesMenuData={mobilePagesMenuData} logoData={logoData} />
        <main className="flex-1">
          {children}
        </main>
        <Footer logoData={logoData} footerCategoriesMenuData={footerCategoriesMenuData} footerPagesMenuData={footerPagesMenuData} />
      </div>
      <ScrollToTop />
      <Toaster />
      <PopAdModal html={logoData?.popAdCode ?? null} />
    </LanguageProvider>
  );
}
