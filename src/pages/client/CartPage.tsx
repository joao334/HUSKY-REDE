import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { useCart } from '../../contexts/CartContext';
import { huskyBrand } from '../../config/huskyBrand';
import { formatCurrency } from '../../utils/format';

export function CartPage() {
  const { items, couponCode, setCouponCode, applyCoupon, couponMessage, discount, deliveryFee, subtotal, total, updateQuantity, removeItem } = useCart();

  return (
    <div>
      <PageHeader eyebrow="Carrinho" title="Seu potinho" description="Revise os itens, aplique cupom e finalize o pedido." />
      {!items.length ? (
        <EmptyState title="Seu potinho ainda está vazio" description="Bora escolher uma delícia?" actionLabel="Ver cardápio" onAction={() => (window.location.href = '/app/cardapio')} icon={<ShoppingBag className="h-8 w-8" />} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <img src={item.product.image_url ?? huskyBrand.assets.mascot} alt={item.product.name} className="h-24 w-24 rounded-brand object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-husky-cocoa dark:text-husky-cream">{item.product.name}</h3>
                    <p className="mt-1 text-sm text-husky-brown/65 dark:text-husky-cream/65">{item.observation || item.product.short_description}</p>
                    <p className="mt-2 font-black text-husky-blue">{formatCurrency(item.product.promotional_price ?? item.product.price)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="grid h-10 w-10 place-items-center rounded-brand bg-white font-black dark:bg-white/8">{item.quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Card className="h-fit p-5">
            <h2 className="text-xl font-black">Resumo</h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
              <div className="flex justify-between text-sm"><span>Desconto</span><strong>- {formatCurrency(discount)}</strong></div>
              <div className="flex justify-between text-sm"><span>Taxa de entrega</span><strong>{formatCurrency(deliveryFee)}</strong></div>
              <div className="border-t border-husky-blue/10 pt-3 text-lg font-black dark:border-white/10 flex justify-between"><span>Total</span><span>{formatCurrency(total)}</span></div>
            </div>
            <div className="mt-5 flex gap-2">
              <Input placeholder="Cupom" value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} />
              <Button type="button" onClick={() => applyCoupon()}>
                Aplicar
              </Button>
            </div>
            {couponMessage ? <p className="mt-2 text-sm font-semibold text-husky-blue">{couponMessage}</p> : null}
            <Link to="/app/checkout" className="mt-5 block">
              <Button className="w-full" size="lg">
                Finalizar pedido 💙
              </Button>
            </Link>
          </Card>
        </div>
      )}
    </div>
  );
}
