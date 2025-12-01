import { gql } from "@apollo/client";

export const GET_PAGES_SEO = gql`
query pagesSeo($language: String = "", $id: Int = null) {
    pages(where: {language: $language, id: $id, status: PUBLISH}) {
      edges {
        node {
          seo {
            breadcrumbs {
              text
            }
            canonical
            metaDesc
            metaKeywords
            opengraphAuthor
            metaRobotsNoindex
            metaRobotsNofollow
            opengraphDescription
            opengraphModifiedTime
            opengraphPublishedTime
            opengraphPublisher
            opengraphSiteName
            opengraphTitle
            opengraphType
            opengraphUrl
            readingTime
            title
            twitterDescription
            twitterTitle
            schema {
              pageType
              raw
            }
            twitterImage {
              sourceUrl(size:MEDIUM)
            }
            opengraphImage {
              sourceUrl(size:MEDIUM)
            }
          }
        }
      }
    }
  }`