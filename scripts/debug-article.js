
const { ApolloClient, InMemoryCache, gql, HttpLink } = require("@apollo/client");
const fetch = require("cross-fetch");

const client = new ApolloClient({
  link: new HttpLink({ uri: "https://biva.qahwaworld.com/graphql", fetch }),
  cache: new InMemoryCache(),
});

const GET_ARTICLE = gql`
  query GetArticle($id: ID!) {
    post(id: $id, idType: SLUG) {
      slug
      translations {
        slug
        language {
          code
        }
      }
      categories {
        nodes {
          name
          slug
          translations {
            slug
            language {
              code
            }
          }
        }
      }
    }
  }
`;

async function run() {
  try {
    const result = await client.query({
      query: GET_ARTICLE,
      variables: { id: "جي-دي-إي-بيتس-تنقل-أسهماً-لموظفيها-وسط-ع" },
    });
    console.log(JSON.stringify(result.data, null, 2));
  } catch (error) {
    console.error(error);
  }
}

run();
