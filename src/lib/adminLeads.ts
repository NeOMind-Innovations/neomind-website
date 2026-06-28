import "server-only";

import type { LeadAiInsight } from "@/lib/leadAiInsights";

export const leadStatuses = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
  "closed",
] as const;

export const leadPriorities = ["high", "medium", "low"] as const;

export type LeadStatus = (typeof leadStatuses)[number];
export type LeadPriority = (typeof leadPriorities)[number];

type LeadMetadataRecord = {
  priority: LeadPriority | null;
  follow_up_date: string | null;
  assigned_to: string | null;
  crm_status: LeadStatus | null;
  internal_notes: string | null;
};

type RawAdminLead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  message: string;
  status: string | null;
  created_at: string;
  ip_address: string | null;
  lead_metadata: LeadMetadataRecord | LeadMetadataRecord[] | null;
  lead_ai_insights: LeadAiInsight | LeadAiInsight[] | null;
};

export type AdminLead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  message: string;
  inquiry_status: string | null;
  crm_status: LeadStatus;
  priority: LeadPriority;
  follow_up_date: string | null;
  assigned_to: string | null;
  internal_notes: string | null;
  created_at: string;
  ip_address: string | null;
  ai_insight: LeadAiInsight | null;
};

export type LeadFilters = {
  status?: string;
  service?: string;
  search?: string;
};

export type LeadKpis = Record<LeadStatus | "total", number>;

function getSupabaseAdminConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin access is not configured.");
  }

  return {
    baseUrl: supabaseUrl.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

function getAdminHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
}

export function isLeadStatus(value: string): value is LeadStatus {
  return leadStatuses.some((status) => status === value);
}

export function isLeadPriority(value: string): value is LeadPriority {
  return leadPriorities.some((priority) => priority === value);
}

function getLeadMetadata(
  value: RawAdminLead["lead_metadata"],
): LeadMetadataRecord | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function getLeadAiInsight(
  value: RawAdminLead["lead_ai_insights"],
): LeadAiInsight | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function normalizeLead(rawLead: RawAdminLead): AdminLead {
  const metadata = getLeadMetadata(rawLead.lead_metadata);
  const fallbackStatus =
    rawLead.status && isLeadStatus(rawLead.status) ? rawLead.status : "new";

  return {
    id: rawLead.id,
    name: rawLead.name,
    email: rawLead.email,
    phone: rawLead.phone,
    company: rawLead.company,
    service_interest: rawLead.service_interest,
    message: rawLead.message,
    inquiry_status: rawLead.status,
    crm_status:
      metadata?.crm_status && isLeadStatus(metadata.crm_status)
        ? metadata.crm_status
        : fallbackStatus,
    priority:
      metadata?.priority && isLeadPriority(metadata.priority)
        ? metadata.priority
        : "medium",
    follow_up_date: metadata?.follow_up_date ?? null,
    assigned_to: metadata?.assigned_to ?? null,
    internal_notes: metadata?.internal_notes ?? null,
    created_at: rawLead.created_at,
    ip_address: rawLead.ip_address,
    ai_insight: getLeadAiInsight(rawLead.lead_ai_insights),
  };
}

function createEmptyKpis(): LeadKpis {
  return {
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal_sent: 0,
    won: 0,
    lost: 0,
    closed: 0,
  };
}

export async function getAdminLeadDashboard(filters: LeadFilters) {
  const { baseUrl, serviceRoleKey } = getSupabaseAdminConfig();
  const params = new URLSearchParams({
    select:
      "id,name,email,phone,company,service_interest,message,status,created_at,ip_address,lead_metadata(priority,follow_up_date,assigned_to,crm_status,internal_notes),lead_ai_insights(id,inquiry_id,lead_temperature,lead_score,summary,suggested_service,estimated_value,recommended_next_step,suggested_reply,proposal_outline,generated_at,updated_at)",
    order: "created_at.desc",
    limit: "5000",
  });
  const response = await fetch(
    `${baseUrl}/rest/v1/contact_inquiries?${params.toString()}`,
    {
      headers: getAdminHeaders(serviceRoleKey),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Unable to load leads (${response.status}).`);
  }

  const allLeads = ((await response.json()) as RawAdminLead[]).map(
    normalizeLead,
  );
  const kpis = allLeads.reduce((counts, lead) => {
    counts.total += 1;
    counts[lead.crm_status] += 1;
    return counts;
  }, createEmptyKpis());
  const serviceInterests = Array.from(
    new Set(
      allLeads
        .map((lead) => lead.service_interest?.trim())
        .filter((service): service is string => Boolean(service)),
    ),
  ).sort((left, right) => left.localeCompare(right));
  const requestedStatus =
    filters.status && isLeadStatus(filters.status) ? filters.status : null;
  const requestedService = filters.service?.trim().toLocaleLowerCase();
  const search = filters.search?.trim().slice(0, 100).toLocaleLowerCase();

  const leads = allLeads.filter((lead) => {
    if (requestedStatus && lead.crm_status !== requestedStatus) {
      return false;
    }

    if (
      requestedService &&
      lead.service_interest?.toLocaleLowerCase() !== requestedService
    ) {
      return false;
    }

    if (
      search &&
      ![lead.name, lead.email, lead.company ?? ""].some((value) =>
        value.toLocaleLowerCase().includes(search),
      )
    ) {
      return false;
    }

    return true;
  });

  return { leads, kpis, serviceInterests };
}

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function normalizeFollowUpDate(value: string) {
  const date = value.trim();

  if (!date) {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Invalid follow-up date.");
  }

  const parsed = new Date(`${date}T00:00:00Z`);

  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error("Invalid follow-up date.");
  }

  return date;
}

export async function upsertLeadMetadata(input: {
  inquiryId: string;
  status: LeadStatus;
  priority: LeadPriority;
  followUpDate: string;
  internalNotes: string;
}) {
  if (!isValidUuid(input.inquiryId)) {
    throw new Error("Invalid lead identifier.");
  }

  if (!isLeadStatus(input.status)) {
    throw new Error("Invalid lead status.");
  }

  if (!isLeadPriority(input.priority)) {
    throw new Error("Invalid lead priority.");
  }

  const { baseUrl, serviceRoleKey } = getSupabaseAdminConfig();
  const params = new URLSearchParams({ on_conflict: "inquiry_id" });
  const response = await fetch(
    `${baseUrl}/rest/v1/lead_metadata?${params.toString()}`,
    {
      method: "POST",
      headers: {
        ...getAdminHeaders(serviceRoleKey),
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        inquiry_id: input.inquiryId,
        crm_status: input.status,
        priority: input.priority,
        follow_up_date: normalizeFollowUpDate(input.followUpDate),
        internal_notes: input.internalNotes.trim().slice(0, 5000) || null,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Unable to update lead metadata (${response.status}).`);
  }
}
