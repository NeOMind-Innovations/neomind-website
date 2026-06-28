create extension if not exists pgcrypto;

create table if not exists public.lead_ai_chat (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.contact_inquiries(id) on delete cascade,
  role text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists lead_ai_chat_inquiry_id_idx
  on public.lead_ai_chat (inquiry_id);

create index if not exists lead_ai_chat_inquiry_created_at_idx
  on public.lead_ai_chat (inquiry_id, created_at);

create index if not exists lead_ai_chat_role_idx
  on public.lead_ai_chat (role);

alter table public.lead_ai_chat enable row level security;

revoke all on table public.lead_ai_chat from anon, authenticated;
grant all on table public.lead_ai_chat to service_role;

drop policy if exists "Service role has full access"
  on public.lead_ai_chat;

create policy "Service role has full access"
  on public.lead_ai_chat
  for all
  to service_role
  using (true)
  with check (true);
