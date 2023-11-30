// app/providers.tsx
"use client";

import React from "react";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthUserProvider } from "@/providers/AuthUserProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <ChakraProvider>
        <AuthUserProvider>{children}</AuthUserProvider>
      </ChakraProvider>
    </CacheProvider>
  );
};
