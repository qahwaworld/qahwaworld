"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CategoryTranslation {
  slug: string;
  languageCode: string; // 'en' | 'ar' | 'ru'
}

interface Props {
  categorySlug: string;                // Current language slug (could be en, ar, or ru)
  categoryTranslations?: CategoryTranslation[];
}

const CategoryLanguageHandler: React.FC<Props> = ({
  categorySlug,
  categoryTranslations = [],
}) => {
  const { setAlternatePaths } = useLanguage();

  useEffect(() => {
    const paths: Record<string, string> = {};

    // Build dictionary for all language slugs from translations
    const slugByLang: Record<string, string> = {};
    categoryTranslations.forEach((t) => {
      slugByLang[t.languageCode.toLowerCase()] = t.slug;
    });

    // Extract English slug from translations array
    // When on AR/RU pages, the English slug is in the translations array with languageCode: "en"
    const enSlug = slugByLang["en"] || categorySlug; // Fallback to categorySlug if no EN translation found

    // Build paths for all languages
    paths["en"] = `/${enSlug}`;

    // AR / RU slugs - use translations if available, otherwise use English slug as fallback
    ["ar", "ru"].forEach((lang) => {
      const translatedSlug = slugByLang[lang] || enSlug;
      paths[lang] = `/${lang}/${translatedSlug}`;
    });

    setAlternatePaths(paths);

    return () => setAlternatePaths({});
  }, [categorySlug, categoryTranslations, setAlternatePaths]);

  return null;
};

export default CategoryLanguageHandler;
