import { useMemo, useState } from 'react';
import { MessageCircle, Printer } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useToast } from '../../contexts/ToastContext';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';
import type { Order, OrderStatus } from '../../types/domain';
import { formatCurrency, formatDateTime } from '../../utils/format';
import { buildWhatsAppOrderMessage, buildWhatsAppUrl } from '../../utils/whatsapp';

const statuses: Array<OrderStatus | 'Todos'> = [
  'Todos',
  'Aguardando aceitar',
  'Pedido aceito',
  'Confeitando',
  'Pronto para retirada',
  'Saiu para entrega',
  'Finalizado',
  'Cancelado',
];

export function AdminOrdersPage() {
  const toast = useToast();
  const orders = useAsync(() => dataService.getOrders(), []);
  const [filter, setFilter] = useState<OrderStatus | 'Todos'>('Todos');
  const filtered = useMemo(() => (orders.data ?? []).filter((order) => filter === 'Todos' || order.status === filter), [filter, orders.data]);

  async function changeStatus(order: Order, status: OrderStatus) {
    await dataService.updateOrderStatus(order.id, status);
    toast.success('Status atualizado', `Pedido ${order.order_number}: ${status}.`);
    await orders.reload();
  }

  return (
    <div>
      <PageHeader eyebrow="Pedidos da Matilha" title="Gestão de pedidos" description="Aceite, acompanhe, cancele e avise o cliente a cada etapa." />
      <div className="mb-4 max-w-sm">
        <Select label="Filtro de status" value={filter} onChange={(event) => setFilter(event.target.value as OrderStatus | 'Todos')}>
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </Select>
      </div>
      <DataTable
        rows={filtered}
        getRowKey={(row) => row.id}
        columns={[
          { header: 'Pedido', accessor: (row) => <strong>{row.order_number}</strong> },
          { header: 'Cliente', accessor: (row) => `${row.customer_name} · ${row.customer_phone}` },
          { header: 'Data', accessor: (row) => formatDateTime(row.created_at) },
          { header: 'Total', accessor: (row) => formatCurrency(row.total) },
          { header: 'Status', accessor: (row) => <StatusBadge status={row.status} /> },
          {
            header: 'Alterar',
            accessor: (row) => (
              <Select value={row.status} onChange={(event) => changeStatus(row, event.target.value as OrderStatus)}>
                {statuses.filter((status) => status !== 'Todos').map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </Select>
            ),
          },
          {
            header: 'Ações',
            accessor: (row) => (
              <div className="flex gap-2">
                <a href={buildWhatsAppUrl(row.customer_phone, buildWhatsAppOrderMessage(row))} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="icon">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </a>
                <Button variant="ghost" size="icon" onClick={() => window.print()}>
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
