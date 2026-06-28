import { NextResponse } from "next/server";
import {
  adminSessionCookieName,
  adminSessionMaxAge,
  createAdminSessionToken,
  isSameOriginRequest,
  verifyAdminPassword,
} from "@/lib/adminAuth";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return new NextResponse("Invalid request origin.", { status: 403 });
  }

  const formData = await request.formData();
  const password = formData.get("password");

  if (typeof password !== "string" || !verifyAdminPassword(password)) {
    return NextResponse.redirect(
      new URL("/admin/leads?authError=1", request.url),
      303,
    );
  }

  const response = NextResponse.redirect(
    new URL("/admin/leads", request.url),
    303,
  );
  response.cookies.set({
    name: adminSessionCookieName,
    value: createAdminSessionToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: adminSessionMaxAge,
  });

  return response;
}
