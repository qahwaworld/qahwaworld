import { Metadata } from 'next';
import { NotFoundContent } from '@/components/NotFoundContent';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Qahwa World',
  description: 'The page you are looking for could not be found. Return to Qahwa World homepage or browse our latest coffee news and articles.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return <NotFoundContent />;
}

