
import client from "@/lib/client/ApolloClient";
import {GET_HEADER_MENU, GET_GLOBAL_OPTIONS, GET_MOBILE_MENU, GET_FOOTER_CATEGORIES_MENU, GET_FOOTER_PAGES_MENU} from "@/lib/wordpress/queries/site/headerQuery";

export interface MenuItem {
  label: string;
  uri: string;
  childItems?: {
    edges: Array<{
      node: MenuItem;
    }>;
  };
}

export interface MenuEdge {
  node: MenuItem;
}

export interface HeaderMenuDataType {
  menuItems: {
    edges: MenuEdge[];
  };
}

export interface Category {
  name: string;
  path: string;
  subcategories?: Category[];
}

// Transform GraphQL menu data to Category format
function transformMenuItem(item: MenuItem): Category {
  const category: Category = {
    name: item.label,
    path: item.uri,
  };

  if (item.childItems?.edges && item.childItems.edges.length > 0) {
    category.subcategories = item.childItems.edges.map(edge => 
      transformMenuItem(edge.node)
    );
  }

  return category;
}

export async function HeaderMenuData(language: string = 'en'): Promise<Category[]> {
  try {
    // Convert language code to lowercase format
    const languageCode = language.toLowerCase();
    
    const result = await client.query<HeaderMenuDataType>({
      query: GET_HEADER_MENU,
      variables: {
        language: languageCode,
      },
      context: {
        fetchOptions: {
          next: {
            tags: ['wordpress', `wordpress-${languageCode}`, 'wordpress-menu', 'wordpress-header'],
          },
        },
      },
    });

    if (result.error || !result.data?.menuItems?.edges) {
      return [];
    }

    return result.data.menuItems.edges.map(edge => 
      transformMenuItem(edge.node)
    );
  } catch (error) {
    return [];
  }
}

export interface MobileMenuDataType {
  menuItems: {
    edges: MenuEdge[];
  };
}

export async function MobileMenuData(language: string = 'en'): Promise<Category[]> {
  try {
    // Convert language code to lowercase format
    const languageCode = language.toLowerCase();
    
    const result = await client.query<MobileMenuDataType>({
      query: GET_MOBILE_MENU,
      variables: {
        language: languageCode,
      },
      context: {
        fetchOptions: {
          next: {
            tags: ['wordpress', `wordpress-${languageCode}`, 'wordpress-menu', 'wordpress-mobile'],
          },
        },
      },
    });

    if (result.error || !result.data?.menuItems?.edges) {
      return [];
    }

    return result.data.menuItems.edges.map(edge => 
      transformMenuItem(edge.node)
    );
  } catch (error) {
    return [];
  }
}

export interface GlobalOptionsType {
  themeSettings: {
    themeGlobalOptions: {
      logoDarkMode: {
        node: {
          altText: string;
          sourceUrl: string;
        };
      };
      logoLightMode: {
        node: {
          altText: string;
          sourceUrl: string;
        };
      };
      logoSticky: {
        node: {
          altText: string;
          sourceUrl: string;
        };
      };
      favIcon: {
        node: {
          altText: string;
          sourceUrl: string;
        };
      } | null;
      popAdCode?: string | null;
      footerDescriptionEn?: string | null;
      footerDescriptionAr?: string | null;
      footerDescriptionRu?: string | null;
      footerCopyrightTextLeftEn?: string | null;
      footerCopyrightTextLeftAr?: string | null;
      footerCopyrightTextLeftRu?: string | null;
      footerCopyrightTextRightEn?: string | null;
      footerCopyrightTextRightAr?: string | null;
      footerCopyrightTextRightRu?: string | null;
      googleAnalyticsId?: string | null;
      googleTagManagerId?: string | null;
      codeHead?: string | null;
      codeBody?: string | null;
      codeFooter?: string | null;
    };
  };
}

export interface LogoData {
  darkMode: {
    altText: string;
    sourceUrl: string;
  };
  lightMode: {
    altText: string;
    sourceUrl: string;
  };
  sticky: {
    altText: string;
    sourceUrl: string;
  };
  favIcon: {
    altText: string;
    sourceUrl: string;
  } | null;
  popAdCode?: string | null;
  footerDescriptionEn?: string | null;
  footerDescriptionAr?: string | null;
  footerDescriptionRu?: string | null;
  footerCopyrightTextLeftEn?: string | null;
  footerCopyrightTextLeftAr?: string | null;
  footerCopyrightTextLeftRu?: string | null;
      footerCopyrightTextRightEn?: string | null;
      footerCopyrightTextRightAr?: string | null;
      footerCopyrightTextRightRu?: string | null;
      googleAnalyticsId?: string | null;
      googleTagManagerId?: string | null;
      codeHead?: string | null;
      codeBody?: string | null;
      codeFooter?: string | null;
}

