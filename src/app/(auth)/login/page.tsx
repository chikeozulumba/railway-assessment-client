"use client";

import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { SignIn } from "@clerk/nextjs";
import { AUTH_PROVIDERS } from "@/constants";
import { Toast } from "@/lib/toast";
import { useAuthStore } from "@/store/auth";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import { useAuthorize } from "@/hooks/useAuthorizeWithSocialAccount";

import type { SignUpWithSocialAccountProvider } from "@/@types/auth";
import { NAVIGATION_LINKS_PATH } from "@/constants/navigation";

export default function Login() {
  const router = useRouter();
  const search = useSearchParams();
  const { auth, setAuthModeState, setAuthState } = useAuthStore();
  
  return (
    <Center id="login" minHeight={"100vh"} height={"100%"}>
      <Stack spacing={4} align={"center"} maxW={"xs"} w={"full"}>
        <SignIn />;
      </Stack>
    </Center>
  );
}
