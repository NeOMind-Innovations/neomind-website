create extension if not exists pgcrypto;

create table if not exists public.lead_metadata (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.contact_inquiries(id) on delete cascade,
  priority text not null default 'medium'
    check (priority in ('high', 'medium', 'low')),
  follow_up_date date,
  assigned_to text,
  crm_status text not null default 'new'
    check (
      crm_status in (
        'new',
        'contacted',
        'qualified',
        'proposal_sent',
        'won',
        'lost',
        'closed'
      )
    ),
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists lead_metadata_inquiry_id_idx
  on public.lead_metadata (inquiry_id);

create index if not exists lead_metadata_crm_status_idx
  on public.lead_metadata (crm_status);

create index if not exists lead_metadata_priority_idx
  on public.lead_metadata (priority);

create index if not exists lead_metadata_follow_up_date_idx
  on public.lead_metadata (follow_up_date);

create or replace function public.set_lead_metadata_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_lead_metadata_updated_at
  on public.lead_metadata;

create trigger set_lead_metadata_updated_at
before update on public.lead_metadata
for each row
execute function public.set_lead_metadata_updated_at();

alter table public.lead_metadata enable row level security;

revoke all on table public.lead_metadata from anon, authenticated;
grant all on table public.lead_metadata to service_role;

drop policy if exists "Service role has full access"
  on public.lead_metadata;

create policy "Service role has full access"
  on public.lead_metadata
  for all
  to service_role
  using (true)
  with check (true);
