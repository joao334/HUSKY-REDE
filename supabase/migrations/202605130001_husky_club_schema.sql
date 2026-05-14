begin;

create extension if not exists pgcrypto with schema public;

create sequence if not exists public.husky_order_number_seq start 1;

create table public.users_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  avatar_url text,
  birth_date date,
  neighborhood text,
  bio text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  points integer not null default 0,
  level text not null default 'Filhote Husky',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null,
  short_description text not null,
  full_description text not null,
  price numeric(10,2) not null check (price >= 0),
  promotional_price numeric(10,2),
  estimated_cost numeric(10,2),
  stock_quantity integer,
  image_url text,
  gallery jsonb default '[]'::jsonb,
  ingredients_text text,
  size text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  is_best_seller boolean not null default false,
  is_limited boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.polls (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  starts_at timestamp with time zone,
  ends_at timestamp with time zone,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now()
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text not null,
  discount_type text not null check (discount_type in ('percentage', 'fixed', 'free_shipping', 'gift')),
  discount_value numeric(10,2) not null default 0,
  starts_at timestamp with time zone,
  ends_at timestamp with time zone,
  max_uses integer,
  uses_per_customer integer,
  minimum_order_value numeric(10,2) default 0,
  product_id uuid references public.products(id) on delete set null,
  category text,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  type text not null,
  media_url text,
  product_id uuid references public.products(id) on delete set null,
  coupon_id uuid references public.coupons(id) on delete set null,
  poll_id uuid references public.polls(id) on delete set null,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  unique (post_id, user_id)
);

create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  is_visible boolean not null default true,
  is_highlighted boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.product_likes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  unique (product_id, user_id)
);

create table public.product_favorites (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  unique (product_id, user_id)
);

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  media_url text,
  button_text text,
  button_link text,
  product_id uuid references public.products(id) on delete set null,
  coupon_id uuid references public.coupons(id) on delete set null,
  starts_at timestamp with time zone,
  ends_at timestamp with time zone,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now()
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  observation text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null,
  customer_phone text not null,
  delivery_type text not null check (delivery_type in ('Entrega', 'Retirada')),
  address text,
  address_number text,
  complement text,
  neighborhood text,
  payment_method text not null check (payment_method in ('PIX', 'Dinheiro', 'Cartão na entrega', 'Link de pagamento')),
  subtotal numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status text not null default 'Aguardando aceitar',
  general_observation text,
  coupon_code text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  subtotal numeric(10,2) not null,
  observation text,
  created_at timestamp with time zone not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  can_use_as_feedback boolean not null default false,
  is_visible boolean not null default true,
  is_highlighted boolean not null default false,
  created_at timestamp with time zone not null default now()
);

create table public.coupon_uses (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  used_at timestamp with time zone not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  type text not null,
  is_read boolean not null default false,
  created_at timestamp with time zone not null default now()
);

create table public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'open',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  message text,
  image_url text,
  is_read boolean not null default false,
  created_at timestamp with time zone not null default now()
);

create table public.poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  option_text text not null,
  created_at timestamp with time zone not null default now()
);

create table public.poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  option_id uuid not null references public.poll_options(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  unique (poll_id, user_id)
);

create table public.loyalty_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  points integer not null,
  reason text not null,
  reference_type text,
  reference_id uuid,
  created_at timestamp with time zone not null default now()
);

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  unit text not null,
  current_quantity numeric(12,3) not null default 0,
  minimum_quantity numeric(12,3) not null default 0,
  unit_cost numeric(10,2),
  supplier text,
  last_purchase_date date,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.inventory_items(id) on delete cascade,
  type text not null check (type in ('entrada', 'saida')),
  quantity numeric(12,3) not null check (quantity > 0),
  reason text,
  created_at timestamp with time zone not null default now()
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  category text not null,
  amount numeric(10,2) not null check (amount >= 0),
  date date not null,
  payment_method text,
  receipt_url text,
  observation text,
  created_at timestamp with time zone not null default now()
);

