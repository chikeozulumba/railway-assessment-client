"use client";

import React from "react";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthUserProvider } from "@/providers/AuthUserProvider";
import { ApolloGraphQLProvider } from "@/providers/ApolloGraphQLProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <ChakraProvider>
        <ApolloGraphQLProvider>
          <AuthUserProvider>{children}</AuthUserProvider>
        </ApolloGraphQLProvider>
      </ChakraProvider>
    </CacheProvider>
  );
};
