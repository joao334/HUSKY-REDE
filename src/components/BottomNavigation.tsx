import { ClipboardList, Home, Trophy, UserRound, Utensils } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../utils/cn';

const items = [
  { to: '/app/feed', label: 'Feed', icon: Home, emoji: '✨' },
  { to: '/app/loja', label: 'Loja', icon: Utensils, emoji: '🍰' },
  { to: '/app/pedidos', label: 'Pedidos', icon: ClipboardList, emoji: '🧾' },
  { to: '/app/matilha', label: 'Matilha', icon: Trophy, emoji: '🏆' },
  { to: '/app/perfil', label: 'Perfil', icon: UserRound, emoji: '💙' },
];

export function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-husky-blue/10 bg-husky-cream/95 px-2 py-2 shadow-soft backdrop-blur md:hidden dark:border-white/10 dark:bg-[#171b22]/95 safe-bottom">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 rounded-brand px-2 py-2 text-[11px] font-bold transition',
                  isActive
                    ? 'bg-husky-blue text-white'
                    : 'text-husky-brown/70 hover:bg-husky-beige/35 dark:text-husky-cream/70 dark:hover:bg-white/8',
                )
              }
            >
              <span className="text-lg leading-none" aria-hidden="true">{item.emoji}</span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
