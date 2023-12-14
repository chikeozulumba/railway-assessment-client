import nookies from "nookies";
import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const uri = process.env.NEXT_PUBLIC_GRAPHQL_URL;

if (!uri) {
  throw new Error("Invalid GraphQL API endpoint provided.");
}

const config = new HttpLink({
  uri,
  credentials: "include",
});

const authentication = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    },
  };
});

const typeDefs = gql`
  input ConnectRailwayAccountDTO {
    name: String
    token: String!
  }

  input Repo {
    fullRepoName: String
    branch: String
  }

  input CreateNewRailwayProjectDTO {
    tokenId: String
    name: String
    description: String
    prDeploys: String
    isPublic: String
    defaultEnvironmentName: String
    repo: Repo
  }
`;

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authentication.concat(config),
  typeDefs,
});
