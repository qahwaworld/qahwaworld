import { gql } from "@apollo/client";

export const GET_ARTICLES_BY_CATEGORY = gql`
  query GetArticlesByCategory($categorySlug: String!, $language: String, $first: Int, $after: String) {
  posts(
    where: {categoryName: $categorySlug, language: $language}
    first: $first
    after: $after
  ) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      title
      excerpt
      content
      slug
      date
      featuredImage {
        node {
          sourceUrl(size:MEDIUM)
        }
      }
      author {
        node {
          name
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
        }
      }
      translations {
        slug
      }
      seo {
        canonical
        metaDesc
        metaKeywords
        metaRobotsNofollow
        metaRobotsNoindex
        opengraphAuthor
        opengraphDescription
        opengraphImage {
          altText
          sourceUrl(size:MEDIUM)
        }
        opengraphModifiedTime
        opengraphPublishedTime
        opengraphPublisher
        opengraphSiteName
        opengraphTitle
        opengraphType
        opengraphUrl
        readingTime
        schema {
          articleType
          pageType
          raw
        }
        title
        twitterDescription
        twitterImage {
          altText
          sourceUrl(size:MEDIUM)
        }
      }
      status
    }
  }
}
`;
