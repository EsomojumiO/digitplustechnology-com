-- 0002_website_leads.sql — website leads, stored in the dp-os project
--
-- Applied 2026-10-09 to Supabase project `dp-os` (ref ipmlkygqvkelrvbdkdfu), the
-- company's internal system, so website leads sit next to clients and contacts.
-- Supersedes 0001_leads.sql, which was never applied anywhere.
--
-- Security model. The table has RLS on and NO policies, and anon/authenticated
-- have no table privileges, so nobody reads or writes it through the API. The
-- website's SERVER writes through one SECURITY DEFINER function that requires a
-- shared token. Only the token's sha256 is stored here. The token itself lives
-- in the Vercel env (LEADS_INGEST_TOKEN) and never reaches a browser. To rotate
-- it: update private.website_lead_ingest with the new hash, then the env var.
--
-- Data minimisation (NDPA). No IP address is stored. The rate limiter uses the
-- IP transiently and drops it.

create table if not exists public.website_leads (
  id               text primary key,
  kind             text not null check (kind in ('contact', 'newsletter', 'report-lead')),
  email            text,
  name             text,
  company          text,
  report_slug      text,
  marketing_opt_in boolean not null default false,
  source           text,
  page             text,
  environment      text not null default 'production',
  payload          jsonb not null,
  created_at       timestamptz not null default now()
);

comment on table public.website_leads is
  'Leads from digitplustechnology.com: contact form, newsletter sign-ups and report downloads. Written only by public.ingest_website_lead(). marketing_opt_in = the person ticked the box to receive email; only those rows may be emailed marketing.';

create index if not exists website_leads_created_at_idx on public.website_leads (created_at desc);
create index if not exists website_leads_kind_idx on public.website_leads (kind);
create index if not exists website_leads_email_idx on public.website_leads (lower(email));

alter table public.website_leads enable row level security;
revoke all on public.website_leads from anon, authenticated;

create schema if not exists private;
revoke all on schema private from anon, authenticated;

create table if not exists private.website_lead_ingest (
  token_hash text primary key,
  created_at timestamptz not null default now()
);

create or replace function public.ingest_website_lead(p_token text, p_lead jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_token is null or not exists (
    select 1 from private.website_lead_ingest
    where token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
  ) then
    raise exception 'unauthorised' using errcode = '42501';
  end if;

  if octet_length(p_lead::text) > 20000 then
    raise exception 'lead too large' using errcode = '22001';
  end if;

  insert into public.website_leads (
    id, kind, email, name, company, report_slug, marketing_opt_in,
    source, page, environment, payload, created_at
  ) values (
    p_lead->>'id',
    p_lead->>'kind',
    left(p_lead->>'email', 320),
    left(p_lead->>'name', 200),
    left(p_lead->>'company', 200),
    left(p_lead->>'report_slug', 160),
    coalesce((p_lead->>'marketing_opt_in')::boolean, false),
    left(p_lead->>'source', 60),
    left(p_lead->>'page', 300),
    coalesce(left(p_lead->>'environment', 20), 'production'),
    coalesce(p_lead->'payload', '{}'::jsonb),
    coalesce((p_lead->>'created_at')::timestamptz, now())
  )
  on conflict (id) do nothing;
end;
$$;

revoke all on function public.ingest_website_lead(text, jsonb) from public;
-- Only the server calls this, with the anon key + token. Signed-in app users
-- have no reason to, so they get no grant.
grant execute on function public.ingest_website_lead(text, jsonb) to anon;
