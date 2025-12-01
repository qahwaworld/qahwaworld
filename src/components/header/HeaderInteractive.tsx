'use client';

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, Mail, Moon, Sun, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getLocalizedPath } from "@/lib/localization";
import { Category, HeaderMenuData } from "@/lib/actions/site/headerMenuAction";
import { Button } from "@/components/ui/button";
import { Language } from "@/types";
import { NavigationMenu } from "./NavigationMenu";
import { MobileMenu } from "./MobileMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchModal } from "./SearchModal";
import { SubscribeModal } from "./SubscribeModal";

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

interface HeaderInteractiveProps {
  menuData: {
    en: Category[];
    ar: Category[];
    ru: Category[];
  };
  locale: string;
}

export const HeaderInteractive: React.FC<HeaderInteractiveProps> = ({ menuData, locale }) => {
  const { language, setLanguage, t, alternatePaths } = useLanguage();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const headerRef = React.useRef<HTMLElement>(null);

  // Get current menu items based on language
  const menuItems = menuData[language] || menuData.en;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      setIsScrolled(window.scrollY > headerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    // Check if there is an alternate path for the new language (e.g., for articles)
    if (alternatePaths && alternatePaths[newLang]) {
      router.push(alternatePaths[newLang]);
      return;
    }

    // Don't manually set language - it will update automatically via pathname

    // Remove current locale from pathname - check for complete path segments
    let pathWithoutLocale = pathname;
    if (pathname === '/ar' || pathname.startsWith('/ar/')) {
      pathWithoutLocale = pathname.substring(3) || '/';
    } else if (pathname === '/ru' || pathname.startsWith('/ru/')) {
      pathWithoutLocale = pathname.substring(3) || '/';
    }

    // Build new path
    let newPath: string;
    if (newLang === 'en') {
      newPath = pathWithoutLocale;
    } else {
      newPath = `/${newLang}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    }

    router.push(newPath);
  };

  const getPath = (path: string) => getLocalizedPath(path, locale);

  return (
    <header
      ref={headerRef}
      className={`bg-white dark:bg-gray-900 border-b dark:border-gray-700 ${isScrolled ? "fixed" : "sticky"
        } top-0 left-0 right-0 z-40 shadow-sm will-change-transform transition-all duration-300`}
    >
      <div className="container mx-auto px-4">
        {/* Desktop Header */}
        <div
          className={`hidden lg:grid grid-cols-3 items-center gap-4 overflow-hidden transition-[height,padding] duration-300 ease-in-out will-change-[height] ${isScrolled ? "h-0 py-0" : "h-20 py-4"
            }`}
        >
          {/* Left: Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/Qahwaworld/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900 transition-colors border dark:border-gray-600"
            >
              <Facebook className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </a>
            <a
              href="https://x.com/qahwaworld"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900 transition-colors border dark:border-gray-600"
            >
              <Twitter className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </a>
            <a
              href="https://www.instagram.com/qahwaworld"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900 transition-colors border dark:border-gray-600"
            >
              <Instagram className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </a>
            <a
              href="https://www.linkedin.com/in/qahwaworld"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900 transition-colors border dark:border-gray-600"
            >
              <Linkedin className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </a>
            <a
              href="https://bsky.app/profile/qahwaworld.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900 transition-colors border dark:border-gray-600"
            >
              <BlueskyIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </a>
          </div>

          {/* Center: Logo */}
          <Link href={getPath('/')} className="flex items-center gap-3 cursor-pointer group justify-center">
            {theme === "dark" ? (
              <img src="/images/qw-white-logo.svg" alt="Qahwa World Logo" className="h-10" />
            ) : (
              <img src="/images/qahwaworld-logo.svg" alt="Qahwa World Logo" className="h-10" />
            )}
          </Link>

          {/* Right: Search, Subscribe & Language */}
          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <Button
              onClick={() => setSubscribeModalOpen(true)}
              className="bg-amber-700 hover:bg-amber-800 shadow-sm"
            >
              {t.subscribe}
            </Button>

            <LanguageSwitcher currentLanguage={language} onLanguageChange={handleLanguageChange} />
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex lg:hidden items-center justify-between py-4">
          <Link href={getPath('/')} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
              <div className="w-5 h-5 bg-amber-300 rounded-full"></div>
            </div>
            <h1 className="text-amber-900 dark:text-amber-100 tracking-wide">
              QAHWA
              <span className="text-amber-700 dark:text-amber-500">WORLD</span>
            </h1>
          </Link>

          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Desktop Navigation Row */}
        <nav
          className={`hidden lg:flex items-center gap-1 transition-all duration-300 ease-in-out border-t dark:border-gray-700 will-change-[padding] ${isScrolled ? "justify-start py-2" : "justify-center py-3"
            }`}
        >
          {/* Small Logo on Scroll */}
          <Link
            href={getPath('/')}
            className={`flex items-center gap-2 cursor-pointer group mr-6 transition-all duration-300 ease-in-out will-change-[opacity,width,transform] ${isScrolled
              ? "opacity-100 visible w-auto translate-x-0"
              : "opacity-0 invisible w-0 -translate-x-2"
              }`}
          >
            <img src="/images/qw-icon.svg" alt="Qahwa World Logo" className="h-10" />
          </Link>
          <NavigationMenu menuItems={menuItems} locale={locale} isScrolled={false} />

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-auto px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
            aria-label="Toggle theme"
          >
            {!mounted ? (
              <Sun className="w-5 h-5 opacity-50" />
            ) : theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        menuItems={menuItems}
        locale={locale}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        translations={{
          search: t.search,
          categories: t.categories,
          pages: t.pages,
          about: t.about,
          privacy: t.privacyPolicy,
          contact: t.contactUs,
          faq: t.faq,
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        locale={locale}
        searchPlaceholder={t.search}
      />

      {/* Subscribe Modal */}
      <SubscribeModal
        isOpen={subscribeModalOpen}
        onClose={() => setSubscribeModalOpen(false)}
        translations={{
          subscribe: t.subscribe,
          email: "Email",
          close: "Close",
        }}
      />
    </header>
  );
};
