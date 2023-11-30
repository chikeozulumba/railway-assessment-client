"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import nookies from "nookies";
import { onAuthStateChanged, User } from "firebase/auth";

import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import { FirebaseAuth } from "@/config";
import { AuthState, AuthUserState } from "@/@types/auth";
import { authStoreInitialState, useAuthStore } from "@/store/auth";
import { graphQLAPI } from "@/lib/api";

export const AuthUserContext = createContext<
  AuthUserState & AuthState["state"]
>(authStoreInitialState);

type AuthUserProviderProps = {
  children: ReactNode;
};

export function AuthUserProvider({ children }: AuthUserProviderProps) {
  const { state: user, setAuthState } = useAuthStore();
  const { logout } = useFirebaseAuth();

  const authStateChanged = useCallback(
    async (user: User | null) => {
      try {
        if (!user) {
          setAuthState({
            loading: false,
            isLoggedInCheck: true,
            authenticated: false,
          });
          return logout();
        }

        const token = await user.getIdToken();
        const response = await graphQLAPI(
          {
            query: `
            query {
                me {
                    id
                    fullName
                    email
                    provider
                    providerId
                    avatarUrl
                }
                }
                `,
          },
          token
        );

        const userHasProfileLoaded = typeof response.data?.me?.id === "string";

        if (!userHasProfileLoaded) return await logout();

        await setAuthState({
          loading: false,
          isLoggedInCheck: true,
          authenticated: true,
          token,
          data: response.data?.me,
        });

        localStorage.setItem("firebaseToken", token);
        nookies.set(undefined, "firebaseToken", token, {
          path: "/",
        });
        return;
      } catch (error) {
        await setAuthState({
          loading: false,
          isLoggedInCheck: true,
          authenticated: false,
        });
      }
    },
    [logout, setAuthState]
  );

  // listen for Firebase state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FirebaseAuth, authStateChanged);
    return () => unsubscribe();
  }, [authStateChanged]);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = FirebaseAuth.currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  return (
    <AuthUserContext.Provider value={user}>
      {user.loading && <div>Loading...</div>}
      {!user.loading && children}
    </AuthUserContext.Provider>
  );
}

// custom hook to use the AuthUserContext and access authUser and loading
export const useAuth = () => useContext(AuthUserContext);
