"use client";

import { FirebaseAuth } from "../config";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import type { SignUpWithSocialAccountProvider } from "@/@types/auth";
import { AUTH_PROVIDERS } from "@/constants";
import { graphQLAPI } from "@/lib/api";

const authorizeUserAccount = async (
  {
    fullName,
    email,
    provider,
    providerId,
    avatarUrl,
  }: Record<string, string | null>,
  ...args: string[]
) => {
  return await graphQLAPI(
    {
      variables: {
        fullName: fullName,
        email: email,
        provider: provider,
        providerId: providerId,
        avatarUrl: avatarUrl,
      },
      query: `mutation {
      authorize(
        payload: {
          fullName: "${fullName}",
          email: "${email}",
          provider: ${provider},
          providerId: "${providerId}",
          avatarUrl: "${avatarUrl}",
        }
      ) {
        id
        fullName
        email
        provider
        providerId
        avatarUrl
      }
    }`,
    },
    ...args
  );
};

export const signUpWithSocialAccount = async (
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

    const response = await authorizeUserAccount(
      {
        fullName: user.displayName,
        email: email,
        provider,
        providerId: user.uid,
        avatarUrl: user.photoURL,
      },
      (user as any).accessToken
    );

    return {
      response: response.data.authorize,
      credentials: providerCredentials,
      error: null,
    };
  } catch (e) {
    return { response: null, error: e };
  }
};

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
