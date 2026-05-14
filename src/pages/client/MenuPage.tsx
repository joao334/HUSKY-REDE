import { useMemo, useState } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { ProductCard } from '../../components/ProductCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Tabs } from '../../components/ui/Tabs';
import { useAuth } from '../../contexts/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';

const filters = ['Todos', 'Bolos de pote', 'Brownies', 'Combos', 'Bebidas', 'Promoções', 'Mais vendidos', 'Favoritos', 'Disponíveis'];

export function MenuPage() {
  const { profile } = useAuth();
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const products = useAsync(() => dataService.getProducts({ userId: profile?.id }), [profile?.id]);

  const filtered = useMemo(() => {
    let rows = products.data ?? [];
    if (filter === 'Mais vendidos') rows = rows.filter((product) => product.is_best_seller);
    else if (filter === 'Favoritos') rows = rows.filter((product) => product.is_favorite);
    else if (filter === 'Disponíveis') rows = rows.filter((product) => product.is_available);
    else if (filter !== 'Todos' && filter !== 'Promoções' && filter !== 'Combos') rows = rows.filter((product) => product.category === filter);
    else if (filter === 'Promoções') rows = rows.filter((product) => product.promotional_price);
    else if (filter === 'Combos') rows = rows.filter((product) => product.category === 'Combos');
    if (search.trim()) {
      const term = search.toLowerCase();
      rows = rows.filter((product) => `${product.name} ${product.short_description} ${product.category}`.toLowerCase().includes(term));
    }
    return rows;
  }, [filter, products.data, search]);

  return (
    <div>
      <PageHeader
        eyebrow="Cardápio"
        title="Escolha seu potinho"
        description="Bolos de pote, brownies e achadinhos doces para montar o pedido da matilha."
      />
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
        <Input placeholder="Buscar delícias..." value={search} onChange={(event) => setSearch(event.target.value)} leftIcon={<Search className="h-4 w-4" />} />
        <Link to="/app/carrinho" className="hidden md:block">
          <button className="h-12 rounded-full bg-husky-blue px-5 font-bold text-white shadow-soft">
            <ShoppingBag className="mr-2 inline h-4 w-4" />
            Ver carrinho
          </button>
        </Link>
      </div>
      <Tabs items={filters} value={filter} onChange={setFilter} />
      <div className="mt-5">
        {products.loading ? (
          <LoadingSpinner />
        ) : filtered.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState title="Esse pote sumiu da matilha" description="Tente outro filtro ou volte mais tarde." />
        )}
      </div>
    </div>
  );
}
