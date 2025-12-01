
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