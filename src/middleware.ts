import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Simple auth check - if not auth page and no session, redirect to signin
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }
  
  // For all other routes, allow through (NextAuth session check happens client-side)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
