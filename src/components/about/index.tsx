import React from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import * as LucideIcons from 'lucide-react';
import { Coffee } from 'lucide-react'; // Default fallback
import { getAboutPageData } from '@/lib/actions/about/aboutAction';
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
  if (!iconClass) return Coffee;
  
  // Convert icon class to PascalCase (e.g., "badge-check" -> "BadgeCheck")
  const iconName = toPascalCase(iconClass);
  
  // Try to get the icon from lucide-react
  const IconComponent = (LucideIcons as any)[iconName];
  
  // Return the icon if found, otherwise return default fallback
  return IconComponent || Coffee;
};

interface AboutPageProps {
  locale: string;
}

const AboutPage: React.FC<AboutPageProps> = async ({ locale }) => {
  // Get translations
  const t = getTranslations(locale);
  
  // Fetch dynamic data
  const aboutData = await getAboutPageData(locale);

  // Check if data is null or essentially empty (no meaningful content)
  const hasContent = aboutData && (
    aboutData.heroHeading ||
    aboutData.heroSubHeading ||
    aboutData.missionHeading ||
    aboutData.missionDescription ||
    aboutData.visionHeading ||
    aboutData.visionDescription ||
    aboutData.valuesHeading ||
    (aboutData.values && aboutData.values.length > 0)
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

  const heroHeading = decodeHTMLEntities(aboutData.heroHeading);
  const heroSubHeading = decodeHTMLEntities(aboutData.heroSubHeading);
  const heroBackgroundColor = aboutData.heroBackgroundColor || '#92400e';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section 
        className="text-white py-20"
        style={{ backgroundColor: heroBackgroundColor }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-white">{heroHeading}</h1>
          <p className="text-xl text-amber-100 dark:text-amber-200">{heroSubHeading}</p>
        </div>
      </section>

      {/* Mission Section */}
      {(aboutData.missionHeading || aboutData.missionDescription || aboutData.missionImage) && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className={`grid gap-12 items-center ${aboutData.missionImage ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
              {(aboutData.missionHeading || aboutData.missionDescription) && (
                <div>
                  {aboutData.missionHeading && (
                    <h2 className="mb-4 text-gray-900 dark:text-gray-100">
                      {decodeHTMLEntities(aboutData.missionHeading)}
                    </h2>
                  )}
                  {aboutData.missionDescription && (
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {decodeHTMLEntities(aboutData.missionDescription)}
                    </p>
                  )}
                </div>
              )}
              {aboutData.missionImage && (
                <div className="h-96 rounded-xl overflow-hidden">
                  <ImageWithFallback
                    src={aboutData.missionImage}
                    alt={decodeHTMLEntities(aboutData.missionHeading) || "Mission"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Vision Section */}
      {(aboutData.visionHeading || aboutData.visionDescription || aboutData.visionImage) && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className={`grid gap-12 items-center ${aboutData.visionImage ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
              {aboutData.visionImage && (
                <div className="h-96 rounded-xl overflow-hidden order-2 lg:order-1">
                  <ImageWithFallback
                    src={aboutData.visionImage}
                    alt={decodeHTMLEntities(aboutData.visionHeading) || "Vision"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {(aboutData.visionHeading || aboutData.visionDescription) && (
                <div className={aboutData.visionImage ? "order-1 lg:order-2" : ""}>
                  {aboutData.visionHeading && (
                    <h2 className="mb-4 text-gray-900 dark:text-gray-100">
                      {decodeHTMLEntities(aboutData.visionHeading)}
                    </h2>
                  )}
                  {aboutData.visionDescription && (
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {decodeHTMLEntities(aboutData.visionDescription)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      {(aboutData.valuesHeading || (aboutData.values && aboutData.values.length > 0)) && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            {aboutData.valuesHeading && (
              <h2 className="text-center mb-12 text-gray-900 dark:text-gray-100">
                {decodeHTMLEntities(aboutData.valuesHeading)}
              </h2>
            )}
            {aboutData.values && aboutData.values.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {aboutData.values.map((value, index) => {
                  const Icon = getIconComponent(value.iconClass);
                  return (
                    <div key={index} className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-amber-50 dark:hover:bg-amber-900 transition-colors">
                      <div className="w-16 h-16 bg-amber-700 dark:bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      {value.heading && (
                        <h3 className="mb-3 text-gray-900 dark:text-gray-100">
                          {decodeHTMLEntities(value.heading)}
                        </h3>
                      )}
                      {value.description && (
                        <p className="text-gray-600 dark:text-gray-400">
                          {decodeHTMLEntities(value.description)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export { AboutPage };
