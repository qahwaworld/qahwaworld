import client from "@/lib/client/ApolloClient";
import { GET_AUTHOR_SEO_BY_AUTHOR_ID } from "@/lib/wordpress/queries/author/getAuthorSEO";

export interface AuthorSocial {
  facebook: string;
  instagram: string;
  linkedIn: string;
  mySpace: string;
  pinterest: string;
  soundCloud: string;
  twitter: string;
  wikipedia: string;
  youTube: string;
}

export interface AuthorSEO {
  canonical: string;
  language: string | null;
  metaDesc: string;
  metaRobotsNofollow: string;
  metaRobotsNoindex: string;
  opengraphDescription: string;
  opengraphImage: {
    altText: string;
    sourceUrl: string;
  } | null;
  opengraphTitle: string;
  region: string | null;
  social: AuthorSocial;
  schema: {
    articleType: string[];
    pageType: string[];
    raw: string;
  };
  title: string;
  twitterDescription: string;
  twitterImage: {
    altText: string;
    sourceUrl: string;
  } | null;
  twitterTitle: string;
}

export interface AuthorImage {
  altText: string;
  sourceUrl: string;
}

export interface AuthorSEOData {
  authorInfo: {
    authorImage: {
      node: AuthorImage;
    } | null;
  };
  seo: AuthorSEO;
}

export interface AuthorSEOResponse {
  user: AuthorSEOData | null;
}

/**
 * Fetch author SEO data from WordPress
 * @param authorId - Author database ID
 * @returns AuthorSEOData or null if not found or error occurs
 */
export async function getAuthorSEO(
  authorId: number
): Promise<AuthorSEOData | null> {
  try {
    const { data, error } = await client.query<AuthorSEOResponse>({
      query: GET_AUTHOR_SEO_BY_AUTHOR_ID,
      variables: {
        authorId: authorId.toString(),
      },
      context: {
        fetchOptions: {
          next: {
            tags: [
              "wordpress",
              "wordpress-author",
              `wordpress-author-${authorId}`,
              "wordpress-seo",
            ],
          },
        },
      },
    });

    if (error) {
      return null;
    }

    if (!data?.user) {
      return null;
    }

    return data.user;
  } catch (error) {
    return null;
  }
}

