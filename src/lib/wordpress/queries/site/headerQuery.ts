
import { gql } from "@apollo/client";

export const GET_HEADER_MENU = gql`
  query getHeaderMenu($language: String = "en") {
    menuItems(where: { location: PRIMARY, parentDatabaseId: 0, language: $language }) {
        edges {
      node {
        label
        uri
        childItems {
          edges {
            node {
              label
              uri
              childItems {
                edges {
                  node {
                    label
                    uri
                    childItems {
                      edges {
                        node {
                          label
                          uri
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`
export const GET_MOBILE_MENU = gql`
  query getMobileMenu($language: String = "en") {
    menuItems(
      where: {location: MOBILE_MENU, parentDatabaseId: 0, language: $language}
    ) {
      edges {
        node {
          label
          uri
          childItems {
            edges {
              node {
                label
                uri
                childItems {
                  edges {
                    node {
                      label
                      uri
                      childItems {
                        edges {
                          node {
                            label
                            uri
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`




export const GET_FOOTER_CATEGORIES_MENU = gql`
query getFooterCategoriesMenu($language: String = "en") {
  menuItems(
    where: {location: FOOTER_CATEGORIES, parentDatabaseId: 0, language: $language}
  ) {
    edges {
      node {
        label
        uri
        childItems {
          edges {
            node {
              label
              uri
              childItems {
                edges {
                  node {
                    label
                    uri
                    childItems {
                      edges {
                        node {
                          label
                          uri
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`

export const GET_FOOTER_PAGES_MENU = gql`
query getFooterPagesMenu($language: String = "en") {
  menuItems(
    where: {location: FOOTER_PAGES, parentDatabaseId: 0, language: $language}
  ) {
    edges {
      node {
        label
        uri
        childItems {
          edges {
            node {
              label
              uri
              childItems {
                edges {
                  node {
                    label
                    uri
                    childItems {
                      edges {
                        node {
                          label
                          uri
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`

export const GET_GLOBAL_OPTIONS = gql`
query globalOptions {
  themeSettings {
    themeGlobalOptions {
      logoDarkMode {
        node {
          altText
          sourceUrl
        }
      }
      logoLightMode {
        node {
          altText
          sourceUrl
        }
      }
      logoSticky {
        node {
          altText
          sourceUrl
        }
      }
      favIcon {
        node {
          altText
          sourceUrl
        }
      }
      popAdCode
      footerDescriptionEn
      footerDescriptionAr
      footerDescriptionRu
      footerCopyrightTextLeftEn
      footerCopyrightTextLeftAr
      footerCopyrightTextLeftRu
      footerCopyrightTextRightEn
      footerCopyrightTextRightAr
      footerCopyrightTextRightRu
      googleAnalyticsId
      googleTagManagerId
      codeHead
      codeBody
      codeFooter
    }
  }
}
`