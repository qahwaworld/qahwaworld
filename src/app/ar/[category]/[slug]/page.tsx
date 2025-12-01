import ArticleRoute from '@/app/[category]/[slug]/page';

interface Props {
    params: Promise<{ category: string; slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ArticlePage({ params, searchParams }: Props) {
    return <ArticleRoute params={params} searchParams={searchParams} locale="ar" />;
}
