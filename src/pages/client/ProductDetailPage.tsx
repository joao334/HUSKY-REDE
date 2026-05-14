import { FormEvent, useMemo, useState } from 'react';
import { Heart, Minus, PawPrint, Plus, ShoppingBag, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { ProductCard } from '../../components/ProductCard';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Textarea } from '../../components/ui/Textarea';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useAsync } from '../../hooks/useAsync';
import { huskyBrand } from '../../config/huskyBrand';
import { dataService } from '../../services/dataService';
import { formatCurrency, formatDate } from '../../utils/format';

export function ProductDetailPage() {
  const { slug = '' } = useParams();
  const { profile } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState('');
  const product = useAsync(() => dataService.getProductBySlug(slug, profile?.id), [slug, profile?.id]);
  const reviews = useAsync(async () => (product.data ? dataService.getProductReviews(product.data.id) : []), [product.data?.id]);
  const related = useAsync(() => dataService.getProducts({ availableOnly: true }), []);

  const average = useMemo(() => {
    const rows = reviews.data ?? [];
    if (!rows.length) return product.data?.average_rating ?? 5;
    return rows.reduce((sum, item) => sum + item.rating, 0) / rows.length;
  }, [product.data?.average_rating, reviews.data]);

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    if (product.data) await addToCart(product.data, quantity, observation || null);
  }

  if (product.loading) return <LoadingSpinner />;
  if (!product.data) return <EmptyState title="Esse pote sumiu da matilha" description="Não encontramos esse produto no cardápio." />;

  const item = product.data;

  return (
    <div>
      <PageHeader eyebrow={item.category} title={item.name} description={item.short_description} />
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden">
          <img src={item.image_url ?? huskyBrand.assets.mascot} alt={item.name} className="aspect-square w-full object-cover" />
        </Card>
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={item.is_available ? 'green' : 'red'}>
                {item.is_available ? '✅ Disponível' : '🚫 Esse pote sumiu da matilha'}
              </Badge>
              {item.is_best_seller ? <Badge tone="brown">🔥 Mais vendido</Badge> : null}
              {item.is_limited ? <Badge tone="cream">✨ Limitado</Badge> : null}
            </div>
            <p className="mt-4 text-4xl font-black text-husky-blue">{formatCurrency(item.promotional_price ?? item.price)}</p>
            <p className="mt-4 leading-7 text-husky-brown/76 dark:text-husky-cream/76">{item.full_description}</p>
            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-brand bg-husky-beige/30 p-3 dark:bg-white/8">
                <strong>Ingredientes principais</strong>
                <p className="mt-1 text-husky-brown/70 dark:text-husky-cream/70">{item.ingredients_text}</p>
              </div>
              <div className="rounded-brand bg-husky-beige/30 p-3 dark:bg-white/8">
                <strong>Tamanho</strong>
                <p className="mt-1 text-husky-brown/70 dark:text-husky-cream/70">{item.size ?? 'Porção Husky'}</p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm font-bold text-husky-brown/70 dark:text-husky-cream/70">
              <Star className="h-5 w-5 fill-husky-beige text-husky-brown" />
              {average.toFixed(1)} de média · {reviews.data?.length ?? 0} uivos da matilha
            </div>
          </Card>
          <Card className="p-5">
            <form className="space-y-4" onSubmit={handleAdd}>
              <div className="flex items-center justify-between gap-3">
                <span className="font-black">Quantidade</span>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="grid h-11 w-12 place-items-center rounded-brand bg-white font-black dark:bg-white/8">{quantity}</span>
                  <Button type="button" variant="outline" size="icon" onClick={() => setQuantity((value) => value + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea label="Observação" value={observation} onChange={(event) => setObservation(event.target.value)} placeholder="Ex.: sem granulado, colher extra..." />
              <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                <Button type="submit" size="lg" disabled={!item.is_available} leftIcon={<ShoppingBag className="h-4 w-4" />}>
                  Adicionar ao carrinho 🛒
                </Button>
                <Button type="button" variant="outline" size="lg" leftIcon={<PawPrint className="h-4 w-4" />} onClick={() => profile && dataService.toggleProductLike(item.id, profile.id)}>
                  Dar patinha 🐾
                </Button>
                <Button type="button" variant="cream" size="lg" leftIcon={<Heart className="h-4 w-4" />} onClick={() => profile && dataService.toggleProductFavorite(item.id, profile.id)}>
                  Favoritar 💙
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <Card className="p-5">
          <h2 className="text-xl font-black">Comentários dos clientes</h2>
          <div className="mt-4 space-y-4">
            {reviews.data?.length ? (
              reviews.data.map((review) => (
                <div key={review.id} className="flex gap-3 rounded-brand bg-husky-beige/20 p-3 dark:bg-white/8">
                  <Avatar src={review.profile?.avatar_url} name={review.profile?.name ?? 'Cliente'} />
                  <div>
                    <p className="font-black">{review.profile?.name ?? 'Cliente da Matilha'}</p>
                    <p className="text-xs font-semibold text-husky-brown/55 dark:text-husky-cream/55">{formatDate(review.created_at)} · {review.rating}/5</p>
                    <p className="mt-2 text-sm text-husky-brown/72 dark:text-husky-cream/72">{review.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="Sem uivos ainda" description="Quem provar primeiro pode deixar a primeira avaliação." />
            )}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-xl font-black">Combos e relacionados</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {(related.data ?? [])
              .filter((row) => row.id !== item.id)
              .slice(0, 2)
              .map((row) => (
                <Link key={row.id} to={`/app/produtos/${row.slug}`} className="flex gap-3 rounded-brand bg-white/70 p-3 transition hover:bg-husky-beige/25 dark:bg-white/8">
                  <img src={row.image_url ?? huskyBrand.assets.mascot} alt={row.name} className="h-20 w-20 rounded-brand object-cover" />
                  <span>
                    <span className="font-black">{row.name}</span>
                    <span className="mt-1 block text-sm text-husky-blue">{formatCurrency(row.price)}</span>
                  </span>
                </Link>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
