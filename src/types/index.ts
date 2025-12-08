export type Language = 'en' | 'ar' | 'ru';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug?: string;
  image: string;
  date: string;
  author: string;
  authorId?: number;
  authorSlug?: string;
  authorBio?: {
    en?: string;
    ar?: string;
    ru?: string;
  };
  authorImage?: {
    altText: string;
    sourceUrl: string;
  };
  authorPostCount?: number;
  readTime: string;
  featured?: boolean;
  tags?: string[] | Array<{ name: string; slug: string }>;
  content?: string;
  slug?: string;
  galleryImages?: Array<{
    altText: string;
    sourceUrl: string;
  }>;
  contentAfterGallery?: string;
}

export interface Translation {
  // Header
  search: string;
  subscribe: string;

  // Navigation
  news: string;
  coffeeWorld: string;
  coffeeCommunity: string;
  studies: string;
  interview: string;
  coffeeReflections: string;
  whatIsQahwaWorld: string;
  whatIsQahwa: string;
  coffeeCultureUAE: string;
  faq: string;
  folktaleStories: string;

  // Sections
  latestArticles: string;
  trending: string;
  spotlight: string;

  // Pages
  aboutUs: string;
  privacyPolicy: string;
  contactUs: string;

  // Footer
  categories: string;
  pages: string;
  followUs: string;
  newsletter: string;
  newsletterText: string;
  emailPlaceholder: string;
  about: string;
  qahwaWorld: string;
  otherOfferings: string;
  support: string;
  madeWithLove: string;
  allRightsReserved: string;
  leadershipTruth: string;
  exclusiveEvents: string;
  socialResponsibility: string;
  sustainability: string;
  blog: string;
  pressRoom: string;
  careers: string;
  ourTeam: string;
  termsOfUse: string;
  cookiePolicy: string;

  // Common
  readMore: string;
  viewAll: string;
  articles: string;
  home: string;
  tags: string;
  allTags: string;
  searchResults: string;
  searchArticles: string;

  // Toast messages
  toastEmailRequired: string;
  toastEmailAlreadySubscribed: string;
  toastSubscriptionSuccess: string;
  toastSubscriptionError: string;
  toastSubscribing: string;

  // Subscribe Modal
  subscribeModalDescription: string;

  // Read Time
  minRead: string;
  readTime: string;
}
