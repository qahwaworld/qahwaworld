import { gql } from "@apollo/client";

export const GET_PRIVACY_PAGE_DATA = gql`
    query getPrivacyPolicyPageData($lang: String!) {
        getPrivacyPolicyPageData(language: $lang) {
            heroHeading
            heroBgColor
            content
            blocks {
            iconClass
            heading
            description
            }
            contactHeading
            contactDescription
            lastUpdated
        }
    }
`;