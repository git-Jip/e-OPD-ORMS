-- Recreates the public tables used by this revision of e-OPD.
-- Supabase Auth manages auth.users separately; this setup does not restore users or data.

begin;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

create table public.patient_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  registration_type text not null default 'new'
    check (registration_type in ('new', 'existing')),
  first_name text not null,
  middle_name text,
  last_name text not null,
  suffix text,
  contact_number text not null,
  gender text,
  date_of_birth date not null,
  address_line text not null,
  last_hospital_visit_date date,
  previous_hospital_doctor text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.patient_profiles enable row level security;

-- Public tables can inherit broad grants. Explicitly narrow browser access.
revoke all on public.profiles, public.patient_profiles from public, anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert on public.patient_profiles to authenticated;
grant all on public.profiles, public.patient_profiles to service_role;

create policy "Patients can read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Patients can create their own profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "Patients can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Patients can read their own patient details"
  on public.patient_profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Patients can create their own patient details"
  on public.patient_profiles for insert to authenticated
  with check ((select auth.uid()) = id);

commit;
