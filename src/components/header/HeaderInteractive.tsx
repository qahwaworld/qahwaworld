'use client';

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, Mail, Moon, Sun, Facebook, Instagram, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getLocalizedPath } from "@/lib/localization";
import { Category, HeaderMenuData, LogoData } from "@/lib/actions/site/headerMenuAction";
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

// Custom Twitter X icon component
const TwitterXIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className={className}
    viewBox="0 0 16 16"
  >
    <path d="M12.6 0.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867 -5.07 -4.425 5.07H0.316l5.733 -6.57L0 0.75h5.063l3.495 4.633L12.601 0.75Zm-0.86 13.028h1.36L4.323 2.145H2.865z" strokeWidth="1" />
  </svg>
);

interface HeaderInteractiveProps {
  menuData: {
    en: Category[];
    ar: Category[];
    ru: Category[];
  };
  mobileMenuData: {
    en: Category[];
    ar: Category[];
    ru: Category[];
  };
  locale: string;
  logoData: LogoData | null;
}

export const HeaderInteractive: React.FC<HeaderInteractiveProps> = ({ menuData, mobileMenuData, locale, logoData }) => {
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
  const mobileMenuItems = mobileMenuData[language] || mobileMenuData.en;

  // Get logo URLs with fallback to default paths
  const darkModeLogo = logoData?.darkMode?.sourceUrl || '/images/qw-white-logo.svg';
  const lightModeLogo = logoData?.lightMode?.sourceUrl || '/images/qahwaworld-logo.svg';
  const stickyLogo = logoData?.sticky?.sourceUrl || '/images/qw-icon.svg';
  const darkModeAlt = logoData?.darkMode?.altText || 'Qahwa World Logo';
  const lightModeAlt = logoData?.lightMode?.altText || 'Qahwa World Logo';
  const stickyAlt = logoData?.sticky?.altText || 'Qahwa World Logo';

  // Avoid hydration mismatch by using light theme assets until mounted on client
  const isDarkTheme = mounted && theme === 'dark';

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
              <TwitterXIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
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
            {isDarkTheme ? (
              <img src={darkModeLogo} alt={darkModeAlt} />
            ) : (
              <img src={lightModeLogo} alt={lightModeAlt} />
            )}
          </Link>

          {/* Right: Search, Subscribe & Language */}
          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Open search modal"
            >
              <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <Button
              onClick={() => setSubscribeModalOpen(true)}
              className="bg-amber-700 hover:bg-amber-800 shadow-sm"
              aria-label="Open subscribe modal"
            >
              {t.subscribe}
            </Button>

            <LanguageSwitcher currentLanguage={language} onLanguageChange={handleLanguageChange} />
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex lg:hidden items-center justify-between py-4">
          <Link href={getPath('/')} className="flex items-center gap-3 cursor-pointer group">
            <div className="">
              {isDarkTheme ? (
                <img src={darkModeLogo} alt={darkModeAlt} className="h-10" />
              ) : (
                <img src={lightModeLogo} alt={lightModeAlt} className="h-10" />
              )}
            </div>
          </Link>

          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
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
          className={`hidden lg:flex items-center gap-1 transition-all duration-300 ease-in-out border-t dark:border-gray-700 will-change-[padding] ${isScrolled ? "justify-start py-2" : "justify-between py-3"
            }`}
        >
          {/* Small Logo on Scroll */}
          <Link
            href={getPath('/')}
            className={`flex items-center gap-2 cursor-pointer group transition-all duration-300 ease-in-out will-change-[opacity,width,transform] ${isScrolled
              ? "opacity-100 visible w-auto translate-x-0 mr-6"
              : "opacity-0 invisible w-0 -translate-x-2 mr-0"
              }`}
          >
            <img src={stickyLogo} alt={stickyAlt} className="h-10" />
          </Link>
          <NavigationMenu menuItems={menuItems} locale={locale} isScrolled={false} />

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ltr:ml-auto rtl:mr-auto px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
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
        menuItems={mobileMenuItems}
        locale={locale}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        translations={{
          search: t.search,
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
          email: t.emailPlaceholder,
          close: "Close",
          toastEmailRequired: t.toastEmailRequired,
          toastEmailAlreadySubscribed: t.toastEmailAlreadySubscribed,
          toastSubscriptionSuccess: t.toastSubscriptionSuccess,
          toastSubscriptionError: t.toastSubscriptionError,
          toastSubscribing: t.toastSubscribing,
        }}
      />
    </header>
  );
};
