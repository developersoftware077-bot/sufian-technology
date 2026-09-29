-- Sufian Technology content catalogue.
-- Run once in Supabase Dashboard > SQL Editor after creating the project.
-- Public visitors can read published entries; only the owner email can manage entries.

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('video', 'book', 'update')),
  title text not null check (char_length(title) between 1 and 140),
  description text not null default '' check (char_length(description) <= 1200),
  category text not null default '' check (char_length(category) <= 80),
  youtube_id text check (youtube_id is null or youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  price text not null default '' check (char_length(price) <= 80),
  preview text not null default '' check (char_length(preview) <= 5000),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  constraint site_content_video_has_youtube_id check (kind <> 'video' or youtube_id is not null)
);

create index if not exists site_content_public_listing_idx
  on public.site_content (kind, created_at desc)
  where is_published = true;

alter table public.site_content enable row level security;

revoke all on table public.site_content from anon, authenticated;
grant select on table public.site_content to anon, authenticated;
grant insert, update, delete on table public.site_content to authenticated;

drop policy if exists "Anyone reads published content" on public.site_content;
create policy "Anyone reads published content"
  on public.site_content for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists "Owner reads all content" on public.site_content;
create policy "Owner reads all content"
  on public.site_content for select
  to authenticated
  using ((select auth.jwt() ->> 'email') = 'developersoftware077@gmail.com');

drop policy if exists "Owner adds content" on public.site_content;
create policy "Owner adds content"
  on public.site_content for insert
  to authenticated
  with check ((select auth.jwt() ->> 'email') = 'developersoftware077@gmail.com');

drop policy if exists "Owner updates content" on public.site_content;
create policy "Owner updates content"
  on public.site_content for update
  to authenticated
  using ((select auth.jwt() ->> 'email') = 'developersoftware077@gmail.com')
  with check ((select auth.jwt() ->> 'email') = 'developersoftware077@gmail.com');

drop policy if exists "Owner deletes content" on public.site_content;
create policy "Owner deletes content"
  on public.site_content for delete
  to authenticated
  using ((select auth.jwt() ->> 'email') = 'developersoftware077@gmail.com');

-- Explicit API grants are required for tables created using SQL in current projects.
grant usage on schema public to anon, authenticated;
