
import client from "@/lib/client/ApolloClient";
import {GET_HEADER_MENU} from "@/lib/wordpress/queries/site/headerQuery";

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
