'use client';

import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { AUTH_PROVIDERS, NAVIGATION_LINKS_PATH } from "@/constants";
import { signUpWithSocialAccount } from "@/firebase/auth";
import type { SignUpWithSocialAccountProvider } from "@/@types/auth";

export default function Login() {
  const router = useRouter();
  const search = useSearchParams();

  const handleAuthentication = async (
    provider: SignUpWithSocialAccountProvider
  ): Promise<boolean | void> => {
    const { response, credentials, error } = await signUpWithSocialAccount(provider);
    if (error && !response) {
      return;
    }

    alert('login user')

    const redirectUrl = search.get("redirect_url");

    return router.replace(
      redirectUrl ? redirectUrl.toString() : NAVIGATION_LINKS_PATH.Home
    );
  };

  return (
    <Center minHeight={"100vh"} height={"100%"}>
      <Stack spacing={4} align={"center"} maxW={"xs"} w={"full"}>
        <Button
          onClick={() => handleAuthentication(AUTH_PROVIDERS.Google)}
          w={"full"}
          leftIcon={<FcGoogle />}
          borderRadius={"12px"}
          background={"#F4DFC8"}
          _hover={{
            background: "#F4EAE0",
          }}
        >
          <Center>
            <Text color={"#000"} fontWeight={"medium"}>
              Continue with Google
            </Text>
          </Center>
        </Button>
        <Button
          onClick={() => handleAuthentication(AUTH_PROVIDERS.Github)}
          w={"full"}
          leftIcon={<FaGithub style={{ color: "#000" }} />}
          borderRadius={"12px"}
          background={"#F4DFC8"}
          _hover={{
            background: "#F4EAE0",
          }}
        >
          <Center>
            <Text color={"#000"} fontWeight={"medium"}>
              Continue with Github
            </Text>
          </Center>
        </Button>
      </Stack>
    </Center>
  );
}
