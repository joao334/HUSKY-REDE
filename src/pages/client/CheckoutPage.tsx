import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import type { DeliveryType, PaymentMethod } from '../../types/domain';
import { formatCurrency } from '../../utils/format';

export function CheckoutPage() {
  const { profile } = useAuth();
  const { items, subtotal, discount, deliveryFee, total, checkout } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customer_name: profile?.name ?? '',
    customer_phone: profile?.phone ?? '',
    delivery_type: 'Entrega' as DeliveryType,
    address: '',
    address_number: '',
    complement: '',
    neighborhood: profile?.neighborhood ?? '',
    payment_method: 'PIX' as PaymentMethod,
    general_observation: '',
  });

  function update<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const order = await checkout(form);
      navigate(`/app/pedido-confirmado/${order.id}`, { state: { order }, replace: true });
    } finally {
      setLoading(false);
    }
  }

  if (!items.length) return <EmptyState title="Seu potinho ainda está vazio" description="Escolha uma delícia antes do checkout." />;

  return (
    <div>
      <PageHeader eyebrow="Checkout" title="Finalizar pedido" description="A Husky vai preparar tudo com carinho." />
      <form className="grid gap-5 lg:grid-cols-[1fr_360px]" onSubmit={handleSubmit}>
        <Card className="p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Nome" required value={form.customer_name} onChange={(event) => update('customer_name', event.target.value)} />
            <Input label="WhatsApp" required value={form.customer_phone} onChange={(event) => update('customer_phone', event.target.value)} />
            <Select label="Forma de entrega" value={form.delivery_type} onChange={(event) => update('delivery_type', event.target.value as DeliveryType)}>
              <option>Entrega</option>
              <option>Retirada</option>
            </Select>
            <Select label="Pagamento" value={form.payment_method} onChange={(event) => update('payment_method', event.target.value as PaymentMethod)}>
              <option>PIX</option>
              <option>Dinheiro</option>
              <option>Cartão na entrega</option>
              <option>Link de pagamento</option>
            </Select>
            {form.delivery_type === 'Entrega' ? (
              <>
                <Input label="Endereço" required value={form.address} onChange={(event) => update('address', event.target.value)} />
                <Input label="Número" required value={form.address_number} onChange={(event) => update('address_number', event.target.value)} />
                <Input label="Complemento" value={form.complement} onChange={(event) => update('complement', event.target.value)} />
                <Input label="Bairro" required value={form.neighborhood} onChange={(event) => update('neighborhood', event.target.value)} />
              </>
            ) : null}
            <Textarea label="Observações" className="md:col-span-2" value={form.general_observation} onChange={(event) => update('general_observation', event.target.value)} />
          </div>
        </Card>
        <Card className="h-fit p-5">
          <h2 className="text-xl font-black">Resumo do pedido</h2>
          <div className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-3">
                <span>{item.quantity}x {item.product.name}</span>
                <strong>{formatCurrency((item.product.promotional_price ?? item.product.price) * item.quantity)}</strong>
              </div>
            ))}
            <div className="border-t border-husky-blue/10 pt-3 dark:border-white/10" />
            <div className="flex justify-between"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
            <div className="flex justify-between"><span>Desconto</span><strong>- {formatCurrency(discount)}</strong></div>
            <div className="flex justify-between"><span>Entrega</span><strong>{formatCurrency(form.delivery_type === 'Entrega' ? deliveryFee : 0)}</strong></div>
            <div className="flex justify-between text-lg font-black"><span>Total</span><span>{formatCurrency(form.delivery_type === 'Entrega' ? total : total - deliveryFee)}</span></div>
          </div>
          <Button className="mt-5 w-full" size="lg" type="submit" isLoading={loading}>
            Finalizar pedido
          </Button>
        </Card>
      </form>
    </div>
  );
}
