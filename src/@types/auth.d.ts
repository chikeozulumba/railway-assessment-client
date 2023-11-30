import { AUTH_PROVIDERS } from "@/constants";
import type { User } from "firebase/auth";

export type AuthUserState = {
  loading: boolean;
  isLoggedInCheck: boolean;
  authenticated?: boolean;
  token?: string;
};

export type AuthUser = {
  uid: string;
  email?: string;
  name?: string;
  avatar?: string;
  token?: string;
  authenticated?: boolean;
};

export type AuthUserProfile = {
  avatar?: string;
  countryId: string | null;
  createdAt: string;
  email: string;
  emailVerifiedAt: string | null;
  firstName: string | null;
  flagged: boolean;
  id: string;
  lastName: string | null;
  name: string;
  phoneNumber: string | null;
  provider: string;
  rating: number;
  reported: boolean;
  status: "active" | "inactive" | "suspended" | "deleted";
  uid: string;
  updatedAt: string;
  username: string;
};

export type AuthorizeUserRequest = {
  uid: string;
  email: string;
  name: string | null;
  avatar: string | null;
  provider: string;
};

export type SignUpWithSocialAccountProvider =
  | AUTH_PROVIDERS.Facebook
  | AUTH_PROVIDERS.Google
  | AUTH_PROVIDERS.Github;


export interface AuthState {
  state: {
    loading: boolean;
    isLoggedInCheck: boolean;
    authenticated: boolean;
    token: string | undefined;
    data: null,
  };
  setAuthState: (update: Partial<AuthState["state"]>) => void;
}