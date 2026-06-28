import "server-only";

export const leadStatuses = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
  "closed",
] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export type AdminLead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  message: string;
  status: LeadStatus | null;
  created_at: string;
  ip_address: string | null;
  notes: string | null;
};

export type LeadFilters = {
  status?: string;
  service?: string;
  search?: string;
};

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

export async function getAdminLeads(filters: LeadFilters) {
  const { baseUrl, serviceRoleKey } = getSupabaseAdminConfig();
  const params = new URLSearchParams({
    select:
      "id,name,email,phone,company,service_interest,message,status,created_at,ip_address,notes",
    order: "created_at.desc",
    limit: "250",
  });

  if (filters.status && isLeadStatus(filters.status)) {
    params.set("status", `eq.${filters.status}`);
  }

  if (filters.service) {
    params.set("service_interest", `eq.${filters.service.slice(0, 150)}`);
  }

  const search = filters.search
    ?.trim()
    .slice(0, 100)
    .replace(/[,*()]/g, " ");

  if (search) {
    params.set(
      "or",
      `(name.ilike.*${search}*,email.ilike.*${search}*,company.ilike.*${search}*)`,
    );
  }

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

  return (await response.json()) as AdminLead[];
}

export async function getLeadServiceInterests() {
  const { baseUrl, serviceRoleKey } = getSupabaseAdminConfig();
  const params = new URLSearchParams({
    select: "service_interest",
    service_interest: "not.is.null",
    order: "service_interest.asc",
    limit: "1000",
  });
  const response = await fetch(
    `${baseUrl}/rest/v1/contact_inquiries?${params.toString()}`,
    {
      headers: getAdminHeaders(serviceRoleKey),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Unable to load service filters (${response.status}).`);
  }

  const rows = (await response.json()) as Array<{
    service_interest: string | null;
  }>;

  return Array.from(
    new Set(
      rows
        .map((row) => row.service_interest?.trim())
        .filter((service): service is string => Boolean(service)),
    ),
  );
}

export async function updateAdminLead(input: {
  id: string;
  status: LeadStatus;
  notes: string;
}) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.id)) {
    throw new Error("Invalid lead identifier.");
  }

  if (!isLeadStatus(input.status)) {
    throw new Error("Invalid lead status.");
  }

  const notes = input.notes.trim().slice(0, 5000);
  const { baseUrl, serviceRoleKey } = getSupabaseAdminConfig();
  const params = new URLSearchParams({ id: `eq.${input.id}` });
  const response = await fetch(
    `${baseUrl}/rest/v1/contact_inquiries?${params.toString()}`,
    {
      method: "PATCH",
      headers: {
        ...getAdminHeaders(serviceRoleKey),
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        status: input.status,
        notes: notes || null,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Unable to update lead (${response.status}).`);
  }
}
