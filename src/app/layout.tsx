import type { Metadata } from 'next';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LocaleWrapper } from '@/components/LocaleWrapper';
import { HtmlAttributes } from '@/components/HtmlAttributes';
import { HeaderMenuData, MobileCategoriesMenuData, MobilePagesMenuData, FooterCategoriesMenuData, FooterPagesMenuData, getGlobalOptions } from '@/lib/actions/site/headerMenuAction';
import './globals.css';

export const metadata: Metadata = {
  title: 'Qahwa World - Coffee Culture & News',
  description: 'Discover the latest coffee news, brewing techniques, and stories from around the world.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch menu data for all languages and global options on server side
  const [enMenuItems, arMenuItems, ruMenuItems, enMobileMenuItems, arMobileMenuItems, ruMobileMenuItems, enMobilePagesItems, arMobilePagesItems, ruMobilePagesItems, enFooterCategoriesItems, arFooterCategoriesItems, ruFooterCategoriesItems, enFooterPagesItems, arFooterPagesItems, ruFooterPagesItems, logoData] = await Promise.all([
    HeaderMenuData('en'),
    HeaderMenuData('ar'),
    HeaderMenuData('ru'),
    MobileCategoriesMenuData('en'),
    MobileCategoriesMenuData('ar'),
    MobileCategoriesMenuData('ru'),
    MobilePagesMenuData('en'),
    MobilePagesMenuData('ar'),
    MobilePagesMenuData('ru'),
    FooterCategoriesMenuData('en'),
    FooterCategoriesMenuData('ar'),
    FooterCategoriesMenuData('ru'),
    FooterPagesMenuData('en'),
    FooterPagesMenuData('ar'),
    FooterPagesMenuData('ru'),
    getGlobalOptions(),
  ]);

  const menuData = {
    en: enMenuItems,
    ar: arMenuItems,
    ru: ruMenuItems,
  };

  const mobileMenuData = {
    en: enMobileMenuItems,
    ar: arMobileMenuItems,
    ru: ruMobileMenuItems,
  };

  const mobilePagesMenuData = {
    en: enMobilePagesItems,
    ar: arMobilePagesItems,
    ru: ruMobilePagesItems,
  };

  const footerCategoriesMenuData = {
    en: enFooterCategoriesItems,
    ar: arFooterCategoriesItems,
    ru: ruFooterCategoriesItems,
  };

  const footerPagesMenuData = {
    en: enFooterPagesItems,
    ar: arFooterPagesItems,
    ru: ruFooterPagesItems,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <HtmlAttributes />
        <ThemeProvider>
          <LocaleWrapper menuData={menuData} mobileMenuData={mobileMenuData} mobilePagesMenuData={mobilePagesMenuData} footerCategoriesMenuData={footerCategoriesMenuData} footerPagesMenuData={footerPagesMenuData} logoData={logoData}>
            {children}
          </LocaleWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
