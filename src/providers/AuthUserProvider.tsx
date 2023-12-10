"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import nookies from "nookies";
import { useQuery } from "@apollo/client";
import { FirebaseAuth } from "@/config";
import {
  initialState as authStoreInitialState,
  useAuthStore,
} from "@/store/auth";
import type { User } from "firebase/auth";
import { useTokenStore } from "@/store/token";
import { GET_PROFILE_AND_RAILWAY_TOKENS } from "@/graphql/queries";
import type { AuthState, AuthUserState } from "@/@types/auth";

export const AuthUserContext = createContext<
  AuthUserState & AuthState["state"]
>(authStoreInitialState);

type AuthUserProviderProps = {
  children: ReactNode;
};

export function AuthUserProvider({ children }: AuthUserProviderProps) {
  const { data, loading } = useQuery(GET_PROFILE_AND_RAILWAY_TOKENS);
  const { state: user, setAuthState } = useAuthStore();
  const { addToken } = useTokenStore();

  const authStateChanged = useCallback(
    async (user: User | null) => {
      try {
        if (user) {
          const token = await user?.getIdToken();

          if (data) {
            setAuthState({
              isLoggedInCheck: true,
              authenticated: true,
              token,
              data: data?.me,
            });

            addToken(data.getRailwayTokens);
          }

          if (token) {
            localStorage.setItem("firebaseToken", token);
            nookies.set(undefined, "firebaseToken", token, {
              path: "/",
            });
          }

          return;
        } else {
          setAuthState({
            isLoggedInCheck: true,
            authenticated: false,
          });
        }
      } catch (error) {
        setAuthState({
          isLoggedInCheck: true,
          authenticated: false,
        });
      }
    },
    [addToken, data, setAuthState]
  );

  // listen for Firebase state change
  useEffect(() => {
    if (loading) return;
    const unsubscribe = onAuthStateChanged(FirebaseAuth, authStateChanged);
    return () => unsubscribe();
  }, [authStateChanged, loading]);

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
      {loading && <div>Loading...</div>}
      {!loading && children}
    </AuthUserContext.Provider>
  );
}

// custom hook to use the AuthUserContext and access authUser and loading
export const useAuth = () => useContext(AuthUserContext);
