-- Rode este arquivo no SQL Editor do Supabase se fotos/videos ficarem carregando
-- ou se aparecer erro de bucket/policy ao enviar midia.

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
