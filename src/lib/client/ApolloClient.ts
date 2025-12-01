import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

/**
 * Apollo Client configured for Next.js App Router with static caching at build time
 * 
 * Strategy:
 * - All data is statically cached at build time
 * - Use cache tags for all GraphQL requests to enable targeted revalidation
 * - revalidatePath() will clear Next.js fetch cache when content is updated/deleted
 * - Apollo cache uses cache-first to leverage Next.js static cache
 */

const client = new ApolloClient({
  link: new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/graphql`,
    fetch: (uri, options) => {
      return fetch(uri, {
        ...options,
        next: { 
          revalidate: false, // Static by default - cached at build time
          tags: ['wordpress'], // Tag all WordPress requests for revalidation
        },
      });
    },
  }),
  cache: new InMemoryCache({
    typePolicies: {
      HomeACF: {
        merge(existing, incoming, { mergeObjects }) {
          return mergeObjects(existing, incoming);
        },
      },
      AboutUsTemplate: {
        merge(existing, incoming, { mergeObjects }) {
          return mergeObjects(existing, incoming);
        },
      },
      ThemeOptions: {
        keyFields: false,
        merge(existing = {}, incoming, { mergeObjects }) {
          return mergeObjects(existing, incoming);
        },
      },
      Page: {
        merge(existing, incoming, { mergeObjects }) {
          return mergeObjects(existing, incoming);
        },
      },
    },
  }),
  // Use cache-first to leverage Next.js static cache
  // Data is cached at build time and only refreshed when revalidatePath() is called
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
  },
});

export default client;
