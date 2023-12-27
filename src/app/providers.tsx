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
        <ClerkProvider>
          <ApolloGraphQLProvider>
            {children}
          </ApolloGraphQLProvider>
        </ClerkProvider>
      </ChakraProvider>
    </CacheProvider>
  );
};
