import { NextResponse } from "next/server";
import {
  isAdminAuthenticated,
  isSameOriginRequest,
} from "@/lib/adminAuth";
import {
  getLeadCopilotMemory,
  isCopilotAction,
  runLeadCopilotAction,
} from "@/lib/leadSalesCopilot";

export async function GET(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );
  }

  const inquiryId = new URL(request.url).searchParams.get("inquiryId");

  if (!inquiryId) {
    return NextResponse.json(
      { error: "A valid inquiryId is required." },
      { status: 400 },
    );
  }

  try {
    const memory = await getLeadCopilotMemory(inquiryId);
    return NextResponse.json({ memory });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load copilot memory.",
      },
      { status: 502 },
    );
  }
}

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

  const input =
    body && typeof body === "object"
      ? (body as {
          inquiryId?: unknown;
          action?: unknown;
          message?: unknown;
        })
      : {};

  if (
    typeof input.inquiryId !== "string" ||
    typeof input.action !== "string" ||
    !isCopilotAction(input.action) ||
    (input.message !== undefined && typeof input.message !== "string")
  ) {
    return NextResponse.json(
      { error: "A valid inquiryId and copilot action are required." },
      { status: 400 },
    );
  }

  try {
    const result = await runLeadCopilotAction({
      inquiryId: input.inquiryId,
      action: input.action,
      message: input.message,
    });
    const memory = await getLeadCopilotMemory(input.inquiryId);
    return NextResponse.json({ result, memory });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "AI Sales Copilot request failed.",
      },
      { status: 502 },
    );
  }
}
