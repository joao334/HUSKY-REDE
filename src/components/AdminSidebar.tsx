import {
  BarChart3,
  Boxes,
  ClipboardList,
  Cog,
  CreditCard,
  Home,
  MessageSquareText,
  MessagesSquare,
  Package,
  Percent,
  PieChart,
  ReceiptText,
  Star,
  Store,
  UsersRound,
  Vote,
  Images,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { BrandMark } from './BrandMark';
import { cn } from '../utils/cn';
import { huskyBrand } from '../config/huskyBrand';

const items = [
  { to: '/admin', label: 'Dashboard', icon: Home, emoji: huskyBrand.adminEmojis.dashboard },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList, emoji: huskyBrand.adminEmojis.orders },
  { to: '/admin/produtos', label: 'Produtos', icon: Store, emoji: huskyBrand.adminEmojis.products },
  { to: '/admin/posts', label: 'Posts', icon: MessageSquareText, emoji: huskyBrand.adminEmojis.channels },
  { to: '/admin/stories', label: 'Stories', icon: Images, emoji: huskyBrand.adminEmojis.banners },
  { to: '/admin/clientes', label: 'Clientes', icon: UsersRound, emoji: huskyBrand.adminEmojis.customers },
  { to: '/admin/chat', label: 'Chat', icon: MessagesSquare, emoji: huskyBrand.adminEmojis.chat },
  { to: '/admin/comentarios', label: 'Comentários', icon: MessageSquareText, emoji: huskyBrand.adminEmojis.manual },
  { to: '/admin/avaliacoes', label: 'Avaliações', icon: Star, emoji: huskyBrand.adminEmojis.reviews },
  { to: '/admin/estoque', label: 'Estoque', icon: Boxes, emoji: huskyBrand.adminEmojis.inventory },
  { to: '/admin/fichas', label: 'Fichas técnicas', icon: Package, emoji: huskyBrand.adminEmojis.kitchen },
  { to: '/admin/despesas', label: 'Despesas', icon: CreditCard, emoji: huskyBrand.adminEmojis.expenses },
  { to: '/admin/cupons', label: 'Cupons', icon: Percent, emoji: huskyBrand.adminEmojis.coupons },
  { to: '/admin/enquetes', label: 'Enquetes', icon: Vote, emoji: huskyBrand.adminEmojis.loyalty },
  { to: '/admin/relatorios', label: 'Relatórios', icon: PieChart, emoji: huskyBrand.adminEmojis.reports },
  { to: '/admin/configuracoes', label: 'Configurações', icon: Cog, emoji: huskyBrand.adminEmojis.settings },
];

export function AdminSidebar() {
  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-husky-blue/10 bg-white/72 p-4 backdrop-blur xl:block dark:border-white/10 dark:bg-white/5">
      <BrandMark />
      <nav className="mt-8 space-y-1 overflow-y-auto pb-4 soft-scrollbar">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
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
      <div className="mt-4 rounded-brand bg-husky-beige/45 p-4 text-sm text-husky-brown">
        <p className="font-black">Gestão da cozinha</p>
        <p className="mt-1">Pedidos, estoque, patinhas e achadinhos no mesmo painel.</p>
      </div>
    </aside>
  );
}
