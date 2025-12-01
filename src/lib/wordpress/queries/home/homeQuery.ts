import { gql } from "@apollo/client";

export const GET_HOME_PAGE_LATEST_ARTICLES = gql`
  query getHomePageLatestArticles($language: String="en" ) {
    posts(first: 9, where: {language: $language}) {
        nodes {
            title
            slug
          	excerpt
            date
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
            categories{
                edges {
                    node {
                        name
                        slug
                        languageCode
                    }
                }
            }
        }
    }
}
`;

export const GET_TRENDING_POSTS_FROM_HOME_PAGE = gql`
  query getTrendingPostsFromHomePage($lang: String!) {
  trendingPosts(language: $lang) {
    id
    title
    slug
    excerpt
    featuredImage
    readingTime
    categories {
      name
      slug
    }
  }
}
`;


export const GET_CATEGORIES_SECTION_FOR_HOME_PAGE = gql`
  query getCategoriesSectionForHomePage($lang: String!) {
    getCategorySectionData(language: $lang) {
      sectionTitle
      sectionBackgroundColor
      viewAllButtonLabel
      viewAllButtonUrl
      category {
        id
        name
        slug
      }
      posts {
        id
        title
        slug
        featuredImage
        date
        readingTime
      }
    }
  }
`;


export const GET_SPOTLIGHT_DATA_FOR_HOME_PAGE = gql`
  query GetSpotlightDataForHomePage($lang: String!) {
  getSpotlightData(language: $lang) {
    sectionTitle
    image
    title
    description
    buttonLabel
    buttonLink

    category {
      id
      name
      slug
    }

    posts {
      id
      title
      slug
      excerpt
      featuredImage
      date
      readingTime
      author
      categories {
        id
        name
        slug
      }
    }
  }
}
`;

export const GET_HOMEPAGE_AD_BANNER = gql`
  query getHomepageAdBanner {
    getHomepageAdBanner {
      name
      content
    }
  }
`;