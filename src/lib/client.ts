import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const uri = process.env.NEXT_PUBLIC_GRAPHQL_URL;

if (!uri) {
  throw new Error("Invalid GraphQL API endpoint provided.");
}

const config = new HttpLink({
  uri,
});

const authentication = setContext((_, { headers, }) => {
  return {
    headers: {
      ...headers,
      "x-auth-token": localStorage.getItem("firebaseToken") as string,
    },
  };
});

const typeDefs = gql`
  input ConnectRailwayAccountDTO {
    name: String
    token: String!
  }
`;

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authentication.concat(config),
  typeDefs,
});
