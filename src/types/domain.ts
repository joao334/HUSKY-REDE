export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type UserRole = 'customer' | 'admin';

export type DeliveryType = 'Entrega' | 'Retirada';

export type PaymentMethod = 'PIX' | 'Dinheiro' | 'Cartão na entrega' | 'Link de pagamento';

export type OrderStatus =
  | 'Aguardando aceitar'
  | 'Pedido aceito'
  | 'Confeitando'
  | 'Pronto para retirada'
  | 'Saiu para entrega'
  | 'Finalizado'
  | 'Cancelado';

export type DiscountType = 'percentage' | 'fixed' | 'free_shipping' | 'gift';

export type Profile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  birth_date: string | null;
  neighborhood: string | null;
  bio: string | null;
  role: UserRole;
  points: number;
  level: string;
  created_at: string;
  updated_at: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  short_description: string;
  full_description: string;
  price: number;
  promotional_price: number | null;
  estimated_cost: number | null;
  stock_quantity: number | null;
  image_url: string | null;
  gallery: string[] | null;
  ingredients_text: string | null;
  size: string | null;
  is_available: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_limited: boolean;
  created_at: string;
  updated_at: string | null;
  likes_count?: number;
  is_liked?: boolean;
  is_favorite?: boolean;
  average_rating?: number;
};

export type PostType =
  | 'Produto'
  | 'Promoção'
  | 'Bastidores'
  | 'Feedback'
  | 'Enquete'
  | 'Novidade'
  | 'Comunicado'
  | 'Lançamento'
  | 'Post da Matilha';

export type Post = {
  id: string;
  title: string;
  content: string;
  type: PostType;
  media_url: string | null;
  media_type?: 'image' | 'video' | null;
  product_id: string | null;
  coupon_id: string | null;
  poll_id: string | null;
  status: 'draft' | 'published' | 'archived';
  created_by: string | null;
  created_at: string;
  updated_at: string | null;
  product?: Product | null;
  profile?: Pick<Profile, 'id' | 'name' | 'avatar_url'> | null;
  likes_count?: number;
  comments_count?: number;
  reposts_count?: number;
  saves_count?: number;
  is_liked?: boolean;
  is_saved?: boolean;
  is_reposted?: boolean;
};

export type PostComment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_visible: boolean;
  is_highlighted: boolean;
  created_at: string;
  updated_at: string | null;
  profile?: Pick<Profile, 'name' | 'avatar_url'> | null;
};

export type Story = {
  id: string;
  title: string;
  content: string | null;
  media_url: string | null;
  media_type?: 'image' | 'video' | null;
  button_text: string | null;
  button_link: string | null;
  product_id: string | null;
  coupon_id: string | null;
  created_by?: string | null;
  profile?: Pick<Profile, 'id' | 'name' | 'avatar_url'> | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
};

export type Coupon = {
  id: string;
  code: string;
  description: string;
  discount_type: DiscountType;
  discount_value: number;
  starts_at: string | null;
  ends_at: string | null;
  max_uses: number | null;
  uses_per_customer: number | null;
  minimum_order_value: number | null;
  product_id: string | null;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
};

export type CartItem = {
  id: string;
  cart_id?: string;
  product_id: string;
  product: Product;
  quantity: number;
  observation: string | null;
  created_at?: string;
  updated_at?: string | null;
};

export type Order = {
  id: string;
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  delivery_type: DeliveryType;
  address: string | null;
  address_number: string | null;
  complement: string | null;
  neighborhood: string | null;
  payment_method: PaymentMethod;
  subtotal: number;
  discount: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  general_observation: string | null;
  coupon_code: string | null;
  created_at: string;
  updated_at: string | null;
  items?: OrderItem[];
  profile?: Profile | null;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  observation: string | null;
  created_at: string;
};

export type Review = {
  id: string;
  order_id: string | null;
  product_id: string | null;
  user_id: string;
  rating: number;
  comment: string | null;
  can_use_as_feedback: boolean;
  is_visible: boolean;
  is_highlighted: boolean;
  created_at: string;
  profile?: Pick<Profile, 'name' | 'avatar_url'> | null;
  product?: Product | null;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  created_at: string;
};

export type Poll = {
  id: string;
  question: string;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
  options?: PollOption[];
  user_vote_option_id?: string | null;
};

export type PollOption = {
  id: string;
  poll_id: string;
  option_text: string;
  created_at: string;
  votes_count?: number;
};

export type LoyaltyHistory = {
  id: string;
  user_id: string;
  points: number;
  reason: string;
  reference_type: string | null;
  reference_id: string | null;
  created_at: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  current_quantity: number;
  minimum_quantity: number;
  unit_cost: number | null;
  supplier: string | null;
  last_purchase_date: string | null;
  created_at: string;
  updated_at: string | null;
  status?: 'Normal' | 'Baixo' | 'Crítico';
};

export type InventoryMovement = {
  id: string;
  item_id: string;
  type: 'entrada' | 'saida';
  quantity: number;
  reason: string | null;
  created_at: string;
};

export type Expense = {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  payment_method: string | null;
  receipt_url: string | null;
  observation: string | null;
  created_at: string;
};

export type ProductRecipe = {
  id: string;
  product_id: string;
  inventory_item_id: string;
  quantity_used: number;
  cost: number;
  created_at: string;
  product?: Product;
  item?: InventoryItem;
};

export type Setting = {
  id: string;
  key: string;
  value: Json;
  updated_at: string;
};

export type ChatConversation = {
  id: string;
  user_id: string;
  status: 'open' | 'closed';
  created_at: string;
  updated_at: string | null;
  profile?: Profile | null;
  last_message?: ChatMessage | null;
};

export type ChatMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string | null;
  image_url: string | null;
  is_read: boolean;
  created_at: string;
  sender?: Profile | null;
};

export type DashboardMetrics = {
  salesToday: number;
  pendingOrders: number;
  monthRevenue: number;
  estimatedProfit: number;
  customerCount: number;
  activeProducts: number;
  lowStock: number;
  pendingComments: number;
  activeCoupons: number;
  topPostTitle: string;
  salesByDay: Array<{ label: string; value: number }>;
  productsSold: Array<{ label: string; value: number }>;
  revenueByMonth: Array<{ label: string; value: number }>;
  customersByWeek: Array<{ label: string; value: number }>;
  ordersByStatus: Array<{ label: string; value: number }>;
};

export type CheckoutInput = {
  user_id: string;
  customer_name: string;
  customer_phone: string;
  delivery_type: DeliveryType;
  address?: string;
  address_number?: string;
  complement?: string;
  neighborhood?: string;
  payment_method: PaymentMethod;
  general_observation?: string;
  coupon_code?: string;
  delivery_fee: number;
  items: CartItem[];
};

export type CrudTable =
  | 'products'
  | 'posts'
  | 'stories'
  | 'coupons'
  | 'orders'
  | 'inventory_items'
  | 'expenses'
  | 'polls'
  | 'users_profiles'
  | 'post_comments'
  | 'reviews'
  | 'settings'
  | 'product_recipes';

export type AnyRecord = Record<string, unknown>;
