"use server";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "./jwtShit";
import prisma from "./prisma";
import { cookies } from "next/headers";

const expiresinSeconds = 10;
// 1 * 24 * 60 * 60 * 1000; // 1 day

export async function login(formData: FormData) {
  // Verify credentials && get the user
  const profile = await prisma.user.findUnique({
    where: {
      username: formData.get("email") as string,
      password: formData.get("password") as string,
    },
  });
  //   console.log("profile:", 21);

  if (profile) {
    // console.log("profile:", profile);
    // Create the session
    const user = { email: formData.get("email"), role: "admin" };

    // Create the session
    const expires = new Date(Date.now() + expiresinSeconds);
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    (await cookies()).set("session", session, { expires, httpOnly: true });
    return true;
  }
  return false;
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) {
    // redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
