import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Helper function to revalidate all language routes
 * Supports: English (main), Arabic (/ar), Russian (/ru)
 */
function revalidateAllLanguages(path: string, type: 'page' | 'layout' = 'page') {
  // Main route (English)
  revalidatePath(path, type);
  
  // Arabic routes
  revalidatePath(`/ar${path}`, type);
  
  // Russian routes
  revalidatePath(`/ru${path}`, type);
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  // Log ALL incoming requests immediately (even before validation)
  console.log('\n' + '='.repeat(60));
  console.log('🔔 Revalidation webhook received at:', new Date().toISOString());
  console.log('📍 Request URL:', req.url);
  console.log('📍 Request Method:', req.method);
  console.log('📍 Request Headers:', JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));
  console.log('='.repeat(60) + '\n');
  
  try {
    const secret = process.env.REVALIDATE_SECRET;
    const token = req.headers.get('x-secret');

    console.log('🔐 Secret configured:', !!secret);
    console.log('🔑 Token received:', !!token);
    console.log('📍 Request from:', req.headers.get('user-agent'));

    if (!secret) {
      console.error('❌ REVALIDATE_SECRET not configured in .env.local');
      return NextResponse.json(
        { message: 'REVALIDATE_SECRET not configured' }, 
        { status: 500 }
      );
    }

    if (token !== secret) {
      console.error('❌ Invalid secret token');
      console.log('Expected secret length:', secret.length);
      console.log('Received token length:', token?.length || 0);
      return NextResponse.json(
        { message: 'Invalid secret' }, 
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('📦 Webhook payload:', JSON.stringify(body, null, 2));

    const { action, post_type, slug, post_id, post_name } = body;

    // CRITICAL: Clear all WordPress data cache using path and tag revalidation
    // This will clear Next.js static cache for all WordPress GraphQL requests
    // All data is statically cached at build time, and revalidatePath() + revalidateTag()
    // will force fresh fetches on the next request to those paths when content is updated/deleted
    console.log('🔄 Starting revalidation process...');
    
    // Clear all WordPress fetch cache tags (this clears all GraphQL query caches)
    // Use 'max' to immediately invalidate the cache
    revalidateTag('wordpress', 'max');
    console.log('✅ Cleared all WordPress fetch cache tags');

    // Revalidate based on action type
    if (action === 'menu_update') {
      // Menu changes affect the entire layout (header/footer) across all languages
      revalidateTag('wordpress-menu', 'max');
      revalidateTag('wordpress-header', 'max');
      revalidatePath('/', 'layout');
      revalidateAllLanguages('/', 'layout');
      console.log('✅ Revalidated entire layout (menu update)');
    }
    else if (action === 'create' || action === 'update' || action === 'publish') {
      // Revalidate homepage across all languages
      revalidateAllLanguages('/');
      console.log('✅ Revalidated homepage');
      
      // If it's a post, revalidate related pages
      if (post_type === 'post') {
        // Clear specific cache tags for posts
        if (slug) {
          revalidateTag(`wordpress-article-${slug}`, 'max');
        }
        revalidateTag('wordpress-article', 'max');
        
        // Revalidate all article pages (dynamic route pattern: /[category]/[slug])
        revalidateAllLanguages('/[category]/[slug]', 'page');
        console.log('✅ Revalidated all article pages');
        
        // Revalidate all category pages
        if (slug) {
          // Try to extract category from slug if available in body
          const categorySlug = body.category_slug || body.category;
          if (categorySlug) {
            revalidateTag(`wordpress-category-${categorySlug}`, 'max');
          }
        }
        revalidateTag('wordpress-category', 'max');
        revalidateAllLanguages('/[category]', 'page');
        console.log('✅ Revalidated category pages');
        
        // Revalidate all tag pages
        revalidateTag('wordpress-tag', 'max');
        revalidateAllLanguages('/tag/[tag]', 'page');
        console.log('✅ Revalidated tag pages');
        
        // Revalidate tags listing page
        revalidateTag('wordpress-tags', 'max');
        revalidateAllLanguages('/tags', 'page');
        console.log('✅ Revalidated tags listing page');
        
        // Revalidate search
        revalidateTag('wordpress-search', 'max');
        revalidateAllLanguages('/search', 'page');
        console.log('✅ Revalidated search page');
        
        // Revalidate sitemaps (posts affect sitemap content)
        revalidateTag('wordpress-sitemap', 'max');
        revalidateTag('wordpress-news-sitemap', 'max');
        revalidatePath('/sitemap.xml', 'page');
        revalidatePath('/sitemap/en.xml', 'page');
        revalidatePath('/sitemap/ar.xml', 'page');
        revalidatePath('/sitemap/ru.xml', 'page');
        revalidatePath('/news-sitemap.xml', 'page');
        revalidatePath('/ar/news-sitemap.xml', 'page');
        revalidatePath('/ru/news-sitemap.xml', 'page');
        console.log('✅ Revalidated sitemaps');
      }
      
      // If it's a page, revalidate that specific page
      if (post_type === 'page') {
        if (slug) {
          // Clear page-specific cache tags
        if (post_id) {
          revalidateTag(`wordpress-page-${post_id}`, 'max');
        }
          
          revalidateAllLanguages(`/${slug}`, 'page');
          console.log(`✅ Revalidated page: /${slug}`);
          
          // Special handling for specific pages
          if (slug === 'about') {
            revalidateTag('wordpress-about', 'max');
            revalidateAllLanguages('/about', 'page');
            console.log('✅ Revalidated about page');
          }
          if (slug === 'contact') {
            revalidateTag('wordpress-contact', 'max');
            revalidateAllLanguages('/contact', 'page');
            console.log('✅ Revalidated contact page');
          }
          if (slug === 'faq') {
            revalidateTag('wordpress-faq', 'max');
            revalidateAllLanguages('/faq', 'page');
            console.log('✅ Revalidated FAQ page');
          }
          if (slug === 'privacy' || slug === 'privacy-policy') {
            revalidateTag('wordpress-privacy', 'max');
            revalidateAllLanguages('/privacy', 'page');
            console.log('✅ Revalidated privacy page');
          }
        }
        // Pages might affect layout (like home page config)
        revalidateTag('wordpress-pages', 'max');
        revalidateTag('wordpress-seo', 'max');
        revalidatePath('/', 'layout');
        revalidateAllLanguages('/', 'layout');
        
        // Revalidate sitemaps (pages are included in sitemaps)
        revalidateTag('wordpress-sitemap', 'max');
        revalidatePath('/sitemap.xml', 'page');
        revalidatePath('/sitemap/en.xml', 'page');
        revalidatePath('/sitemap/ar.xml', 'page');
        revalidatePath('/sitemap/ru.xml', 'page');
        console.log('✅ Revalidated layout and sitemaps');
      }
    } 
    else if (action === 'delete' || action === 'unpublish') {
      // On delete/unpublish, do a full revalidation
      // Clear all WordPress-related cache tags
      revalidateTag('wordpress', 'max');
      revalidateTag('wordpress-article', 'max');
      revalidateTag('wordpress-category', 'max');
      revalidateTag('wordpress-tag', 'max');
      revalidateTag('wordpress-author', 'max');
      revalidateTag('wordpress-sitemap', 'max');
      revalidateTag('wordpress-news-sitemap', 'max');
      
      revalidatePath('/', 'layout');
      revalidateAllLanguages('/', 'layout');
      revalidateAllLanguages('/');
      
      // Revalidate sitemaps (content deletion affects sitemaps)
      revalidatePath('/sitemap.xml', 'page');
      revalidatePath('/sitemap/en.xml', 'page');
      revalidatePath('/sitemap/ar.xml', 'page');
      revalidatePath('/sitemap/ru.xml', 'page');
      revalidatePath('/news-sitemap.xml', 'page');
      revalidatePath('/ar/news-sitemap.xml', 'page');
      revalidatePath('/ru/news-sitemap.xml', 'page');
      console.log('✅ Full site revalidation (delete/unpublish)');
    }
    else if (action === 'media_update') {
      // Media changes might affect any page with images
      // Clear all cache since media can appear anywhere
      revalidateTag('wordpress', 'max');
      revalidatePath('/', 'layout');
      revalidateAllLanguages('/', 'layout');
      revalidateAllLanguages('/');
      console.log('✅ Revalidated layout (media update)');
    }
    else if (action === 'theme_settings_update') {
      // Theme settings affect the entire site (header, footer, layout, etc.)
      // Clear all WordPress cache tags
      revalidateTag('wordpress', 'max');
      revalidatePath('/', 'layout');
      revalidateAllLanguages('/', 'layout');
      revalidateAllLanguages('/');
      console.log('✅ Revalidated entire site (theme settings update)');
    }
    else if (action === 'user_profile_update' && post_type === 'user_profile') {
      // User profile update affects author pages and all articles by that author
      console.log(`👤 User profile update detected for user: ${post_name || post_id}`);
      
      // Clear author-specific cache tags
      if (post_id) {
        revalidateTag(`wordpress-author-${post_id}`, 'max');
      }
      revalidateTag('wordpress-author', 'max');
      
      // Revalidate homepage (shows articles with author info)
      revalidateAllLanguages('/');
      console.log('✅ Revalidated homepage');
      
      // Revalidate all author pages
      revalidateAllLanguages('/author/[id]', 'page');
      console.log('✅ Revalidated all author pages');
      
      // Revalidate all article pages (they display author images)
      revalidateTag('wordpress-article', 'max');
      revalidateAllLanguages('/[category]/[slug]', 'page');
      console.log('✅ Revalidated all article pages');
      
      // Revalidate all category pages (they list articles with author info)
      revalidateTag('wordpress-category', 'max');
      revalidateAllLanguages('/[category]', 'page');
      console.log('✅ Revalidated category pages');
      
      // Revalidate all tag pages (they list articles with author info)
      revalidateTag('wordpress-tag', 'max');
      revalidateAllLanguages('/tag/[tag]', 'page');
      console.log('✅ Revalidated tag pages');
      
      console.log(`✅ User profile revalidation complete for: ${post_name || post_id}`);
    }
    else {
      // Default: revalidate homepage and layout
      // Clear all WordPress cache as fallback
      revalidateTag('wordpress', 'max');
      revalidateAllLanguages('/');
      revalidateAllLanguages('/', 'layout');
      console.log('✅ Default revalidation');
    }

    const duration = Date.now() - startTime;
    console.log(`⏱️  Revalidation completed in ${duration}ms`);

    return NextResponse.json({ 
      success: true,
      revalidated: true, 
      action,
      post_type,
      slug,
      post_id,
      post_name,
      duration_ms: duration,
      now: Date.now() 
    });
  } catch (error) {
    console.error('❌ Revalidation error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false,
      error: message 
    }, { status: 500 });
  }
}

// GET method for manual testing
export async function GET(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const token = req.nextUrl.searchParams.get('secret');

  if (!secret || token !== secret) {
    return NextResponse.json(
      { message: 'Invalid secret' }, 
      { status: 401 }
    );
  }

  try {
    // Clear all WordPress cache tags for manual revalidation
    revalidateTag('wordpress', 'max');
    revalidatePath('/', 'layout');
    revalidateAllLanguages('/', 'layout');
    revalidateAllLanguages('/');
    console.log('✅ Manual revalidation via GET');
    
    return NextResponse.json({ 
      success: true,
      revalidated: true, 
      now: Date.now() 
    });
  } catch (error) {
    console.error('❌ Revalidation error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false,
      error: message 
    }, { status: 500 });
  }
}
