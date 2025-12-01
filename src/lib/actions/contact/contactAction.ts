import client from "@/lib/client/ApolloClient";
import { GET_CONTACT_PAGE_DATA } from "@/lib/wordpress/queries/contact/contactQuery";

export interface ContactPageData {
  contactBlockHeading: string;
  emailLabel: string;
  emailAddress: string;
  phoneLabel: string;
  phoneNumber: string;
  addressLabel: string;
  address: string;
  description: string;
  formId: string;
}

export interface ContactPageDataType {
  getContactPageData: ContactPageData;
}

export async function getContactPageData(lang: string): Promise<ContactPageData | null> {
  try {
    // Normalize language to lowercase for consistency
    const normalizedLang = lang.toLowerCase();
    const result = await client.query<ContactPageDataType>({
      query: GET_CONTACT_PAGE_DATA,
      variables: {
        lang: normalizedLang,
      },
      context: {
        fetchOptions: {
          next: { 
            tags: ['wordpress', `wordpress-${normalizedLang}`, 'wordpress-contact']
          },
        },
      },
    });

    if (result.error || !result.data?.getContactPageData) {
      return null;
    }

    return result.data.getContactPageData;
  } catch (error) {
    return null;
  }
}

