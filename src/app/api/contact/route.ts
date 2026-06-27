import { isIP } from "node:net";
import { NextResponse } from "next/server";
import { sendContactInquiryEmails } from "@/lib/contactEmails";
import { insertContactInquiry } from "@/lib/contactInquiries";
import { checkContactRateLimit } from "@/lib/contactRateLimit";
import { verifyTurnstileToken } from "@/lib/turnstile";

type ContactInquiry = {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceInterest: string;
  message: string;
};

type ContactRequest = ContactInquiry & {
  turnstileToken: string;
};

const requiredFields: Array<keyof ContactInquiry> = [
  "name",
  "email",
  "serviceInterest",
  "message",
];

function normalizeValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getIpAddress(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const candidate =
    forwardedFor?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    request.headers.get("cf-connecting-ip")?.trim();

  return candidate && isIP(candidate) ? candidate : null;
}

export async function POST(request: Request) {
  const ipAddress = getIpAddress(request);
  const rateLimit = checkContactRateLimit(ipAddress ?? "unknown");

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error:
          "Too many inquiries were submitted. Please wait before trying again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": rateLimit.retryAfter.toString(),
        },
      },
    );
  }

  try {
    const body = (await request.json()) as Partial<ContactRequest>;
    const inquiry: ContactInquiry = {
      name: normalizeValue(body.name),
      email: normalizeValue(body.email),
      phone: normalizeValue(body.phone),
      company: normalizeValue(body.company),
      serviceInterest: normalizeValue(body.serviceInterest),
      message: normalizeValue(body.message),
    };
    const turnstileToken = normalizeValue(body.turnstileToken);

    const missingFields = requiredFields.filter((field) => !inquiry[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Please complete all required fields.",
          fields: missingFields,
        },
        { status: 400 },
      );
    }

    if (!isValidEmail(inquiry.email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address.", fields: ["email"] },
        { status: 400 },
      );
    }

    const turnstileVerification = await verifyTurnstileToken(
      turnstileToken,
      ipAddress,
    );

    if (!turnstileVerification.success) {
      return NextResponse.json(
        {
          error:
            turnstileVerification.error ??
            "Security verification failed. Please try again.",
        },
        { status: 400 },
      );
    }

    await insertContactInquiry({
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      company: inquiry.company,
      service_interest: inquiry.serviceInterest,
      message: inquiry.message,
      ip_address: ipAddress,
      user_agent: request.headers.get("user-agent"),
    });

    try {
      await sendContactInquiryEmails(inquiry);
    } catch {
      console.error(
        "Contact inquiry was saved, but one or more email notifications failed.",
      );
    }

    return NextResponse.json({
      message: "Your inquiry has been received. NeOMind will follow up soon.",
    });
  } catch {
    return NextResponse.json(
      { error: "We could not submit your inquiry. Please try again." },
      { status: 500 },
    );
  }
}
