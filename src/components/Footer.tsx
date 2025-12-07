"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "../contexts/LanguageContext";
import { getLocalizedPath } from "@/lib/localization";
import { Facebook, Instagram, Linkedin, Cloud } from "lucide-react";
import { LogoData, Category } from "@/lib/actions/site/headerMenuAction";

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

// Custom Twitter X icon component
const TwitterXIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className={className}
    viewBox="0 0 16 16"
  >
    <path
      d="M12.6 0.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867 -5.07 -4.425 5.07H0.316l5.733 -6.57L0 0.75h5.063l3.495 4.633L12.601 0.75Zm-0.86 13.028h1.36L4.323 2.145H2.865z"
      strokeWidth="1"
    />
  </svg>
);

interface FooterProps {
  logoData: LogoData | null;
  footerCategoriesMenuData: {
    en: Category[];
    ar: Category[];
    ru: Category[];
  };
  footerPagesMenuData: {
    en: Category[];
    ar: Category[];
    ru: Category[];
  };
}

export const Footer: React.FC<FooterProps> = ({
  logoData,
  footerCategoriesMenuData,
  footerPagesMenuData,
}) => {
  const { language } = useLanguage();
  const params = useParams() as { locale?: string };
  const locale = params?.locale || "en";
  const getPath = (path: string) => getLocalizedPath(path, locale);

  // Get current language menu data
  const currentLanguage = language.toLowerCase() as "en" | "ar" | "ru";
  const categories =
    footerCategoriesMenuData[currentLanguage] ||
    footerCategoriesMenuData.en ||
    [];
  const pages =
    footerPagesMenuData[currentLanguage] || footerPagesMenuData.en || [];

  // Get dynamic footer content based on language
  const getFooterDescription = () => {
    if (!logoData) {
      return language === "ar"
        ? "استكشف عالم القهوة من خلال القصص والثقافة والمجتمع"
        : language === "ru"
        ? "Исследуйте мир кофе через истории, культуру и сообщество"
        : "Explore the world of coffee through stories, culture, and community";
    }

    if (language === "ar")
      return logoData.footerDescriptionAr || logoData.footerDescriptionEn || "";
    if (language === "ru")
      return logoData.footerDescriptionRu || logoData.footerDescriptionEn || "";
    return logoData.footerDescriptionEn || "";
  };

  const getCopyrightLeft = () => {
    if (!logoData) {
      return `© 2025 Qahwa World. ${
        language === "ar"
          ? "جميع الحقوق محفوظة"
          : language === "ru"
          ? "Все права защищены"
          : "All rights reserved"
      }.`;
    }

    if (language === "ar")
      return (
        logoData.footerCopyrightTextLeftAr ||
        logoData.footerCopyrightTextLeftEn ||
        ""
      );
    if (language === "ru")
      return (
        logoData.footerCopyrightTextLeftRu ||
        logoData.footerCopyrightTextLeftEn ||
        ""
      );
    return logoData.footerCopyrightTextLeftEn || "";
  };

  const getCopyrightRight = () => {
    if (!logoData) {
      return language === "ar"
        ? "صنع بحب من عالم القهوة"
        : language === "ru"
        ? "Сделано с любовью Qahwa World"
        : "Made with love by Qahwa World";
    }

    if (language === "ar")
      return (
        logoData.footerCopyrightTextRightAr ||
        logoData.footerCopyrightTextRightEn ||
        ""
      );
    if (language === "ru")
      return (
        logoData.footerCopyrightTextRightRu ||
        logoData.footerCopyrightTextRightEn ||
        ""
      );
    return logoData.footerCopyrightTextRightEn || "";
  };

  const logoUrl = logoData?.darkMode?.sourceUrl || "/images/qw-white-logo.svg";
  const logoAlt = logoData?.darkMode?.altText || "Qahwa World Logo";

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Column 1: Logo, Tagline & Social Icons */}
          <div className="space-y-6">
            {/* Logo */}
            <Link
              href={getPath("/")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img src={logoUrl} alt={logoAlt} className="h-10" />
            </Link>

            {/* Tagline */}
            <p className="text-gray-400 leading-relaxed">
              {getFooterDescription()}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/Qahwaworld/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-all hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/qahwaworld"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter X"
                className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-all hover:scale-110"
              >
                <TwitterXIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/qahwaworld"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-all hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/qahwaworld"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-all hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://bsky.app/profile/qahwaworld.bsky.social"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bluesky"
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
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <li key={`category-${index}-${category.path}`}>
                    <Link
                      href={category.path}
                      className="text-gray-400 hover:text-amber-500 transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">
                  No categories available
                </li>
              )}
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
              {pages.length > 0 ? (
                pages.map((page, index) => (
                  <li key={`page-${index}-${page.path}`}>
                    <Link
                      href={page.path}
                      className="text-gray-400 hover:text-amber-500 transition-colors"
                    >
                      {page.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">No pages available</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">{getCopyrightLeft()}</p>
            <p className="text-gray-500 text-sm">{getCopyrightRight()}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
