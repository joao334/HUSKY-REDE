import type {
  AnyRecord,
  CartItem,
  ChatConversation,
  ChatMessage,
  CheckoutInput,
  Coupon,
  CrudTable,
  DashboardMetrics,
  Expense,
  InventoryItem,
  LoyaltyHistory,
  Notification,
  Order,
  OrderItem,
  OrderStatus,
  Poll,
  Post,
  PostComment,
  Product,
  Profile,
  Review,
  Setting,
  Story,
} from '../types/domain';
import {
  demoAdminProfile,
  demoConversations,
  demoCoupons,
  demoExpenses,
  demoInventory,
  demoLoyaltyHistory,
  demoMessages,
  demoMetrics,
  demoNotifications,
  demoOrders,
  demoPolls,
  demoPosts,
  demoProducts,
  demoProfile,
  demoReviews,
  demoStories,
} from './demoData';
import { getSupabase, isSupabaseConfigured, normalizeError, supabase } from './supabase';
import { getLoyaltyLevel } from '../utils/loyalty';
import { demoStorageVersion, huskyBrand } from '../config/huskyBrand';

type CouponValidation = {
  coupon: Coupon | null;
  discount: number;
  freeShipping: boolean;
  message: string;
};

const demoTables: Record<string, unknown[]> = {
  products: demoProducts,
  posts: demoPosts,
  stories: demoStories,
  coupons: demoCoupons,
  orders: demoOrders,
  inventory_items: demoInventory,
  expenses: demoExpenses,
  polls: demoPolls,
  users_profiles: [demoProfile, demoAdminProfile],
  post_comments: [],
  reviews: demoReviews,
  notifications: demoNotifications,
  loyalty_history: demoLoyaltyHistory,
  chat_conversations: demoConversations,
  chat_messages: demoMessages,
  settings: [
    {
      id: 'setting-brand',
      key: 'brand',
      value: {
        name: huskyBrand.displayName,
        store_name: huskyBrand.storeName,
        city: huskyBrand.city,
        state: huskyBrand.state,
        whatsapp: huskyBrand.whatsapp,
        instagram: `@${huskyBrand.instagramHandle}`,
        instagram_url: huskyBrand.instagramUrl,
        address: 'Embu das Artes - SP',
        working_hours: 'Terça a quinta 14h-21h; sexta 14h-22h; sábado 12h-22h; domingo 12h-20h',
        opening_hours: huskyBrand.openingHours,
        announcement: huskyBrand.announcement,
        delivery_fee: huskyBrand.deliveryFee,
        free_delivery_from: huskyBrand.freeDeliveryFrom,
        minimum_order: huskyBrand.minOrder,
        delivery_time: huskyBrand.deliveryTime,
        pickup_time: huskyBrand.pickupTime,
        orders_enabled: true,
        payment_provider: huskyBrand.paymentProvider,
        infinitepay_handle: huskyBrand.infinitePayHandle,
        checkout_function: huskyBrand.checkoutFunction,
        check_function: huskyBrand.checkFunction,
        payment_return_url: huskyBrand.paymentReturnUrl,
        primary_color: '#3b6da6',
        logo_url: huskyBrand.assets.logo,
        mascot_url: huskyBrand.assets.mascot,
        hero_url: huskyBrand.assets.hero,
        chat_emojis: huskyBrand.chatEmojis,
        chat_stickers: huskyBrand.chatStickers,
        service_area: huskyBrand.serviceArea,
      },
      updated_at: new Date().toISOString(),
    },
  ],
  product_recipes: [],
};

