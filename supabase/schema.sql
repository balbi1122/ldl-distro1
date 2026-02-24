-- =============================================================================
-- Stories for a Showgirl — Supabase Database Schema
-- Run this in the Supabase SQL editor to initialise the database.
-- =============================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- PROFILES (extends auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id                      uuid references auth.users(id) on delete cascade primary key,
  username                text unique not null,
  display_name            text not null,
  bio                     text,
  avatar_url              text,
  membership_tier         text not null default 'free'
                            check (membership_tier in ('free', 'monthly', 'annual', 'lifetime')),
  stripe_customer_id      text,
  stripe_subscription_id  text,
  subscription_end_date   timestamptz,
  is_admin                boolean not null default false,
  post_count              integer not null default 0,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- RLS: users can read all profiles, update only their own
alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- CATEGORIES
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  slug        text unique not null,
  description text,
  type        text not null check (type in ('album', 'tour', 'special')),
  color       text not null default '#c9386a',
  year_info   text,
  post_count  integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Categories are viewable by everyone"
  on public.categories for select using (true);

create policy "Only admins can modify categories"
  on public.categories for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  ));

-- ---------------------------------------------------------------------------
-- POSTS
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id            uuid default gen_random_uuid() primary key,
  author_id     uuid references public.profiles(id) on delete cascade not null,
  category_id   uuid references public.categories(id) on delete set null,
  title         text not null,
  content_type  text not null check (content_type in ('poem', 'story', 'video')),
  content       text,
  video_url     text,
  excerpt       text,
  is_approved   boolean not null default true,
  is_featured   boolean not null default false,
  view_count    integer not null default 0,
  like_count    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "Approved posts are viewable by everyone"
  on public.posts for select using (is_approved = true);

create policy "Admins can view all posts"
  on public.posts for select
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  ));

create policy "Authenticated users can insert their own posts"
  on public.posts for insert with check (auth.uid() = author_id);

create policy "Authors can update their own posts"
  on public.posts for update using (auth.uid() = author_id);

create policy "Admins can update any post"
  on public.posts for update
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  ));

create policy "Admins can delete any post"
  on public.posts for delete
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  ));

-- ---------------------------------------------------------------------------
-- POST LIKES
-- ---------------------------------------------------------------------------
create table if not exists public.post_likes (
  id          uuid default gen_random_uuid() primary key,
  post_id     uuid references public.posts(id) on delete cascade not null,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  created_at  timestamptz not null default now(),
  unique(post_id, user_id)
);

alter table public.post_likes enable row level security;

create policy "Likes are viewable by everyone"
  on public.post_likes for select using (true);

create policy "Authenticated users can like posts"
  on public.post_likes for insert with check (auth.uid() = user_id);

create policy "Users can remove their own likes"
  on public.post_likes for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- HELPER FUNCTIONS
-- ---------------------------------------------------------------------------

-- Increment view count (bypasses RLS via security definer)
create or replace function public.increment_view_count(post_id uuid)
returns void language sql security definer as $$
  update public.posts
  set view_count = view_count + 1
  where id = post_id;
$$;

-- Update post count when a user submits
create or replace function public.increment_post_count()
returns trigger language plpgsql security definer as $$
begin
  update public.profiles
  set post_count = post_count + 1,
      updated_at = now()
  where id = new.author_id;
  return new;
end;
$$;

create trigger on_post_created
  after insert on public.posts
  for each row execute procedure public.increment_post_count();

-- Decrement on delete
create or replace function public.decrement_post_count()
returns trigger language plpgsql security definer as $$
begin
  update public.profiles
  set post_count = greatest(post_count - 1, 0),
      updated_at = now()
  where id = old.author_id;
  return old;
end;
$$;

create trigger on_post_deleted
  after delete on public.posts
  for each row execute procedure public.decrement_post_count();

-- Update category post count
create or replace function public.update_category_post_count()
returns trigger language plpgsql security definer as $$
begin
  if TG_OP = 'INSERT' then
    update public.categories
    set post_count = post_count + 1
    where id = new.category_id;
  elsif TG_OP = 'DELETE' then
    update public.categories
    set post_count = greatest(post_count - 1, 0)
    where id = old.category_id;
  end if;
  return null;