create table public.product_recipes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  inventory_item_id uuid not null references public.inventory_items(id) on delete cascade,
  quantity_used numeric(12,3) not null,
  cost numeric(10,2) not null default 0,
  created_at timestamp with time zone not null default now(),
  unique (product_id, inventory_item_id)
);

create table public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.calculate_husky_level(total_points integer)
returns text
language sql
immutable
as $$
  select case
    when total_points >= 600 then 'Husky Supremo'
    when total_points >= 300 then 'Lobo da Matilha'
    when total_points >= 150 then 'Husky Fiel'
    when total_points >= 50 then 'Husky Curioso'
    else 'Filhote Husky'
  end;
$$;

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users_profiles
    where id = user_id and role = 'admin'
  );
$$;

create or replace function public.add_loyalty_points(
  target_user uuid,
  amount integer,
  reason_text text,
  ref_type text default null,
  ref_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  next_points integer;
begin
  insert into public.loyalty_history (user_id, points, reason, reference_type, reference_id)
  values (target_user, amount, reason_text, ref_type, ref_id);

  update public.users_profiles
  set
    points = greatest(0, points + amount),
    updated_at = now()
  where id = target_user
  returning points into next_points;

  update public.users_profiles
  set level = public.calculate_husky_level(next_points)
  where id = target_user;
end;
$$;

create or replace function public.set_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null then
    new.order_number = 'HC-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('public.husky_order_number_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

create or replace function public.handle_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is distinct from new.status then
    insert into public.notifications (user_id, title, content, type)
    values (
      new.user_id,
      case
        when new.status = 'Confeitando' then 'A Husky está confeitando'
        when new.status = 'Finalizado' then 'Pedido entregue com sucesso para a matilha'
        else 'Pedido atualizado'
      end,
      'Seu pedido ' || new.order_number || ' agora está: ' || new.status || '.',
      'order_status'
    );

    if new.status = 'Finalizado'
      and not exists (
        select 1 from public.loyalty_history
        where user_id = new.user_id and reference_type = 'order' and reference_id = new.id
      )
    then
      perform public.add_loyalty_points(new.user_id, floor(new.total)::integer, 'Pedido finalizado ' || new.order_number, 'order', new.id);
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.handle_review_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.add_loyalty_points(new.user_id, 5, 'Uivo da Matilha publicado', 'review', new.id);
  return new;
end;
$$;

create or replace function public.handle_comment_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  today_count integer;
begin
  select count(*) into today_count
  from public.post_comments
  where user_id = new.user_id
    and created_at >= date_trunc('day', now());

  if today_count <= 5 then
    perform public.add_loyalty_points(new.user_id, 2, 'Comentário na rede Husky', 'post_comment', new.id);
  end if;

  return new;
end;
$$;

create or replace function public.handle_chat_message()
returns trigger
language plpgsql
as $$
begin
  update public.chat_conversations
  set updated_at = now()
  where id = new.conversation_id;
  return new;
end;
$$;

create or replace function public.get_public_ranking(limit_count integer default 30)
returns table (
  id uuid,
  name text,
  avatar_url text,
  points integer,
  level text,
  created_at timestamp with time zone
)
language sql
stable
security definer
set search_path = public
as $$
  select users_profiles.id, users_profiles.name, users_profiles.avatar_url, users_profiles.points, users_profiles.level, users_profiles.created_at
  from public.users_profiles
  where role = 'customer'
  order by points desc, created_at asc
  limit limit_count;
$$;

create trigger set_users_profiles_updated_at before update on public.users_profiles for each row execute function public.set_updated_at();
create trigger set_products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger set_posts_updated_at before update on public.posts for each row execute function public.set_updated_at();
create trigger set_post_comments_updated_at before update on public.post_comments for each row execute function public.set_updated_at();
create trigger set_carts_updated_at before update on public.carts for each row execute function public.set_updated_at();
create trigger set_cart_items_updated_at before update on public.cart_items for each row execute function public.set_updated_at();
create trigger set_orders_updated_at before update on public.orders for each row execute function public.set_updated_at();
create trigger set_coupons_updated_at before update on public.coupons for each row execute function public.set_updated_at();
create trigger set_inventory_items_updated_at before update on public.inventory_items for each row execute function public.set_updated_at();
create trigger set_settings_updated_at before update on public.settings for each row execute function public.set_updated_at();

create trigger set_order_number_before_insert before insert on public.orders for each row execute function public.set_order_number();
create trigger order_status_after_update after update of status on public.orders for each row execute function public.handle_order_status_change();
create trigger review_points_after_insert after insert on public.reviews for each row execute function public.handle_review_points();
create trigger comment_points_after_insert after insert on public.post_comments for each row execute function public.handle_comment_points();
create trigger chat_message_after_insert after insert on public.chat_messages for each row execute function public.handle_chat_message();

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'users_profiles','products','posts','post_likes','post_comments','product_likes','product_favorites',
    'stories','carts','cart_items','orders','order_items','reviews','coupons','coupon_uses',
    'notifications','chat_conversations','chat_messages','polls','poll_options','poll_votes',
    'loyalty_history','inventory_items','inventory_movements','expenses','product_recipes','settings'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('create policy "%s_admin_all" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', table_name, table_name);
  end loop;
end;
$$;

create policy "profiles_select_own" on public.users_profiles for select to authenticated using (id = auth.uid());
create policy "profiles_insert_own" on public.users_profiles for insert to authenticated with check (id = auth.uid() and role = 'customer');
create policy "profiles_update_own" on public.users_profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid() and role = 'customer');

