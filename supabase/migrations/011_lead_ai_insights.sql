create extension if not exists pgcrypto;

create table if not exists public.lead_ai_insights (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.contact_inquiries(id) on delete cascade,
  lead_temperature text
    check (lead_temperature in ('hot', 'warm', 'cold')),
  lead_score integer
    check (lead_score between 0 and 100),
  summary text,
  suggested_service text,
  estimated_value text,
  recommended_next_step text,
  suggested_reply text,
  proposal_outline text,
  generated_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists lead_ai_insights_inquiry_id_idx
  on public.lead_ai_insights (inquiry_id);

create index if not exists lead_ai_insights_temperature_idx
  on public.lead_ai_insights (lead_temperature);

create index if not exists lead_ai_insights_score_idx
  on public.lead_ai_insights (lead_score);

create or replace function public.set_lead_ai_insights_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_lead_ai_insights_updated_at
  on public.lead_ai_insights;

create trigger set_lead_ai_insights_updated_at
before update on public.lead_ai_insights
for each row
execute function public.set_lead_ai_insights_updated_at();

alter table public.lead_ai_insights enable row level security;

revoke all on table public.lead_ai_insights from anon, authenticated;
grant all on table public.lead_ai_insights to service_role;

drop policy if exists "Service role has full access"
  on public.lead_ai_insights;

create policy "Service role has full access"
  on public.lead_ai_insights
  for all
  to service_role
  using (true)
  with check (true);
