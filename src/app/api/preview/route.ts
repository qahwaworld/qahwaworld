import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Preview API Route Handler
 * 
 * This endpoint is called by WordPress when clicking "Preview" button
 * URL format: /api/preview?token=TOKEN&category=CATEGORY&id=ID
 * 
 * Flow:
 * 1. Extract token, category, and id from query params
 * 2. Validate token with WordPress REST API
 * 3. Enable Next.js Draft Mode
 * 4. Redirect to the article preview page using ID
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  const category = searchParams.get('category');
  const id = searchParams.get('id');

  // Validate required parameters - need token, category, and id
  if (!token || !category || !id) {
    console.error('❌ Missing required parameters', {
      hasToken: !!token,
      hasCategory: !!category,
      hasId: !!id,
      allParams: Object.fromEntries(searchParams.entries())
    });
    return NextResponse.json(
      { 
        error: 'Missing token, category, or id parameter',
        received: {
          hasToken: !!token,
          hasCategory: !!category,
          hasId: !!id,
          allParams: Object.fromEntries(searchParams.entries())
        }
      },
      { status: 400 }
    );
  }

  try {
    // 1. Validate token with WordPress REST API
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    if (!wpUrl) {
      console.error('❌ NEXT_PUBLIC_WORDPRESS_API_URL not configured');
      return NextResponse.json(
        { error: 'WordPress URL not configured' },
        { status: 500 }
      );
    }

    // Remove /graphql suffix if present to get base WordPress URL
    const baseWpUrl = wpUrl.replace(/\/graphql\/?$/, '').replace(/\/$/, '');

    const validateUrl = `${baseWpUrl}/wp-json/nextjs/v1/validate-preview?token=${encodeURIComponent(token)}`;
    
    const validateResponse = await fetch(validateUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Don't cache preview token validation - always check fresh
      cache: 'no-store',
    });

    if (!validateResponse.ok) {
      console.error('❌ Token validation failed:', validateResponse.status);
      return NextResponse.json(
        { error: 'Invalid or expired preview token' },
        { status: 401 }
      );
    }

    const validationData = await validateResponse.json();

    // 2. Enable Draft Mode
    const draft = await draftMode();
    draft.enable();

    // 3. Construct the preview URL using the provided category and id
    // Use the article route pattern: /[category]/[id] for preview
    const previewPath = `/${category}/${id}`;

    // 4. Redirect to the article page with preview mode enabled
    // Add query parameters to indicate this is a preview and pass the ID
    const redirectUrl = new URL(previewPath, request.url);
    redirectUrl.searchParams.set('preview', 'true');
    redirectUrl.searchParams.set('token', token); // Pass token in URL for article page
    redirectUrl.searchParams.set('preview_id', id); // Pass ID for article page to fetch by ID

    const response = NextResponse.redirect(redirectUrl, {
      status: 307, // Temporary redirect
    });
    
    // Ensure preview redirect is not cached
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;

  } catch (error) {
    console.error('❌ Preview error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to enable preview mode',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

