import { gql } from "@apollo/client";

export const SEARCH_ARTICLES = gql`
  query SearchArticles($search: String!, $first: Int = 10, $after: String, $language: String) {
    posts(
      first: $first
      after: $after
      where: { 
        search: $search
        language: $language
      }
    ) {
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
      nodes {
        id
        databaseId
        title
        excerpt
        content
        date
        slug
        link
        featuredImage {
          node {
            sourceUrl(size:MEDIUM)
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
            slug
            databaseId
          }
        }
      }
    }
  }
`;

