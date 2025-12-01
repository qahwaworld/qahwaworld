import { gql } from "@apollo/client";

export const GET_ABOUT_PAGE_DATA = gql`
    query getAboutPageData($lang: String!) {
        getAboutPageData(language: $lang) {
            heroHeading
            heroSubHeading
            heroBackgroundColor

            missionHeading
            missionDescription
            missionImage

            visionHeading
            visionDescription
            visionImage

            valuesHeading
            values {
            iconClass
            heading
            description
            }
        }
    }
`;