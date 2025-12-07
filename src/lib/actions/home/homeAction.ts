import client from "@/lib/client/ApolloClient";
import { GET_HOME_PAGE_LATEST_ARTICLES, GET_TRENDING_POSTS_FROM_HOME_PAGE, GET_CATEGORIES_SECTION_FOR_HOME_PAGE, GET_SPOTLIGHT_DATA_FOR_HOME_PAGE, GET_HOMEPAGE_AD_BANNER } from "@/lib/wordpress/queries/home/homeQuery";

export interface FeaturedImage {
  node: {
    sourceUrl: string;
    altText: string;
    mediaDetails: {
      width: number;
      height: number;
    };
  };
}

export interface Category {
  node: {
    name: string;
    slug: string;
    languageCode: string;
  };
}

export interface Post {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  featuredImage: FeaturedImage;
  categories: {
    edges: Category[];
  };
}

export interface HomePageDataType {
  posts: {
    nodes: Post[];
  };
}

export async function getHomePageLatestArticles(language: string = "en"): Promise<Post[]> {
  try {
    // Normalize language to lowercase for consistency
    const normalizedLanguage = language.toLowerCase();
    const result = await client.query<HomePageDataType>({
      query: GET_HOME_PAGE_LATEST_ARTICLES,
      variables: {
        language: normalizedLanguage,
      },
      context: {
        fetchOptions: {
          next: { 
            tags: ['wordpress', `wordpress-${normalizedLanguage}`]
          },
        },
      },
    });

    if (result.error || !result.data?.posts?.nodes) {
      return [];
    }

    return result.data.posts.nodes;
  } catch (error) {
    return [];
  }
}

export interface TrendingPostCategory {
  name: string;
  slug: string;
}

export interface TrendingPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  readingTime: number;
  categories: TrendingPostCategory[];
}

export interface TrendingPostsDataType {
  trendingPosts: TrendingPost[];
}

export async function getTrendingPostsFromHomePage(lang: string): Promise<TrendingPost[]> {
  try {
    // Normalize language to lowercase for consistency
    const normalizedLang = lang.toLowerCase();
    const result = await client.query<TrendingPostsDataType>({
      query: GET_TRENDING_POSTS_FROM_HOME_PAGE,
      variables: {
        lang: normalizedLang,
      },
      context: {
        fetchOptions: {
          next: { 
            tags: ['wordpress', `wordpress-${normalizedLang}`]
          },
        },
      },
    });

    if (result.error || !result.data?.trendingPosts) {
      return [];
    }

    return result.data.trendingPosts;
  } catch (error) {
    return [];
  }
}

export interface CategorySectionCategory {
  id: number;
  name: string;
  slug: string;
}

export interface CategorySectionPost {
  id: number;
  title: string;
  slug: string;
  featuredImage: string;
  date: string;
  readingTime: number;
}

export interface CategorySectionItem {
  sectionTitle: string;
  viewAllButtonLabel: string;
  viewAllButtonUrl: string;
  category: CategorySectionCategory;
  posts: CategorySectionPost[];
}

export interface CategorySectionDataType {
  getCategorySectionData: CategorySectionItem[];
}

export async function getCategoriesSectionForHomePage(lang: string): Promise<CategorySectionItem[]> {
  try {
    // Normalize language to lowercase for consistency
    const normalizedLang = lang.toLowerCase();
    const result = await client.query<CategorySectionDataType>({
      query: GET_CATEGORIES_SECTION_FOR_HOME_PAGE,
      variables: {
        lang: normalizedLang,
      },
      context: {
        fetchOptions: {
          next: { 
            tags: ['wordpress', `wordpress-${normalizedLang}`]
          },
        },
      },
    });

    if (result.error || !result.data?.getCategorySectionData) {
      return [];
    }

    return result.data.getCategorySectionData;
  } catch (error) {
    return [];
  }
}

export interface SpotlightPostCategory {
  id: number;
  name: string;
  slug: string;
}

export interface SpotlightPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  date: string;
  readingTime: number;
  author: string;
  categories: SpotlightPostCategory[];
}

export interface SpotlightCategory {
  id: number;
  name: string;
  slug: string;
}

export interface SpotlightData {
  sectionTitle: string;
  image: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonLink: string;
  category: SpotlightCategory;
  posts: SpotlightPost[];
}

export interface SpotlightDataType {
  getSpotlightData: SpotlightData;
}

export async function getSpotlightDataForHomePage(lang: string): Promise<SpotlightData | null> {
  try {
    // Normalize language to lowercase for consistency
    const normalizedLang = lang.toLowerCase();
    const result = await client.query<SpotlightDataType>({
      query: GET_SPOTLIGHT_DATA_FOR_HOME_PAGE,
      variables: {
        lang: normalizedLang,
      },
      context: {
        fetchOptions: {
          next: { 
            tags: ['wordpress', `wordpress-${normalizedLang}`]
          },
        },
      },
    });

    if (result.error || !result.data?.getSpotlightData) {
      return null;
    }

    return result.data.getSpotlightData;
  } catch (error) {
    return null;
  }
}

export interface HomepageAdBanner {
  name: string;
  content: string;
}

export interface HomepageAdBannerDataType {
  getHomepageAdBanner: HomepageAdBanner[];
}

export async function getHomepageAdBanner(): Promise<HomepageAdBanner[]> {
  try {
    const result = await client.query<HomepageAdBannerDataType>({
      query: GET_HOMEPAGE_AD_BANNER,
      context: {
        fetchOptions: {
          next: { 
            tags: ['wordpress', 'wordpress-ad-banners']
          },
        },
      },
    });

    if (result.error || !result.data?.getHomepageAdBanner) {
      return [];
    }

    return result.data.getHomepageAdBanner;
  } catch (error) {
    return [];
  }
}
