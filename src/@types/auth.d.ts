import { AUTH_PROVIDERS } from "@/constants";
import { User } from "./user";

export type AuthUserState = {
  loading: boolean;
  isLoggedInCheck: boolean;
  authenticated?: boolean;
  token?: string;
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
    data: null | User;
  };
  auth: {
    provider: string | null;
  };
  setAuthState: (update: Partial<AuthState["state"]>) => void;
  setAuthModeState: (update: Partial<AuthState["auth"]>) => void;
}
