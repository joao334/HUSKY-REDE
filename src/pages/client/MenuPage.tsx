import { useMemo, useState } from 'react';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';
import { formatCurrency } from '../../utils/format';

const filters = ['Todos', 'Bolos de pote', 'Brownies', 'Combos', 'Promocoes', 'Mais vendidos', 'Favoritos'];

export function MenuPage() {
  const { profile } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const products = useAsync(() => dataService.getProducts({ userId: profile?.id }), [profile?.id]);

  const filtered = useMemo(() => {
    let rows = products.data ?? [];
    if (filter === 'Mais vendidos') rows = rows.filter((product) => product.is_best_seller);
    else if (filter === 'Favoritos') rows = rows.filter((product) => product.is_favorite);
    else if (filter === 'Promocoes') rows = rows.filter((product) => product.promotional_price);
    else if (filter !== 'Todos') rows = rows.filter((product) => product.category === filter);
    if (search.trim()) {
      const term = search.toLowerCase();
      rows = rows.filter((product) => `${product.name} ${product.short_description} ${product.category}`.toLowerCase().includes(term));
    }
    return rows;
  }, [filter, products.data, search]);

  return (
    <div className="mx-auto max-w-[935px] lg:mx-0">
      <header className="border-b border-black/10 bg-white px-4 py-4 dark:border-white/10 dark:bg-[#0d1118] lg:rounded-t-[12px] lg:border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-husky-blue">Shop</p>
            <h1 className="text-2xl font-black">Loja Husky 💙</h1>
          </div>
          <div className="flex gap-4">
            <Link to="/app/carrinho" title="Carrinho">
              <ShoppingBag className="h-7 w-7" />
            </Link>
            <Menu className="h-7 w-7" />
          </div>
        </div>
        <div className="mt-4">
          <Input placeholder="Pesquisar potinhos..." value={search} onChange={(event) => setSearch(event.target.value)} leftIcon={<Search className="h-4 w-4" />} />
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 soft-scrollbar">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-black transition ${
                filter === item
                  ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                  : 'border-black/10 bg-white text-black dark:border-white/10 dark:bg-white/5 dark:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      {products.loading ? (
        <LoadingSpinner />
      ) : filtered.length ? (
        <div className="grid grid-cols-2 gap-0.5 bg-white dark:bg-[#0d1118] sm:grid-cols-3 lg:rounded-b-[12px] lg:border-x lg:border-b lg:border-black/10 lg:dark:border-white/10">
          {filtered.map((product) => {
            const price = Number(product.promotional_price ?? product.price);
            return (
              <div key={product.id} className="group relative aspect-square overflow-hidden bg-black">
                <Link to={`/app/produtos/${product.slug}`} className="block h-full">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="grid h-full place-items-center bg-husky-beige text-husky-brown">
                      <ShoppingBag className="h-10 w-10" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/78 to-transparent p-3 text-white">
                    <p className="line-clamp-1 text-sm font-black">{product.name}</p>
                    <p className="text-xs font-semibold">{formatCurrency(price)}</p>
                  </div>
                </Link>
                <button
                  type="button"
                  disabled={!product.is_available}
                  onClick={() => {
                    addToCart(product);
                    toast.success('Entrou no carrinho 🛒', product.name);
                  }}
                  className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white text-black shadow-card transition hover:scale-105 disabled:opacity-50"
                  title="Adicionar ao carrinho"
                >
                  <ShoppingBag className="h-5 w-5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState title="Esse pote sumiu da matilha" description="Tente outro filtro ou volte mais tarde." />
      )}
    </div>
  );
}
