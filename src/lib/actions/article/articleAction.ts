import client from "@/lib/client/ApolloClient";
import { GET_ARTICLE, GET_AUTHOR_POST_COUNT } from "@/lib/wordpress/queries/article/articleQuery";

export interface ArticleTranslation {
    slug: string;
    language: {
        code: string;
    };
}

export interface ArticleData {
    id: string;
    databaseId: number;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    slug: string;
    link: string;
    featuredImage: {
        node: {
            sourceUrl: string;
            altText: string;
            mediaDetails?: {
                width: number;
                height: number;
            };
        };
    } | null;
    postAdvancePost?: {
        galleryImages?: {
            nodes: Array<{
                altText: string;
                sourceUrl: string;
            }>;
        };
        contentAfterGallery?: string;
    };
    categories: {
        nodes: Array<{
            name: string;
            slug: string;
            translations?: Array<{
                slug: string;
                language: {
                    code: string;
                };
            }>;
        }>;
    };
    tags: {
        nodes: Array<{
            name: string;
            slug: string;
        }>;
    };
    author: {
        node: {
            name: string;
            slug: string;
            databaseId: number;
            authorInfo?: {
                authorBioEn?: string;
                authorBioAr?: string;
                authorBioRu?: string;
                authorImage?: {
                    node: {
                        altText: string;
                        sourceUrl: string;
                    };
                };
            };
        };
    };
    translations?: ArticleTranslation[];
    seo?: {
        canonical: string;
        metaDesc: string;
        metaKeywords: string;
        metaRobotsNofollow: string;
        metaRobotsNoindex: string;
        opengraphAuthor: string;
        opengraphDescription: string;
        opengraphImage?: {
            altText: string;
            sourceUrl: string;
        };
        opengraphModifiedTime: string;
        opengraphPublishedTime: string;
        opengraphPublisher: string;
        opengraphSiteName: string;
        opengraphTitle: string;
        opengraphType: string;
        opengraphUrl: string;
        readingTime: number;
        schema?: {
            articleType: string;
            pageType: string;
            raw: string;
        };
        title: string;
        twitterDescription: string;
        twitterImage?: {
            altText: string;
            sourceUrl: string;
        };
    };
}

export async function getArticleBySlug(slug: string, language?: string | null): Promise<ArticleData | null> {
    try {
        const result = await client.query<{ posts: { nodes: ArticleData[] } }>({
            query: GET_ARTICLE,
            variables: { slug, language: language || null },
            context: {
                fetchOptions: {
                    next: {
                        tags: ['wordpress', 'wordpress-article', `wordpress-article-${slug}`],
                    },
                },
            },
        });


        if (!result.data?.posts?.nodes || result.data.posts.nodes.length === 0) {
            return null;
        }
        return result.data.posts.nodes[0];
    } catch (error) {
        return null;
    }
}

export interface AuthorPostCountData {
    getAuthorPostCountBySlug: {
        count: number;
    };
}

export async function getAuthorPostCount(authorSlug: string): Promise<number | null> {
    try {
        const result = await client.query<AuthorPostCountData>({
            query: GET_AUTHOR_POST_COUNT,
            variables: { slug: authorSlug },
            context: {
                fetchOptions: {
                    next: {
                        tags: ['wordpress', 'wordpress-author', `wordpress-author-${authorSlug}`],
                    },
                },
            },
        });

        if (!result.data?.getAuthorPostCountBySlug) {
            return null;
        }
        return result.data.getAuthorPostCountBySlug.count;
    } catch (error) {
        return null;
    }
}
