import { SearchResultsPage } from '@/components/search';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchRoute({ searchParams }: Props) {
  const params = await searchParams;
  return <SearchResultsPage query={params.q} locale="en" />;
}
