create table if not exists public.sng_chat_leads (
  id bigint generated always as identity primary key,
  external_id text not null unique,
  lead_type text not null default 'site_chat',
  name text,
  contact text,
  preferred_serial text,
  message text,
  reply text,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists public.sng_chat_appointments (
  id bigint generated always as identity primary key,
  external_id text not null unique,
  name text,
  contact text,
  requested_when text,
  purpose text,
  source text,
  created_at timestamptz not null default now()
);
