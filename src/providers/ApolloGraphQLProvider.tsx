import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/client";

export function ApolloGraphQLProvider({ children }: React.PropsWithChildren) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
