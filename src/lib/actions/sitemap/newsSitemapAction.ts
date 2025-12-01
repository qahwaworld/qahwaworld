import client from "@/lib/client/ApolloClient";
import { GET_LATEST_POSTS_FOR_NEWS_SITEMAP } from "@/lib/wordpress/queries/sitemap/sitemapQuery";

export interface NewsSitemapPost {
  databaseId: number;
  title: string;
  slug: string;
  date: string;
  language: string; // Language code (en, ar, ru)
  categories: {
    nodes: Array<{
      slug: string;
    }>;
  };
}

export interface NewsSitemapQueryResponse {
  posts: {
    nodes: Omit<NewsSitemapPost, 'language'>[];
  };
}

/**
 * Fetch latest posts for news sitemap for a specific language
 * @param lang - Language code (en, ar, ru)
 * @param limit - Number of posts to fetch (default: 50)
 * @returns Array of latest posts with language info
 */
export async function getLatestPostsForNewsSitemap(
  lang: string = 'en',
  limit: number = 50
): Promise<NewsSitemapPost[]> {
  try {
    const normalizedLang = lang.toLowerCase();
    
    const result = await client.query<NewsSitemapQueryResponse>({
      query: GET_LATEST_POSTS_FOR_NEWS_SITEMAP,
      variables: {
        first: limit,
        lang: normalizedLang,
      },
      context: {
        fetchOptions: {
          next: {
            tags: ['wordpress', `wordpress-${normalizedLang}`, 'wordpress-news-sitemap'],
          },
        },
      },
    });

    if (!result.data?.posts?.nodes) {
      console.error('News sitemap query error: No data returned');
      return [];
    }

    // Map posts with language info and return latest posts (already ordered by date DESC from query)
    return result.data.posts.nodes
      .slice(0, limit)
      .map((post) => ({
        ...post,
        language: normalizedLang,
      }));
  } catch (error) {
    console.error('Error fetching latest posts for news sitemap:', error);
    return [];
  }
}

