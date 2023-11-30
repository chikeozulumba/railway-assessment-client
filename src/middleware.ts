import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parse as parseCookies } from "cookie";
import { AUTH_NAVIGATION_LINKS_PATH } from "./constants/auth";
import { NAVIGATION_LINKS_PATH } from "./constants/navigation";
import { API_URL, FirebaseAuth } from "./config";
import { graphQLAPI } from "./lib/api";

const BASE_APP_PATH = process.env.NEXT_PUBLIC_CLIENT_URL;

if (typeof API_URL !== "string" || !API_URL) {
  throw new Error(`Please supply authorization endpoint`);
}

// Set the paths that don't require the user to be signed in
const publicPaths = [
  AUTH_NAVIGATION_LINKS_PATH.Login,
  AUTH_NAVIGATION_LINKS_PATH.Register,
];

// Set the paths that don't require the user to be signed in
const authPaths = [AUTH_NAVIGATION_LINKS_PATH.Login];

const isPublicPath = (path: string) => {
  return publicPaths.find((x) =>
    path.match(new RegExp(`^${x}$`.replace("*$", "($|/)")))
  );
};

const isAuthPath = (path: string) => {
  return authPaths.find((x) =>
    path.match(new RegExp(`^${x}$`.replace("*$", "($|/)")))
  );
};

const logoutAndRedirect = async (req: NextRequest) => {
  const currentPath = new URL(req.url).pathname;
  if (authPaths.includes(currentPath as AUTH_NAVIGATION_LINKS_PATH)) {
    return NextResponse.next();
  }

  await FirebaseAuth.signOut();
  const signInUrl = new URL(AUTH_NAVIGATION_LINKS_PATH.Login, BASE_APP_PATH);
  if (!signInUrl.searchParams.get("redirect_url")) {
    signInUrl.searchParams.set("redirect_url", req.url);
  }

  return NextResponse.redirect(signInUrl);
};

const handle = async (req: NextRequest, token?: string) => {
  try {
    if (!token) return await logoutAndRedirect(req);

    const dashboardPath = new URL(NAVIGATION_LINKS_PATH.Home, BASE_APP_PATH);
    const nextLocationPathname = req.nextUrl.pathname;

    // Try and fetch user profile
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

    if (!userHasProfileLoaded) return await logoutAndRedirect(req);

    if (
      isPublicPath(nextLocationPathname) &&
      isAuthPath(nextLocationPathname)
    ) {
      if (req.url === req.nextUrl.href) {
        return NextResponse.redirect(dashboardPath);
      } else NextResponse.redirect(req.url);
    }
    return NextResponse.next();
  } catch (error) {
    return await logoutAndRedirect(req);
  }
};

const AuthMiddleware = (request: NextRequest) => {
  const cookies = request.headers.get("Cookie") ?? "";
  const token = parseCookies(cookies)["firebaseToken"] ?? undefined;

  return handle(request, token);
};

export const config = {
  matcher: "/((?!_next/image|_next/static|favicon.ico).*)",
};

export default AuthMiddleware;
