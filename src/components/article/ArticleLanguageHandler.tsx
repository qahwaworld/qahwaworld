'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArticleTranslation } from '@/lib/actions/article/articleAction';

interface CategoryTranslation {
    slug: string;
    language: {
        code: string;
    };
}

interface Props {
    translations: ArticleTranslation[];
    categorySlug: string;
    categoryTranslations?: CategoryTranslation[];
}

export function ArticleLanguageHandler({ translations, categorySlug, categoryTranslations }: Props) {
    const { setAlternatePaths } = useLanguage();

    useEffect(() => {
        if (!translations || translations.length === 0) return;

        const paths: Record<string, string> = {};

        translations.forEach((translation) => {
            const langCode = translation.language.code.toLowerCase(); // 'en', 'ar', 'ru'
            const articleSlug = translation.slug;

            // Always use the correct category slug for each language
            let catSlug = categorySlug;
            if (categoryTranslations) {
                const translatedCategory = categoryTranslations.find(
                    (cat) => cat.language.code.toLowerCase() === langCode
                );
                if (translatedCategory?.slug) {
                    catSlug = translatedCategory.slug;
                } else if (langCode === 'en') {
                    // Fallback to English slug if available
                    const enCategory = categoryTranslations.find(
                        (cat) => cat.language.code.toLowerCase() === 'en'
                    );
                    if (enCategory?.slug) catSlug = enCategory.slug;
                }
            }

            if (langCode === 'en') {
                paths[langCode] = `/${catSlug}/${articleSlug}`;
            } else {
                paths[langCode] = `/${langCode}/${catSlug}/${articleSlug}`;
            }
        });

        setAlternatePaths(paths);

        // Cleanup on unmount
        return () => {
            setAlternatePaths({});
        };
    }, [translations, categorySlug, categoryTranslations, setAlternatePaths]);

    return null;
}
