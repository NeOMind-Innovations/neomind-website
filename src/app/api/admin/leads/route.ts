import { NextResponse } from "next/server";
import {
  isAdminAuthenticated,
  isSameOriginRequest,
} from "@/lib/adminAuth";
import {
  isLeadPriority,
  isLeadStatus,
  upsertLeadMetadata,
} from "@/lib/adminLeads";

function getRedirectUrl(request: Request, returnTo: FormDataEntryValue | null) {
  const fallback = new URL("/admin/leads", request.url);

  if (typeof returnTo !== "string") {
    return fallback;
  }

  const candidate = new URL(returnTo, request.url);
  return candidate.origin === fallback.origin &&
    candidate.pathname === "/admin/leads"
    ? candidate
    : fallback;
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return new NextResponse("Invalid request origin.", { status: 403 });
  }

  if (!isAdminAuthenticated()) {
    return NextResponse.redirect(new URL("/admin/leads", request.url), 303);
  }

  const formData = await request.formData();
  const redirectUrl = getRedirectUrl(request, formData.get("returnTo"));
  const id = formData.get("id");
  const status = formData.get("status");
  const priority = formData.get("priority");
  const followUpDate = formData.get("followUpDate");
  const internalNotes = formData.get("internalNotes");

  if (
    typeof id !== "string" ||
    typeof status !== "string" ||
    typeof priority !== "string" ||
    typeof followUpDate !== "string" ||
    typeof internalNotes !== "string" ||
    !isLeadStatus(status) ||
    !isLeadPriority(priority)
  ) {
    redirectUrl.searchParams.set("updateError", "1");
    return NextResponse.redirect(redirectUrl, 303);
  }

  try {
    await upsertLeadMetadata({
      inquiryId: id,
      status,
      priority,
      followUpDate,
      internalNotes,
    });
    redirectUrl.searchParams.set("updated", "1");
  } catch {
    redirectUrl.searchParams.set("updateError", "1");
  }

  return NextResponse.redirect(redirectUrl, 303);
}
