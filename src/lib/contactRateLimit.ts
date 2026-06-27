import "server-only";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const globalRateLimit = globalThis as typeof globalThis & {
  contactRateLimit?: Map<string, RateLimitEntry>;
};

const contactRateLimit =
  globalRateLimit.contactRateLimit ?? new Map<string, RateLimitEntry>();

globalRateLimit.contactRateLimit = contactRateLimit;

export function checkContactRateLimit(ipAddress: string) {
  const now = Date.now();
  const existing = contactRateLimit.get(ipAddress);

  if (!existing || existing.resetAt <= now) {
    contactRateLimit.set(ipAddress, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });

    return { allowed: true, retryAfter: 0 };
  }

  if (existing.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}
