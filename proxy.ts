import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Rutas que requieren sesión. El chequeo fino de rol se hace en cada
// layout/página/Server Action con requireRole().
const isProtected = createRouteMatcher(["/admin(.*)", "/cliente(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Todas las rutas excepto estáticos y _next; incluye siempre las de API.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
