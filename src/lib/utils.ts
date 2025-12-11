import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getTranslations } from "./translations";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
}

export function calculateReadTime(content: string, locale: string = 'en'): string {
  const wordsPerMinute = 200;
  const text = stripHtml(content);
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  const t = getTranslations(locale);
  const minReadText = t.minRead || 'Min Read';
  
  return `${minutes} ${minReadText}`;
}

export function formatDate(dateString: string, locale: string = 'en'): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Normalize URL by replacing backend domain with frontend domain
 * This ensures canonical URLs and Open Graph URLs use the frontend domain
 * @param url - The URL to normalize
 * @returns Normalized URL with frontend domain
 */
export function normalizeUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  
  const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qahwaworld.com';
  const cleanFrontendUrl = frontendUrl.replace(/\/$/, '');
  
  // Direct string replacement - most reliable approach
  // Replace backend.qahwaworld.com with frontend domain (case-insensitive)
  let normalizedUrl = url;
  
  // Pattern 1: Replace https://backend.qahwaworld.com or http://backend.qahwaworld.com
  // This is the most common case - hardcoded backend domain
  if (normalizedUrl.toLowerCase().includes('backend.qahwaworld.com')) {
    normalizedUrl = normalizedUrl.replace(
      /https?:\/\/backend\.qahwaworld\.com/gi,
      cleanFrontendUrl
    );
  }
  
  // Pattern 2: Also handle if backend URL comes from env variable
  const backendUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL 
    ? process.env.NEXT_PUBLIC_WORDPRESS_API_URL.replace('/graphql', '').replace(/\/$/, '')
    : null;
  
  if (backendUrl && backendUrl !== frontendUrl) {
    const cleanBackendUrl = backendUrl.replace(/\/$/, '');
    // Only replace if URL contains the backend URL
    if (normalizedUrl.toLowerCase().includes(cleanBackendUrl.toLowerCase())) {
      // Escape special regex characters in the backend URL
      const escapedBackendUrl = cleanBackendUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Replace the backend URL with frontend URL
      normalizedUrl = normalizedUrl.replace(
        new RegExp(escapedBackendUrl, 'gi'),
        cleanFrontendUrl
      );
    }
  }
  
  return normalizedUrl;
}
