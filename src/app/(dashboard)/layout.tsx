"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Alert, AlertIcon, Box, Container, Text } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { useQuery } from "@apollo/client";
import { NavigationBar } from "@/components/Navbar";
import { GET_PROFILE_AND_RAILWAY_TOKENS } from "@/graphql/queries";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const auth = useUser();

  const { data, loading } = useQuery(GET_PROFILE_AND_RAILWAY_TOKENS);
  
  const shouldHideTokenAlertBox = !["/settings"].includes(pathname);
  const railwayAccountConnected = data?.getRailwayTokens?.length > 0;

  return auth.isLoaded && !loading && (
    <>
      <NavigationBar />
      <Container maxW={"1024px"} pt={{ base: 16 }}>
        {data && !railwayAccountConnected &&shouldHideTokenAlertBox && (
          <Alert status="warning" fontSize={"small"} mb={4}>
            <AlertIcon />
            <Text color={"#000000"}>
              Connect your railway account via API secret token.
              <br />
              <Link href="/settings?mode=token" textDecoration={"underline"}>
                Click here to proceed
              </Link>
            </Text>
          </Alert>
        )}
        <Box minH={"100vh"}>{children}</Box>
      </Container>
    </>
  );
}
