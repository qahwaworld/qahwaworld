'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Coffee, Search } from 'lucide-react';
import { getTranslations } from '@/lib/translations';
import { getLocalizedPath } from '@/lib/localization';
import { Button } from '@/components/ui/button';

export function NotFoundContent() {
  const pathname = usePathname();
  
  // Detect locale from pathname
  // Check for /ar/ or /ru/ to avoid matching paths like /article
  let locale = 'en';
  if (pathname === '/ar' || pathname?.startsWith('/ar/')) {
    locale = 'ar';
  } else if (pathname === '/ru' || pathname?.startsWith('/ru/')) {
    locale = 'ru';
  }
  
  const t = getTranslations(locale);
  const getPath = (path: string) => getLocalizedPath(path, locale);

  // 404 translations
  const notFoundTranslations: Record<string, any> = {
    en: {
      title: '404',
      heading: 'Page Not Found',
      message: "Sorry, we couldn't find the page you're looking for.",
      suggestion: 'The page might have been moved, deleted, or the URL might be incorrect.',
      goHome: 'Go to Homepage',
      goBack: 'Go Back',
      search: 'Search Articles',
      popularLinks: 'Popular Links',
      categories: 'Browse Categories',
      latestArticles: 'Latest Articles',
    },
    ar: {
      title: '404',
      heading: 'الصفحة غير موجودة',
      message: 'عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.',
      suggestion: 'قد تكون الصفحة قد تم نقلها أو حذفها، أو قد يكون الرابط غير صحيح.',
      goHome: 'العودة إلى الصفحة الرئيسية',
      goBack: 'العودة',
      search: 'البحث في المقالات',
      popularLinks: 'روابط شائعة',
      categories: 'تصفح الفئات',
      latestArticles: 'أحدث المقالات',
    },
    ru: {
      title: '404',
      heading: 'Страница не найдена',
      message: 'Извините, мы не смогли найти страницу, которую вы ищете.',
      suggestion: 'Страница могла быть перемещена, удалена или URL может быть неверным.',
      goHome: 'На главную',
      goBack: 'Назад',
      search: 'Поиск статей',
      popularLinks: 'Популярные ссылки',
      categories: 'Просмотр категорий',
      latestArticles: 'Последние статьи',
    },
  };

  const notFoundT = notFoundTranslations[locale] || notFoundTranslations.en;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-amber-700 dark:text-amber-500 mb-4">
            {notFoundT.title}
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Coffee className="w-8 h-8 text-amber-700 dark:text-amber-500" />
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              {notFoundT.heading}
            </h2>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            {notFoundT.message}
          </p>
          <p className="text-base text-gray-500 dark:text-gray-500">
            {notFoundT.suggestion}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Button
            asChild
            className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3"
          >
            <Link href={getPath('/')}>
              <Home className="w-4 h-4 mr-2" />
              {notFoundT.goHome}
            </Link>
          </Button>
        </div>

        {/* Popular Links */}
        <div className="border-t dark:border-gray-700 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            {notFoundT.popularLinks}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <Link
              href={getPath('/')}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-amber-700 dark:text-amber-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {t.home}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {notFoundT.latestArticles}
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href={getPath('/about')}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Coffee className="w-5 h-5 text-amber-700 dark:text-amber-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {t.about}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Learn about Qahwa World
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href={getPath('/tags')}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-amber-700 dark:text-amber-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {t.tags}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {notFoundT.categories}
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href={getPath('/contact')}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Coffee className="w-5 h-5 text-amber-700 dark:text-amber-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {t.contact}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get in touch with us
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

