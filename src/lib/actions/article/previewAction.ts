import { ArticleData } from './articleAction';

/**
 * Fetch a preview post by ID using custom WordPress REST endpoint
 * This includes draft, pending, and unpublished posts
 * 
 * Note: We use a custom WordPress REST endpoint (/nextjs/v1/preview-post)
 * that validates the token and returns draft posts.
 * 
 * @param id - Post database ID
 * @param token - Optional preview token (from cookie in preview mode)
 */
export async function fetchPreviewPostById(id: string | number, token?: string): Promise<ArticleData | null> {
  try {
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    if (!wpUrl) {
      console.error('❌ NEXT_PUBLIC_WORDPRESS_API_URL not configured');
      return null;
    }

    // Remove /graphql suffix if present to get base WordPress URL
    const baseWpUrl = wpUrl.replace(/\/graphql\/?$/, '').replace(/\/$/, '');

    // Try the custom preview endpoint if token is available
    if (token) {
      const previewUrl = `${baseWpUrl}/wp-json/nextjs/v1/preview-post?post_id=${id}&token=${encodeURIComponent(token)}`;
      
      const response = await fetch(previewUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 0 },
      });

      if (response.ok) {
        const post = await response.json();
        return transformCustomRestPostToArticleData(post);
      } else {
        console.warn('⚠️ Custom preview endpoint failed:', response.status);
      }
    }

    // Fallback: Try standard REST API (works for published posts)
    const restUrl = `${baseWpUrl}/wp-json/wp/v2/posts/${id}?_embed`;
    
    const response = await fetch(restUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error('❌ REST API error:', response.status, response.statusText);
      return null;
    }

    const post = await response.json();
    
    return transformRestPostToArticleData(post);
  } catch (error) {
    console.error("❌ Error fetching preview post by ID:", error);
    return null;
  }
}

/**
 * Fetch a preview post by slug using custom WordPress REST endpoint
 * This includes draft, pending, and unpublished posts
 * 
 * Note: We use a custom WordPress REST endpoint (/nextjs/v1/preview-post)
 * that validates the token and returns draft posts.
 * 
 * @param slug - Post slug
 * @param token - Optional preview token (from cookie in preview mode)
 */
export async function fetchPreviewPostBySlug(slug: string, token?: string): Promise<ArticleData | null> {
  try {
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    if (!wpUrl) {
      console.error('❌ NEXT_PUBLIC_WORDPRESS_API_URL not configured');
      return null;
    }

    // Remove /graphql suffix if present to get base WordPress URL
    const baseWpUrl = wpUrl.replace(/\/graphql\/?$/, '').replace(/\/$/, '');

    // Try the custom preview endpoint if token is available
    if (token) {
      // First, we need to get the post ID from slug, then use the preview endpoint
      // WordPress preview endpoint typically uses post_id, so we'll need to fetch by slug first
      const previewUrl = `${baseWpUrl}/wp-json/nextjs/v1/preview-post-by-slug?slug=${encodeURIComponent(slug)}&token=${encodeURIComponent(token)}`;
      
      const response = await fetch(previewUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 0 },
      });

      if (response.ok) {
        const post = await response.json();
        return transformCustomRestPostToArticleData(post);
      } else {
        console.warn('⚠️ Custom preview endpoint failed:', response.status);
      }
    }

    // Fallback: Try standard REST API (works for published posts)
    const restUrl = `${baseWpUrl}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed&status=any`;
    
    const response = await fetch(restUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error('❌ REST API error:', response.status, response.statusText);
      return null;
    }

    const posts = await response.json();
    
    if (!posts || posts.length === 0) {
      console.warn('⚠️ Preview post not found by slug');
      return null;
    }

    const post = posts[0];
    
    return transformRestPostToArticleData(post);
  } catch (error) {
    console.error("❌ Error fetching preview post by slug:", error);
    return null;
  }
}

/**
 * Transform WordPress REST API post to ArticleData interface
 */
