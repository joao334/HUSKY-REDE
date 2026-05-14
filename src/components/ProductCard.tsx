import { motion } from 'framer-motion';
import { Eye, Heart, PawPrint, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../types/domain';
import { formatCurrency } from '../utils/format';
import { dataService } from '../services/dataService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export function ProductCard({ product }: { product: Product }) {
  const { profile } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();
  const price = Number(product.promotional_price ?? product.price);

  async function handlePaw() {
    if (!profile) return;
    await dataService.toggleProductLike(product.id, profile.id);
    toast.success('Patinha registrada', `${product.name} ganhou carinho da matilha.`);
  }

  async function handleFavorite() {
    if (!profile) return;
    await dataService.toggleProductFavorite(product.id, profile.id);
    toast.success('Guardado no pote', `${product.name} entrou nos seus favoritos.`);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card className="group overflow-hidden">
        <Link to={`/app/produtos/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-husky-beige/35">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            ) : (
              <div className="grid h-full place-items-center text-husky-blue">
                <ShoppingBag className="h-12 w-12" />
              </div>
            )}
            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
              {product.is_best_seller ? <Badge tone="brown">🔥 Mais vendido</Badge> : null}
              {product.is_limited ? <Badge tone="cream">✨ Limitado</Badge> : null}
            </div>
            <div className="absolute bottom-3 right-3">
              <Badge tone={product.is_available ? 'green' : 'red'}>
                {product.is_available ? '✅ Disponível' : '🚫 Esse pote sumiu'}
              </Badge>
            </div>
          </div>
        </Link>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-husky-blue">{product.category}</p>
              <h3 className="mt-1 line-clamp-2 text-lg font-black text-husky-cocoa dark:text-husky-cream">{product.name}</h3>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-husky-beige/50 px-2 py-1 text-xs font-bold text-husky-brown">
              <Star className="h-3.5 w-3.5 fill-current" />
              {product.average_rating?.toFixed(1) ?? '5.0'}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm text-husky-brown/70 dark:text-husky-cream/70">{product.short_description}</p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              {product.promotional_price ? (
                <p className="text-xs font-semibold text-husky-brown/50 line-through">{formatCurrency(product.price)}</p>
              ) : null}
              <p className="text-xl font-black text-husky-blue">{formatCurrency(price)}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={handlePaw} title="Dar patinha">
                <PawPrint className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleFavorite} title="Guardar no pote">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
            <Button
              onClick={() => addToCart(product)}
              disabled={!product.is_available}
              leftIcon={<ShoppingBag className="h-4 w-4" />}
            >
              Adicionar 🛒
            </Button>
            <Link to={`/app/produtos/${product.slug}`}>
              <Button variant="outline" size="icon" title="Ver detalhes">
                <Eye className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
