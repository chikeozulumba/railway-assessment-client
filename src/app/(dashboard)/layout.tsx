"use client";
import { usePathname } from "next/navigation";
import { Alert, AlertIcon, Box, Container, Text, useToken } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { NavigationBar } from "@/components/Navbar";
import { useAuthStore } from "@/store/auth";
import { useTokenStore } from "@/store/token";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state: user } = useAuthStore();
  const { state: tokenState } = useTokenStore();
  const pathname = usePathname();

  const shouldHideTokenAlertBox = !['/settings'].includes(pathname);
  const railwayAccountConnected = tokenState.length > 0;

  return (
    <>
      <NavigationBar />
      <Container maxW={"1024px"} pt={{ base: 16 }}>
        {user.data &&
          !railwayAccountConnected &&
          shouldHideTokenAlertBox && (
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
        <Box minH={"100vh"}>
          {children}
        </Box>
      </Container>
    </>
  );
}