function transformRestPostToArticleData(post: any): ArticleData {
  // Extract category
  const categoryId = post.categories?.[0];
  const category = post._embedded?.['wp:term']?.[0]?.find((t: any) => t.id === categoryId);
  
  // Extract tags
  const tagIds = post.tags || [];
  const allTags = post._embedded?.['wp:term']?.[1] || [];
  const tags = tagIds.map((tagId: number) => {
    const tag = allTags.find((t: any) => t.id === tagId);
    return tag ? { name: tag.name, slug: tag.slug } : null;
  }).filter(Boolean);

  // Extract featured image
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];

  // Extract author
  const author = post._embedded?.['author']?.[0];

  return {
    id: `post-${post.id}`,
    databaseId: post.id,
    title: post.title?.rendered || '',
    excerpt: post.excerpt?.rendered || '',
    content: post.content?.rendered || '',
    postAdvancePost: post.acf?.postAdvancePost ? {
      galleryImages: post.acf.postAdvancePost.galleryImages ? {
        nodes: post.acf.postAdvancePost.galleryImages.map((img: any) => ({
          altText: img.alt || '',
          sourceUrl: img.url || img.sourceUrl || '',
        })),
      } : undefined,
      contentAfterGallery: post.acf.postAdvancePost.contentAfterGallery || undefined,
    } : undefined,
    date: post.date || '',
    slug: post.slug || '',
    link: post.link || '',
    featuredImage: featuredImage ? {
      node: {
        sourceUrl: featuredImage.source_url,
        altText: featuredImage.alt_text || '',
        mediaDetails: featuredImage.media_details ? {
          width: featuredImage.media_details.width,
          height: featuredImage.media_details.height,
        } : undefined,
      },
    } : null,
    categories: {
      nodes: category ? [{
        name: category.name,
        slug: category.slug,
        translations: [],
      }] : [],
    },
    tags: {
      nodes: tags.map((tag: any) => ({
        name: tag.name,
        slug: tag.slug,
      })),
    },
    author: {
      node: {
        name: author?.name || 'Unknown',
        slug: author?.slug || 'unknown',
        databaseId: author?.id || 0,
        authorInfo: undefined,
      },
    },
    translations: [],
    seo: undefined,
  };
}

/**
 * Transform custom WordPress REST endpoint response to ArticleData interface
 * Used for the /nextjs/v1/preview-post-by-slug endpoint
 */
function transformCustomRestPostToArticleData(post: any): ArticleData {
  return {
    id: `post-${post.id}`,
    databaseId: post.id,
    title: post.title || '',
    excerpt: post.excerpt || '',
    content: post.content || '',
    postAdvancePost: post.postAdvancePost ? {
      galleryImages: post.postAdvancePost.galleryImages ? {
        nodes: post.postAdvancePost.galleryImages.map((img: any) => ({
          altText: img.altText || img.alt || '',
          sourceUrl: img.sourceUrl || img.url || '',
        })),
      } : undefined,
      contentAfterGallery: post.postAdvancePost.contentAfterGallery || undefined,
    } : undefined,
    date: post.date || '',
    slug: post.slug || '',
    link: post.link || '',
    featuredImage: post.featured_image ? {
      node: {
        sourceUrl: post.featured_image,
        altText: post.featured_image_alt || '',
      },
    } : null,
    categories: {
      nodes: post.categories?.map((cat: any) => ({
        name: cat.name,
        slug: cat.slug,
        translations: [],
      })) || [],
    },
    tags: {
      nodes: post.tags?.map((tag: any) => ({
        name: tag.name,
        slug: tag.slug,
      })) || [],
    },
    author: {
      node: {
        name: post.author?.name || 'Unknown',
        slug: post.author?.slug || 'unknown',
        databaseId: post.author?.id || 0,
        authorInfo: undefined,
      },
    },
    translations: post.translations || [],
    seo: post.seo,
  };
}

