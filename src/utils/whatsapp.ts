import type { Order } from '../types/domain';
import { formatCurrency } from './format';

export function buildWhatsAppOrderMessage(order: Order) {
  const items = order.items?.length
    ? order.items
        .map((item) => `${item.quantity}x ${item.product_name} - ${formatCurrency(item.subtotal)}`)
        .join('\n')
    : 'Itens do pedido';

  const address = [order.address, order.address_number, order.complement, order.neighborhood]
    .filter(Boolean)
    .join(', ');

  return `Olá, Husky Confeiteiro! Quero fazer um pedido 🐾:

Pedido nº: ${order.order_number}
Nome: ${order.customer_name}
Telefone: ${order.customer_phone}

Itens 🍰:
${items}

Entrega/Retirada: ${order.delivery_type}
Endereço: ${address || 'Retirada na confeitaria'}
Pagamento: ${order.payment_method}
Cupom: ${order.coupon_code || 'Sem cupom'}
Total: ${formatCurrency(order.total)}

Observações 💙:
${order.general_observation || 'Sem observações'}`;
}

export function buildWhatsAppUrl(phone: string | null | undefined, message: string) {
  const cleanPhone = (phone || '').replace(/\D/g, '');
  const target = cleanPhone ? `55${cleanPhone.replace(/^55/, '')}` : '';
  return `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
}
