import client from "@/lib/client/ApolloClient";
import { GET_FAQ_PAGE_DATA } from "@/lib/wordpress/queries/faq/faqQuery";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQPageData {
  heroHeading: string;
  heroSubHeading: string;
  faqs: FAQItem[];
  ctaHeading: string;
  ctaSubHeading: string;
  ctaButtonText: string;
  ctaButtonLink: string;
}

export interface FAQPageDataType {
  getFaqPageData: FAQPageData;
}

export async function getFAQPageData(lang: string): Promise<FAQPageData | null> {
  try {
    // Normalize language to lowercase for consistency
    const normalizedLang = lang.toLowerCase();
    const result = await client.query<FAQPageDataType>({
      query: GET_FAQ_PAGE_DATA,
      variables: {
        lang: normalizedLang,
      },
      context: {
        fetchOptions: {
          next: { 
            tags: ['wordpress', `wordpress-${normalizedLang}`, 'wordpress-faq']
          },
        },
      },
    });

    if (result.error || !result.data?.getFaqPageData) {
      return null;
    }

    return result.data.getFaqPageData;
  } catch (error) {
    return null;
  }
}

