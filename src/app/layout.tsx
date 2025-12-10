import type { Metadata } from 'next';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LocaleWrapper } from '@/components/LocaleWrapper';
import { HtmlAttributes } from '@/components/HtmlAttributes';
import { ThirdPartyCode } from '@/components/ThirdPartyCode';
import { ServerMetaTags } from '@/components/ServerMetaTags';
import { HeaderMenuData, MobileMenuData, FooterCategoriesMenuData, FooterPagesMenuData, getGlobalOptions } from '@/lib/actions/site/headerMenuAction';
import './globals.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

export async function generateMetadata(): Promise<Metadata> {
  const logoData = await getGlobalOptions();
  const favIconUrl = logoData?.favIcon?.sourceUrl;
  
  // Extract Yandex verification from codeHead
  let yandexVerification: string | undefined;
  if (logoData?.codeHead) {
    const yandexMatch = logoData.codeHead.match(/<meta\s+name=["']yandex-verification["']\s+content=["']([^"']+)["']\s*\/?>/i);
    if (yandexMatch) {
      yandexVerification = yandexMatch[1];
    }
  }

  return {
    title: 'Qahwa World - Coffee Culture & News',
    description: 'Discover the latest coffee news, brewing techniques, and stories from around the world.',
    ...(favIconUrl && {
      icons: {
        icon: favIconUrl,
        shortcut: favIconUrl,
        apple: favIconUrl,
      },
    }),
    ...(yandexVerification && {
      other: {
        'yandex-verification': yandexVerification,
      },
    }),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch menu data for all languages and global options on server side
  const [enMenuItems, arMenuItems, ruMenuItems, enMobileMenuItems, arMobileMenuItems, ruMobileMenuItems, enFooterCategoriesItems, arFooterCategoriesItems, ruFooterCategoriesItems, enFooterPagesItems, arFooterPagesItems, ruFooterPagesItems, logoData] = await Promise.all([
    HeaderMenuData('en'),
    HeaderMenuData('ar'),
    HeaderMenuData('ru'),
    MobileMenuData('en'),
    MobileMenuData('ar'),
    MobileMenuData('ru'),
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

  // Get Google Analytics and Tag Manager IDs from WordPress
  const googleAnalyticsId = logoData?.googleAnalyticsId || null;
  const googleTagManagerId = logoData?.googleTagManagerId || null;
  
  // Get third-party code snippets from WordPress
  const codeHead = logoData?.codeHead || null;
  const codeBody = logoData?.codeBody || null;
  const codeFooter = logoData?.codeFooter || null;

  // Filter out meta tags from codeHead (they'll be rendered server-side)
  let codeHeadWithoutMeta = codeHead;
  if (codeHead) {
    // Remove meta tags from codeHead since they're rendered server-side
    codeHeadWithoutMeta = codeHead.replace(/<meta[^>]*>/gi, '').trim();
    if (!codeHeadWithoutMeta) {
      codeHeadWithoutMeta = null;
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      {googleTagManagerId && <GoogleTagManager gtmId={googleTagManagerId} />}
      <body suppressHydrationWarning>
        <ServerMetaTags codeHead={codeHead} />
        {codeHeadWithoutMeta && <ThirdPartyCode html={codeHeadWithoutMeta} position="head" />}
        {codeBody && <ThirdPartyCode html={codeBody} position="body" />}
        <HtmlAttributes />
        <ThemeProvider>
          <LocaleWrapper menuData={menuData} mobileMenuData={mobileMenuData} footerCategoriesMenuData={footerCategoriesMenuData} footerPagesMenuData={footerPagesMenuData} logoData={logoData}>
            {children}
          </LocaleWrapper>
        </ThemeProvider>
        {codeFooter && <ThirdPartyCode html={codeFooter} position="footer" />}
      </body>
      {googleAnalyticsId && <GoogleAnalytics gaId={googleAnalyticsId} />}
    </html>
  );
}
