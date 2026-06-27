create extension if not exists pgcrypto;

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  phone text,
  company text,
  service_interest text,
  message text not null,
  source text default 'website',
  status text default 'new',
  ip_address inet,
  user_agent text,
  handled_at timestamptz,
  handled_by text,
  notes text
);

create index if not exists contact_inquiries_created_at_idx
  on public.contact_inquiries (created_at);

create index if not exists contact_inquiries_status_idx
  on public.contact_inquiries (status);

create index if not exists contact_inquiries_email_idx
  on public.contact_inquiries (email);

create index if not exists contact_inquiries_service_interest_idx
  on public.contact_inquiries (service_interest);

alter table public.contact_inquiries enable row level security;

revoke all on table public.contact_inquiries from anon, authenticated;
grant all on table public.contact_inquiries to service_role;

drop policy if exists "Service role has full access"
  on public.contact_inquiries;

create policy "Service role has full access"
  on public.contact_inquiries
  for all
  to service_role
  using (true)
  with check (true);
