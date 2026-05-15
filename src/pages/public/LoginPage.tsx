import { Heart, Home, PlusSquare, Search, ShoppingBag, UserRound } from 'lucide-react';
import { Navigate, useLocation } from 'react-router-dom';
import { GoogleSignInButton } from '../../components/GoogleSignInButton';
import { useAuth } from '../../contexts/AuthContext';
import { huskyBrand } from '../../config/huskyBrand';

function cleanRedirect(path?: string) {
  if (!path) return '/app/feed';
  if (path.startsWith('/admin')) return path;
  if (path.startsWith('/app')) return path;
  return '/app/feed';
}

export function LoginPage() {
  const { loginWithGoogle, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const from = cleanRedirect((location.state as { from?: string } | null)?.from);

  if (!loading && isAuthenticated) return <Navigate to={isAdmin ? '/admin' : '/app/feed'} replace />;

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#577fac_0,#3b6da6_28%,#d9578d_62%,#edd8ab_100%)] px-5 py-8 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden justify-center lg:flex">
          <div className="phone-shell relative h-[620px] w-[310px] overflow-hidden bg-white text-[#111]">
            <div className="phone-notch" />
            <div className="flex h-full flex-col pt-9">
              <div className="flex items-center justify-between px-4 py-3">
                <p className="husky-script text-3xl font-black text-[#111]">Husky Club</p>
                <div className="flex gap-3">
                  <PlusSquare className="h-5 w-5" />
                  <Heart className="h-5 w-5" />
                </div>
              </div>
              <div className="flex gap-3 overflow-hidden border-b border-black/10 px-4 pb-3">
                {[huskyBrand.assets.mascot, huskyBrand.assets.brigadeiro, huskyBrand.assets.maracuja, huskyBrand.assets.prestigio].map((src, index) => (
                  <div key={src} className="w-16 shrink-0 text-center">
                    <div className="insta-ring h-16 w-16 rounded-full p-0.5">
                      <img src={src} alt="" className="h-full w-full rounded-full object-cover" />
                    </div>
                    <p className="mt-1 truncate text-[10px] font-semibold">{index === 0 ? 'Seu story' : ['brAUnie', 'Abana', 'Prestigio'][index - 1]}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 px-4 py-3">
                <img src={huskyBrand.assets.logo} alt="" className="h-8 w-8 rounded-full object-cover" />
                <p className="text-sm font-black">@{huskyBrand.instagramHandle}</p>
              </div>
              <img src={huskyBrand.assets.hero} alt="Husky Club preview" className="aspect-square w-full object-cover" />
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex gap-4">
                  <Heart className="h-6 w-6" />
                  <Search className="h-6 w-6" />
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <UserRound className="h-6 w-6" />
              </div>
              <div className="px-4 text-sm">
                <p className="font-black">1.284 patinhas</p>
                <p><span className="font-black">huskyconfeiteiro</span> A rede doce da matilha. 💙</p>
              </div>
              <div className="mt-auto grid grid-cols-5 border-t border-black/10 px-5 py-3">
                <Home className="h-6 w-6" />
                <Search className="h-6 w-6" />
                <PlusSquare className="h-6 w-6" />
                <ShoppingBag className="h-6 w-6" />
                <UserRound className="h-6 w-6" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[390px]">
          <div className="rounded-[28px] border border-white/24 bg-white/92 p-7 text-husky-cocoa shadow-[0_30px_90px_rgba(0,0,0,0.25)] backdrop-blur dark:bg-[#11151c]/92 dark:text-husky-cream">
            <div className="text-center">
              <img src={huskyBrand.assets.logo} alt="Husky Club" className="mx-auto h-20 w-20 rounded-[24px] object-cover shadow-card" />
              <h1 className="husky-script mt-5 text-5xl font-black text-husky-cocoa dark:text-white">Husky Club</h1>
              <p className="mt-2 text-sm font-semibold text-husky-brown/68 dark:text-husky-cream/70">A rede doce da matilha.</p>
            </div>

            <div className="mt-8">
              <GoogleSignInButton isLoading={loading} onClick={() => loginWithGoogle(from)} />
            </div>

            <div className="my-6 flex items-center gap-4 text-xs font-black uppercase text-husky-brown/45 dark:text-husky-cream/45">
              <span className="h-px flex-1 bg-husky-blue/15" />
              perfil unico por cliente
              <span className="h-px flex-1 bg-husky-blue/15" />
            </div>

            <p className="text-center text-sm leading-6 text-husky-brown/70 dark:text-husky-cream/70">
              Entre para postar stories, curtir potinhos, comprar doces e acompanhar suas patinhas.
            </p>
          </div>

          <div className="mt-4 rounded-[20px] border border-white/24 bg-white/70 p-4 text-center text-sm font-bold text-husky-cocoa shadow-card backdrop-blur dark:bg-[#11151c]/80 dark:text-husky-cream">
            Se for sua primeira vez, a conta e criada automaticamente com o Google.
          </div>
        </section>
      </div>
    </main>
  );
}
