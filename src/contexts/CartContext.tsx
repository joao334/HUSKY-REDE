import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, CheckoutInput, Coupon, Order, Product } from '../types/domain';
import { dataService } from '../services/dataService';
import { huskyBrand } from '../config/huskyBrand';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

type CartContextValue = {
  items: CartItem[];
  loading: boolean;
  coupon: Coupon | null;
  couponCode: string;
  couponMessage: string | null;
  discount: number;
  deliveryFee: number;
  subtotal: number;
  total: number;
  setCouponCode: (code: string) => void;
  reloadCart: () => Promise<void>;
  addToCart: (product: Product, quantity?: number, observation?: string | null) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (deliveryFee?: number) => Promise<void>;
  checkout: (input: Omit<CheckoutInput, 'user_id' | 'items' | 'delivery_fee' | 'coupon_code'>) => Promise<Order>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { profile, refreshProfile } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const deliveryFee = huskyBrand.deliveryFee;

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.product.promotional_price ?? item.product.price) * item.quantity, 0),
    [items],
  );

  const total = useMemo(() => Math.max(0, subtotal - discount + deliveryFee), [deliveryFee, discount, subtotal]);

  const reloadCart = useCallback(async () => {
    if (!profile) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const cartItems = await dataService.getCart(profile.id);
      setItems(cartItems);
    } catch (error) {
      toast.error('Ops! A Husky tropeçou no carrinho.', error instanceof Error ? error.message : undefined);
    } finally {
      setLoading(false);
    }
  }, [profile, toast]);

  useEffect(() => {
    reloadCart();
  }, [reloadCart]);

  const addToCart = useCallback(
    async (product: Product, quantity = 1, observation?: string | null) => {
      if (!profile) throw new Error('Entre na matilha para montar seu potinho.');
      setLoading(true);
      try {
        const next = await dataService.addCartItem(profile.id, product, quantity, observation);
        setItems(next);
        toast.success('Potinho no carrinho', `${product.name} entrou para o pedido.`);
      } catch (error) {
        toast.error('Não deu para adicionar', error instanceof Error ? error.message : undefined);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [profile, toast],
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!profile) return;
      const next = await dataService.updateCartItem(profile.id, itemId, quantity);
      setItems(next);
    },
    [profile],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!profile) return;
      const next = await dataService.removeCartItem(profile.id, itemId);
      setItems(next);
      toast.info('Item removido', 'Seu potinho foi atualizado.');
    },
    [profile, toast],
  );

  const clearCart = useCallback(async () => {
    if (!profile) return;
    await dataService.clearCart(profile.id);
    setItems([]);
    setCoupon(null);
    setCouponCode('');
    setDiscount(0);
  }, [profile]);

  const applyCoupon = useCallback(
    async (customDeliveryFee = deliveryFee) => {
      if (!profile || !couponCode.trim()) return;
      const result = await dataService.validateCoupon(couponCode, subtotal, profile.id, items, customDeliveryFee);
      setCoupon(result.coupon);
      setDiscount(result.discount);
      setCouponMessage(result.message);
      if (result.coupon) toast.success('Cupom aplicado', result.message);
      else toast.error('Cupom recusado', result.message);
    },
    [couponCode, deliveryFee, items, profile, subtotal, toast],
  );

  const checkout = useCallback(
    async (input: Omit<CheckoutInput, 'user_id' | 'items' | 'delivery_fee' | 'coupon_code'>) => {
      if (!profile) throw new Error('Entre na matilha para finalizar.');
      if (!items.length) throw new Error('Seu potinho ainda está vazio.');
      const order = await dataService.createOrder({
        ...input,
        user_id: profile.id,
        items,
        delivery_fee: input.delivery_type === 'Entrega' ? deliveryFee : 0,
        coupon_code: coupon?.code ?? (couponCode || undefined),
      });
      setItems([]);
      setCoupon(null);
      setCouponCode('');
      setDiscount(0);
      await refreshProfile();
      toast.success('Au au! Pedido recebido', 'A Husky vai avisar cada etapa.');
      return order;
    },
    [coupon, couponCode, deliveryFee, items, profile, refreshProfile, toast],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      loading,
      coupon,
      couponCode,
      couponMessage,
      discount,
      deliveryFee,
      subtotal,
      total,
      setCouponCode,
      reloadCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      checkout,
    }),
    [
      addToCart,
      applyCoupon,
      checkout,
      clearCart,
      coupon,
      couponCode,
      couponMessage,
      deliveryFee,
      discount,
      items,
      loading,
      reloadCart,
      removeItem,
      subtotal,
      total,
      updateQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart precisa estar dentro de CartProvider.');
  return context;
}
