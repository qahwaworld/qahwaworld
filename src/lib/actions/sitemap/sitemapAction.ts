import client from "@/lib/client/ApolloClient";
import {
  GET_SITEMAP_PAGES,
  GET_SITEMAP_POSTS,
  GET_SITEMAP_CATEGORIES,
  GET_SITEMAP_TAGS,
} from "@/lib/wordpress/queries/sitemap/sitemapQuery";

export interface SitemapPage {
  slug: string;
  date: string;
}

export interface SitemapPost {
  slug: string;
  date: string;
  categories: {
    nodes: Array<{
      slug: string;
    }>;
  };
}

export interface SitemapCategory {
  slug: string;
}

export interface SitemapTag {
  slug: string;
}

export interface SitemapData {
  pages: {
    nodes: SitemapPage[];
  };
  posts: {
    nodes: SitemapPost[];
  };
  categories: {
    nodes: SitemapCategory[];
  };
  tags: {
    nodes: SitemapTag[];
  };
}

/**
 * Fetch all pages with pagination
 */
async function fetchAllPages(lang: string, batchSize: number = 100): Promise<SitemapPage[]> {
  const allPages: SitemapPage[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    try {
      const result: {
        data?: {
          pages: {
            nodes: SitemapPage[];
            pageInfo: {
              hasNextPage: boolean;
              endCursor: string | null;
            };
          };
        };
      } = await client.query<{
        pages: {
          nodes: SitemapPage[];
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
          };
        };
      }>({
        query: GET_SITEMAP_PAGES,
        variables: {
          lang,
          first: batchSize,
          after,
        },
        context: {
          fetchOptions: {
            next: {
              tags: ['wordpress', `wordpress-${lang}`, 'wordpress-sitemap'],
            },
          },
        },
      });

      if (result.data?.pages?.nodes) {
        allPages.push(...result.data.pages.nodes);
        hasNextPage = result.data.pages.pageInfo.hasNextPage;
        after = result.data.pages.pageInfo.endCursor;
      } else {
        hasNextPage = false;
      }
    } catch (error) {
      console.error('Error fetching pages for sitemap:', error);
      hasNextPage = false;
    }
  }

  return allPages;
}

/**
 * Fetch all posts with pagination
 */
async function fetchAllPosts(lang: string, batchSize: number = 100): Promise<SitemapPost[]> {
  const allPosts: SitemapPost[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    try {
      const result: {
        data?: {
          posts: {
            nodes: SitemapPost[];
            pageInfo: {
              hasNextPage: boolean;
              endCursor: string | null;
            };
          };
        };
      } = await client.query<{
        posts: {
          nodes: SitemapPost[];
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
          };
        };
      }>({
        query: GET_SITEMAP_POSTS,
        variables: {
          lang,
          first: batchSize,
          after,
        },
        context: {
          fetchOptions: {
            next: {
              tags: ['wordpress', `wordpress-${lang}`, 'wordpress-sitemap'],
            },
          },
        },
      });

      if (result.data?.posts?.nodes) {
        allPosts.push(...result.data.posts.nodes);
        hasNextPage = result.data.posts.pageInfo.hasNextPage;
        after = result.data.posts.pageInfo.endCursor;
      } else {
        hasNextPage = false;
      }
    } catch (error) {
      console.error('Error fetching posts for sitemap:', error);
      hasNextPage = false;
    }
  }

  return allPosts;
}

/**
 * Fetch all categories with pagination
 */
async function fetchAllCategories(lang: string, batchSize: number = 100): Promise<SitemapCategory[]> {
  const allCategories: SitemapCategory[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    try {
      const result: {
        data?: {
          categories: {
            nodes: SitemapCategory[];
            pageInfo: {
              hasNextPage: boolean;
              endCursor: string | null;
            };
          };
        };
      } = await client.query<{
        categories: {
          nodes: SitemapCategory[];
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
          };
        };
      }>({
        query: GET_SITEMAP_CATEGORIES,
        variables: {
          lang,
          first: batchSize,
          after,
        },
        context: {
          fetchOptions: {
            next: {
              tags: ['wordpress', `wordpress-${lang}`, 'wordpress-sitemap'],
            },
          },
        },
      });

      if (result.data?.categories?.nodes) {
        allCategories.push(...result.data.categories.nodes);
        hasNextPage = result.data.categories.pageInfo.hasNextPage;
        after = result.data.categories.pageInfo.endCursor;
      } else {
        hasNextPage = false;
      }
    } catch (error) {
      console.error('Error fetching categories for sitemap:', error);
      hasNextPage = false;
    }
  }

  return allCategories;
}

/**
 * Fetch all tags with pagination
 */
async function fetchAllTags(lang: string, batchSize: number = 100): Promise<SitemapTag[]> {
  const allTags: SitemapTag[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    try {
      const result: {
        data?: {
          tags: {
            nodes: SitemapTag[];
            pageInfo: {
              hasNextPage: boolean;
              endCursor: string | null;
            };
          };
        };
      } = await client.query<{
        tags: {
          nodes: SitemapTag[];
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
          };
        };
      }>({
        query: GET_SITEMAP_TAGS,
        variables: {
          lang,
          first: batchSize,
          after,
        },
        context: {
          fetchOptions: {
            next: {
              tags: ['wordpress', `wordpress-${lang}`, 'wordpress-sitemap'],
            },
          },
        },
      });

      if (result.data?.tags?.nodes) {
        allTags.push(...result.data.tags.nodes);
        hasNextPage = result.data.tags.pageInfo.hasNextPage;
        after = result.data.tags.pageInfo.endCursor;
      } else {
        hasNextPage = false;
      }
    } catch (error) {
      console.error('Error fetching tags for sitemap:', error);
      hasNextPage = false;
    }
  }

  return allTags;
}

/**
 * Fetch all sitemap data for a specific language with pagination
 * @param lang - Language code (en, ar, ru)
 * @param batchSize - Number of items to fetch per batch (default: 100)
 * @returns Sitemap data or null if error
 */
export async function getSitemapData(
  lang: string = 'en',
  batchSize: number = 100
): Promise<SitemapData | null> {
  try {
    // Normalize language to lowercase for consistency
    const normalizedLang = lang.toLowerCase();

    // Fetch all data in parallel for better performance
    const [pages, posts, categories, tags] = await Promise.all([
      fetchAllPages(normalizedLang, batchSize),
      fetchAllPosts(normalizedLang, batchSize),
      fetchAllCategories(normalizedLang, batchSize),
      fetchAllTags(normalizedLang, batchSize),
    ]);

    return {
      pages: { nodes: pages },
      posts: { nodes: posts },
      categories: { nodes: categories },
      tags: { nodes: tags },
    };
  } catch (error) {
    console.error('Error fetching sitemap data:', error);
    return null;
  }
}

