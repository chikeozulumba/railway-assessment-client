"use client";

import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { AUTH_PROVIDERS, NAVIGATION_LINKS_PATH } from "@/constants";
import { Toast } from "@/lib/toast";
import { useAuthStore } from "@/store/auth";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import { useAuthorize } from "@/hooks/useAuthorizeWithSocialAccount";

import type { SignUpWithSocialAccountProvider } from "@/@types/auth";

export default function Login() {
  const router = useRouter();
  const search = useSearchParams();
  const { auth, setAuthModeState, setAuthState } = useAuthStore();

  const { signUpWithSocialAccount, authorizeUser, loading } = useAuthorize();
  const { logout } = useFirebaseAuth();

  const handleAuthentication = async (
    provider: SignUpWithSocialAccountProvider
  ): Promise<boolean | void> => {
    if (auth.provider !== null) return;

    const { error, user, token } = await signUpWithSocialAccount(provider);

    if (error && !user) {
      setAuthModeState({ provider: null });
      Toast(`Invalid login attempt, please try again.`, {
        type: "error",
        time: 4,
      });
      await logout();
      return;
    }

    const { data } = await authorizeUser({
      variables: { payload: user },
      context: { headers: { Authorization: "Bearer " + token } },
    });

    if (!loading && data) {
      setAuthState({
        loading: false,
        isLoggedInCheck: true,
        authenticated: true,
        data: data.authorize,
      });

      const redirectUrl = search.get("redirect_url");
      return router.replace(
        redirectUrl ? redirectUrl.toString() : NAVIGATION_LINKS_PATH.Home
      );
    }

    Toast(`Invalid login attempt, please try again.`, {
      type: "error",
      time: 4,
    });
  };

  const shouldDisable = auth.provider !== null;

  return (
    <Center minHeight={"100vh"} height={"100%"}>
      <Stack spacing={4} align={"center"} maxW={"xs"} w={"full"}>
        <Button
          onClick={() => handleAuthentication(AUTH_PROVIDERS.Google)}
          w={"full"}
          leftIcon={<FcGoogle />}
          borderRadius={"12px"}
          background={"#F4DFC8"}
          disabled={shouldDisable}
          _hover={{
            background: shouldDisable ? undefined : "#F4EAE0",
            cursor: shouldDisable ? "not-allowed" : "cursor-pointer",
          }}
        >
          <Center>
            <Text color={"#000"} fontWeight={"medium"}>
              {auth.provider === AUTH_PROVIDERS.Google
                ? "Please wait..."
                : "Continue with Google"}
            </Text>
          </Center>
        </Button>
        <Button
          onClick={() => handleAuthentication(AUTH_PROVIDERS.Github)}
          w={"full"}
          leftIcon={<FaGithub style={{ color: "#000" }} />}
          borderRadius={"12px"}
          background={"#F4DFC8"}
          disabled={shouldDisable}
          _hover={{
            background: shouldDisable ? undefined : "#F4EAE0",
            cursor: shouldDisable ? "not-allowed" : "cursor-pointer",
          }}
        >
          <Center>
            <Text color={"#000"} fontWeight={"medium"}>
              {auth.provider === AUTH_PROVIDERS.Github
                ? "Please wait..."
                : "Continue with Github"}
            </Text>
          </Center>
        </Button>
      </Stack>
    </Center>
  );
}
