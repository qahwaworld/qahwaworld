'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language, Translation } from '../types';

const translations: Record<Language, Translation> = {
  en: {
    search: 'Search',
    subscribe: 'Subscribe',
    news: 'News',
    coffeeWorld: 'Qahwa World',
    coffeeCommunity: 'Coffee Community',
    studies: 'Studies',
    interview: 'Interview',
    coffeeReflections: 'Coffee Reflections',
    latestArticles: 'Latest articles',
    trending: 'Trending',
    spotlight: 'Spotlight',
    aboutUs: 'About us',
    privacyPolicy: 'Privacy Policy',
    contactUs: 'Contact Us',
    categories: 'Categories',
    pages: 'Pages',
    followUs: 'Follow Us',
    newsletter: 'Newsletter',
    newsletterText: 'Subscribe to receive the latest articles and coffee stories',
    emailPlaceholder: 'Enter your email',
    readMore: 'Read more',
    viewAll: 'View All',
    articles: 'Articles',
    whatIsQahwaWorld: 'What is Qahwa World',
    whatIsQahwa: 'What is Qahwa?',
    coffeeCultureUAE: 'Coffee culture in the UAE',
    faq: 'FAQ',
    folktaleStories: 'Folktale stories',
    about: 'ABOUT',
    qahwaWorld: 'QAHWAWORLD',
    otherOfferings: 'OTHER OFFERINGS',
    support: 'SUPPORT',
    madeWithLove: 'Made with love by Qahwa World',
    allRightsReserved: '© 2025 Qahwa World. All rights reserved.',
    leadershipTruth: 'Leadership & Truth',
    exclusiveEvents: 'Exclusive Events',
    socialResponsibility: 'Social Responsibility',
    sustainability: 'Sustainability',
    blog: 'Blog',
    pressRoom: 'Press Room',
    careers: 'Careers',
    ourTeam: 'Our Team',
    termsOfUse: 'Terms of Use',
    cookiePolicy: 'Cookie Policy',
    home: 'Home',
    tags: 'Tags',
    allTags: 'All Tags',
    searchResults: 'Search Results',
    searchArticles: 'Search Articles',
  },
  ar: {
    search: 'بحث',
    subscribe: 'اشترك',
    news: 'أخبار',
    coffeeWorld: 'عالم القهوة',
    coffeeCommunity: 'مجتمع القهوة',
    studies: 'دراسات',
    interview: 'حوارات',
    coffeeReflections: 'تأملات',
    latestArticles: 'أحدث المقالات',
    trending: 'الشائع',
    spotlight: 'الضوء',
    aboutUs: 'من نحن',
    privacyPolicy: 'سياسة الخصوصية',
    contactUs: 'اتصل بنا',
    categories: 'الفئات',
    pages: 'الصفحات',
    followUs: 'تابعنا',
    newsletter: 'النشرة الإخبارية',
    newsletterText: 'اشترك لتلقي أحدث المقالات وقصص القهوة',
    emailPlaceholder: 'أدخل بريدك الإلكتروني',
    readMore: 'اقرأ المزيد',
    viewAll: 'عرض الكل',
    articles: 'المقالات',
    whatIsQahwaWorld: 'ما هو عالم القهوة',
    whatIsQahwa: 'ما هي القهوة؟',
    coffeeCultureUAE: 'ثقافة القهوة في الإمارات',
    faq: 'الأسئلة الشائعة',
    folktaleStories: 'قصص فولكلورية',
    about: 'حول',
    qahwaWorld: 'عالم القهوة',
    otherOfferings: 'عروض أخرى',
    support: 'الدعم',
    madeWithLove: 'صنع بحب بواسطة عالم القهوة',
    allRightsReserved: '© 2025 عالم القهوة. جميع الحقوق محفوظة.',
    leadershipTruth: 'القيادة والحقيقة',
    exclusiveEvents: 'فعاليات حصرية',
    socialResponsibility: 'المسؤولية الاجتماعية',
    sustainability: 'الاستدامة',
    blog: 'المدونة',
    pressRoom: 'غرفة الصحافة',
    careers: 'الوظائف',
    ourTeam: 'فريقنا',
    termsOfUse: 'شروط الاستخدام',
    cookiePolicy: 'سياسة ملفات تعريف الارتباط',
    home: 'الرئيسية',
    tags: 'الوسوم',
    allTags: 'جميع الوسوم',
    searchResults: 'نتائج البحث',
    searchArticles: 'البحث في المقالات',
  },
  ru: {
    search: 'Поиск',
    subscribe: 'Подписаться',
    news: 'Новости',
    coffeeWorld: 'Мир Кахвы',
    coffeeCommunity: 'Кофейное Сообщество',
    studies: 'Исследования',
    interview: 'Интервью',
    coffeeReflections: 'Размышления',
    latestArticles: 'Последние статьи',
    trending: 'В тренде',
    spotlight: 'В центре внимания',
    aboutUs: 'О нас',
    privacyPolicy: 'Политика',
    contactUs: 'Связаться с нами',
    categories: 'Категории',
    pages: 'Страницы',
    followUs: 'Подписывайтесь',
    newsletter: 'Рассылка',
    newsletterText: 'Подпишитесь, чтобы получать последние статьи и кофейные истории',
    emailPlaceholder: 'Введите ваш email',
    readMore: 'Читать далее',
    viewAll: 'Показать всё',
    articles: 'Статьи',
    whatIsQahwaWorld: 'Что такое Мир Кахвы',
    whatIsQahwa: 'Что такое Кахва?',
    coffeeCultureUAE: 'Кофейная культура в ОАЭ',
    faq: 'FAQ',
    folktaleStories: 'Фольклорные истории',
    about: 'О НАС',
    qahwaWorld: 'МИР КАХВЫ',
    otherOfferings: 'ДРУГИЕ ПРЕДЛОЖЕНИЯ',
    support: 'ПОДДЕРЖКА',
    madeWithLove: 'Сделано с любовью Миром Кахвы',
    allRightsReserved: '© 2025 Мир Кахвы. Все права защищены.',
    leadershipTruth: 'Лидерство и Правда',
    exclusiveEvents: 'Эксклюзивные События',
    socialResponsibility: 'Социальная Ответственность',
    sustainability: 'Устойчивость',
    blog: 'Блог',
    pressRoom: 'Пресс-центр',
    careers: 'Карьера',
    ourTeam: 'Наша Команда',
    termsOfUse: 'Условия использования',
    cookiePolicy: 'Политика Cookie',
    home: 'Главная',
    tags: 'Теги',
    allTags: 'Все Теги',
    searchResults: 'Результаты поиска',
    searchArticles: 'Поиск статей',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
  dir: 'ltr' | 'rtl';
  alternatePaths: Record<string, string>;
  setAlternatePaths: (paths: Record<string, string>) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode; initialLanguage?: Language }> = ({
  children,
  initialLanguage = 'en'
}) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [alternatePaths, setAlternatePaths] = useState<Record<string, string>>({});

  // Sync language state with initialLanguage prop when it changes (e.g., on navigation)
  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  // Note: Document lang and dir attributes are handled by the layout files
  // to prevent hydration mismatches. We only manage the language state here.

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    dir: language === 'ar' ? 'rtl' : 'ltr',
    alternatePaths,
    setAlternatePaths,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
