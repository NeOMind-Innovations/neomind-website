import { NextResponse } from "next/server";
import {
  adminSessionCookieName,
  isSameOriginRequest,
} from "@/lib/adminAuth";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return new NextResponse("Invalid request origin.", { status: 403 });
  }

  const response = NextResponse.redirect(
    new URL("/admin/leads", request.url),
    303,
  );
  response.cookies.set({
    name: adminSessionCookieName,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
