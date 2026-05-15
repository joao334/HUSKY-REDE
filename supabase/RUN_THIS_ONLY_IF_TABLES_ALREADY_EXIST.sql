-- IMPORTANTE:
-- Se o erro foi "relation users_profiles already exists", rode SOMENTE este arquivo.
-- Nao cole junto com 202605130001_husky_club_schema.sql.
-- Este arquivo nao tem "create table public.users_profiles".

select 'Patch correto: nao recria users_profiles' as aviso;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users_profiles (
    id,
    name,
    email,
    avatar_url,
    role,
    points,
    level
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1),
      'Cliente da Matilha'
    ),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    'customer',
    0,
    'Filhote Husky'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

alter table public.posts
  add column if not exists media_type text default 'image' check (media_type in ('image', 'video'));

alter table public.stories
  add column if not exists media_type text default 'image' check (media_type in ('image', 'video')),
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_at timestamp with time zone not null default now();

drop trigger if exists set_stories_updated_at on public.stories;
create trigger set_stories_updated_at before update on public.stories for each row execute function public.set_updated_at();

create table if not exists public.post_saves (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  unique (post_id, user_id)
);

create table if not exists public.post_reposts (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  unique (post_id, user_id)
);

alter table public.post_saves enable row level security;
alter table public.post_reposts enable row level security;

drop policy if exists "posts_insert_own_customer" on public.posts;
drop policy if exists "posts_update_own_customer" on public.posts;
drop policy if exists "posts_delete_own_customer" on public.posts;
drop policy if exists "stories_insert_own_customer" on public.stories;
drop policy if exists "stories_update_own_customer" on public.stories;
drop policy if exists "stories_delete_own_customer" on public.stories;

create policy "posts_insert_own_customer" on public.posts
for insert to authenticated
with check (
  created_by = auth.uid()
  and status = 'published'
  and type = 'Post da Matilha'
);

create policy "posts_update_own_customer" on public.posts
for update to authenticated
using (created_by = auth.uid())
with check (
  created_by = auth.uid()
  and status = 'published'
  and type = 'Post da Matilha'
);

create policy "posts_delete_own_customer" on public.posts
for delete to authenticated
using (created_by = auth.uid());

create policy "stories_insert_own_customer" on public.stories
for insert to authenticated
with check (created_by = auth.uid());

create policy "stories_update_own_customer" on public.stories
for update to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

create policy "stories_delete_own_customer" on public.stories
for delete to authenticated
using (created_by = auth.uid());

drop policy if exists "post_saves_select_auth" on public.post_saves;
drop policy if exists "post_saves_insert_own" on public.post_saves;
drop policy if exists "post_saves_delete_own" on public.post_saves;
drop policy if exists "post_saves_admin_all" on public.post_saves;
drop policy if exists "post_reposts_select_auth" on public.post_reposts;
drop policy if exists "post_reposts_insert_own" on public.post_reposts;
drop policy if exists "post_reposts_delete_own" on public.post_reposts;
drop policy if exists "post_reposts_admin_all" on public.post_reposts;

create policy "post_saves_select_auth" on public.post_saves
for select to authenticated using (true);

create policy "post_saves_insert_own" on public.post_saves
for insert to authenticated with check (user_id = auth.uid());

create policy "post_saves_delete_own" on public.post_saves
for delete to authenticated using (user_id = auth.uid());

create policy "post_saves_admin_all" on public.post_saves
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "post_reposts_select_auth" on public.post_reposts
for select to authenticated using (true);

create policy "post_reposts_insert_own" on public.post_reposts
for insert to authenticated with check (user_id = auth.uid());

create policy "post_reposts_delete_own" on public.post_reposts
for delete to authenticated using (user_id = auth.uid());

create policy "post_reposts_admin_all" on public.post_reposts
for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('husky-media', 'husky-media', true)
on conflict (id) do update set public = true;

drop policy if exists "husky_media_public_select" on storage.objects;
drop policy if exists "husky_media_authenticated_insert" on storage.objects;
drop policy if exists "husky_media_owner_or_admin_update" on storage.objects;
drop policy if exists "husky_media_owner_or_admin_delete" on storage.objects;

create policy "husky_media_public_select" on storage.objects
for select to anon, authenticated
using (bucket_id = 'husky-media');

create policy "husky_media_authenticated_insert" on storage.objects
for insert to authenticated
with check (bucket_id = 'husky-media');

notify pgrst, 'reload schema';
