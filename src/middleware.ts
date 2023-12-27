import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { apolloClient } from "./lib/gql";
import { AUTHORIZE_USER_MUTATION } from "./graphql/mutations";
import { redirectToSignUp } from "@clerk/nextjs/server";

export default authMiddleware({
  signInUrl: '/login',
  publicRoutes: ["/login"],
  async afterAuth(auth, req) {
    try {
      // Handle users who aren't authenticated
      if (!auth.userId && !auth.isPublicRoute) {
        return redirectToSignIn({ returnBackUrl: req.url });
      }

      const token = await auth.getToken();

      if (!token) {
        throw new Error('Invalid authorization token');
      }

      const { data } = await apolloClient.mutate({
        mutation: AUTHORIZE_USER_MUTATION, variables: { payload: { uid: auth.userId } }, context: {
          headers: {
            'authorization': 'Bearer ' + token,
          }
        }
      });

      if (typeof data?.authorize?.id !== 'string') {
        return redirectToSignUp({ returnBackUrl: req.url });
      }

      // If the user is logged in and trying to access a protected route, allow them to access route
      if (auth.userId && !auth.isPublicRoute) {
        return NextResponse.next()
      }

      return NextResponse.next()

    } catch (error) {
      if (['Unauthorized', 'Invalid authorization token'].includes((error as any)?.message)) {
        return redirectToSignIn({ returnBackUrl: req.url });
      }
    }
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
