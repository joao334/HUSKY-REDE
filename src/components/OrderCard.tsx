import { ClipboardList, RotateCcw, Star } from 'lucide-react';
import type { Order } from '../types/domain';
import { formatCurrency, formatDateTime } from '../utils/format';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { StatusBadge } from './ui/StatusBadge';

type OrderCardProps = {
  order: Order;
  onReorder?: (order: Order) => void;
  onReview?: (order: Order) => void;
  onDetails?: (order: Order) => void;
};

export function OrderCard({ order, onReorder, onReview, onDetails }: OrderCardProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-husky-blue">Pedido nº {order.order_number}</p>
          <h3 className="mt-1 text-lg font-black text-husky-cocoa dark:text-husky-cream">{formatDateTime(order.created_at)}</h3>
          <p className="mt-2 text-sm text-husky-brown/70 dark:text-husky-cream/70">
            {order.items?.map((item) => `${item.quantity}x ${item.product_name}`).join(', ') || 'Itens do pedido'}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="mt-4 grid gap-3 text-sm text-husky-brown/75 dark:text-husky-cream/75 sm:grid-cols-3">
        <span>Entrega: <strong>{order.delivery_type}</strong></span>
        <span>Pagamento: <strong>{order.payment_method}</strong></span>
        <span>Total: <strong>{formatCurrency(order.total)}</strong></span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {onDetails ? (
          <Button variant="outline" leftIcon={<ClipboardList className="h-4 w-4" />} onClick={() => onDetails(order)}>
            Ver detalhes
          </Button>
        ) : null}
        {onReorder ? (
          <Button variant="cream" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={() => onReorder(order)}>
            Pedir novamente
          </Button>
        ) : null}
        {order.status === 'Finalizado' && onReview ? (
          <Button leftIcon={<Star className="h-4 w-4" />} onClick={() => onReview(order)}>
            Avaliar pedido
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
