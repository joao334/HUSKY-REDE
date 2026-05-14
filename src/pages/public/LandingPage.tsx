import { Link } from 'react-router-dom';
import { Gift, HeartHandshake, MessageCircleHeart, PawPrint, ShoppingBag, Sparkles } from 'lucide-react';
import { BrandMark } from '../../components/BrandMark';
import { ProductCard } from '../../components/ProductCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAsync } from '../../hooks/useAsync';
import { huskyBrand } from '../../config/huskyBrand';
import { dataService } from '../../services/dataService';

const features = [
  { title: 'Veja novidades', text: 'Posts, stories e lançamentos direto da cozinha.', icon: Sparkles, emoji: '✨' },
  { title: 'Faça pedidos', text: 'Cardápio digital, carrinho e WhatsApp pronto.', icon: ShoppingBag, emoji: '🛒' },
  { title: 'Ganhe patinhas', text: 'Compras, comentários e avaliações viram pontos.', icon: PawPrint, emoji: '🐾' },
  { title: 'Use cupons', text: 'Achadinhos especiais para adoçar o pedido.', icon: Gift, emoji: '🎟️' },
  { title: 'Participe da matilha', text: 'Enquetes, ranking, chat e recompensas.', icon: HeartHandshake, emoji: '💙' },
];

export function LandingPage() {
  const { data: products, loading } = useAsync(() => dataService.getProducts({ featuredOnly: true, availableOnly: true }), []);
  const { data: reviews } = useAsync(() => dataService.getProductReviews(), []);

  return (
    <main className="min-h-screen text-husky-cocoa dark:text-husky-cream">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <BrandMark />
        <div className="flex gap-2">
          <Link to="/login">
            <Button variant="outline">Entrar com Google</Button>
          </Link>
          <Link to="/cadastro" className="hidden sm:block">
            <Button>Criar conta 💙</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-8 px-4 pb-10 pt-4 sm:px-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="max-w-2xl">
          <p className="inline-flex rounded-full bg-husky-beige px-4 py-2 text-sm font-black text-husky-brown shadow-card">
            Husky Club 💙 Embu das Artes
          </p>
          <h1 className="mt-5 text-5xl font-black tracking-normal text-husky-cocoa dark:text-husky-cream sm:text-6xl lg:text-7xl">
            A rede doce da matilha.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-husky-brown/76 dark:text-husky-cream/76">
            Entre com Google para ver posts, comprar potinhos, ganhar patinhas e acompanhar seus pedidos.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/login">
              <Button size="lg" leftIcon={<PawPrint className="h-5 w-5" />}>
                Entrar com Google
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button size="lg" variant="cream">
                Criar conta 💙
              </Button>
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {features.slice(0, 4).map((feature) => (
                <div key={feature.title} className="flex gap-3 rounded-brand bg-white/70 p-3 shadow-card dark:bg-white/8">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-brand bg-husky-blue text-white">
                    <span className="text-lg" aria-hidden="true">{feature.emoji}</span>
                  </span>
                  <span>
                    <span className="block font-black">{feature.title}</span>
                    <span className="mt-1 block text-sm text-husky-brown/68 dark:text-husky-cream/68">{feature.text}</span>
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-8 rounded-full bg-husky-beige/50 blur-3xl" />
          <Card className="relative overflow-hidden p-4">
            <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-brand bg-gradient-to-br from-husky-blue to-husky-sky p-5 text-white">
                <img src={huskyBrand.assets.mascot} alt="Mascote Husky Confeiteiro" className="mx-auto h-64 w-64 animate-floaty rounded-brand object-cover shadow-soft" />
                <p className="mt-4 text-center text-sm font-bold opacity-90">Mascote oficial da Husky Confeiteiro</p>
              </div>
              <div className="space-y-3">
                {features.map((feature) => (
                    <div key={feature.title} className="rounded-brand bg-husky-cream/80 p-4 dark:bg-white/8">
                      <span className="text-xl" aria-hidden="true">{feature.emoji}</span>
                      <h3 className="mt-2 font-black">{feature.title}</h3>
                      <p className="mt-1 text-sm text-husky-brown/68 dark:text-husky-cream/68">{feature.text}</p>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-husky-blue">Cardápio em destaque</p>
            <h2 className="mt-1 text-3xl font-black">Potinhos que a matilha ama</h2>
          </div>
          <Link to="/login">
            <Button variant="outline">Ver no app 🍰</Button>
          </Link>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(products ?? []).slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {(reviews ?? []).slice(0, 3).map((review) => (
            <Card key={review.id} className="p-5">
              <MessageCircleHeart className="h-7 w-7 text-husky-blue" />
              <p className="mt-4 text-sm leading-6 text-husky-brown/75 dark:text-husky-cream/75">“{review.comment}”</p>
              <p className="mt-4 font-black">{review.profile?.name ?? 'Cliente da Matilha'}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-husky-blue/10 bg-white/55 px-4 py-8 dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-husky-brown/75 dark:text-husky-cream/75 md:flex-row md:items-center md:justify-between">
          <BrandMark />
          <p>
            <a href={huskyBrand.instagramUrl} target="_blank" rel="noreferrer" className="font-bold text-husky-blue">
              @{huskyBrand.instagramHandle}
            </a>{' '}
            · WhatsApp {huskyBrand.whatsapp} · {huskyBrand.city}/{huskyBrand.state} · terça a quinta 14h-21h
          </p>
        </div>
      </footer>
    </main>
  );
}
