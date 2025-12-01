import { SearchResultsPage } from '@/components/search';

interface Props {
  params: Promise<{  }>;
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchRoute({ params, searchParams }: Props) {
  const {} = await params;
  const search = await searchParams;
  const query = search.q || '';
  return <SearchResultsPage query={query} locale="ar" />;
}
