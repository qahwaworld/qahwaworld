'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { ChevronDown } from "lucide-react";
import { Language } from "@/types";

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  variant?: 'default' | 'dropdown';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  onLanguageChange,
  variant = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "ar", label: "ع" },
    { code: "ru", label: "RU" },
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  // Dropdown variant for mobile
  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-3 py-1.5 border dark:border-gray-600 rounded-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
          aria-label="Select language"
        >
          <span>{currentLang.label}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-0 w-16 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-sm shadow-lg z-20 overflow-hidden">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    currentLanguage === lang.code
                      ? "bg-amber-700 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Default variant (button group) for desktop
  return (
    <div className="flex items-center gap-1 border dark:border-gray-600 rounded-lg px-2 py-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          className={`w-10 px-2 py-1 text-sm rounded transition-colors ${
            currentLanguage === lang.code
              ? "bg-amber-700 text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
