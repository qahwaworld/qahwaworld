import React from 'react';
import * as LucideIcons from 'lucide-react';
import { FileText } from 'lucide-react'; // Default fallback
import { getPrivacyPolicyPageData } from '@/lib/actions/privacy/privacyAction';
import { getTranslations } from '@/lib/translations';

const decodeHTMLEntities = (text: string | null | undefined = ""): string => {
  if (!text || text === null || text === undefined) {
    return "";
  }

  const entityMap: Record<string, string> = {
    "&quot;": '"',
    "&#34;": '"',
    "&#8220;": '"',
    "&#8221;": '"',
    "&#8216;": "'",
    "&#8217;": "'",
    "&#39;": "'",
    "&apos;": "'",
    "&amp;": "&",
    "&nbsp;": " ",
    "&ndash;": "-",
    "&#8211;": "-",
    "&mdash;": "-",
    "&#8212;": "-",
    "&hellip;": "...",
    "&#8230;": "...",
  };

  let decoded = String(text).replace(/&[a-zA-Z0-9#]+;/g, (entity) => entityMap[entity] || entity);

  decoded = decoded
    .replace(/&#x([\da-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));

  return decoded;
};

// Convert kebab-case or snake_case to PascalCase
// Examples: "badge-check" -> "BadgeCheck", "file-text" -> "FileText", "user_profile" -> "UserProfile"
const toPascalCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

// Icon mapping function - dynamically gets icon from lucide-react
const getIconComponent = (iconClass: string): React.ComponentType<any> => {
  if (!iconClass) return FileText;
  
  // Convert icon class to PascalCase (e.g., "badge-check" -> "BadgeCheck")
  const iconName = toPascalCase(iconClass);
  
  // Try to get the icon from lucide-react
  const IconComponent = (LucideIcons as any)[iconName];
  
  // Return the icon if found, otherwise return default fallback
  return IconComponent || FileText;
};

interface PrivacyPageProps {
  locale: string;
}

const PrivacyPage: React.FC<PrivacyPageProps> = async ({ locale }) => {
  // Get translations
  const t = getTranslations(locale);
  
  // Fetch dynamic data
  const privacyData = await getPrivacyPolicyPageData(locale);

  // Check if data is null or essentially empty
  const hasContent = privacyData && (
    privacyData.heroHeading ||
    privacyData.content ||
    (privacyData.blocks && privacyData.blocks.length > 0) ||
    privacyData.contactHeading ||
    privacyData.contactDescription
  );

  // Show "no content" message if data is null or empty
  if (!hasContent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-700 rounded-lg p-6 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-amber-500 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-base font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  {t.noContentTitle}
                </h3>
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <p>{t.noContentMessage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const heroHeading = decodeHTMLEntities(privacyData.heroHeading);
  const heroBgColor = privacyData.heroBgColor || '#92400e';
  const formattedLastUpdated = privacyData.lastUpdated 
    ? new Date(privacyData.lastUpdated).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      {heroHeading && (
        <section 
          className="text-white py-20"
          style={{ backgroundColor: heroBgColor }}
        >
          <div className="container mx-auto px-4">
            <h1 className="mb-4 text-white">{heroHeading}</h1>
            {formattedLastUpdated && (
              <p className="text-amber-100 dark:text-amber-200">
                {locale === 'ar' 
                  ? `آخر تحديث: ${formattedLastUpdated}`
                  : locale === 'ru'
                  ? `Последнее обновление: ${formattedLastUpdated}`
                  : `Last Updated: ${formattedLastUpdated}`}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {privacyData.content && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8">
              <div 
                className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg prose prose-amber dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: privacyData.content }}
              />
            </div>
          )}

          {privacyData.blocks && privacyData.blocks.length > 0 && (
            <div className="space-y-6">
              {privacyData.blocks.map((block, index) => {
                const Icon = getIconComponent(block.iconClass);
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-amber-700 dark:text-amber-300" />
                      </div>
                      <div>
                        {block.heading && (
                          <h3 className="mb-3 text-gray-900 dark:text-gray-100">
                            {decodeHTMLEntities(block.heading)}
                          </h3>
                        )}
                        {block.description && (
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {decodeHTMLEntities(block.description)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {(privacyData.contactHeading || privacyData.contactDescription) && (
            <div className="mt-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-8 border border-amber-200 dark:border-amber-700">
              {privacyData.contactHeading && (
                <h3 className="mb-3 text-gray-900 dark:text-gray-100">
                  {decodeHTMLEntities(privacyData.contactHeading)}
                </h3>
              )}
              {privacyData.contactDescription && (
                <p className="text-gray-600 dark:text-gray-400">
                  {decodeHTMLEntities(privacyData.contactDescription)}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export { PrivacyPage };
