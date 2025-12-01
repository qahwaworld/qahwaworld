import client from "@/lib/client/ApolloClient";
import { GET_PRIVACY_PAGE_DATA } from "@/lib/wordpress/queries/privacy/privacyQuery";

export interface PrivacyPageBlock {
  iconClass: string;
  heading: string;
  description: string;
}

export interface PrivacyPageData {
  heroHeading: string;
  heroBgColor: string;
  content: string;
  blocks: PrivacyPageBlock[];
  contactHeading: string;
  contactDescription: string;
  lastUpdated: string;
}

export interface PrivacyPageDataType {
  getPrivacyPolicyPageData: PrivacyPageData;
}

export async function getPrivacyPolicyPageData(lang: string): Promise<PrivacyPageData | null> {
  try {
    // Normalize language to lowercase for consistency
    const normalizedLang = lang.toLowerCase();
    const result = await client.query<PrivacyPageDataType>({
      query: GET_PRIVACY_PAGE_DATA,
      variables: {
        lang: normalizedLang,
      },
      context: {
        fetchOptions: {
          next: { 
            tags: ['wordpress', `wordpress-${normalizedLang}`, 'wordpress-privacy']
          },
        },
      },
    });

    if (result.error || !result.data?.getPrivacyPolicyPageData) {
      return null;
    }

    return result.data.getPrivacyPolicyPageData;
  } catch (error) {
    return null;
  }
}

