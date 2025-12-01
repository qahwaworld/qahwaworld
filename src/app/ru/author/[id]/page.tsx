import AuthorPage, { generateMetadata as generateAuthorMetadata } from '@/app/author/[id]/page';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generateAuthorMetadata({ params, locale: 'ru' });
}

export default async function RussianAuthorPage({ params }: Props) {
  return <AuthorPage params={params} locale="ru" />;
}

