import { Home, PlusSquare, Search, ShoppingBag, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../utils/cn';

const items = [
  { to: '/app/feed', label: 'Feed', icon: Home },
  { to: '/app/loja', label: 'Explorar', icon: Search },
  { to: '/app/feed', label: 'Criar', icon: PlusSquare },
  { to: '/app/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { to: '/app/perfil', label: 'Perfil', icon: UserRound },
];

export function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/96 px-4 py-2 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur md:hidden dark:border-white/10 dark:bg-[#0d1118]/96 safe-bottom">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex h-11 items-center justify-center rounded-[12px] transition',
                  isActive ? 'text-black dark:text-white' : 'text-black/70 dark:text-white/70',
                )
              }
              title={item.label}
            >
              <Icon className="h-7 w-7" />
              <span className="sr-only">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
