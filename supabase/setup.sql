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
  author text not null default '' check (char_length(author) <= 140),
  isbn text not null default '' check (char_length(isbn) <= 32),
  format text not null default 'print' check (format in ('print', 'digital', 'both')),
  language text not null default 'English' check (char_length(language) <= 40),
  price_amount numeric(12,2) check (price_amount is null or price_amount >= 0),
  currency text not null default 'TZS' check (currency ~ '^[A-Z]{3}$'),
  stock integer check (stock is null or stock >= 0),
  cover_url text not null default '' check (char_length(cover_url) <= 1000),
  preview text not null default '' check (char_length(preview) <= 5000),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  constraint site_content_video_has_youtube_id check (kind <> 'video' or youtube_id is not null)
);

-- Keep this setup safe to run again when the original catalogue table already exists.
alter table public.site_content add column if not exists author text not null default '' check (char_length(author) <= 140);
alter table public.site_content add column if not exists isbn text not null default '' check (char_length(isbn) <= 32);
alter table public.site_content add column if not exists format text not null default 'print' check (format in ('print', 'digital', 'both'));
alter table public.site_content add column if not exists language text not null default 'English' check (char_length(language) <= 40);
alter table public.site_content add column if not exists price_amount numeric(12,2) check (price_amount is null or price_amount >= 0);
alter table public.site_content add column if not exists currency text not null default 'TZS' check (currency ~ '^[A-Z]{3}$');
alter table public.site_content add column if not exists stock integer check (stock is null or stock >= 0);
alter table public.site_content add column if not exists cover_url text not null default '' check (char_length(cover_url) <= 1000);

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

-- Publicly readable cover images; only the owner account can upload or remove them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('book-covers', 'book-covers', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Owner uploads book covers" on storage.objects;
create policy "Owner uploads book covers"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'book-covers'
    and (select auth.jwt() ->> 'email') = 'developersoftware077@gmail.com'
  );

drop policy if exists "Owner removes book covers" on storage.objects;
create policy "Owner removes book covers"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'book-covers'
    and (select auth.jwt() ->> 'email') = 'developersoftware077@gmail.com'
  );

drop policy if exists "Owner lists book covers" on storage.objects;
create policy "Owner lists book covers"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'book-covers'
    and (select auth.jwt() ->> 'email') = 'developersoftware077@gmail.com'
  );
