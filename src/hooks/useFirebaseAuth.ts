import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import nookies from "nookies";
import { AUTH_NAVIGATION_LINKS_PATH } from "@/constants";
import { FirebaseAuth } from "@/config";
import { useAuthStore } from "@/store/auth";

export default function useFirebaseAuth(redirect = true) {
  const { state: user, setAuthState } = useAuthStore();
  const router = useRouter();
  const search = useSearchParams();

  const logout = useCallback(async () => {
    await setAuthState({
      loading: false,
      isLoggedInCheck: false,
      authenticated: false,
      token: undefined,
    });

    localStorage.removeItem("firebaseToken");
    nookies.destroy(undefined, "firebaseToken");

    await FirebaseAuth.signOut();

    const redirectUrl = search.get("redirect_url");
    return (
      redirect && router.push(AUTH_NAVIGATION_LINKS_PATH.Login + (redirectUrl ? '?redirect_url=' + redirectUrl : ''))
    );
  }, [redirect, router, search, setAuthState]);

  return { logout };
}