create policy "products_public_available" on public.products for select to anon, authenticated using (is_available = true);
create policy "posts_public_published" on public.posts for select to anon, authenticated using (status = 'published');
create policy "stories_public_active" on public.stories for select to anon, authenticated using (
  is_active = true
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);
create policy "coupons_public_active" on public.coupons for select to anon, authenticated using (
  is_active = true
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);
create policy "settings_public_select" on public.settings for select to anon, authenticated using (true);

create policy "post_likes_select_auth" on public.post_likes for select to authenticated using (true);
create policy "post_likes_insert_own" on public.post_likes for insert to authenticated with check (user_id = auth.uid());
create policy "post_likes_delete_own" on public.post_likes for delete to authenticated using (user_id = auth.uid());

create policy "post_comments_select_visible_or_own" on public.post_comments for select to authenticated using (is_visible = true or user_id = auth.uid());
create policy "post_comments_insert_own" on public.post_comments for insert to authenticated with check (user_id = auth.uid());
create policy "post_comments_update_own" on public.post_comments for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "post_comments_delete_own" on public.post_comments for delete to authenticated using (user_id = auth.uid());

create policy "product_likes_select_auth" on public.product_likes for select to authenticated using (true);
create policy "product_likes_insert_own" on public.product_likes for insert to authenticated with check (user_id = auth.uid());
create policy "product_likes_delete_own" on public.product_likes for delete to authenticated using (user_id = auth.uid());

create policy "product_favorites_select_own" on public.product_favorites for select to authenticated using (user_id = auth.uid());
create policy "product_favorites_insert_own" on public.product_favorites for insert to authenticated with check (user_id = auth.uid());
create policy "product_favorites_delete_own" on public.product_favorites for delete to authenticated using (user_id = auth.uid());

