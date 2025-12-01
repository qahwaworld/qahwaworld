import { gql } from "@apollo/client";

export const GET_AUTHOR_SEO_BY_AUTHOR_ID = gql`
  query GetAuthorSEOByAuthorId($authorId: ID!) {
    user(id: $authorId, idType: DATABASE_ID) {
      authorInfo {
        authorImage {
          node {
            altText
            sourceUrl(size: THUMBNAIL)
          }
        }
      }
      seo {
        canonical
        language
        metaDesc
        metaRobotsNofollow
        metaRobotsNoindex
        opengraphDescription
        opengraphImage {
          altText
          sourceUrl(size:MEDIUM)
        }
        opengraphTitle
        region
        social {
          facebook
          instagram
          linkedIn
          mySpace
          pinterest
          soundCloud
          twitter
          wikipedia
          youTube
        }
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
        twitterTitle
      }
    }
  }
`;