export async function getGlobalOptions(): Promise<LogoData | null> {
  try {
    const result = await client.query<GlobalOptionsType>({
      query: GET_GLOBAL_OPTIONS,
      context: {
        fetchOptions: {
          next: {
            tags: ['wordpress', 'wordpress-global-options', 'wordpress-header'],
          },
        },
      },
    });

    if (result.error || !result.data?.themeSettings?.themeGlobalOptions) {
      return null;
    }

    const options = result.data.themeSettings.themeGlobalOptions;

    return {
      darkMode: {
        altText: options.logoDarkMode?.node?.altText || 'Qahwa World Logo',
        sourceUrl: options.logoDarkMode?.node?.sourceUrl || '',
      },
      lightMode: {
        altText: options.logoLightMode?.node?.altText || 'Qahwa World Logo',
        sourceUrl: options.logoLightMode?.node?.sourceUrl || '',
      },
      sticky: {
        altText: options.logoSticky?.node?.altText || 'Qahwa World Logo',
        sourceUrl: options.logoSticky?.node?.sourceUrl || '',
      },
      favIcon: options.favIcon?.node ? {
        altText: options.favIcon.node.altText || 'Favicon',
        sourceUrl: options.favIcon.node.sourceUrl || '',
      } : null,
      popAdCode: options.popAdCode ?? null,
      footerDescriptionEn: options.footerDescriptionEn ?? null,
      footerDescriptionAr: options.footerDescriptionAr ?? null,
      footerDescriptionRu: options.footerDescriptionRu ?? null,
      footerCopyrightTextLeftEn: options.footerCopyrightTextLeftEn ?? null,
      footerCopyrightTextLeftAr: options.footerCopyrightTextLeftAr ?? null,
      footerCopyrightTextLeftRu: options.footerCopyrightTextLeftRu ?? null,
      footerCopyrightTextRightEn: options.footerCopyrightTextRightEn ?? null,
      footerCopyrightTextRightAr: options.footerCopyrightTextRightAr ?? null,
      footerCopyrightTextRightRu: options.footerCopyrightTextRightRu ?? null,
      googleAnalyticsId: options.googleAnalyticsId ?? null,
      googleTagManagerId: options.googleTagManagerId ?? null,
      codeHead: options.codeHead ?? null,
      codeBody: options.codeBody ?? null,
      codeFooter: options.codeFooter ?? null,
    };
  } catch (error) {
    console.error('Error fetching global options:', error);
    return null;
  }
}

export interface FooterCategoriesMenuDataType {
  menuItems: {
    edges: MenuEdge[];
  };
}

export async function FooterCategoriesMenuData(language: string = 'en'): Promise<Category[]> {
  try {
    // Convert language code to lowercase format
    const languageCode = language.toLowerCase();
    
    const result = await client.query<FooterCategoriesMenuDataType>({
      query: GET_FOOTER_CATEGORIES_MENU,
      variables: {
        language: languageCode,
      },
      context: {
        fetchOptions: {
          next: {
            tags: ['wordpress', `wordpress-${languageCode}`, 'wordpress-menu', 'wordpress-footer-categories'],
          },
        },
      },
    });

    if (result.error || !result.data?.menuItems?.edges) {
      return [];
    }

    return result.data.menuItems.edges.map(edge => 
      transformMenuItem(edge.node)
    );
  } catch (error) {
    return [];
  }
}

export interface FooterPagesMenuDataType {
  menuItems: {
    edges: MenuEdge[];
  };
}

export async function FooterPagesMenuData(language: string = 'en'): Promise<Category[]> {
  try {
    // Convert language code to lowercase format
    const languageCode = language.toLowerCase();
    
    const result = await client.query<FooterPagesMenuDataType>({
      query: GET_FOOTER_PAGES_MENU,
      variables: {
        language: languageCode,
      },
      context: {
        fetchOptions: {
          next: {
            tags: ['wordpress', `wordpress-${languageCode}`, 'wordpress-menu', 'wordpress-footer-pages'],
          },
        },
      },
    });

    if (result.error || !result.data?.menuItems?.edges) {
      return [];
    }

    return result.data.menuItems.edges.map(edge => 
      transformMenuItem(edge.node)
    );
  } catch (error) {
    return [];
  }
}
