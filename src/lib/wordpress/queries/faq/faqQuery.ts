import { gql } from "@apollo/client";

export const GET_FAQ_PAGE_DATA = gql`
    query getFAQPageData($lang: String!) {
        getFaqPageData(language: $lang) {
            heroHeading
            heroSubHeading

            faqs {
            question
            answer
            }

            ctaHeading
            ctaSubHeading
            ctaButtonText
            ctaButtonLink
        }
    }
`;