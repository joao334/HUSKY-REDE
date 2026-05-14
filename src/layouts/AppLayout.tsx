import {
  Bell,
  ClipboardList,
  Gift,
  Home,
  LogOut,
  MessageCircle,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  Trophy,
  UserRound,
  Utensils,
  Vote,
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar';
import { BottomNavigation } from '../components/BottomNavigation';
import { BrandMark } from '../components/BrandMark';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../utils/cn';

const navItems = [
  { to: '/app/feed', label: 'Feed', icon: Home, emoji: '✨' },
  { to: '/app/loja', label: 'Loja', icon: Utensils, emoji: '🍰' },
  { to: '/app/pedidos', label: 'Pedidos', icon: ClipboardList, emoji: '🧾' },
  { to: '/app/matilha', label: 'Clube da Matilha', icon: Trophy, emoji: '🐾' },
  { to: '/app/ranking', label: 'Ranking', icon: Trophy, emoji: '🏆' },
  { to: '/app/cupons', label: 'Cupons', icon: Gift, emoji: '🎟️' },
  { to: '/app/notificacoes', label: 'Notificações', icon: Bell, emoji: '🔔' },
  { to: '/app/chat', label: 'Chat', icon: MessageCircle, emoji: '💬' },
  { to: '/app/enquetes', label: 'Enquetes', icon: Vote, emoji: '📊' },
  { to: '/app/perfil', label: 'Perfil', icon: UserRound, emoji: '💙' },
];

export function AppLayout() {
  const { profile, logout } = useAuth();
  const { items } = useCart();
  const { theme, toggleTheme } = useTheme();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen text-husky-cocoa dark:text-husky-cream">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-husky-blue/10 bg-white/62 p-4 backdrop-blur lg:block dark:border-white/10 dark:bg-white/5">
          <BrandMark />
          <nav className="mt-8 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-brand px-3 py-2.5 text-sm font-bold transition',
                      isActive
                        ? 'bg-husky-blue text-white shadow-card'
                        : 'text-husky-brown/75 hover:bg-husky-beige/35 dark:text-husky-cream/75 dark:hover:bg-white/8',
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span aria-hidden="true">{item.emoji}</span>
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 pb-28 md:pb-8">
          <header className="sticky top-0 z-30 border-b border-husky-blue/10 bg-husky-cream/80 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-[#171b22]/80 lg:px-8">
            <div className="mx-auto flex max-w-6xl items-center gap-3">
              <div className="lg:hidden">
                <BrandMark compact />
              </div>
              <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-husky-brown/55 ring-1 ring-husky-blue/10 dark:bg-white/8 dark:text-husky-cream/55 md:flex">
                <Search className="h-4 w-4" />
                <span className="text-sm font-semibold">Buscar posts, potinhos e achadinhos</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <NavLink to="/app/carrinho" className="relative">
                  <Button variant="outline" size="icon">
                    <ShoppingBag className="h-5 w-5" />
                    Carrinho 🛒
                  </Button>
                  {cartCount ? (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-husky-brown px-1 text-[11px] font-black text-white">
                      {cartCount}
                    </span>
                  ) : null}
                </NavLink>
                <NavLink to="/app/notificacoes">
                  <Button variant="outline" size="icon">
                    <Bell className="h-5 w-5" />
                    Notificações 🔔
                  </Button>
                </NavLink>
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  Tema ✨
                </Button>
                <NavLink to="/app/perfil" className="hidden sm:block">
                  <Avatar src={profile?.avatar_url} name={profile?.name} />
                </NavLink>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                  Sair 👋
                </Button>
              </div>
            </div>
          </header>
          <div className="mx-auto max-w-6xl px-4 py-5 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
}
