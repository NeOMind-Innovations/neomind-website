import "server-only";

export type ContactInquiryRecord = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service_interest: string;
  message: string;
  ip_address: string | null;
  user_agent: string | null;
};

export async function insertContactInquiry(inquiry: ContactInquiryRecord) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase contact storage is not configured.");
  }

  const response = await fetch(
    `${supabaseUrl.replace(/\/$/, "")}/rest/v1/contact_inquiries`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(inquiry),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase contact insert failed with ${response.status}.`);
  }
}
