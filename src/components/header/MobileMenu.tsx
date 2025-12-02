'use client';

import React, { useState } from "react";
import Link from 'next/link';
import { Search, X, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

interface MobileMenuProps {
  menuItems: Category[];
  mobilePagesMenuItems: Category[];
  locale: string;
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  translations: {
    search: string;
    categories: string;
    pages: string;
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
  mobilePagesMenuItems,
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

  const mobileMenuCategories = [
    {
      key: "main",
      title: translations.categories,
      items: menuItems.map((item) => ({
        key: item.path,
        label: item.name,
        path: item.path,
        subcategories: item.subcategories,
      })),
    },
    {
      key: "pages",
      title: translations.pages,
      items: mobilePagesMenuItems.map((item: Category) => ({
        key: item.path,
        label: item.name,
        path: item.path,
        subcategories: item.subcategories,
      })),
    },
  ];

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

      {/* Menu Content with Accordion */}
      <div className="flex-1 overflow-y-auto p-4">
        <Accordion type="multiple" className="w-full">
          {mobileMenuCategories.map((category) => (
            <AccordionItem key={category.key} value={category.key}>
              <AccordionTrigger className="hover:text-amber-700">
                {category.title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-3 pl-4">
                  {category.items.map((item: MobileMenuItem) => (
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
                            className="flex-1 text-left px-3 py-2.5 rounded-md hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                          >
                            {item.label}
                          </Link>
                          <div className="p-2 ml-1 w-9"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Language Switcher Footer */}
      <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">Language</span>
          <LanguageSwitcher 
            currentLanguage={currentLanguage} 
            onLanguageChange={onLanguageChange} 
          />
        </div>
      </div>
    </div>
  );
};