create policy "carts_select_own" on public.carts for select to authenticated using (user_id = auth.uid());
create policy "carts_insert_own" on public.carts for insert to authenticated with check (user_id = auth.uid());
create policy "carts_update_own" on public.carts for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "cart_items_select_own_cart" on public.cart_items for select to authenticated using (
  exists (select 1 from public.carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid())
);
create policy "cart_items_insert_own_cart" on public.cart_items for insert to authenticated with check (
  exists (select 1 from public.carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid())
);
create policy "cart_items_update_own_cart" on public.cart_items for update to authenticated using (
  exists (select 1 from public.carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid())
) with check (
  exists (select 1 from public.carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid())
);
create policy "cart_items_delete_own_cart" on public.cart_items for delete to authenticated using (
  exists (select 1 from public.carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid())
);

create policy "orders_select_own" on public.orders for select to authenticated using (user_id = auth.uid());
create policy "orders_insert_own" on public.orders for insert to authenticated with check (user_id = auth.uid());

create policy "order_items_select_own_order" on public.order_items for select to authenticated using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "order_items_insert_own_order" on public.order_items for insert to authenticated with check (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

create policy "reviews_select_visible" on public.reviews for select to anon, authenticated using (is_visible = true);
create policy "reviews_select_own" on public.reviews for select to authenticated using (user_id = auth.uid());
create policy "reviews_insert_own" on public.reviews for insert to authenticated with check (user_id = auth.uid());
create policy "reviews_update_own" on public.reviews for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "coupon_uses_select_own" on public.coupon_uses for select to authenticated using (user_id = auth.uid());
create policy "coupon_uses_insert_own" on public.coupon_uses for insert to authenticated with check (user_id = auth.uid());

create policy "notifications_select_own" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "notifications_insert_own" on public.notifications for insert to authenticated with check (user_id = auth.uid());
create policy "notifications_update_own" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "chat_conversations_select_own" on public.chat_conversations for select to authenticated using (user_id = auth.uid());
create policy "chat_conversations_insert_own" on public.chat_conversations for insert to authenticated with check (user_id = auth.uid());
create policy "chat_conversations_update_own" on public.chat_conversations for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "chat_messages_select_own_conversation" on public.chat_messages for select to authenticated using (
  exists (select 1 from public.chat_conversations where chat_conversations.id = chat_messages.conversation_id and chat_conversations.user_id = auth.uid())
);
create policy "chat_messages_insert_own_conversation" on public.chat_messages for insert to authenticated with check (
  sender_id = auth.uid()
  and exists (select 1 from public.chat_conversations where chat_conversations.id = chat_messages.conversation_id and chat_conversations.user_id = auth.uid())
);

create policy "polls_select_active" on public.polls for select to anon, authenticated using (
  is_active = true
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);
create policy "poll_options_select_active_poll" on public.poll_options for select to anon, authenticated using (
  exists (
    select 1 from public.polls
    where polls.id = poll_options.poll_id
      and polls.is_active = true
      and (polls.starts_at is null or polls.starts_at <= now())
      and (polls.ends_at is null or polls.ends_at >= now())
  )
);
create policy "poll_votes_select_auth" on public.poll_votes for select to authenticated using (true);
create policy "poll_votes_insert_own" on public.poll_votes for insert to authenticated with check (user_id = auth.uid());

create policy "loyalty_history_select_own" on public.loyalty_history for select to authenticated using (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('husky-media', 'husky-media', true)
on conflict (id) do update set public = excluded.public;

create policy "husky_media_public_select" on storage.objects for select to anon, authenticated
using (bucket_id = 'husky-media');

create policy "husky_media_authenticated_insert" on storage.objects for insert to authenticated
with check (bucket_id = 'husky-media');

create policy "husky_media_owner_or_admin_update" on storage.objects for update to authenticated
using (bucket_id = 'husky-media' and (owner = auth.uid() or public.is_admin()))
with check (bucket_id = 'husky-media' and (owner = auth.uid() or public.is_admin()));

create policy "husky_media_owner_or_admin_delete" on storage.objects for delete to authenticated
using (bucket_id = 'husky-media' and (owner = auth.uid() or public.is_admin()));

commit;
