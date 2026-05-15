create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  location text,
  is_private boolean default false,
  is_admin boolean default false,
  is_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  media_url text,
  media_type text check (media_type in ('image','video')),
  thumbnail_url text,
  caption text,
  location text,
  visibility text default 'public' check (visibility in ('public','followers','private')),
  likes_count int default 0,
  comments_count int default 0,
  saves_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  media_url text,
  media_type text,
  position int default 0,
  created_at timestamptz default now()
);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.saved_posts (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

create table if not exists public.followers (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references public.profiles(id) on delete cascade,
  following_id uuid references public.profiles(id) on delete cascade,
  status text default 'accepted' check (status in ('pending','accepted','rejected')),
  created_at timestamptz default now(),
  unique(follower_id, following_id)
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  media_url text,
  media_type text,
  text_content text,
  background text,
  expires_at timestamptz default (now() + interval '24 hours'),
  created_at timestamptz default now()
);

create table if not exists public.story_views (
  id uuid primary key default gen_random_uuid(),
  story_id uuid references public.stories(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(story_id, user_id)
);

create table if not exists public.reels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  video_url text,
  cover_url text,
  caption text,
  audio_name text,
  views_count int default 0,
  likes_count int default 0,
  comments_count int default 0,
  created_at timestamptz default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_one uuid references public.profiles(id) on delete cascade,
  user_two uuid references public.profiles(id) on delete cascade,
  last_message text,
  updated_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  receiver_id uuid references public.profiles(id) on delete cascade,
  content text,
  media_url text,
  message_type text default 'text',
  is_read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  type text,
  post_id uuid,
  story_id uuid,
  message text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.hashtags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  usage_count int default 0,
  created_at timestamptz default now()
);

create table if not exists public.post_hashtags (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  hashtag_id uuid references public.hashtags(id) on delete cascade
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete cascade,
  target_type text,
  target_id uuid,
  reason text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists public.blocked_users (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid references public.profiles(id) on delete cascade,
  blocked_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(blocker_id, blocked_id)
);

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists(select 1 from public.profiles where id = auth.uid() and is_admin = true);
$$;

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.post_media enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
alter table public.saved_posts enable row level security;
alter table public.followers enable row level security;
alter table public.stories enable row level security;
alter table public.story_views enable row level security;
alter table public.reels enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.hashtags enable row level security;
alter table public.post_hashtags enable row level security;
alter table public.reports enable row level security;
alter table public.blocked_users enable row level security;

create policy "profiles_read" on public.profiles for select to authenticated using (true);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles_update_own_or_admin" on public.profiles for update to authenticated using (id = auth.uid() or public.is_admin());

create policy "posts_read_public_or_owner_or_following" on public.posts for select to authenticated using (
  visibility = 'public'
  or user_id = auth.uid()
  or public.is_admin()
  or exists(select 1 from public.followers f where f.follower_id = auth.uid() and f.following_id = posts.user_id and f.status = 'accepted')
);
create policy "posts_insert_own" on public.posts for insert to authenticated with check (user_id = auth.uid());
create policy "posts_update_own_or_admin" on public.posts for update to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "posts_delete_own_or_admin" on public.posts for delete to authenticated using (user_id = auth.uid() or public.is_admin());

create policy "ownable_insert" on public.likes for insert to authenticated with check (user_id = auth.uid());
create policy "ownable_read_likes" on public.likes for select to authenticated using (true);
create policy "ownable_delete_likes" on public.likes for delete to authenticated using (user_id = auth.uid());

create policy "comments_read" on public.comments for select to authenticated using (true);
create policy "comments_insert_own" on public.comments for insert to authenticated with check (user_id = auth.uid());
create policy "comments_delete_own_or_admin" on public.comments for delete to authenticated using (user_id = auth.uid() or public.is_admin());

create policy "saved_posts_own" on public.saved_posts for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "followers_read" on public.followers for select to authenticated using (true);
create policy "followers_manage_own" on public.followers for all to authenticated using (follower_id = auth.uid() or following_id = auth.uid()) with check (follower_id = auth.uid());

create policy "stories_read_active" on public.stories for select to authenticated using (expires_at > now());
create policy "stories_insert_own" on public.stories for insert to authenticated with check (user_id = auth.uid());
create policy "stories_delete_own_or_admin" on public.stories for delete to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "story_views_own" on public.story_views for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "reels_read" on public.reels for select to authenticated using (true);
create policy "reels_insert_own" on public.reels for insert to authenticated with check (user_id = auth.uid());
create policy "reels_delete_own_or_admin" on public.reels for delete to authenticated using (user_id = auth.uid() or public.is_admin());

create policy "conversations_participants" on public.conversations for all to authenticated using (auth.uid() in (user_one, user_two)) with check (auth.uid() in (user_one, user_two));
create policy "messages_participants" on public.messages for all to authenticated using (auth.uid() in (sender_id, receiver_id)) with check (auth.uid() in (sender_id, receiver_id));
create policy "notifications_own" on public.notifications for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "hashtags_read" on public.hashtags for select to authenticated using (true);
create policy "hashtags_insert" on public.hashtags for insert to authenticated with check (true);
create policy "post_hashtags_read" on public.post_hashtags for select to authenticated using (true);
create policy "post_hashtags_insert" on public.post_hashtags for insert to authenticated with check (true);
create policy "reports_insert_own" on public.reports for insert to authenticated with check (reporter_id = auth.uid());
create policy "reports_admin" on public.reports for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "blocked_users_own" on public.blocked_users for all to authenticated using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('avatars','avatars',true,5242880,array['image/png','image/jpeg','image/webp']),
  ('posts','posts',true,52428800,array['image/png','image/jpeg','image/webp','video/mp4']),
  ('stories','stories',true,31457280,array['image/png','image/jpeg','image/webp','video/mp4']),
  ('reels','reels',true,104857600,array['video/mp4']),
  ('messages','messages',true,31457280,array['image/png','image/jpeg','image/webp','video/mp4'])
on conflict (id) do update set public = excluded.public;

create policy "storage_public_read_social" on storage.objects for select to authenticated using (bucket_id in ('avatars','posts','stories','reels','messages'));
create policy "storage_insert_own_social" on storage.objects for insert to authenticated with check (
  bucket_id in ('avatars','posts','stories','reels','messages') and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "storage_update_own_social" on storage.objects for update to authenticated using ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin());
create policy "storage_delete_own_social" on storage.objects for delete to authenticated using ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin());

notify pgrst, 'reload schema';
