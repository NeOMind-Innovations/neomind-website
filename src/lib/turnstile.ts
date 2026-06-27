import "server-only";

type TurnstileVerificationResponse = {
  success: boolean;
};

type TurnstileVerificationResult = {
  success: boolean;
  error?: string;
};

export async function verifyTurnstileToken(
  token: string,
  ipAddress: string | null,
): Promise<TurnstileVerificationResult> {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!siteKey || !secretKey) {
    if (process.env.NODE_ENV !== "production") {
      return { success: true };
    }

    return {
      success: false,
      error:
        "Security verification is unavailable. Please try again later.",
    };
  }

  if (!token) {
    return {
      success: false,
      error: "Please complete the security verification and try again.",
    };
  }

  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
  });

  if (ipAddress) {
    body.set("remoteip", ipAddress);
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        success: false,
        error:
          "Security verification could not be completed. Please try again.",
      };
    }

    const result =
      (await response.json()) as TurnstileVerificationResponse;

    return result.success
      ? { success: true }
      : {
          success: false,
          error:
            "Security verification failed. Please complete it again.",
        };
  } catch {
    return {
      success: false,
      error:
        "Security verification could not be completed. Please try again.",
    };
  }
}
