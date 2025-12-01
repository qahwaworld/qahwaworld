import apolloClient from '@/lib/client/ApolloClient';
import { GET_YOUTUBE_CHANNEL_BANNER } from '@/lib/queries/site/themeSettingsQueries';

export interface YoutubeChannelBannerData {
  youtubeChannelBanner: {
    node: {
      sourceUrl: string;
    };
  } | null;
  youtubeChannelLink: string;
}

/**
 * Fetch YouTube channel banner data from WordPress theme settings
 */
export async function fetchYoutubeChannelBanner(): Promise<YoutubeChannelBannerData | null> {
  try {
    const { data } = await apolloClient.query<{
      themeSettings: {
        themeOptionsFields: YoutubeChannelBannerData;
      };
    }>({
      query: GET_YOUTUBE_CHANNEL_BANNER,
      fetchPolicy: 'network-only',
    });

    if (!data?.themeSettings?.themeOptionsFields) {
      console.error('YouTube channel banner data not found');
      return null;
    }

    return data.themeSettings.themeOptionsFields;
  } catch (error) {
    console.error('Error fetching YouTube channel banner:', error);
    return null;
  }
}

