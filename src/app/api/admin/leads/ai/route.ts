import { NextResponse } from "next/server";
import {
  isAdminAuthenticated,
  isSameOriginRequest,
} from "@/lib/adminAuth";
import { generateAndSaveLeadInsight } from "@/lib/leadAiInsights";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  }

  if (!isAdminAuthenticated()) {
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 503 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "A valid JSON request body is required." },
      { status: 400 },
    );
  }

  const inquiryId =
    body && typeof body === "object"
      ? (body as { inquiryId?: unknown }).inquiryId
      : null;

  if (typeof inquiryId !== "string") {
    return NextResponse.json(
      { error: "A valid inquiryId is required." },
      { status: 400 },
    );
  }

  try {
    const insight = await generateAndSaveLeadInsight(inquiryId);
    return NextResponse.json({ insight });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "AI insight generation failed.";
    const status = message === "Lead not found." ? 404 : 502;

    return NextResponse.json({ error: message }, { status });
  }
}
