import ArticleRoute, { generateMetadata as generateArticleMetadata } from '@/app/[category]/[slug]/page';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ category: string; slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return generateArticleMetadata({ params, locale: 'ar' });
}

export default async function ArticlePage({ params, searchParams }: Props) {
    return <ArticleRoute params={params} searchParams={searchParams} locale="ar" />;
}
