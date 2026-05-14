import { useCallback, useState } from 'react';
import { RotateCcw, Star } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { OrderCard } from '../../components/OrderCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { useAsync } from '../../hooks/useAsync';
import { useRealtimeRefresh } from '../../hooks/useRealtimeRefresh';
import { dataService } from '../../services/dataService';
import type { Order } from '../../types/domain';

export function OrdersPage() {
  const { profile } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const orders = useAsync(() => dataService.getOrders(profile?.id), [profile?.id]);
  const reload = useCallback(() => orders.reload().catch(() => undefined), [orders]);
  useRealtimeRefresh('orders', reload, profile?.id ? `user_id=eq.${profile.id}` : undefined);

  async function reorder(order: Order) {
    const products = await dataService.getProducts();
    for (const item of order.items ?? []) {
      const product = products.find((row) => row.id === item.product_id);
      if (product) await addToCart(product, item.quantity, item.observation);
    }
    toast.success('Pedido remontado', 'Os potinhos voltaram para o carrinho.');
  }

  async function submitReview() {
    if (!profile || !reviewOrder) return;
    await dataService.createReview({
      order_id: reviewOrder.id,
      user_id: profile.id,
      rating,
      comment,
      can_use_as_feedback: true,
      is_visible: true,
      is_highlighted: false,
    });
    toast.success('Uivo enviado', 'Você ganhou patinhas por avaliar.');
    setReviewOrder(null);
  }

  return (
    <div>
      <PageHeader eyebrow="Pedidos da Matilha" title="Meus pedidos" description="Acompanhe cada status em tempo real." />
      <div className="space-y-4">
        {orders.data?.length ? (
          orders.data.map((order) => <OrderCard key={order.id} order={order} onReorder={reorder} onReview={setReviewOrder} />)
        ) : (
          <EmptyState title="A matilha ainda não fez nenhum pedido por aqui" description="Quando você finalizar um pedido, ele aparece nessa tela." />
        )}
      </div>
      <Modal open={Boolean(reviewOrder)} onClose={() => setReviewOrder(null)} title="Avaliar pedido">
        <div className="space-y-4">
          <Select label="Nota" value={rating} onChange={(event) => setRating(Number(event.target.value))}>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>{value} estrelas</option>
            ))}
          </Select>
          <Textarea label="Comentário" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Conte como foi o pedido..." />
          <Button onClick={submitReview} leftIcon={<Star className="h-4 w-4" />}>
            Enviar avaliação ⭐
          </Button>
        </div>
      </Modal>
    </div>
  );
}
