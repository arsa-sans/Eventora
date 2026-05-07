-- ============================================
-- EVENTORA — Full Database Schema (Enhanced)
-- ============================================

-- 1. Profiles Table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  last_payment_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Themes Table
create table if not exists public.themes (
  id text primary key, -- e.g. 'emerald-garden'
  name text not null,
  category text not null,
  is_premium boolean default false,
  price numeric default 0,
  preview_image_url text,
  css_variables jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Invitations Table (Enhanced)
create table if not exists public.invitations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  slug text unique not null,
  title text not null default 'Undangan Saya',
  event_type text not null default 'wedding',
  status text default 'draft', -- 'draft', 'active', 'expired'
  is_premium boolean default false,
  theme_id text not null default 'emerald-garden',
  activated_at timestamp with time zone,

  -- Couple / Host info
  groom_name text,
  bride_name text,
  host_name text,
  groom_father text,
  groom_mother text,
  bride_father text,
  bride_mother text,
  groom_photo text,
  bride_photo text,
  cover_photo text,

  -- Event details (JSON array for multi-event support)
  events jsonb default '[]'::jsonb,
  -- Legacy single event fields
  event_date timestamp with time zone,
  event_time text,
  event_location text,
  event_map_url text,

  -- Content
  message text,
  love_story jsonb default '[]'::jsonb,
  gallery_images text[] default '{}',
  bank_accounts jsonb default '[]'::jsonb,

  -- Features
  music_url text,
  streaming_url text,
  custom_font text,
  custom_colors jsonb,
  auto_scroll boolean default false,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. RSVPs Table
create table if not exists public.rsvps (
  id uuid default gen_random_uuid() primary key,
  invitation_id uuid references public.invitations(id) on delete cascade not null,
  guest_name text not null,
  attendance text not null, -- 'yes', 'no', 'maybe'
  message text,
  pax integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Transactions Table (Enhanced for Mayar.id)
create table if not exists public.transactions (
  id text primary key, -- Mayar transaction ID
  user_id uuid references public.profiles(id) on delete cascade not null,
  invitation_id uuid references public.invitations(id) on delete set null,
  amount numeric not null default 0,
  status text default 'pending', -- 'pending', 'paid', 'failed', 'expired'
  payment_provider text default 'mayar',
  customer_email text,
  customer_name text,
  paid_at timestamp with time zone,
  raw_payload jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.themes enable row level security;
alter table public.invitations enable row level security;
alter table public.rsvps enable row level security;
alter table public.transactions enable row level security;

-- ============================================
-- POLICIES
-- ============================================

-- Profiles
create policy "Users can view their own profiles."
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update their own profiles."
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile."
  on public.profiles for insert with check (auth.uid() = id);

-- Themes (public read)
create policy "Public themes are viewable by everyone."
  on public.themes for select using (true);

-- Invitations
create policy "Users can manage their own invitations."
  on public.invitations for all using (auth.uid() = user_id);

create policy "Public can view active invitations."
  on public.invitations for select using (status = 'active');

-- RSVPs
create policy "Anyone can insert rsvps."
  on public.rsvps for insert with check (true);

create policy "Anyone can view rsvps for active invitations."
  on public.rsvps for select using (
    exists (
      select 1 from public.invitations
      where id = invitation_id and (status = 'active' or user_id = auth.uid())
    )
  );

-- Transactions
create policy "Users can view their own transactions."
  on public.transactions for select using (auth.uid() = user_id);

-- ============================================
-- TRIGGER: Auto-create profile on signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if exists, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- STORAGE: Create bucket for invitation images
-- ============================================
-- Run this in Supabase SQL Editor separately:
insert into storage.buckets (id, name, public) values ('invitation-images', 'invitation-images', true);

create policy "Anyone can view invitation images"
  on storage.objects for select using (bucket_id = 'invitation-images');

create policy "Authenticated users can upload invitation images"
  on storage.objects for insert with check (bucket_id = 'invitation-images' and auth.role() = 'authenticated');

create policy "Users can update their own images"
  on storage.objects for update using (bucket_id = 'invitation-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own images"
  on storage.objects for delete using (bucket_id = 'invitation-images' and auth.uid()::text = (storage.foldername(name))[1]);
