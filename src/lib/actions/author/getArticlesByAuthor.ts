import client from "@/lib/client/ApolloClient";
import { GET_ARTICLES_BY_AUTHOR_ID } from "@/lib/wordpress/queries/author/authorQuery";
import { Article } from "@/types/wordpress";

export interface AuthorArticlesResponse {
  posts: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: Article[];
  };
}

export async function getArticlesByAuthor(
  authorId: number,
  language: string = 'en',
  first: number = 12,
  after?: string
): Promise<{ articles: Article[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }> {
  try {
    const variables: any = { 
      authorId, 
      language,
      first, 
      ...(after && { after })
    };

    const normalizedLang = language.toLowerCase();
    const { data, error } = await client.query<AuthorArticlesResponse>({
      query: GET_ARTICLES_BY_AUTHOR_ID,
      variables,
      context: {
        fetchOptions: {
          next: {
            tags: ['wordpress', `wordpress-${normalizedLang}`, 'wordpress-author', `wordpress-author-${authorId}`],
          },
        },
      },
    });

    if (error) {
      return {
        articles: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      };
    }
  
    return {
      articles: data?.posts?.nodes || [],
      pageInfo: data?.posts?.pageInfo || { hasNextPage: false, endCursor: null },
    };
  } catch (error) {
    return {
      articles: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

