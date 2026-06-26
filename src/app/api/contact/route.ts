import { NextResponse } from "next/server";

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

async function storeContactInquiry(inquiry: ContactInquiry) {
  // Placeholder persistence until an email provider or database is connected.
  console.info("NeOMind contact inquiry received", {
    ...inquiry,
    receivedAt: new Date().toISOString(),
  });
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

    await storeContactInquiry(inquiry);

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
