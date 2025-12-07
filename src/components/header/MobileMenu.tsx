'use client';

import React, { useState } from "react";
import Link from 'next/link';
import { Search, X, ChevronDown, ChevronRight, Facebook, Instagram, Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Category } from "@/lib/actions/site/headerMenuAction";
import { getLocalizedPath } from "@/lib/localization";
import { toast } from "sonner";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Language } from "@/types";

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

interface MobileMenuProps {
  menuItems: Category[];
  locale: string;
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  translations: {
    search: string;
    about: string;
    privacy: string;
    contact: string;
    faq: string;
  };
}

interface MobileMenuItem {
  key: string;
  label: string;
  path: string;
  subcategories?: Category[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  menuItems,
  locale,
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
  translations,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());

  const getPath = (path: string) => getLocalizedPath(path, locale);

  const toggleSubmenu = (itemKey: string) => {
    const newOpenSubmenus = new Set(openSubmenus);
    if (newOpenSubmenus.has(itemKey)) {
      newOpenSubmenus.delete(itemKey);
    } else {
      newOpenSubmenus.add(itemKey);
    }
    setOpenSubmenus(newOpenSubmenus);
  };

  const mobileMenuItems = menuItems.map((item) => ({
    key: item.path,
    label: item.name,
    path: item.path,
    subcategories: item.subcategories,
  }));

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast.success(`Searching for: ${searchQuery}`);
      setSearchQuery("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed top-0 ${
        locale === 'ar' ? 'right-0' : 'left-0'
      } bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl flex flex-col z-50 h-screen`}
    >
      {/* Menu Header */}
      <div className="p-6 border-b dark:border-gray-700 bg-gradient-to-r from-amber-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-amber-900 dark:text-amber-100">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="relative">
          <Input
            type="text"
            placeholder={translations.search}
            className="pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Menu Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-1">
          {mobileMenuItems.map((item: MobileMenuItem) => (
            <div key={item.key}>
              {item.subcategories && item.subcategories.length > 0 ? (
                <Collapsible
                  open={openSubmenus.has(item.key)}
                  onOpenChange={() => toggleSubmenu(item.key)}
                >
                  <div className="flex items-center justify-between w-full group">
                    <Link
                      href={getPath(item.path)}
                      onClick={onClose}
                      className="flex-1 text-left px-3 py-2.5 rounded-md hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                    >
                      {item.label}
                    </Link>
                    <CollapsibleTrigger className="p-2 ml-1 hover:bg-amber-50 dark:hover:bg-gray-700 rounded-md transition-colors group-hover:bg-amber-50 dark:group-hover:bg-gray-700">
                      {openSubmenus.has(item.key) ? (
                        <ChevronDown className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      )}
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="flex flex-col gap-2 pl-6 border-l border-gray-200 dark:border-gray-600 ml-6 mt-1">
                    {/* Subcategory links */}
                    {item.subcategories.map((subitem) => (
                      <Link
                        key={subitem.path}
                        href={getPath(subitem.path)}
                        onClick={onClose}
                        className="text-left px-3 py-2 rounded-md hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 text-sm"
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <Link
                    href={getPath(item.path)}
                    onClick={onClose}
                    className="flex-1 ltr:text-left rtl:text-right px-3 py-2.5 rounded-md hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    {item.label}
                  </Link>
                  <div className="p-2 ml-1 w-9"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Language Switcher & Social Icons Footer */}
      <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">Language</span>
            <LanguageSwitcher 
              currentLanguage={currentLanguage} 
              onLanguageChange={onLanguageChange} 
            />
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-b dark:border-gray-700"></div>
        
        {/* Social Icons */}
        <div className="p-4 pt-4">
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
        </div>
      </div>
    </div>
  );
};
