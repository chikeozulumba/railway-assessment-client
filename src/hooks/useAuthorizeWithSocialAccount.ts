"use client";

import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import nookies from "nookies";
import { useMutation } from "@apollo/client";
import type { SignUpWithSocialAccountProvider } from "@/@types/auth";
import { AUTH_PROVIDERS } from "@/constants";
import { AUTHORIZE_USER_MUTATION } from "@/graphql/mutations";
import { GET_PROFILE_AND_RAILWAY_TOKENS } from "@/graphql/queries";
import { FirebaseAuth } from "../config";

const loadProvider = (provider: string) => {
  switch (provider) {
    case AUTH_PROVIDERS.Google:
      return GoogleAuthProvider;
    case AUTH_PROVIDERS.Github:
      return GithubAuthProvider;
    default:
      return null;
  }
};

const signUpWithSocialAccount = async (
  providerName: SignUpWithSocialAccountProvider
) => {
  const Provider = loadProvider(providerName);

  if (!Provider) {
    throw Error("Invalid provider selected");
  }

  try {
    let { user, ...credentials } = await signInWithPopup(
      FirebaseAuth,
      new Provider()
    );

    const providerCredentials = Provider.credentialFromResult({
      user,
      ...credentials,
    });

    if (!providerCredentials) {
      throw new Error("Error occured while trying to authorize your account.");
    }

    const provider = providerCredentials.providerId.replaceAll(".com", "");
    const email =
      provider === "google"
        ? user.email
        : (user as any).reloadUserInfo?.providerUserInfo[0]?.email;

    const token = (user as any).accessToken;

    if (token) {
      localStorage.setItem("firebaseToken", token);
      nookies.set(undefined, "firebaseToken", token, {
        path: "/",
      });
    }

    return {
      user: {
        fullName: user.displayName,
        email: email,
        provider,
        providerId: user.uid,
        avatarUrl: user.photoURL,
      },
      token,
      credentials: providerCredentials,
      error: null,
    };
  } catch (e) {
    return { error: e };
  }
};

export const useAuthorize = () => {
  const [authorizeUser, { loading, ...args }] = useMutation(
    AUTHORIZE_USER_MUTATION,
    {
      refetchQueries: [{ query: GET_PROFILE_AND_RAILWAY_TOKENS }],
    }
  );

  return {
    signUpWithSocialAccount,
    authorizeUser,
    loading,
    ...args,
  };
};
