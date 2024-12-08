"use server";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "./jwtShit";
import prisma from "./prisma";
import { cookies } from "next/headers";
import { expiresin1Day } from "@/utils/client_utils";

const expires1dayTime = () => {
  var now = new Date();
  var time = now.getTime();
  return time + expiresin1Day;
};
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
    const expires = expires1dayTime();
    const session = await encrypt({ data: user, expires });

    // Save the session in a cookie
    setCookie("session", session, expires);
    return true;
  }
  return false;
}

export async function logout() {
  // Destroy the session
  setCookie("session", "", 0);
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function setCookie(key: string, value: string, expires: number) {
  cookies().set(key, value, { expires, httpOnly: true });
}

// login middle ware itself

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  if (!session) {
    if (request.nextUrl.pathname === "/login") {
      return NextResponse.next();
    }
    // redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);

    // if user is already login and trying to go to login page then just redirect to /admin page
    if (request.nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    parsed.expires = expires1dayTime();
    const res = NextResponse.next();
    res.cookies.set({
      name: "session",
      value: await encrypt(parsed),
      httpOnly: true,
      expires: parsed.expires,
    });
    return res;
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
