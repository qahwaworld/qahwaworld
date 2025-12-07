'use client';

import React from 'react';
import { Category, LogoData } from "@/lib/actions/site/headerMenuAction";
import { HeaderInteractive } from "./header/HeaderInteractive";

interface HeaderProps {
  locale?: string;
  language?: string;
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
  logoData: LogoData | null;
}

export const Header: React.FC<HeaderProps> = ({ locale = 'en', language = 'en', menuData, mobileMenuData, logoData }) => {
  return <HeaderInteractive menuData={menuData} mobileMenuData={mobileMenuData} locale={locale} logoData={logoData} />;
};
