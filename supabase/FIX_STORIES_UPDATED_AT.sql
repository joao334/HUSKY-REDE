-- Rode este arquivo no SQL Editor do Supabase se aparecer:
-- Could not find the 'updated_at' column of 'stories' in the schema cache

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table public.stories
  add column if not exists updated_at timestamp with time zone not null default now();

drop trigger if exists set_stories_updated_at on public.stories;
create trigger set_stories_updated_at
  before update on public.stories
  for each row execute function public.set_updated_at();

notify pgrst, 'reload schema';
