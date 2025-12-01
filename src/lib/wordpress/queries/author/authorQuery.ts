import { gql } from "@apollo/client";

export const GET_ARTICLES_BY_AUTHOR_ID = gql`
  query GetArticlesByAuthorId($authorId: Int!, $language: String, $first: Int, $after: String) {
    posts(
      where: { author: $authorId, language: $language }
      first: $first
      after: $after
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        title
        content
        excerpt
        slug
        date
        featuredImage {
          node {
            sourceUrl(size: MEDIUM)
            altText
          }
        }
        author {
          node {
            name
            databaseId
            slug
            authorInfo {
              authorBioEn
              authorBioAr
              authorBioRu
              authorImage {
                node {
                  altText
                  sourceUrl(size: THUMBNAIL)
                }
              }
            }
          }
        }
        categories {
          nodes {
            name
            slug
            translations {
              slug
              languageCode
            }
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
        translations {
          slug
        }
      }
    }
  }
`;