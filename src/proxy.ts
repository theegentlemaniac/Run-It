// Note: In Next.js 16, `src/proxy.ts` exporting `proxy` is the renamed
// successor to the `middleware.ts` convention (the old file/function names
// are deprecated). This runs on every matched request; verified via
// `next build`/`next dev` output ("Proxy (Middleware)").
import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - image files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
