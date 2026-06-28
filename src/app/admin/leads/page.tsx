import type { Metadata } from "next";
import Link from "next/link";
import { LeadQuickActions } from "@/components/admin/LeadQuickActions";
import {
  isAdminAuthenticated,
  isAdminPasswordConfigured,
} from "@/lib/adminAuth";
import {
  getAdminLeadDashboard,
  leadPriorities,
  leadStatuses,
  type AdminLead,
  type LeadFilters,
  type LeadKpis,
} from "@/lib/adminLeads";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lead Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminLeadsPageProps = {
  searchParams: {
    status?: string;
    service?: string;
    search?: string;
    authError?: string;
    updated?: string;
    updateError?: string;
  };
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

const priorityStyles = {
  high: "bg-red-50 text-red-700 ring-red-600/20",
  medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
  low: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

const emptyKpis: LeadKpis = {
  total: 0,
  new: 0,
  contacted: 0,
  qualified: 0,
  proposal_sent: 0,
  won: 0,
  lost: 0,
  closed: 0,
};

const kpiCards: Array<{
  key: keyof LeadKpis;
  label: string;
  accent: string;
}> = [
  { key: "total", label: "Total Leads", accent: "bg-deep-navy" },
  { key: "new", label: "New", accent: "bg-blue-500" },
  { key: "contacted", label: "Contacted", accent: "bg-cyan-500" },
  { key: "qualified", label: "Qualified", accent: "bg-violet-500" },
  { key: "proposal_sent", label: "Proposal Sent", accent: "bg-amber-500" },
  { key: "won", label: "Won", accent: "bg-emerald-500" },
  { key: "lost", label: "Lost", accent: "bg-rose-500" },
  { key: "closed", label: "Closed", accent: "bg-slate-500" },
];

function formatStatus(status: string) {
  return status
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

function valueOrDash(value: string | null) {
  return value || "Not provided";
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

function isOverdueFollowUp(lead: AdminLead) {
  const followUpDate = lead.follow_up_date;

  return (
    followUpDate !== null &&
    followUpDate < getTodayInIndia() &&
    !["won", "lost", "closed"].includes(lead.crm_status)
  );
}

function buildReturnTo(filters: LeadFilters) {
  const params = new URLSearchParams();

  if (filters.status) params.set("status", filters.status);
  if (filters.service) params.set("service", filters.service);
  if (filters.search) params.set("search", filters.search);

  const query = params.toString();
  return query ? `/admin/leads?${query}` : "/admin/leads";
}

function LoginScreen({
  hasError,
  isConfigured,
}: {
  hasError: boolean;
  isConfigured: boolean;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-light-gray px-5 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-900/10 sm:p-9">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-deep-navy"
        >
          NeO<span className="text-primary-blue">Mind</span>
        </Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-primary-blue">
          Secure administration
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-charcoal">
          Lead dashboard
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Sign in with the dashboard password to review and manage contact
          inquiries.
        </p>

        {!isConfigured ? (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Set <code>ADMIN_DASHBOARD_PASSWORD</code> before using the
            dashboard.
          </div>
        ) : null}

        {hasError ? (
          <div
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            The password is incorrect. Please try again.
          </div>
        ) : null}

        <form action="/api/admin/login" method="post" className="mt-6">
          <label className="grid gap-2 text-sm font-semibold text-charcoal">
            Admin password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              disabled={!isConfigured}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-primary-blue focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </label>
          <button
            type="submit"
            disabled={!isConfigured}
            className="mt-5 w-full rounded-lg bg-primary-blue px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-deep-navy disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}

function LeadCard({
  lead,
  returnTo,
}: {
  lead: AdminLead;
  returnTo: string;
}) {
  const currentStatus = lead.crm_status;
  const isOverdue = isOverdueFollowUp(lead);

  return (
    <article
      className={`overflow-hidden rounded-xl bg-white shadow-sm ${
        isOverdue
          ? "border border-red-300 ring-2 ring-red-100"
          : "border border-slate-200"
      }`}
    >
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-bold text-charcoal">{lead.name}</h2>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                statusStyles[currentStatus] ?? statusStyles.new
              }`}
            >
              {formatStatus(currentStatus)}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${priorityStyles[lead.priority]}`}
            >
              {lead.priority} priority
            </span>
            {isOverdue ? (
              <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
                Follow-up overdue
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Received {formatDate(lead.created_at)}
          </p>
        </div>
        <LeadQuickActions email={lead.email} phone={lead.phone} />
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]">
        <div className="space-y-6">
          <dl className="grid gap-4 text-sm sm:grid-cols-2 xl:grid-cols-3">
            <div>
              <dt className="font-semibold text-slate-500">Email</dt>
              <dd className="mt-1 break-words text-charcoal">{lead.email}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Phone</dt>
              <dd className="mt-1 break-words text-charcoal">
                {valueOrDash(lead.phone)}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Company</dt>
              <dd className="mt-1 break-words text-charcoal">
                {valueOrDash(lead.company)}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Service interest</dt>
              <dd className="mt-1 break-words text-charcoal">
                {valueOrDash(lead.service_interest)}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">IP address</dt>
              <dd className="mt-1 break-words font-mono text-xs text-charcoal">
                {valueOrDash(lead.ip_address)}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Follow-up</dt>
              <dd
                className={`mt-1 break-words ${
                  isOverdue ? "font-semibold text-red-700" : "text-charcoal"
                }`}
              >
                {lead.follow_up_date ?? "Not scheduled"}
              </dd>
            </div>
          </dl>

          <div>
            <h3 className="text-sm font-semibold text-slate-500">Message</h3>
            <p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-light-gray p-4 text-sm leading-6 text-slate-700">
              {lead.message}
            </p>
          </div>
        </div>

        <form
          action="/api/admin/leads"
          method="post"
          className="rounded-lg border border-slate-200 bg-slate-50 p-4"
        >
          <input type="hidden" name="id" value={lead.id} />
          <input type="hidden" name="returnTo" value={returnTo} />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-charcoal">
              CRM status
              <select
                name="status"
                defaultValue={currentStatus}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-primary-blue focus:ring-4 focus:ring-blue-100"
              >
                {leadStatuses.map((status) => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-charcoal">
              Priority
              <select
                name="priority"
                defaultValue={lead.priority}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal capitalize outline-none focus:border-primary-blue focus:ring-4 focus:ring-blue-100"
              >
                {leadPriorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {formatStatus(priority)}
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
              defaultValue={lead.follow_up_date ?? ""}
              className={`rounded-lg border bg-white px-3 py-2.5 font-normal outline-none focus:border-primary-blue focus:ring-4 focus:ring-blue-100 ${
                isOverdue ? "border-red-400 text-red-700" : "border-slate-300"
              }`}
            />
          </label>

          <label className="mt-4 grid gap-2 text-sm font-semibold text-charcoal">
            Internal notes
            <textarea
              name="internalNotes"
              rows={5}
              maxLength={5000}
              defaultValue={lead.internal_notes ?? ""}
              placeholder="Add internal follow-up notes..."
              className="resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none placeholder:text-slate-400 focus:border-primary-blue focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-deep-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-blue"
          >
            Save changes
          </button>
        </form>
      </div>
    </article>
  );
}

export default async function AdminLeadsPage({
  searchParams,
}: AdminLeadsPageProps) {
  if (!isAdminAuthenticated()) {
    return (
      <LoginScreen
        hasError={searchParams.authError === "1"}
        isConfigured={isAdminPasswordConfigured()}
      />
    );
  }

  const filters: LeadFilters = {
    status: searchParams.status?.trim(),
    service: searchParams.service?.trim(),
    search: searchParams.search?.trim(),
  };
  const returnTo = buildReturnTo(filters);
  let leads: AdminLead[] = [];
  let serviceInterests: string[] = [];
  let kpis = emptyKpis;
  let loadError = "";

  try {
    const dashboard = await getAdminLeadDashboard(filters);
    leads = dashboard.leads;
    serviceInterests = dashboard.serviceInterests;
    kpis = dashboard.kpis;
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Unable to load lead data.";
  }

  return (
    <main className="min-h-screen bg-light-gray">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
          <div>
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-deep-navy"
            >
              NeO<span className="text-primary-blue">Mind</span>
            </Link>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Lead administration
            </p>
          </div>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-blue hover:text-primary-blue"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-blue">
              Contact inquiries
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-charcoal">
              Lead dashboard
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-500">
            {leads.length} {leads.length === 1 ? "lead" : "leads"} shown
          </p>
        </div>

        <section
          className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8"
          aria-label="Lead performance summary"
        >
          {kpiCards.map((card) => (
            <div
              key={card.key}
              className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <span
                className={`absolute inset-x-0 top-0 h-1 ${card.accent}`}
                aria-hidden="true"
              />
              <p className="text-2xl font-bold tracking-tight text-charcoal">
                {kpis[card.key]}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {card.label}
              </p>
            </div>
          ))}
        </section>

        <form
          action="/admin/leads"
          method="get"
          className="mt-7 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_1fr_1.4fr_auto]"
        >
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Status
            <select
              name="status"
              defaultValue={filters.status ?? ""}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-charcoal outline-none focus:border-primary-blue focus:ring-4 focus:ring-blue-100"
            >
              <option value="">All statuses</option>
              {leadStatuses.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Service interest
            <select
              name="service"
              defaultValue={filters.service ?? ""}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-charcoal outline-none focus:border-primary-blue focus:ring-4 focus:ring-blue-100"
            >
              <option value="">All services</option>
              {serviceInterests.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Search
            <input
              type="search"
              name="search"
              defaultValue={filters.search ?? ""}
              placeholder="Name, email, or company"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-charcoal outline-none placeholder:text-slate-400 focus:border-primary-blue focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="rounded-lg bg-primary-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-deep-navy"
            >
              Filter
            </button>
            <Link
              href="/admin/leads"
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-primary-blue hover:text-primary-blue"
            >
              Clear
            </Link>
          </div>
        </form>

        {searchParams.updated === "1" ? (
          <div
            className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            role="status"
          >
            Lead updated successfully.
          </div>
        ) : null}

        {searchParams.updateError === "1" ? (
          <div
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            The lead could not be updated. Please try again.
          </div>
        ) : null}

        {loadError ? (
          <div
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {loadError}
          </div>
        ) : null}

        {!loadError && leads.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h2 className="text-lg font-semibold text-charcoal">
              No leads found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Try changing the filters or search query.
            </p>
          </div>
        ) : null}

        <div className="mt-6 space-y-5">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} returnTo={returnTo} />
          ))}
        </div>
      </div>
    </main>
  );
}
