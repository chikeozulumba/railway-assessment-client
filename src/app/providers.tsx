"use client";

import React from "react";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { ClerkProvider } from "@clerk/nextjs";
import { ApolloGraphQLProvider } from "@/providers/ApolloGraphQLProvider";
import { theme } from "@/theme";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <ApolloGraphQLProvider>
          <ClerkProvider>{children}</ClerkProvider>
        </ApolloGraphQLProvider>
      </ChakraProvider>
    </CacheProvider>
  );
};
