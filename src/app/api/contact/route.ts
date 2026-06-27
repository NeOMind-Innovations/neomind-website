import { isIP } from "node:net";
import { NextResponse } from "next/server";
import { insertContactInquiry } from "@/lib/contactInquiries";

type ContactInquiry = {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceInterest: string;
  message: string;
};

const requiredFields: Array<keyof ContactInquiry> = [
  "name",
  "email",
  "phone",
  "company",
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
  try {
    const body = (await request.json()) as Partial<ContactInquiry>;
    const inquiry: ContactInquiry = {
      name: normalizeValue(body.name),
      email: normalizeValue(body.email),
      phone: normalizeValue(body.phone),
      company: normalizeValue(body.company),
      serviceInterest: normalizeValue(body.serviceInterest),
      message: normalizeValue(body.message),
    };

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

    await insertContactInquiry({
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      company: inquiry.company,
      service_interest: inquiry.serviceInterest,
      message: inquiry.message,
      ip_address: getIpAddress(request),
      user_agent: request.headers.get("user-agent"),
    });

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
