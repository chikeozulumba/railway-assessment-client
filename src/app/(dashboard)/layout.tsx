"use client";
import { NavigationBar } from "@/components/Navbar";
import { Box } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pathname] = usePathname().split("/").filter(Boolean) || "";

  return (
      <>
        <NavigationBar />
        <Box minH={'100%'} p={4}>{children}</Box>
      </>
  );
}
