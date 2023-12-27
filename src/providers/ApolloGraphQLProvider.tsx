'use client';
import type { PropsWithChildren } from 'react'
import { useMemo } from 'react'
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  from,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context';
import { useAuth } from '@clerk/nextjs';
import { GRAPHQL_URL, typeDefs } from '../lib/gql';


const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
  credentials: "include",
});

export const ApolloGraphQLProvider = ({ children }: PropsWithChildren) => {
  const { getToken } = useAuth();

  const client = useMemo(() => {
    const authMiddleware = setContext(async (operation, { headers }) => {
      const token = await getToken();
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`,
        },
      }
    })

    return new ApolloClient({
      link: from([authMiddleware, httpLink]),
      cache: new InMemoryCache(),
      typeDefs,
    })
  }, [getToken])

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
