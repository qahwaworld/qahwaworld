import client from "@/lib/client/ApolloClient";
import { GET_ABOUT_PAGE_DATA } from "@/lib/wordpress/queries/about/aboutQuery";

export interface AboutPageValue {
  iconClass: string;
  heading: string;
  description: string;
}

export interface AboutPageData {
  heroHeading: string;
  heroSubHeading: string;
  heroBackgroundColor: string;
  missionHeading: string;
  missionDescription: string;
  missionImage: string;
  visionHeading: string;
  visionDescription: string;
  visionImage: string;
  valuesHeading: string;
  values: AboutPageValue[];
}

export interface AboutPageDataType {
  getAboutPageData: AboutPageData;
}

export async function getAboutPageData(lang: string): Promise<AboutPageData | null> {
  try {
    // Normalize language to lowercase for consistency
    const normalizedLang = lang.toLowerCase();
    const result = await client.query<AboutPageDataType>({
      query: GET_ABOUT_PAGE_DATA,
      variables: {
        lang: normalizedLang,
      },
      context: {
        fetchOptions: {
          next: { 
            tags: ['wordpress', `wordpress-${normalizedLang}`, 'wordpress-about']
          },
        },
      },
    });

    if (result.error || !result.data?.getAboutPageData) {
      return null;
    }

    return result.data.getAboutPageData;
  } catch (error) {
    return null;
  }
}