end;
$$;

create trigger on_post_category_change
  after insert or delete on public.posts
  for each row execute procedure public.update_category_post_count();

-- Auto-update updated_at on profiles
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger posts_updated_at
  before update on public.posts
  for each row execute procedure public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- SEED CATEGORIES
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug, description, type, color, year_info) values
  -- Albums
  ('Taylor Swift', 'taylor-swift-album', 'Inspired by Taylor''s self-titled debut album — country roots, teen heartache, and storytelling magic.', 'album', '#2d6a4f', '2006'),
  ('Fearless', 'fearless', 'Inspired by Fearless — gold-spun love songs, dancing in the rain, and the reckless joy of first loves.', 'album', '#c8a165', '2008'),
  ('Speak Now', 'speak-now', 'Inspired by Speak Now — entirely self-written, theatrical, and full of enchanted moments.', 'album', '#7b2d8b', '2010'),
  ('Red', 'red', 'Inspired by Red — burning, all-consuming love stories that hurt so good.', 'album', '#c0392b', '2012'),
  ('1989', '1989', 'Inspired by 1989 — synth-pop dreams, New York nights, and shaking off the past.', 'album', '#5ba4cf', '2014'),
  ('reputation', 'reputation', 'Inspired by reputation — dark, defiant, and reborn from the ashes of public persona.', 'album', '#2c2c2c', '2017'),
  ('Lover', 'lover', 'Inspired by Lover — pastel-soft, joyful, and bursting with rainbow love.', 'album', '#f06292', '2019'),
  ('folklore', 'folklore', 'Inspired by folklore — indie-folk imagination, lost loves, and storytelling from the woods.', 'album', '#78909c', '2020'),
  ('evermore', 'evermore', 'Inspired by evermore — the companion sister album, autumn leaves, and bittersweet epiphanies.', 'album', '#a0522d', '2020'),
  ('Midnights', 'midnights', 'Inspired by Midnights — sleepless introspection, glitter and ghosts at 3am.', 'album', '#1a237e', '2022'),
  ('The Tortured Poets Department', 'tortured-poets-department', 'Inspired by TTPD — raw grief, poetic fury, and the ache of loving the wrong person.', 'album', '#616161', '2024'),
  -- Tours
  ('Taylor Swift Tour', 'taylor-swift-tour', 'Inspired by Taylor''s debut headline tour.', 'tour', '#2d6a4f', '2007–2008'),
  ('Fearless Tour', 'fearless-tour', 'Inspired by the Fearless Tour — sparkles, curls, and fairy-tale magic.', 'tour', '#c8a165', '2009–2010'),
  ('Speak Now World Tour', 'speak-now-tour', 'Inspired by the Speak Now World Tour — purple gowns and enchanted forests.', 'tour', '#7b2d8b', '2011–2012'),
  ('The Red Tour', 'red-tour', 'Inspired by The Red Tour — stadium spectacle and all-the-feels emotion.', 'tour', '#c0392b', '2013–2014'),
  ('The 1989 World Tour', '1989-tour', 'Inspired by The 1989 World Tour — pop perfection and surprise guest after surprise guest.', 'tour', '#5ba4cf', '2015'),
  ('reputation Stadium Tour', 'reputation-tour', 'Inspired by the reputation Stadium Tour — serpents, screens, and the phoenix rising.', 'tour', '#2c2c2c', '2018'),
  ('The Eras Tour', 'eras-tour', 'Inspired by The Eras Tour — a journey through every chapter of Taylor''s musical history.', 'tour', '#d4af37', '2023–2024'),
  -- Special
  ('The Late Show Story', 'late-show-story', 'Content inspired by the story concept Taylor Swift described on The Late Show with Stephen Colbert — a tale about a young woman finding her voice. Share your imaginings of how this story could unfold.', 'special', '#6c3483', 'Special')
on conflict (slug) do nothing;
