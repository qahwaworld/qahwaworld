'use client';

import React from "react";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from "../contexts/LanguageContext";
import { getLocalizedPath } from "@/lib/localization";
import { Facebook, Twitter, Instagram, Linkedin, Cloud } from "lucide-react";


// Custom Bluesky icon component
const BlueskyIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
  </svg>
);

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const params = useParams() as { locale?: string };
  const locale = params?.locale || 'en';
  const getPath = (path: string) => getLocalizedPath(path, locale);

  const categories = [
    {
      key: "News",
      label:
        language === "ar" ? "أخبار" : language === "ru" ? "Новости" : "News",
    },
    {
      key: "Coffee Community",
      label:
        language === "ar"
          ? "مجتمع القهوة"
          : language === "ru"
          ? "Кофейное сообщество"
          : "Coffee Community",
    },
    {
      key: "Studies",
      label:
        language === "ar"
          ? "دراسات"
          : language === "ru"
          ? "Исследования"
          : "Studies",
    },
    {
      key: "Interview",
      label:
        language === "ar"
          ? "حوارات"
          : language === "ru"
          ? "Интервью"
          : "Interview",
    },
    {
      key: "Coffee Reflections",
      label:
        language === "ar"
          ? "تأملات"
          : language === "ru"
          ? "Размышления"
          : "Coffee Reflections",
    },
  ];

  const pages = [
    {
      key: "about",
      label:
        language === "ar" ? "من نحن" : language === "ru" ? "О нас" : "About Us",
    },
    {
      key: "privacy",
      label:
        language === "ar"
          ? "سياسة الخصوصية"
          : language === "ru"
          ? "Политика"
          : "Privacy Policy",
    },
    {
      key: "contact",
      label:
        language === "ar"
          ? "اتصل بنا"
          : language === "ru"
          ? "Связаться с нами"
          : "Contact Us",
    },
    {
      key: "faq",
      label:
        language === "ar"
          ? "الأسئلة الشائعة"
          : language === "ru"
          ? "ЧАВО"
          : "FAQ",
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Column 1: Logo, Tagline & Social Icons */}
          <div className="space-y-6">
            {/* Logo */}
            <Link href={getPath('/')} className="flex items-center gap-3 cursor-pointer group">
              <img src='/images/qw-white-logo.svg' alt="Qahwa World Logo" className="h-10" />
            </Link>

            {/* Tagline */}
            <p className="text-gray-400 leading-relaxed">
              {language === "ar"
                ? "استكشف عالم القهوة من خلال القصص والثقافة والمجتمع"
                : language === "ru"
                ? "Исследуйте мир кофе через истории, культуру и сообщество"
                : "Explore the world of coffee through stories, culture, and community"}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/Qahwaworld/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-all hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/qahwaworld"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-all hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/qahwaworld"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-all hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/qahwaworld"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-all hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://bsky.app/profile/qahwaworld.bsky.social"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-all hover:scale-110"
              >
                <BlueskyIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h3 className="text-lg text-amber-500 mb-4">
              {language === "ar"
                ? "الفئات"
                : language === "ru"
                ? "Категории"
                : "Categories"}
            </h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.key}>
                  <Link
                    href={getPath(`/${encodeURIComponent(category.key)}`)}
                    className="text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Pages */}
          <div>
            <h3 className="text-lg text-amber-500 mb-4">
              {language === "ar"
                ? "الصفحات"
                : language === "ru"
                ? "Страницы"
                : "Pages"}
            </h3>
            <ul className="space-y-3">
              {pages.map((page) => (
                <li key={page.key}>
                  <Link
                    href={getPath(`/${page.key}`)}
                    className="text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 Qahwa World.{" "}
              {language === "ar"
                ? "جميع الحقوق محفوظة"
                : language === "ru"
                ? "Все права защищены"
                : "All rights reserved"}
              .
            </p>
            <p className="text-gray-500 text-sm">
              {language === "ar"
                ? "صنع بحب من عالم القهوة"
                : language === "ru"
                ? "Сделано с любовью Qahwa World"
                : "Made with love by Qahwa World"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
