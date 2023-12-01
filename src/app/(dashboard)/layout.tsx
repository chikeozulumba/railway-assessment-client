"use client";
import { usePathname } from "next/navigation";
import { Alert, AlertIcon, Box, Container, Text } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { NavigationBar } from "@/components/Navbar";
import { useAuthStore } from "@/store/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state: user } = useAuthStore();
  const pathname = usePathname();

  const shouldHideTokenAlertBox = !['/settings'].includes(pathname);

  return (
    <>
      <NavigationBar />
      <Container maxW={"1024px"} centerContent>
        {user.data &&
          !user.data.railwayAccountConnected &&
          shouldHideTokenAlertBox && (
            <Alert status="warning" fontSize={"small"} mt={4}>
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
        <Box minH={"100%"} p={4}>
          {children}
        </Box>
      </Container>
    </>
  );
}
