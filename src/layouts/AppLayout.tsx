import {
  Bell,
  Gift,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  Moon,
  PlusSquare,
  Search,
  ShoppingBag,
  Sun,
  Trophy,
  UserRound,
  Utensils,
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar';
import { BottomNavigation } from '../components/BottomNavigation';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../utils/cn';

const navItems = [
  { to: '/app/feed', label: 'Feed', icon: Home },
  { to: '/app/loja', label: 'Loja', icon: Utensils },
  { to: '/app/feed', label: 'Criar', icon: PlusSquare },
  { to: '/app/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { to: '/app/matilha', label: 'Matilha', icon: Trophy },
  { to: '/app/cupons', label: 'Cupons', icon: Gift },
  { to: '/app/notificacoes', label: 'Avisos', icon: Bell },
  { to: '/app/chat', label: 'Chat', icon: MessageCircle },
  { to: '/app/perfil', label: 'Perfil', icon: UserRound },
];

export function AppLayout() {
  const { profile, logout } = useAuth();
  const { items } = useCart();
  const { theme, toggleTheme } = useTheme();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] dark:bg-[#080b10] dark:text-husky-cream">
      <div className="mx-auto flex min-h-screen max-w-[1280px]">
        <aside className="sticky top-0 hidden h-screen w-[245px] shrink-0 border-r border-black/10 bg-white px-5 py-6 lg:block dark:border-white/10 dark:bg-[#0d1118]">
          <NavLink to="/app/feed" className="husky-script mb-8 block text-4xl font-black text-husky-cocoa dark:text-white">
            Husky Club
          </NavLink>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={`${item.to}-${item.label}`}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-4 rounded-[12px] px-3 py-3 text-[15px] font-semibold transition',
                      isActive
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'text-[#171717] hover:bg-black/5 dark:text-husky-cream dark:hover:bg-white/10',
                    )
                  }
                >
                  <Icon className="h-6 w-6" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
          <div className="absolute bottom-6 left-5 right-5 space-y-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex w-full items-center gap-4 rounded-[12px] px-3 py-3 text-left text-[15px] font-semibold hover:bg-black/5 dark:hover:bg-white/10"
            >
              {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              Tema
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-4 rounded-[12px] px-3 py-3 text-left text-[15px] font-semibold hover:bg-black/5 dark:hover:bg-white/10"
            >
              <LogOut className="h-6 w-6" />
              Sair
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
          <header className="sticky top-0 z-30 border-b border-black/10 bg-white/95 px-4 py-3 backdrop-blur lg:hidden dark:border-white/10 dark:bg-[#0d1118]/95">
            <div className="flex items-center justify-between">
              <NavLink to="/app/feed" className="husky-script text-3xl font-black text-[#111] dark:text-white">
                Husky Club
              </NavLink>
              <div className="flex items-center gap-4">
                <NavLink to="/app/feed" title="Criar">
                  <PlusSquare className="h-6 w-6" />
                </NavLink>
                <NavLink to="/app/notificacoes" title="Avisos">
                  <Heart className="h-6 w-6" />
                </NavLink>
                <NavLink to="/app/carrinho" className="relative" title="Carrinho">
                  <ShoppingBag className="h-6 w-6" />
                  {cartCount ? (
                    <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-husky-blue px-1 text-[11px] font-black text-white">
                      {cartCount}
                    </span>
                  ) : null}
                </NavLink>
              </div>
            </div>
          </header>

          <div className="mx-auto grid max-w-[975px] gap-8 px-0 py-0 lg:grid-cols-[minmax(0,630px)_300px] lg:px-6 lg:py-8">
            <div className="min-w-0">
              <Outlet />
            </div>
            <aside className="sticky top-8 hidden h-fit space-y-5 lg:block">
              <div className="flex items-center gap-3">
                <Avatar src={profile?.avatar_url} name={profile?.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black">{profile?.name ?? 'Cliente da Matilha'}</p>
                  <p className="truncate text-xs font-semibold text-black/50 dark:text-white/50">@huskyclub</p>
                </div>
                <NavLink to="/app/perfil" className="text-xs font-black text-husky-blue">
                  Perfil
                </NavLink>
              </div>
              <div className="rounded-[16px] border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-black/50 dark:text-white/50">Atalhos da matilha</p>
                  <NavLink to="/app/ranking" className="text-xs font-black text-husky-blue">
                    Ver ranking
                  </NavLink>
                </div>
                <div className="mt-4 space-y-3 text-sm font-semibold">
                  <NavLink to="/app/loja" className="flex items-center gap-3">
                    <Search className="h-5 w-5" /> Explorar potinhos
                  </NavLink>
                  <NavLink to="/app/cupons" className="flex items-center gap-3">
                    <Gift className="h-5 w-5" /> Cupons liberados
                  </NavLink>
                  <NavLink to="/app/chat" className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5" /> Falar com a Husky
                  </NavLink>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
}
