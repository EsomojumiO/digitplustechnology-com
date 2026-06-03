-- 0001_leads.sql — durable lead capture for digitplustechnology.com
--
-- Run this once in your Supabase project (SQL editor, or `supabase db push`).
-- The site writes here via the REST API using the SERVICE ROLE key from the
-- server only (see src/lib/integrations/store.ts). RLS is enabled and NO public
-- policies are added, so the anon/publishable key cannot read or write leads —
-- only the service role (which bypasses RLS) can. This keeps lead data private.

create table if not exists public.leads (
  id          text primary key,
  kind        text not null check (kind in ('contact', 'newsletter', 'report-lead')),
  email       text,
  name        text,
  company     text,
  source      text,
  page        text,
  ip          text,
  payload     jsonb not null,
  created_at  timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_kind_idx on public.leads (kind);
create index if not exists leads_email_idx on public.leads (email);

-- Lock the table down: enabled RLS with no policies = service-role-only access.
alter table public.leads enable row level security;
