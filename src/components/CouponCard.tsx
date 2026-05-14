import { Copy, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Coupon } from '../types/domain';
import { formatCurrency, formatDate } from '../utils/format';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

function couponValue(coupon: Coupon) {
  if (coupon.discount_type === 'percentage') return `${coupon.discount_value}%`;
  if (coupon.discount_type === 'fixed') return formatCurrency(coupon.discount_value);
  if (coupon.discount_type === 'free_shipping') return 'Frete grátis';
  return 'Brinde';
}

export function CouponCard({ coupon }: { coupon: Coupon }) {
  const toast = useToast();
  const { setCouponCode } = useCart();
  const navigate = useNavigate();

  async function copyCoupon() {
    await navigator.clipboard.writeText(coupon.code);
    setCouponCode(coupon.code);
    toast.success('Cupom copiado', `${coupon.code} está pronto para usar.`);
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-dashed border-husky-blue/20 bg-husky-blue p-4 text-white dark:border-white/10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase opacity-80">🎟️ Achadinho da Husky</p>
            <h3 className="mt-1 text-2xl font-black">{coupon.code}</h3>
          </div>
          <Badge tone="cream">{couponValue(coupon)}</Badge>
        </div>
      </div>
      <div className="p-4">
        <p className="font-semibold text-husky-cocoa dark:text-husky-cream">{coupon.description}</p>
        <p className="mt-2 text-sm text-husky-brown/70 dark:text-husky-cream/70">
          Validade: {formatDate(coupon.ends_at, 'dd/MM/yyyy')} · Pedido mínimo: {formatCurrency(coupon.minimum_order_value ?? 0)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" leftIcon={<Copy className="h-4 w-4" />} onClick={copyCoupon}>
            Copiar cupom
          </Button>
          <Button leftIcon={<ShoppingBag className="h-4 w-4" />} onClick={() => navigate('/app/loja')}>
            Usar agora 🍰
          </Button>
        </div>
      </div>
    </Card>
  );
}
