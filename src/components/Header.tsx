'use client';

import React from 'react';
import { Category } from "@/lib/actions/site/headerMenuAction";
import { HeaderInteractive } from "./header/HeaderInteractive";

interface HeaderProps {
  locale?: string;
  language?: string;
  menuData: {
    en: Category[];
    ar: Category[];
    ru: Category[];
  };
}

export const Header: React.FC<HeaderProps> = ({ locale = 'en', language = 'en', menuData }) => {
  return <HeaderInteractive menuData={menuData} locale={locale} />;
};
