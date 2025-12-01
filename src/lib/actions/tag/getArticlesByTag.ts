import client from "@/lib/client/ApolloClient";
import { GET_ARTICLES_BY_TAG, GET_ALL_TAGS } from "@/lib/wordpress/queries/tag/getArticlesByTag";
import { Article } from "@/types/wordpress";

export interface TagArticlesResponse {
  posts: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: Article[];
  };
}

export async function getArticlesByTag(
  tagSlug: string,
  language: string = 'en',
  first: number = 12,
  after?: string
): Promise<{ articles: Article[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }> {
  try {
    const variables: any = {
      tagSlug,
      language,
      first,
      ...(after && { after })
    };

    const normalizedLang = language.toLowerCase();
    const { data, error } = await client.query<TagArticlesResponse>({
      query: GET_ARTICLES_BY_TAG,
      variables,
      context: {
        fetchOptions: {
          next: {
            tags: ['wordpress', `wordpress-${normalizedLang}`, 'wordpress-tag', `wordpress-tag-${tagSlug}`],
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

export interface Tag {
  name: string;
  slug: string;
}

export interface AllTagsResponse {
  tags: {
    edges: Array<{
      node: Tag;
    }>;
  };
}

export async function getAllTags(
  language: string = ''
): Promise<Tag[]> {
  try {
    const normalizedLang = (language || '').toLowerCase();
    const result = await client.query<AllTagsResponse>({
      query: GET_ALL_TAGS,
      variables: {
        language: normalizedLang,
      },
      context: {
        fetchOptions: {
          next: {
            tags: ['wordpress', `wordpress-${normalizedLang || 'all'}`, 'wordpress-tags'],
          },
        },
      },
    });

    if (result.error || !result.data?.tags?.edges) {
      return [];
    }

    return result.data.tags.edges.map(edge => ({
      name: edge.node.name.replace(/^"|"$/g, ''), // Remove quotes from tag names
      slug: edge.node.slug,
    }));
  } catch (error) {
    return [];
  }
}

