import type { Metadata } from 'next';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LocaleWrapper } from '@/components/LocaleWrapper';
import { HtmlAttributes } from '@/components/HtmlAttributes';
import { HeaderMenuData } from '@/lib/actions/site/headerMenuAction';
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
  // Fetch menu data for all languages on server side
  const [enMenuItems, arMenuItems, ruMenuItems] = await Promise.all([
    HeaderMenuData('en'),
    HeaderMenuData('ar'),
    HeaderMenuData('ru'),
  ]);

  const menuData = {
    en: enMenuItems,
    ar: arMenuItems,
    ru: ruMenuItems,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <HtmlAttributes />
        <ThemeProvider>
          <LocaleWrapper menuData={menuData}>
            {children}
          </LocaleWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
