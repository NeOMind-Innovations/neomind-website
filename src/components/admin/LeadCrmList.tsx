"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarClock, X } from "lucide-react";
import { LeadQuickActions } from "@/components/admin/LeadQuickActions";
import { LeadSalesCopilot } from "@/components/admin/LeadSalesCopilot";

type LeadAiInsight = {
  id: string;
  inquiry_id: string;
  lead_temperature: "hot" | "warm" | "cold";
  lead_score: number;
  summary: string;
  suggested_service: string;
  estimated_value: string;
  recommended_next_step: string;
  suggested_reply: string;
  proposal_outline: string;
  generated_at: string;
  updated_at: string;
};

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  message: string;
  crm_status: string;
  priority: string;
  follow_up_date: string | null;
  assigned_to: string | null;
  internal_notes: string | null;
  created_at: string;
  ip_address: string | null;
  ai_insight: LeadAiInsight | null;
};

type LeadCrmListProps = {
  leads: Lead[];
  returnTo: string;
  statuses: readonly string[];
  priorities: readonly string[];
};

const statusStyles: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-600/20",
  contacted: "bg-cyan-50 text-cyan-700 ring-cyan-600/20",
  qualified: "bg-violet-50 text-violet-700 ring-violet-600/20",
  proposal_sent: "bg-amber-50 text-amber-700 ring-amber-600/20",
  won: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  lost: "bg-rose-50 text-rose-700 ring-rose-600/20",
  closed: "bg-slate-100 text-slate-700 ring-slate-600/20",
};

const priorityStyles: Record<string, string> = {
  high: "bg-red-50 text-red-700 ring-red-600/20",
  medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
  low: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

const serviceIcons: Record<string, string> = {
  "AI Solutions": "🤖",
  "Custom Software Development": "💻",
  "Mobile App Development": "📱",
  "SaaS Product Development": "☁️",
  "AI Helpdesk Solutions": "🎧",
  "Business Automation": "⚙️",
  "Cloud Applications": "☁️",
  "Digital Transformation": "🚀",
};

function formatLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function formatRelativeAge(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 1000),
  );

  if (elapsedSeconds < 60) {
    return "Just now";
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} ${elapsedMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);

  if (elapsedHours < 24) {
    return `${elapsedHours} ${elapsedHours === 1 ? "hour" : "hours"} ago`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);

  if (elapsedDays === 1) {
    return "Yesterday";
  }

  return `${elapsedDays} days ago`;
}

