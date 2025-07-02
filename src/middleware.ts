// import { clerkMiddleware } from '@clerk/nextjs/server';
//
// export default clerkMiddleware({debug: true});
//
// export const config = {
//   matcher: [
//       "/",
//       "/dashboard(.*)",
//       "/upload(.*)",
//       "/api(.*)",
//       "/((?!sign-in|sign-up|_next|favicon.ico).*)"],
// };

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createUserIfNotExists } from "@/lib/createUserIfNotExists";


const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/upload(.*)",
   "/",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
