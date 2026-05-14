import type { OrderStatus } from '../../types/domain';
import { Badge } from './Badge';

const toneByStatus: Record<OrderStatus, 'blue' | 'cream' | 'brown' | 'green' | 'red' | 'muted'> = {
  'Aguardando aceitar': 'cream',
  'Pedido aceito': 'blue',
  Confeitando: 'brown',
  'Pronto para retirada': 'green',
  'Saiu para entrega': 'blue',
  Finalizado: 'green',
  Cancelado: 'red',
};

const labelByStatus: Record<OrderStatus, string> = {
  'Aguardando aceitar': 'Aguardando aceitar',
  'Pedido aceito': 'Pedido aceito',
  Confeitando: 'A Husky está confeitando',
  'Pronto para retirada': 'Pronto para retirada',
  'Saiu para entrega': 'Saiu para entrega',
  Finalizado: 'Pedido entregue',
  Cancelado: 'Cancelado',
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={toneByStatus[status]}>{labelByStatus[status]}</Badge>;
}
