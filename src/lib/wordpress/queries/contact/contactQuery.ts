import { gql } from "@apollo/client";

export const GET_CONTACT_PAGE_DATA = gql`
    query getContactPageData($lang: String!) {
        getContactPageData(language: $lang) {
            contactBlockHeading
            emailLabel
            emailAddress
            phoneLabel
            phoneNumber
            addressLabel
            address
            description
            formId
        }
    }
`;