function makeId(prefix = 'id') {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function ensureDemoSeedVersion() {
  if (typeof localStorage === 'undefined') return;
  const versionKey = 'husky-demo-version';
  if (localStorage.getItem(versionKey) === demoStorageVersion) return;
  Object.keys(localStorage)
    .filter((key) => key.startsWith('husky-demo-') || key === 'husky-current-profile')
    .forEach((key) => localStorage.removeItem(key));
  localStorage.setItem(versionKey, demoStorageVersion);
}

function readDemo<T>(table: string): T[] {
  ensureDemoSeedVersion();
  const storageKey = `husky-demo-${table}`;
  const stored = localStorage.getItem(storageKey);
  if (stored) return JSON.parse(stored) as T[];
  const value = (demoTables[table] ?? []) as T[];
  localStorage.setItem(storageKey, JSON.stringify(value));
  return value;
}

function writeDemo<T>(table: string, rows: T[]) {
  localStorage.setItem(`husky-demo-${table}`, JSON.stringify(rows));
}

function assertData<T>(data: T | null, error: unknown): T {
  if (error) throw new Error(normalizeError(error));
  if (data === null) throw new Error('Ops! A Husky não encontrou esse item.');
  return data;
}

function normalizeProduct(row: unknown): Product {
  const product = row as Product;
  return {
    ...product,
    price: Number(product.price ?? 0),
    promotional_price: product.promotional_price === null ? null : Number(product.promotional_price ?? 0),
    estimated_cost: product.estimated_cost === null ? null : Number(product.estimated_cost ?? 0),
    stock_quantity: product.stock_quantity === null ? null : Number(product.stock_quantity ?? 0),
  };
}

function normalizeOrder(row: unknown): Order {
  const order = row as Order;
  return {
    ...order,
    subtotal: Number(order.subtotal ?? 0),
    discount: Number(order.discount ?? 0),
    delivery_fee: Number(order.delivery_fee ?? 0),
    total: Number(order.total ?? 0),
  };
}

async function getPostCounts(ids: string[]) {
  if (!ids.length) return { likes: new Map<string, number>(), comments: new Map<string, number>() };
  const client = getSupabase();
  const [{ data: likes }, { data: comments }] = await Promise.all([
    client.from('post_likes').select('post_id').in('post_id', ids),
    client.from('post_comments').select('post_id').eq('is_visible', true).in('post_id', ids),
  ]);

  const likeMap = new Map<string, number>();
  const commentMap = new Map<string, number>();
  likes?.forEach((like: { post_id: string }) => likeMap.set(like.post_id, (likeMap.get(like.post_id) ?? 0) + 1));
  comments?.forEach((comment: { post_id: string }) =>
    commentMap.set(comment.post_id, (commentMap.get(comment.post_id) ?? 0) + 1),
  );
  return { likes: likeMap, comments: commentMap };
}

export const dataService = {
  isDemoMode() {
    return !isSupabaseConfigured;
  },

  async uploadMedia(file: File, folder = 'uploads') {
    if (!isSupabaseConfigured) {
      return URL.createObjectURL(file);
    }

    const client = getSupabase();
    const extension = file.name.split('.').pop() || 'png';
    const path = `${folder}/${makeId('media')}.${extension}`;
    const { error } = await client.storage.from('husky-media').upload(path, file, {
      upsert: false,
      cacheControl: '3600',
    });
    if (error) throw new Error(normalizeError(error));
    const { data } = client.storage.from('husky-media').getPublicUrl(path);
    return data.publicUrl;
  },

  async getSettings() {
    if (!isSupabaseConfigured) return readDemo<Setting>('settings');
    const { data, error } = await getSupabase().from('settings').select('*').order('key');
    return assertData<Setting[]>(data as Setting[] | null, error);
  },

  async getBrandSettings() {
    const settings = await this.getSettings();
    return settings.find((setting) => setting.key === 'brand')?.value as AnyRecord | undefined;
  },

  async getProducts(filters?: {
    category?: string;
    favoritesOnly?: boolean;
    availableOnly?: boolean;
    featuredOnly?: boolean;
    bestSellerOnly?: boolean;
    userId?: string;
  }) {
    if (!isSupabaseConfigured) {
      let products = readDemo<Product>('products').map(normalizeProduct);
      if (filters?.category && filters.category !== 'Todos') {
        products = products.filter((product) => product.category === filters.category);
      }
      if (filters?.availableOnly) products = products.filter((product) => product.is_available);
      if (filters?.featuredOnly) products = products.filter((product) => product.is_featured);
      if (filters?.bestSellerOnly) products = products.filter((product) => product.is_best_seller);
      return products;
    }

    let query = getSupabase().from('products').select('*').order('created_at', { ascending: false });
    if (filters?.category && filters.category !== 'Todos') query = query.eq('category', filters.category);
    if (filters?.availableOnly) query = query.eq('is_available', true);
    if (filters?.featuredOnly) query = query.eq('is_featured', true);
    if (filters?.bestSellerOnly) query = query.eq('is_best_seller', true);
    const { data, error } = await query;
    const products = assertData<Product[]>(data as Product[] | null, error).map(normalizeProduct);

    if (filters?.favoritesOnly && filters.userId) {
      const { data: favorites, error: favError } = await getSupabase()
        .from('product_favorites')
        .select('product_id')
        .eq('user_id', filters.userId);
      if (favError) throw new Error(normalizeError(favError));
      const favoriteIds = new Set((favorites ?? []).map((item: { product_id: string }) => item.product_id));
      return products.filter((product) => favoriteIds.has(product.id));
    }

    return products;
  },

  async getProductBySlug(slug: string, userId?: string) {
    if (!isSupabaseConfigured) {
      const product = readDemo<Product>('products')
        .map(normalizeProduct)
        .find((item) => item.slug === slug);
      if (!product) throw new Error('Esse pote sumiu da matilha.');
      return product;
    }

    const { data, error } = await getSupabase().from('products').select('*').eq('slug', slug).single();
    const product = normalizeProduct(assertData<Product>(data as Product | null, error));
    if (userId) {
      const [{ data: favorite }, { data: liked }, { data: likes }] = await Promise.all([
        getSupabase()
          .from('product_favorites')
          .select('id')
          .eq('product_id', product.id)
          .eq('user_id', userId)
          .maybeSingle(),
        getSupabase().from('product_likes').select('id').eq('product_id', product.id).eq('user_id', userId).maybeSingle(),
        getSupabase().from('product_likes').select('id').eq('product_id', product.id),
      ]);
      product.is_favorite = Boolean(favorite);
      product.is_liked = Boolean(liked);
      product.likes_count = likes?.length ?? 0;
    }
    return product;
  },

  async getPosts(userId?: string) {
    if (!isSupabaseConfigured) return readDemo<Post>('posts');

    const { data, error } = await getSupabase()
      .from('posts')
      .select('*, product:products(*)')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    const posts = assertData<Post[]>(data as Post[] | null, error);
    const ids = posts.map((post) => post.id);
    const counts = await getPostCounts(ids);

    let likedIds = new Set<string>();
    if (userId && ids.length) {
      const { data: likes, error: likesError } = await getSupabase()
        .from('post_likes')
        .select('post_id')
        .eq('user_id', userId)
        .in('post_id', ids);
      if (likesError) throw new Error(normalizeError(likesError));
      likedIds = new Set((likes ?? []).map((like: { post_id: string }) => like.post_id));
    }

    return posts.map((post) => ({
      ...post,
      product: post.product ? normalizeProduct(post.product) : null,
      likes_count: counts.likes.get(post.id) ?? 0,
      comments_count: counts.comments.get(post.id) ?? 0,
      is_liked: likedIds.has(post.id),
    }));
  },

  async getPostComments(postId: string) {
    if (!isSupabaseConfigured) {
      return readDemo<PostComment>('post_comments').filter((comment) => comment.post_id === postId && comment.is_visible);
    }

    const { data, error } = await getSupabase()
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .eq('is_visible', true)
      .order('created_at', { ascending: true });
    const comments = assertData<PostComment[]>(data as PostComment[] | null, error);
    const userIds = [...new Set(comments.map((comment) => comment.user_id))];
    if (!userIds.length) return comments;
    const { data: profiles } = await getSupabase().from('users_profiles').select('id,name,avatar_url').in('id', userIds);
    const profileMap = new Map(
      (profiles ?? []).map((profile: Pick<Profile, 'id' | 'name' | 'avatar_url'>) => [profile.id, profile]),
    );
    return comments.map((comment) => ({ ...comment, profile: profileMap.get(comment.user_id) ?? null }));
  },

  async addPostComment(postId: string, userId: string, content: string) {
    const payload = {
      id: makeId('comment'),
      post_id: postId,
      user_id: userId,
      content,
      is_visible: true,
      is_highlighted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (!isSupabaseConfigured) {
      const comments = readDemo<PostComment>('post_comments');
      writeDemo('post_comments', [...comments, payload]);
      return payload;
    }

    const { data, error } = await getSupabase().from('post_comments').insert(payload).select('*').single();
    return assertData<PostComment>(data as PostComment | null, error);
  },

  async togglePostLike(postId: string, userId: string) {
    if (!isSupabaseConfigured) return true;
    const client = getSupabase();
    const { data: existing, error } = await client
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new Error(normalizeError(error));
    if (existing) {
      const { error: deleteError } = await client.from('post_likes').delete().eq('id', existing.id);
      if (deleteError) throw new Error(normalizeError(deleteError));
      return false;
    }
    const { error: insertError } = await client.from('post_likes').insert({ post_id: postId, user_id: userId });
    if (insertError) throw new Error(normalizeError(insertError));
    return true;
  },

  async toggleProductLike(productId: string, userId: string) {
    if (!isSupabaseConfigured) return true;
    const client = getSupabase();
    const { data: existing, error } = await client
      .from('product_likes')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new Error(normalizeError(error));
    if (existing) {
      const { error: deleteError } = await client.from('product_likes').delete().eq('id', existing.id);
      if (deleteError) throw new Error(normalizeError(deleteError));
      return false;
    }
    const { error: insertError } = await client.from('product_likes').insert({ product_id: productId, user_id: userId });
    if (insertError) throw new Error(normalizeError(insertError));
    return true;
  },

  async toggleProductFavorite(productId: string, userId: string) {
    if (!isSupabaseConfigured) return true;
    const client = getSupabase();
    const { data: existing, error } = await client
      .from('product_favorites')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new Error(normalizeError(error));
    if (existing) {
      const { error: deleteError } = await client.from('product_favorites').delete().eq('id', existing.id);
      if (deleteError) throw new Error(normalizeError(deleteError));
      return false;
    }
    const { error: insertError } = await client
      .from('product_favorites')
      .insert({ product_id: productId, user_id: userId });
    if (insertError) throw new Error(normalizeError(insertError));
    return true;
  },

  async getProductReviews(productId?: string) {
    if (!isSupabaseConfigured) {
      const reviews = readDemo<Review>('reviews');
      return productId ? reviews.filter((review) => review.product_id === productId) : reviews;
    }

    let query = getSupabase()
      .from('reviews')
      .select('*, product:products(*)')
      .eq('is_visible', true)
      .order('created_at', { ascending: false });
    if (productId) query = query.eq('product_id', productId);
    const { data, error } = await query;
    return assertData<Review[]>(data as Review[] | null, error);
  },

  async createReview(payload: Partial<Review>) {
    if (!isSupabaseConfigured) {
      const review = {
        id: makeId('review'),
        created_at: new Date().toISOString(),
        is_visible: true,
        is_highlighted: false,
        can_use_as_feedback: false,
        ...payload,
      } as Review;
      const rows = readDemo<Review>('reviews');
      writeDemo('reviews', [review, ...rows]);
      return review;
    }

    const { data, error } = await getSupabase().from('reviews').insert(payload).select('*').single();
    return assertData<Review>(data as Review | null, error);
  },

  async getStories() {
    if (!isSupabaseConfigured) return readDemo<Story>('stories');
    const now = new Date().toISOString();
    const { data, error } = await getSupabase()
      .from('stories')
      .select('*')
      .eq('is_active', true)
      .lte('starts_at', now)
      .gte('ends_at', now)
      .order('created_at', { ascending: false });
    return assertData<Story[]>(data as Story[] | null, error);
  },

  async getCoupons() {
    if (!isSupabaseConfigured) return readDemo<Coupon>('coupons');
    const { data, error } = await getSupabase()
      .from('coupons')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return assertData<Coupon[]>(data as Coupon[] | null, error);
  },

  async validateCoupon(
    code: string,
    subtotal: number,
    userId?: string,
    items: CartItem[] = [],
    deliveryFee = 0,
  ): Promise<CouponValidation> {
    const cleanCode = code.trim().toUpperCase();
    const coupons = await this.getCoupons();
    const coupon = coupons.find((item) => item.code.toUpperCase() === cleanCode) ?? null;
    if (!coupon) return { coupon: null, discount: 0, freeShipping: false, message: 'Cupom não encontrado.' };
    const nowMs = Date.now();
    if (coupon.starts_at && new Date(coupon.starts_at).getTime() > nowMs) {
      return { coupon: null, discount: 0, freeShipping: false, message: 'Esse cupom ainda não começou.' };
    }
    if (coupon.ends_at && new Date(coupon.ends_at).getTime() < nowMs) {
      return { coupon: null, discount: 0, freeShipping: false, message: 'Esse cupom expirou.' };
    }
    if (coupon.minimum_order_value && subtotal < Number(coupon.minimum_order_value)) {
      return {
        coupon: null,
        discount: 0,
        freeShipping: false,
        message: `Pedido mínimo de R$${Number(coupon.minimum_order_value).toFixed(2).replace('.', ',')}.`,
      };
    }
    if (coupon.product_id && !items.some((item) => item.product_id === coupon.product_id)) {
      return { coupon: null, discount: 0, freeShipping: false, message: 'Cupom válido para outro produto.' };
    }
    if (coupon.category && !items.some((item) => item.product.category === coupon.category)) {
      return { coupon: null, discount: 0, freeShipping: false, message: 'Cupom válido para outra categoria.' };
    }

    if (isSupabaseConfigured && userId) {
      const client = getSupabase();
      const [{ count: totalUses }, { count: userUses }] = await Promise.all([
        client.from('coupon_uses').select('id', { count: 'exact', head: true }).eq('coupon_id', coupon.id),
        client
          .from('coupon_uses')
          .select('id', { count: 'exact', head: true })
          .eq('coupon_id', coupon.id)
          .eq('user_id', userId),
      ]);
      if (coupon.max_uses && Number(totalUses ?? 0) >= coupon.max_uses) {
        return { coupon: null, discount: 0, freeShipping: false, message: 'Cupom já atingiu o limite de uso.' };
      }
      if (coupon.uses_per_customer && Number(userUses ?? 0) >= coupon.uses_per_customer) {
        return { coupon: null, discount: 0, freeShipping: false, message: 'Você já usou esse cupom.' };
      }
    }

    if (coupon.discount_type === 'percentage') {
      return {
        coupon,
        discount: Math.min(subtotal, subtotal * (Number(coupon.discount_value) / 100)),
        freeShipping: false,
        message: 'Cupom aplicado. A matilha aprovou.',
      };
    }
    if (coupon.discount_type === 'fixed') {
      return {
        coupon,
        discount: Math.min(subtotal, Number(coupon.discount_value)),
        freeShipping: false,
        message: 'Cupom aplicado. A matilha aprovou.',
      };
    }
    if (coupon.discount_type === 'free_shipping') {
      return {
        coupon,
        discount: deliveryFee,
        freeShipping: true,
        message: 'Frete grátis liberado.',
      };
    }
    return { coupon, discount: 0, freeShipping: false, message: 'Brinde liberado para esse pedido.' };
  },

  async getCart(userId: string) {
    if (!isSupabaseConfigured) return readDemo<CartItem>(`cart-${userId}`);
    const client = getSupabase();
    let { data: cart, error } = await client.from('carts').select('*').eq('user_id', userId).maybeSingle();
    if (error) throw new Error(normalizeError(error));
    if (!cart) {
      const inserted = await client.from('carts').insert({ user_id: userId }).select('*').single();
      cart = assertData(inserted.data, inserted.error);
    }
    const { data, error: itemsError } = await client
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('cart_id', cart.id)
      .order('created_at', { ascending: true });
    const rows = assertData<Array<CartItem & { product: Product }>>(data as Array<CartItem & { product: Product }> | null, itemsError);
    return rows.map((row) => ({ ...row, product: normalizeProduct(row.product) }));
  },

  async saveDemoCart(userId: string, items: CartItem[]) {
    writeDemo(`cart-${userId}`, items);
  },

  async addCartItem(userId: string, product: Product, quantity = 1, observation?: string | null) {
    if (!isSupabaseConfigured) {
      const items = readDemo<CartItem>(`cart-${userId}`);
      const existing = items.find((item) => item.product_id === product.id && item.observation === (observation ?? null));
      const next = existing
        ? items.map((item) => (item.id === existing.id ? { ...item, quantity: item.quantity + quantity } : item))
        : [
            ...items,
            {
              id: makeId('cart-item'),
              product_id: product.id,
              product,
              quantity,
              observation: observation ?? null,
            },
          ];
      writeDemo(`cart-${userId}`, next);
      return next;
    }

    const client = getSupabase();
    const cart = await client.from('carts').select('*').eq('user_id', userId).maybeSingle();
    let cartId = cart.data?.id;
    if (!cartId) {
      const inserted = await client.from('carts').insert({ user_id: userId }).select('id').single();
      cartId = assertData(inserted.data as { id: string } | null, inserted.error).id;
    }
    const { data: existing, error } = await client
      .from('cart_items')
      .select('*')
      .eq('cart_id', cartId)
      .eq('product_id', product.id)
      .eq('observation', observation ?? '')
      .maybeSingle();
    if (error) throw new Error(normalizeError(error));
    if (existing) {
      const { error: updateError } = await client
        .from('cart_items')
        .update({ quantity: Number(existing.quantity) + quantity })
        .eq('id', existing.id);
      if (updateError) throw new Error(normalizeError(updateError));
    } else {
      const { error: insertError } = await client.from('cart_items').insert({
        cart_id: cartId,
        product_id: product.id,
        quantity,
        observation: observation ?? null,
      });
      if (insertError) throw new Error(normalizeError(insertError));
    }
    return this.getCart(userId);
  },

  async updateCartItem(userId: string, itemId: string, quantity: number) {
    if (!isSupabaseConfigured) {
      const items = readDemo<CartItem>(`cart-${userId}`)
        .map((item) => (item.id === itemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0);
      writeDemo(`cart-${userId}`, items);
      return items;
    }
    const client = getSupabase();
    if (quantity <= 0) {
      const { error } = await client.from('cart_items').delete().eq('id', itemId);
      if (error) throw new Error(normalizeError(error));
    } else {
      const { error } = await client.from('cart_items').update({ quantity }).eq('id', itemId);
      if (error) throw new Error(normalizeError(error));
    }
    return this.getCart(userId);
  },

  async removeCartItem(userId: string, itemId: string) {
    return this.updateCartItem(userId, itemId, 0);
  },

  async clearCart(userId: string) {
    if (!isSupabaseConfigured) {
      writeDemo(`cart-${userId}`, []);
      return;
    }
    const client = getSupabase();
    const { data: cart } = await client.from('carts').select('id').eq('user_id', userId).maybeSingle();
    if (cart?.id) {
      const { error } = await client.from('cart_items').delete().eq('cart_id', cart.id);
      if (error) throw new Error(normalizeError(error));
    }
  },

  async createOrder(input: CheckoutInput) {
    const subtotal = input.items.reduce(
      (sum, item) => sum + Number(item.product.promotional_price ?? item.product.price) * item.quantity,
      0,
    );
    const couponValidation = input.coupon_code
      ? await this.validateCoupon(input.coupon_code, subtotal, input.user_id, input.items, input.delivery_fee)
      : { coupon: null, discount: 0, freeShipping: false, message: '' };
    const deliveryFee = couponValidation.freeShipping ? 0 : input.delivery_fee;
    const total = Math.max(0, subtotal - couponValidation.discount + deliveryFee);
    const orderPayload = {
      user_id: input.user_id,
      customer_name: input.customer_name,
      customer_phone: input.customer_phone,
      delivery_type: input.delivery_type,
      address: input.address || null,
      address_number: input.address_number || null,
      complement: input.complement || null,
      neighborhood: input.neighborhood || null,
      payment_method: input.payment_method,
      subtotal,
      discount: couponValidation.discount,
      delivery_fee: deliveryFee,
      total,
      status: 'Aguardando aceitar' as OrderStatus,
      general_observation: input.general_observation || null,
      coupon_code: couponValidation.coupon?.code ?? null,
    };

    if (!isSupabaseConfigured) {
      const order: Order = {
        id: makeId('order'),
        order_number: `HC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Date.now()).slice(-4)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...orderPayload,
        items: input.items.map<OrderItem>((item) => ({
          id: makeId('order-item'),
          order_id: 'demo-order',
          product_id: item.product_id,
          product_name: item.product.name,
          quantity: item.quantity,
          unit_price: Number(item.product.promotional_price ?? item.product.price),
          subtotal: Number(item.product.promotional_price ?? item.product.price) * item.quantity,
          observation: item.observation,
          created_at: new Date().toISOString(),
        })),
      };
      const rows = readDemo<Order>('orders');
      writeDemo('orders', [order, ...rows]);
      await this.clearCart(input.user_id);
      return order;
    }

    const client = getSupabase();
    const { data: orderData, error } = await client.from('orders').insert(orderPayload).select('*').single();
    const order = normalizeOrder(assertData<Order>(orderData as Order | null, error));
    const itemPayloads = input.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product.name,
      quantity: item.quantity,
      unit_price: Number(item.product.promotional_price ?? item.product.price),
      subtotal: Number(item.product.promotional_price ?? item.product.price) * item.quantity,
      observation: item.observation,
    }));
    const { data: items, error: itemsError } = await client.from('order_items').insert(itemPayloads).select('*');
    const createdItems = assertData<OrderItem[]>(items as OrderItem[] | null, itemsError);

    if (couponValidation.coupon) {
      await client.from('coupon_uses').insert({
        coupon_id: couponValidation.coupon.id,
        user_id: input.user_id,
        order_id: order.id,
      });
    }

    await Promise.all(
      input.items.map(async (item) => {
        if (item.product.stock_quantity === null) return;
        await client
          .from('products')
          .update({ stock_quantity: Math.max(0, Number(item.product.stock_quantity) - item.quantity) })
          .eq('id', item.product_id);
      }),
    );

    await client.from('notifications').insert({
      user_id: input.user_id,
      title: 'Au au! Seu pedido foi recebido pela Husky.',
      content: `Pedido ${order.order_number} recebido. Vamos avisar cada passo.`,
      type: 'order_created',
    });

    try {
      await client.rpc('add_loyalty_points', {
        target_user: input.user_id,
        amount: Math.floor(total),
        reason_text: `Pedido recebido ${order.order_number}`,
        ref_type: 'order',
        ref_id: order.id,
      });
    } catch {
      await client
        .from('users_profiles')
        .update({ points: Math.floor(total), level: getLoyaltyLevel(Math.floor(total)).name })
        .eq('id', input.user_id);
    }

    const { data: admins } = await client.from('users_profiles').select('id').eq('role', 'admin');
    if (admins?.length) {
      await client.from('notifications').insert(
        admins.map((admin: { id: string }) => ({
          user_id: admin.id,
          title: 'Novo pedido da matilha',
          content: `${input.customer_name} fez o pedido ${order.order_number}.`,
          type: 'admin_order',
        })),
      );
    }

    await this.clearCart(input.user_id);
    return { ...order, items: createdItems };
  },

  async getOrders(userId?: string) {
    if (!isSupabaseConfigured) {
      const orders = readDemo<Order>('orders').map(normalizeOrder);
      return userId ? orders.filter((order) => order.user_id === userId) : orders;
    }
    let query = getSupabase()
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false });
    if (userId) query = query.eq('user_id', userId);
    const { data, error } = await query;
    return assertData<Order[]>(data as Order[] | null, error).map(normalizeOrder);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    if (!isSupabaseConfigured) {
      const rows = readDemo<Order>('orders');
      const next = rows.map((order) => (order.id === orderId ? { ...order, status, updated_at: new Date().toISOString() } : order));
      writeDemo('orders', next);
      return next.find((order) => order.id === orderId)!;
    }
    const { data, error } = await getSupabase()
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select('*')
      .single();
    return assertData<Order>(data as Order | null, error);
  },

  async getProfile(userId: string) {
    if (!isSupabaseConfigured) {
      const rows = readDemo<Profile>('users_profiles');
      return rows.find((profile) => profile.id === userId) ?? demoProfile;
    }
    const { data, error } = await getSupabase().from('users_profiles').select('*').eq('id', userId).single();
    return assertData<Profile>(data as Profile | null, error);
  },

  async updateProfile(userId: string, values: Partial<Profile>) {
    if (!isSupabaseConfigured) {
      const rows = readDemo<Profile>('users_profiles');
      const next = rows.map((profile) =>
        profile.id === userId ? { ...profile, ...values, updated_at: new Date().toISOString() } : profile,
      );
      writeDemo('users_profiles', next);
      return next.find((profile) => profile.id === userId)!;
    }
    const { data, error } = await getSupabase()
      .from('users_profiles')
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select('*')
      .single();
    return assertData<Profile>(data as Profile | null, error);
  },

  async getRanking() {
    if (!isSupabaseConfigured) {
      return [
        demoProfile,
        { ...demoProfile, id: 'rank-2', name: 'Ana da Matilha', points: 322, level: 'Lobo da Matilha' },
        { ...demoProfile, id: 'rank-3', name: 'Bruno Fiel', points: 244, level: 'Husky Fiel' },
        { ...demoProfile, id: 'rank-4', name: 'Carol Crocante', points: 198, level: 'Husky Fiel' },
      ].sort((a, b) => b.points - a.points);
    }
    const { data, error } = await getSupabase().rpc('get_public_ranking', { limit_count: 30 });
    const rows = assertData<Partial<Profile>[]>(data as Partial<Profile>[] | null, error);
    return rows.map((row) => ({
      id: row.id!,
      name: row.name ?? 'Cliente da Matilha',
      email: '',
      phone: null,
      avatar_url: row.avatar_url ?? null,
      birth_date: null,
      neighborhood: null,
      bio: null,
      role: 'customer',
      points: Number(row.points ?? 0),
      level: row.level ?? 'Filhote Husky',
      created_at: row.created_at ?? new Date().toISOString(),
      updated_at: null,
    })) satisfies Profile[];
  },

  async getLoyaltyHistory(userId: string) {
    if (!isSupabaseConfigured) return readDemo<LoyaltyHistory>('loyalty_history');
    const { data, error } = await getSupabase()
      .from('loyalty_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return assertData<LoyaltyHistory[]>(data as LoyaltyHistory[] | null, error);
  },

  async getNotifications(userId: string) {
    if (!isSupabaseConfigured) return readDemo<Notification>('notifications').filter((item) => item.user_id === userId);
    const { data, error } = await getSupabase()
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return assertData<Notification[]>(data as Notification[] | null, error);
  },

  async markNotificationRead(id: string) {
    if (!isSupabaseConfigured) {
      const rows = readDemo<Notification>('notifications').map((notification) =>
        notification.id === id ? { ...notification, is_read: true } : notification,
      );
      writeDemo('notifications', rows);
      return;
    }
    const { error } = await getSupabase().from('notifications').update({ is_read: true }).eq('id', id);
    if (error) throw new Error(normalizeError(error));
  },

  async getPolls(userId?: string) {
    if (!isSupabaseConfigured) return readDemo<Poll>('polls');
    const { data, error } = await getSupabase()
      .from('polls')
      .select('*, options:poll_options(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    const polls = assertData<Poll[]>(data as Poll[] | null, error);
    const pollIds = polls.map((poll) => poll.id);
    if (!pollIds.length) return polls;
    const { data: votes } = await getSupabase().from('poll_votes').select('poll_id,option_id,user_id').in('poll_id', pollIds);
    return polls.map((poll) => ({
      ...poll,
      options: poll.options?.map((option) => ({
        ...option,
        votes_count: votes?.filter((vote: { option_id: string }) => vote.option_id === option.id).length ?? 0,
      })),
      user_vote_option_id:
        votes?.find((vote: { poll_id: string; user_id: string; option_id: string }) => vote.poll_id === poll.id && vote.user_id === userId)
          ?.option_id ?? null,
    }));
  },

  async votePoll(pollId: string, optionId: string, userId: string) {
    if (!isSupabaseConfigured) {
      const polls = readDemo<Poll>('polls').map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              user_vote_option_id: optionId,
              options: poll.options?.map((option) =>
                option.id === optionId ? { ...option, votes_count: (option.votes_count ?? 0) + 1 } : option,
              ),
            }
          : poll,
      );
      writeDemo('polls', polls);
      return;
    }
    const { data: existing, error } = await getSupabase()
      .from('poll_votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new Error(normalizeError(error));
    if (existing) throw new Error('Você já votou nessa enquete.');
    const { error: insertError } = await getSupabase().from('poll_votes').insert({
      poll_id: pollId,
      option_id: optionId,
      user_id: userId,
    });
    if (insertError) throw new Error(normalizeError(insertError));
  },

  async getOrCreateConversation(userId: string) {
    if (!isSupabaseConfigured) return readDemo<ChatConversation>('chat_conversations')[0];
    const client = getSupabase();
    const { data: existing, error } = await client
      .from('chat_conversations')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'open')
      .maybeSingle();
    if (error) throw new Error(normalizeError(error));
    if (existing) return existing as ChatConversation;
    const { data, error: insertError } = await client
      .from('chat_conversations')
      .insert({ user_id: userId })
      .select('*')
      .single();
    return assertData<ChatConversation>(data as ChatConversation | null, insertError);
  },

  async getConversations() {
    if (!isSupabaseConfigured) return readDemo<ChatConversation>('chat_conversations');
    const { data, error } = await getSupabase()
      .from('chat_conversations')
      .select('*')
      .order('updated_at', { ascending: false });
    return assertData<ChatConversation[]>(data as ChatConversation[] | null, error);
  },

  async getChatMessages(conversationId: string) {
    if (!isSupabaseConfigured) return readDemo<ChatMessage>('chat_messages').filter((msg) => msg.conversation_id === conversationId);
    const { data, error } = await getSupabase()
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    return assertData<ChatMessage[]>(data as ChatMessage[] | null, error);
  },

  async sendChatMessage(conversationId: string, senderId: string, message: string, imageUrl?: string | null) {
    const payload = {
      conversation_id: conversationId,
      sender_id: senderId,
      message: message || null,
      image_url: imageUrl || null,
      is_read: false,
    };
    if (!isSupabaseConfigured) {
      const row = { id: makeId('message'), ...payload, created_at: new Date().toISOString() } as ChatMessage;
      const rows = readDemo<ChatMessage>('chat_messages');
      writeDemo('chat_messages', [...rows, row]);
      return row;
    }
    const { data, error } = await getSupabase().from('chat_messages').insert(payload).select('*').single();
    return assertData<ChatMessage>(data as ChatMessage | null, error);
  },

  async getDashboard(): Promise<DashboardMetrics> {
    if (!isSupabaseConfigured) return demoMetrics;
    const client = getSupabase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const todayStart = today.toISOString();
    const [
      ordersToday,
      pendingOrders,
      monthOrders,
      customers,
      products,
      inventory,
      comments,
      coupons,
      posts,
      orderItems,
      expenses,
    ] = await Promise.all([
      client.from('orders').select('total').gte('created_at', todayStart).neq('status', 'Cancelado'),
      client.from('orders').select('id').in('status', ['Aguardando aceitar', 'Pedido aceito', 'Confeitando']),
      client.from('orders').select('total').gte('created_at', monthStart).neq('status', 'Cancelado'),
      client.from('users_profiles').select('id').eq('role', 'customer'),
      client.from('products').select('id').eq('is_available', true),
      client.from('inventory_items').select('current_quantity,minimum_quantity'),
      client.from('post_comments').select('id').eq('is_visible', false),
      client.from('coupons').select('id').eq('is_active', true),
      client.from('posts').select('title').eq('status', 'published').limit(1),
      client.from('order_items').select('product_name,quantity,subtotal').gte('created_at', monthStart),
      client.from('expenses').select('amount').gte('date', monthStart.slice(0, 10)),
    ]);

    const monthRevenue = (monthOrders.data ?? []).reduce((sum: number, order: { total: number }) => sum + Number(order.total), 0);
    const monthExpenses = (expenses.data ?? []).reduce((sum: number, expense: { amount: number }) => sum + Number(expense.amount), 0);
    const productsSoldMap = new Map<string, number>();
    (orderItems.data ?? []).forEach((item: { product_name: string; quantity: number }) => {
      productsSoldMap.set(item.product_name, (productsSoldMap.get(item.product_name) ?? 0) + Number(item.quantity));
    });

    return {
      salesToday: (ordersToday.data ?? []).reduce((sum: number, order: { total: number }) => sum + Number(order.total), 0),
      pendingOrders: pendingOrders.data?.length ?? 0,
      monthRevenue,
      estimatedProfit: monthRevenue - monthExpenses,
      customerCount: customers.data?.length ?? 0,
      activeProducts: products.data?.length ?? 0,
      lowStock:
        inventory.data?.filter(
          (item: { current_quantity: number; minimum_quantity: number }) =>
            Number(item.current_quantity) <= Number(item.minimum_quantity),
        ).length ?? 0,
      pendingComments: comments.data?.length ?? 0,
      activeCoupons: coupons.data?.length ?? 0,
      topPostTitle: posts.data?.[0]?.title ?? 'Sem posts publicados',
      salesByDay: demoMetrics.salesByDay,
      productsSold: [...productsSoldMap.entries()].map(([label, value]) => ({ label, value })).slice(0, 6),
      revenueByMonth: demoMetrics.revenueByMonth,
      customersByWeek: demoMetrics.customersByWeek,
      ordersByStatus: demoMetrics.ordersByStatus,
    };
  },

  async listCrud<T = AnyRecord>(table: CrudTable) {
    if (!isSupabaseConfigured) return readDemo<T>(table);
    const { data, error } = await getSupabase().from(table).select('*').order('created_at', { ascending: false });
    return assertData<T[]>(data as T[] | null, error);
  },

  async createCrud<T = AnyRecord>(table: CrudTable, values: AnyRecord) {
    if (!isSupabaseConfigured) {
      const rows = readDemo<T & AnyRecord>(table);
      const row = {
        id: makeId(table),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...values,
      } as unknown as T & AnyRecord;
      writeDemo(table, [row, ...rows]);
      return row as T;
    }
    const { data, error } = await getSupabase().from(table).insert(values).select('*').single();
    return assertData<T>(data as T | null, error);
  },

  async updateCrud<T = AnyRecord>(table: CrudTable, id: string, values: AnyRecord) {
    if (!isSupabaseConfigured) {
      const rows = readDemo<T & AnyRecord>(table);
      const next = rows.map((row) => (row.id === id ? { ...row, ...values, updated_at: new Date().toISOString() } : row));
      writeDemo(table, next);
      return next.find((row) => row.id === id) as T;
    }
    const { data, error } = await getSupabase()
      .from(table)
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    return assertData<T>(data as T | null, error);
  },

  async deleteCrud(table: CrudTable, id: string) {
    if (!isSupabaseConfigured) {
      const rows = readDemo<AnyRecord>(table).filter((row) => row.id !== id);
      writeDemo(table, rows);
      return;
    }
    const { error } = await getSupabase().from(table).delete().eq('id', id);
    if (error) throw new Error(normalizeError(error));
  },

  subscribeToTable(table: string, callback: () => void, filter?: string) {
    const client = supabase;
    if (!client) return () => undefined;
    const channel = client
      .channel(`realtime-${table}-${filter ?? 'all'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter,
        },
        callback,
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  },
};
