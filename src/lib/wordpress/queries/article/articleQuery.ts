import { gql } from "@apollo/client";

export const GET_ARTICLE = gql`
  query GetArticle($slug: String!, $language: String = null) {
    posts(where: {name: $slug, language: $language, status: PUBLISH}, first: 1) {
      nodes {
        id
        databaseId
        title
        excerpt
        content
        date
        slug
        link
        postAdvancePost {
          galleryImages {
            nodes {
              altText
              sourceUrl
            }
          }
          contentAfterGallery
        }
        featuredImage {
          node {
            sourceUrl
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
            translations {
              slug
              language {
                code
              }
            }
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
        translations {
          slug
          language {
            code
          }
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
            sourceUrl
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
            sourceUrl
          }
        }
      }
    }
  }
`;

export const GET_ARTICLES = gql`
  query GetArticles($first: Int = 10, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
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

export const GET_ARTICLES_BY_CATEGORY = gql`
  query GetArticlesByCategory($categorySlug: String!, $first: Int = 10, $after: String) {
    posts(
      first: $first
      after: $after
      where: { categoryName: $categorySlug }
    ) {
      pageInfo {
        hasNextPage
        endCursor
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
          }
        }
        categories {
          nodes {
            name
            slug
            count
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

export const GET_AUTHOR_POST_COUNT = gql`
  query AuthorPostCount($slug: String!) {
    getAuthorPostCountBySlug(authorSlug: $slug) {
      count
    }
  }
`;
