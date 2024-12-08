import { NextRequest } from "next/server";
import { updateSession } from "./lib/auth";

export async function middleware(request: NextRequest) {
  // console.log(request.nextUrl.pathname);
  return await updateSession(request);
}

export const config = {
  matcher: ["/login", "/admin", "/admin/new", "/admin/:id"],
};
