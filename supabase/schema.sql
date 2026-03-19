-- LocalLens (crowdsourced review) schema for Supabase Postgres
-- Run this in the Supabase SQL editor.

-- 1) Tables

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  location text not null,
  short_description text not null,
  address_line text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  quality int not null check (quality between 1 and 5),
  service int not null check (service between 1 and 5),
  value int not null check (value between 1 and 5),
  overall numeric(3,2) not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  photo_url text,
  created_at timestamptz not null default now()
);

create index if not exists reviews_business_status_created_idx
  on public.reviews (business_id, status, created_at desc);

-- 2) Profile bootstrap on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', null), 'user')
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3) Aggregation view (approved reviews only)
create or replace view public.business_ratings as
select
  b.id as business_id,
  coalesce(avg(r.overall), 0)::numeric(3,2) as average_rating,
  count(r.id)::int as rating_count,
  coalesce(avg(r.quality), 0)::numeric(3,2) as avg_quality,
  coalesce(avg(r.service), 0)::numeric(3,2) as avg_service,
  coalesce(avg(r.value), 0)::numeric(3,2) as avg_value
from public.businesses b
left join public.reviews r
  on r.business_id = b.id
 and r.status = 'approved'
group by b.id;

create or replace view public.businesses_public as
select
  b.*,
  br.average_rating,
  br.rating_count,
  br.avg_quality,
  br.avg_service,
  br.avg_value
from public.businesses b
join public.business_ratings br on br.business_id = b.id;

-- 4) RLS
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.reviews enable row level security;

-- Profiles: user can read/update own profile
drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Businesses: anyone can read; only admins can write (update/delete)
-- Note: Insert is public to allow seeding via server-side initialization
drop policy if exists "businesses public read" on public.businesses;
create policy "businesses public read"
  on public.businesses for select
  using (true);

drop policy if exists "businesses public insert" on public.businesses;
create policy "businesses public insert"
  on public.businesses for insert
  with check (true);

drop policy if exists "businesses admin update" on public.businesses;
create policy "businesses admin update"
  on public.businesses for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "businesses admin delete" on public.businesses;
create policy "businesses admin delete"
  on public.businesses for delete
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Reviews: public can only read approved; authenticated users can create pending;
-- admins can read all and update status.
drop policy if exists "reviews public read approved" on public.reviews;
create policy "reviews public read approved"
  on public.reviews for select
  using (status = 'approved');

drop policy if exists "reviews user insert" on public.reviews;
create policy "reviews user insert"
  on public.reviews for insert
  with check (auth.uid() = user_id);

drop policy if exists "reviews admin read all" on public.reviews;
create policy "reviews admin read all"
  on public.reviews for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "reviews admin update status" on public.reviews;
create policy "reviews admin update status"
  on public.reviews for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- 5) Optional storage guidance (bonus)
-- Create a bucket named "review-photos" in Supabase Storage (public or signed).
-- If you keep it private, you should use signed URLs in the app.

