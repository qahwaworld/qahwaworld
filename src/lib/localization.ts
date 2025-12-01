/**
 * Get localized path for navigation
 * English (en) is the default language and doesn't need a locale prefix
 * Arabic (ar) and Russian (ru) need locale prefixes
 */
export function getLocalizedPath(path: string, locale: string = 'en'): string {
  // For English (default), no locale prefix
  if (locale === 'en') {
    return path;
  }

  // Prevent double locale prefix
  if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
    return path;
  }

  // Handle root path specially
  if (path === '/') {
    return `/${locale}`;
  }

  // Add locale prefix to other paths
  return `/${locale}${path}`;
}
