// Server-side translations utility
export function getTranslations(locale: string) {
  const translations: Record<string, any> = {
    en: {
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      faq: 'FAQ',
      privacy: 'Privacy Policy',
      search: 'Search',
      searchPlaceholder: 'Search articles...',
      latestArticles: 'Latest Articles',
      trendingNow: 'Trending ',
      trending: 'Trending ',
      news: 'News',
      interview: 'Interview',
      featured: 'Featured',
      viewMore: 'View More',
      viewAll: 'View All',
      readMore: 'Read More',
      relatedArticles: 'Related Articles',
      shareArticle: 'Share Article',
      tags: 'Tags',
      categories: 'Categories',
      allTags: 'All Tags',
      browseByTag: 'Browse by Tag',
      searchResults: 'Search Results',
      noResults: 'No results found',
      loadMore: 'Load More',
      noContentTitle: 'No Content Available',
      noContentMessage: 'There is no content available for this page at the moment. Please check back later.',
      minRead: 'Min Read',
      readTime: 'Read time:',
    },
    ar: {
      home: 'الرئيسية',
      about: 'من نحن',
      contact: 'اتصل بنا',
      faq: 'الأسئلة الشائعة',
      privacy: 'سياسة الخصوصية',
      search: 'بحث',
      searchPlaceholder: 'البحث في المقالات...',
      latestArticles: 'أحدث المقالات',
      trendingNow: 'الأكثر رواجاً',
      trending: 'الأكثر رواجاً',
      news: 'أخبار',
      interview: 'حوارات',
      featured: 'مميز',
      viewMore: 'عرض المزيد',
      viewAll: 'عرض الكل',
      readMore: 'اقرأ المزيد',
      relatedArticles: 'مقالات ذات صلة',
      shareArticle: 'شارك المقال',
      tags: 'الوسوم',
      categories: 'الفئات',
      allTags: 'جميع الوسوم',
      browseByTag: 'تصفح حسب الوسم',
      searchResults: 'نتائج البحث',
      noResults: 'لا توجد نتائج',
      loadMore: 'تحميل المزيد',
      noContentTitle: 'لا يوجد محتوى متاح',
      noContentMessage: 'لا يوجد محتوى متاح لهذه الصفحة في الوقت الحالي. يرجى المحاولة مرة أخرى لاحقاً.',
      minRead: 'دقيقة للقراءة',
      readTime: 'وقت القراءة:',
    },
    ru: {
      home: 'Главная',
      about: 'О нас',
      contact: 'Контакты',
      faq: 'Часто задаваемые вопросы',
      privacy: 'Политика конфиденциальности',
      search: 'Поиск',
      searchPlaceholder: 'Поиск статей...',
      latestArticles: 'Последние статьи',
      trendingNow: 'В тренде',
      trending: 'В тренде',
      news: 'Новости',
      interview: 'Интервью',
      featured: 'Избранное',
      viewMore: 'Показать больше',
      viewAll: 'Показать все',
      readMore: 'Читать далее',
      relatedArticles: 'Похожие статьи',
      shareArticle: 'Поделиться статьей',
      tags: 'Теги',
      categories: 'Категории',
      allTags: 'Все теги',
      browseByTag: 'Просмотр по тегу',
      searchResults: 'Результаты поиска',
      noResults: 'Ничего не найдено',
      loadMore: 'Загрузить ещё',
      noContentTitle: 'Контент недоступен',
      noContentMessage: 'В настоящее время контент для этой страницы недоступен. Пожалуйста, проверьте позже.',
      minRead: 'Мин. чтение',
      readTime: 'Время чтения:',
    },
  };

  return translations[locale] || translations.en;
}

export function getCategoryTranslation(category: string, locale: string): string {
  // Normalize category name (trim, handle variations)
  const normalizedCategory = category.trim();
  
  const categoryTranslations: Record<string, { en: string; ar: string; ru: string }> = {
    News: { en: 'News', ar: 'أخبار', ru: 'Новости' },
    'Coffee Community': { en: 'Coffee Community', ar: 'مجتمع القهوة', ru: 'Кофейное Сообщество' },
    'Cofee Community': { en: 'Coffee Community', ar: 'مجتمع القهوة', ru: 'Кофейное Сообщество' }, // Handle typo
    Studies: { en: 'Studies', ar: 'دراسات', ru: 'Исследования' },
    Research: { en: 'Studies', ar: 'دراسات', ru: 'Исследования' }, // Alternative name
    Interview: { en: 'Interview', ar: 'حوارات', ru: 'Интервью' },
    'Coffee Reflections': { en: 'Coffee Reflections', ar: 'تأملات', ru: 'Размышления' },
    Reflections: { en: 'Coffee Reflections', ar: 'تأملات', ru: 'Размышления' }, // Handle short form
    Spotlight: { en: 'Spotlight', ar: 'في دائرة الضوء', ru: 'В центре внимания' },
  };

  // Try exact match first
  if (categoryTranslations[normalizedCategory]) {
    return categoryTranslations[normalizedCategory][locale as 'en' | 'ar' | 'ru'] || category;
  }

  // Try case-insensitive match
  const lowerCategory = normalizedCategory.toLowerCase();
  for (const [key, translations] of Object.entries(categoryTranslations)) {
    if (key.toLowerCase() === lowerCategory) {
      return translations[locale as 'en' | 'ar' | 'ru'] || category;
    }
  }

  // Try partial match for variations (e.g., "Coffee Community" matches "Cofee Community")
  for (const [key, translations] of Object.entries(categoryTranslations)) {
    const keyLower = key.toLowerCase();
    if (lowerCategory.includes(keyLower) || keyLower.includes(lowerCategory)) {
      return translations[locale as 'en' | 'ar' | 'ru'] || category;
    }
  }

  // If no match found, return original category
  return category;
}
