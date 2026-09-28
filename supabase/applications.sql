drop table if exists public.delegation_members;
drop table if exists public.delegation_applications;
drop table if exists public.individual_applications;
drop table if exists public.applications;

create table public.individual_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'yeni' check (status in ('yeni', 'incelendi', 'kabul', 'red')),
  full_name text not null,
  national_id text not null,
  school text not null,
  grade text not null,
  phone text not null,
  email text not null,
  motivation text not null,
  experience text not null default '',
  commission_1 text not null,
  commission_2 text not null,
  commission_3 text not null,
  commission_reason text not null,
  participation text not null,
  accept_reassignment boolean not null,
  accept_media boolean not null
);

create table public.delegation_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'yeni' check (status in ('yeni', 'incelendi', 'kabul', 'red')),
  full_name text not null,
  national_id text not null,
  school text not null,
  grade text not null,
  phone text not null,
  email text not null,
  experience text not null default '',
  motivation text not null,
  commission_1 text not null,
  commission_2 text not null,
  commission_3 text not null,
  commission_reason text not null,
  other_delegates text not null default '',
  accept_reassignment boolean not null,
  accept_media boolean not null
);

create table public.delegation_members (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.delegation_applications (id) on delete cascade,
  slot smallint not null check (slot between 1 and 5),
  full_name text not null,
  national_id text not null,
  email text not null,
  school text not null,
  grade text not null,
  experience text not null default '',
  commission_1 text not null,
  commission_2 text not null,
  commission_3 text not null,
  unique (application_id, slot)
);

create index individual_applications_created_at_idx on public.individual_applications (created_at desc);
create index delegation_applications_created_at_idx on public.delegation_applications (created_at desc);

alter table public.individual_applications enable row level security;
alter table public.delegation_applications enable row level security;
alter table public.delegation_members enable row level security;
