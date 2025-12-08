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
