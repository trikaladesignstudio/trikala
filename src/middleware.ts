import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const nonPublicPages = ["/login", "/admin", "/admin/new", "/admin/:id"];
  if (nonPublicPages.includes(request.nextUrl.pathname)) {
    return await updateSession(request);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};
