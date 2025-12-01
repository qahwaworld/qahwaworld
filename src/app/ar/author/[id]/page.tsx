import AuthorPage, { generateMetadata as generateAuthorMetadata } from '@/app/author/[id]/page';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generateAuthorMetadata({ params, locale: 'ar' });
}

export default async function ArabicAuthorPage({ params }: Props) {
  return <AuthorPage params={params} locale="ar" />;
}

