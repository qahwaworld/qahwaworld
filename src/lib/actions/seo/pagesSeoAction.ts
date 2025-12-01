import client from "@/lib/client/ApolloClient";
import { GET_PAGES_SEO } from "@/lib/wordpress/queries/seo/pagesSeoQuery";

export interface Breadcrumb {
  text: string;
}

export interface Schema {
  pageType: string[];
  raw: string;
}

export interface Image {
  sourceUrl: string;
}

export interface PageSEO {
  breadcrumbs: Breadcrumb[];
  canonical: string;
  metaDesc: string;
  metaKeywords: string;
  opengraphAuthor: string;
  metaRobotsNoindex: string;
  metaRobotsNofollow: string;
  opengraphDescription: string;
  opengraphModifiedTime: string;
  opengraphPublishedTime: string;
  opengraphPublisher: string;
  opengraphSiteName: string;
  opengraphTitle: string;
  opengraphType: string;
  opengraphUrl: string;
  readingTime: number;
  title: string;
  twitterDescription: string;
  twitterTitle: string;
  schema: Schema;
  twitterImage: Image | null;
  opengraphImage: Image | null;
}

export interface PageNode {
  seo: PageSEO;
}

export interface PageEdge {
  node: PageNode;
}

export interface PagesSeoResponse {
  pages: {
    edges: PageEdge[];
  };
}

export interface PagesSeoQueryVariables {
  language?: string;
  id?: number | null;
}

/**
 * Fetch SEO data for pages from WordPress
 * @param language - Language code (e.g., 'en', 'ar', 'ru'). Defaults to empty string
 * @param id - Page ID. Defaults to null
 * @returns PageSEO object or null if not found or error occurs
 */
export async function getPagesSeo(
  language: string = "",
  id: number | null = null
): Promise<PageSEO | null> {
  try {
    // Normalize language - use provided language or empty string
    // When both ID and language are provided, pass both to the query
    // This matches the working GraphQL query pattern
    const normalizedLanguage = language || "";
    
    const result = await client.query<PagesSeoResponse>({
      query: GET_PAGES_SEO,
      variables: {
        // Pass both language and id when available
        // The GraphQL query works correctly with both parameters
        language: normalizedLanguage,
        id: id,
      },
      context: {
        fetchOptions: {
          next: {
            tags: [
              "wordpress",
              `wordpress-${normalizedLanguage || "all"}`,
              "wordpress-seo",
              id ? `wordpress-page-${id}` : "wordpress-pages",
            ],
          },
        },
      },
    });

    if (result.error) {
      return null;
    }

    if (!result.data?.pages?.edges || result.data.pages.edges.length === 0) {
      return null;
    }

    // Return the first page's SEO data
    return result.data.pages.edges[0].node.seo;
  } catch (error) {
    return null;
  }
}

/**
 * Fetch SEO data for all pages matching the language filter
 * @param language - Language code (e.g., 'en', 'ar', 'ru'). Defaults to empty string
 * @returns Array of PageSEO objects or empty array if not found or error occurs
 */
export async function getAllPagesSeo(
  language: string = ""
): Promise<PageSEO[]> {
  try {
    const normalizedLanguage = language.toLowerCase();

    const result = await client.query<PagesSeoResponse>({
      query: GET_PAGES_SEO,
      variables: {
        language: normalizedLanguage,
        id: null,
      },
      context: {
        fetchOptions: {
          next: {
            tags: [
              "wordpress",
              `wordpress-${normalizedLanguage || "all"}`,
              "wordpress-seo",
              "wordpress-pages",
            ],
          },
        },
      },
    });

    if (
      result.error ||
      !result.data?.pages?.edges ||
      result.data.pages.edges.length === 0
    ) {
      return [];
    }

    // Return all pages' SEO data
    return result.data.pages.edges.map((edge) => edge.node.seo);
  } catch (error) {
    return [];
  }
}

