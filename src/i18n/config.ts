import en from './locales/en.json';
import ar from './locales/ar.json';
import ru from './locales/ru.json';

const translations = { en, ar, ru };

export function getTranslations(locale: string) {
  return translations[locale as keyof typeof translations] || translations.en;
}

export type Translations = typeof en;
