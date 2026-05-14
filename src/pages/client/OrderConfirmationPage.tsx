import { useLocation, useParams } from 'react-router-dom';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';
import type { Order } from '../../types/domain';
import { buildWhatsAppOrderMessage, buildWhatsAppUrl } from '../../utils/whatsapp';
import { formatCurrency } from '../../utils/format';
import { huskyBrand } from '../../config/huskyBrand';

export function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const stateOrder = (location.state as { order?: Order } | null)?.order;
  const order = useAsync(async () => {
    if (stateOrder) return stateOrder;
    const orders = await dataService.getOrders();
    return orders.find((item) => item.id === orderId) ?? null;
  }, [orderId, stateOrder?.id]);

  if (order.loading) return <LoadingSpinner />;
  if (!order.data) return <PageHeader title="Pedido não encontrado" description="A Husky não localizou esse pedido." />;

  const message = buildWhatsAppOrderMessage(order.data);
  const whatsappUrl = buildWhatsAppUrl(huskyBrand.whatsapp, message);

  return (
    <div>
      <PageHeader eyebrow="Pedido recebido" title="Au au! Seu pedido foi recebido pela Husky." description="Você pode acompanhar o status em Meus pedidos." />
      <Card className="mx-auto max-w-2xl p-6 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-husky-mint" />
        <h2 className="mt-4 text-2xl font-black">Pedido nº {order.data.order_number}</h2>
        <p className="mt-2 text-husky-brown/72 dark:text-husky-cream/72">Total {formatCurrency(order.data.total)} · {order.data.payment_method}</p>
        <pre className="mt-5 max-h-72 overflow-auto rounded-brand bg-husky-cocoa p-4 text-left text-xs leading-5 text-husky-cream soft-scrollbar">{message}</pre>
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-5 inline-block">
          <Button size="lg" leftIcon={<MessageCircle className="h-5 w-5" />}>
            Abrir WhatsApp
          </Button>
        </a>
      </Card>
    </div>
  );
}
