import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminSessionCookieName = "neomind_admin_session";
export const adminSessionMaxAge = 60 * 60 * 8;

function getAdminPassword() {
  return process.env.ADMIN_DASHBOARD_PASSWORD;
}

function safeEqual(left: string, right: string) {
  const leftDigest = createHash("sha256").update(left).digest();
  const rightDigest = createHash("sha256").update(right).digest();

  return timingSafeEqual(leftDigest, rightDigest);
}

function signSession(expiration: string, password: string) {
  return createHmac("sha256", password)
    .update(`neomind-admin:${expiration}`)
    .digest("base64url");
}

export function isAdminPasswordConfigured() {
  return Boolean(getAdminPassword());
}

export function verifyAdminPassword(candidate: string) {
  const password = getAdminPassword();

  return Boolean(password && candidate && safeEqual(candidate, password));
}

export function createAdminSessionToken() {
  const password = getAdminPassword();

  if (!password) {
    throw new Error("Admin dashboard password is not configured.");
  }

  const expiration = String(Date.now() + adminSessionMaxAge * 1000);
  return `${expiration}.${signSession(expiration, password)}`;
}

export function isValidAdminSessionToken(token: string | undefined) {
  const password = getAdminPassword();

  if (!password || !token) {
    return false;
  }

  const [expiration, signature, extra] = token.split(".");
  const expirationTime = Number(expiration);

  if (
    extra !== undefined ||
    !expiration ||
    !signature ||
    !Number.isFinite(expirationTime) ||
    expirationTime <= Date.now()
  ) {
    return false;
  }

  return safeEqual(signature, signSession(expiration, password));
}

export function isAdminAuthenticated() {
  return isValidAdminSessionToken(
    cookies().get(adminSessionCookieName)?.value,
  );
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