function formatFollowUpDate(value: string | null) {
  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

function getTodayInIndia() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function isOverdueFollowUp(lead: Lead) {
  return (
    lead.follow_up_date !== null &&
    lead.follow_up_date < getTodayInIndia() &&
    !["won", "lost", "closed"].includes(lead.crm_status)
  );
}

function displayValue(value: string | null) {
  return value || "Not provided";
}

function getPriorityLabel(priority: string) {
  if (priority === "high") return "🔥 Hot";
  if (priority === "low") return "Low Priority";
  return "Medium Priority";
}

function getServiceIcon(service: string | null) {
  return (service && serviceIcons[service]) || "💼";
}

export function LeadCrmList({
  leads,
  returnTo,
  statuses,
  priorities,
}: LeadCrmListProps) {
  const [leadItems, setLeadItems] = useState(leads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  function openLead(lead: Lead) {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setSelectedLead(lead);
  }

  function closeLead() {
    setSelectedLead(null);
  }

  function handleInsightUpdated(insight: LeadAiInsight) {
    setLeadItems((current) =>
      current.map((lead) =>
        lead.id === insight.inquiry_id
          ? { ...lead, ai_insight: insight }
          : lead,
      ),
    );
    setSelectedLead((current) =>
      current ? { ...current, ai_insight: insight } : current,
    );
  }

  useEffect(() => {
    setLeadItems(leads);
  }, [leads]);

  useEffect(() => {
    if (!selectedLead) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedLead(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [selectedLead]);

  return (
    <>
      <div className="space-y-4">
        {leadItems.map((lead) => {
          const isOverdue = isOverdueFollowUp(lead);

          return (
            <article
              key={lead.id}
              className={`relative overflow-hidden rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-slate-900 ${
                isOverdue
                  ? "border border-red-300 ring-2 ring-red-100"
                  : "border border-slate-200 dark:border-slate-800"
              }`}
            >
              <button
                type="button"
                onClick={() => openLead(lead)}
                className="absolute inset-0 z-0 cursor-pointer rounded-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                aria-label={`View ${lead.name}`}
              />
              <div className="pointer-events-none relative z-10">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-lg font-bold text-charcoal dark:text-white">
                      {lead.name}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                        statusStyles[lead.crm_status] ?? statusStyles.new
                      }`}
                    >
                      {formatLabel(lead.crm_status)}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${
                        priorityStyles[lead.priority] ?? priorityStyles.medium
                      }`}
                    >
                      {getPriorityLabel(lead.priority)}
                    </span>
                    {isOverdue ? (
                      <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
                        Follow-up overdue
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-xs font-medium text-slate-500">
                    <span suppressHydrationWarning>
                      {formatRelativeAge(lead.created_at)}
                    </span>
                    {" · "}
                    {formatDate(lead.created_at)}
                  </p>
                </div>

                <LeadQuickActions
                  email={lead.email}
                  phone={lead.phone}
                  onView={() => openLead(lead)}
                />
                </div>

                <dl className="mt-5 grid gap-x-6 gap-y-3 border-y border-slate-100 py-4 text-sm dark:border-slate-800 sm:grid-cols-2 xl:grid-cols-5">
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Email
                  </dt>
                  <dd className="mt-1 truncate text-slate-700 dark:text-slate-200" title={lead.email}>
                    {lead.email}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Phone
                  </dt>
                  <dd className="mt-1 truncate text-slate-700 dark:text-slate-200">
                    {displayValue(lead.phone)}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Company
                  </dt>
                  <dd className="mt-1 truncate text-slate-700 dark:text-slate-200">
                    {displayValue(lead.company)}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Service
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5 truncate text-slate-700 dark:text-slate-200">
                    <span aria-hidden="true">
                      {getServiceIcon(lead.service_interest)}
                    </span>
                    {displayValue(lead.service_interest)}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Follow-up
                  </dt>
                  <dd
                    className={`mt-1 flex items-center gap-1.5 truncate ${
                      isOverdue
                        ? "font-semibold text-red-700"
                        : "text-slate-700"
                    }`}
                  >
                    <CalendarClock size={14} aria-hidden="true" />
                    {formatFollowUpDate(lead.follow_up_date)}
                  </dd>
                </div>
                </dl>

                <p className="mt-4 line-clamp-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {lead.message}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {selectedLead ? (
        <div
          className="fixed inset-0 z-[100] flex justify-end bg-slate-950/45 backdrop-blur-[2px]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeLead();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-drawer-title"
            className="flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl dark:bg-slate-950"
          >
            <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-7">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-blue">
                  Lead details
                </p>
                <h2
                  id="lead-drawer-title"
                  className="mt-1 truncate text-2xl font-bold tracking-tight text-charcoal dark:text-white"
                >
                  {selectedLead.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  <span suppressHydrationWarning>
                    {formatRelativeAge(selectedLead.created_at)}
                  </span>
                  {" · "}
                  {formatDate(selectedLead.created_at)}
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeLead}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-charcoal"
                aria-label="Close lead details"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                    statusStyles[selectedLead.crm_status] ?? statusStyles.new
                  }`}
                >
                  {formatLabel(selectedLead.crm_status)}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${
                    priorityStyles[selectedLead.priority] ??
                    priorityStyles.medium
                  }`}
                >
                  {getPriorityLabel(selectedLead.priority)}
                </span>
              </div>

              <section className="mt-6">
                <h3 className="text-sm font-bold text-charcoal">
                  Inquiry details
                </h3>
                <dl className="mt-3 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-slate-500">Email</dt>
                    <dd className="mt-1 break-words text-charcoal">
                      {selectedLead.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">Phone</dt>
                    <dd className="mt-1 break-words text-charcoal">
                      {displayValue(selectedLead.phone)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">Company</dt>
                    <dd className="mt-1 break-words text-charcoal">
                      {displayValue(selectedLead.company)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">
                      Service interest
                    </dt>
                    <dd className="mt-1 flex items-center gap-1.5 break-words text-charcoal">
                      <span aria-hidden="true">
                        {getServiceIcon(selectedLead.service_interest)}
                      </span>
                      {displayValue(selectedLead.service_interest)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">IP address</dt>
                    <dd className="mt-1 break-words font-mono text-xs text-charcoal">
                      {displayValue(selectedLead.ip_address)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">
                      Assigned to
                    </dt>
                    <dd className="mt-1 break-words text-charcoal">
                      {displayValue(selectedLead.assigned_to)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-slate-500">
                    Full message
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                    {selectedLead.message}
                  </p>
                </div>
              </section>

              <LeadSalesCopilot
                lead={selectedLead}
                onInsightUpdated={handleInsightUpdated}
              />

              <form
                key={selectedLead.id}
                action="/api/admin/leads"
                method="post"
                className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5"
              >
                <input type="hidden" name="id" value={selectedLead.id} />
                <input type="hidden" name="returnTo" value={returnTo} />

                <h3 className="text-sm font-bold text-charcoal">
                  CRM management
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-charcoal">
                    CRM status
                    <select
                      name="status"
                      defaultValue={selectedLead.crm_status}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-primary-blue focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {formatLabel(status)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-charcoal">
                    Priority
                    <select
                      name="priority"
                      defaultValue={selectedLead.priority}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-primary-blue focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {formatLabel(priority)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="mt-4 grid gap-2 text-sm font-semibold text-charcoal">
                  Follow-up date
                  <input
                    type="date"
                    name="followUpDate"
                    defaultValue={selectedLead.follow_up_date ?? ""}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-primary-blue focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </label>

                <label className="mt-4 grid gap-2 text-sm font-semibold text-charcoal">
                  Internal notes
                  <textarea
                    name="internalNotes"
                    rows={6}
                    maxLength={5000}
                    defaultValue={selectedLead.internal_notes ?? ""}
                    placeholder="Add internal follow-up notes..."
                    className="resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none placeholder:text-slate-400 focus:border-primary-blue focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-5 w-full rounded-lg bg-deep-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-blue"
                >
                  Save changes
                </button>
              </form>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
