"use client";

import { useState } from "react";
import { Copy, Eye, Mail, Phone } from "lucide-react";

type LeadQuickActionsProps = {
  email: string;
  phone: string | null;
  onView: () => void;
};

export function LeadQuickActions({
  email,
  phone,
  onView,
}: LeadQuickActionsProps) {
  const [copied, setCopied] = useState<"email" | "phone" | null>(null);

  async function copyValue(value: string, field: "email" | "phone") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(field);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  }

  const actionClassName =
    "inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary-blue hover:text-primary-blue disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

  return (
    <div className="flex flex-wrap gap-2" aria-label="Lead quick actions">
      <button
        type="button"
        onClick={onView}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-deep-navy px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-blue"
      >
        <Eye size={14} aria-hidden="true" />
        View
      </button>
      <a href={`mailto:${email}`} className={actionClassName}>
        <Mail size={14} aria-hidden="true" />
        Email
      </a>
      <a
        href={phone ? `tel:${phone}` : undefined}
        aria-disabled={!phone}
        className={`${actionClassName} ${!phone ? "pointer-events-none bg-slate-100 text-slate-400" : ""}`}
      >
        <Phone size={14} aria-hidden="true" />
        Call
      </a>
      <button
        type="button"
        onClick={() => copyValue(email, "email")}
        className={actionClassName}
      >
        <Copy size={14} aria-hidden="true" />
        {copied === "email" ? "Email copied" : "Copy email"}
      </button>
      <button
        type="button"
        disabled={!phone}
        onClick={() => phone && copyValue(phone, "phone")}
        className={actionClassName}
      >
        <Copy size={14} aria-hidden="true" />
        {copied === "phone" ? "Phone copied" : "Copy phone"}
      </button>
    </div>
  );
}
