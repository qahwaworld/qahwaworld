'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { Language } from "@/types";

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "ar", label: "ع" },
    { code: "ru", label: "RU" },
  ];

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
