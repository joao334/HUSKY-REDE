import { Menu, Moon, Sun, LogOut } from 'lucide-react';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const quickLinks = [
  ['Dashboard', '/admin'],
  ['Pedidos', '/admin/pedidos'],
  ['Produtos', '/admin/produtos'],
  ['Relatórios', '/admin/relatorios'],
  ['Configurações', '/admin/configuracoes'],
];

export function AdminLayout() {
  const { profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (profile?.role !== 'admin') return <Navigate to="/app/feed" replace />;

  return (
    <div className="min-h-screen text-husky-cocoa dark:text-husky-cream">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <AdminSidebar />
        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-husky-blue/10 bg-husky-cream/85 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-[#171b22]/85 lg:px-8">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="xl:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <p className="text-xs font-bold uppercase text-husky-blue">Painel Husky Confeiteiro</p>
                <h1 className="text-lg font-black">Gestão completa da matilha</h1>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <Avatar src={profile?.avatar_url} name={profile?.name} />
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 xl:hidden soft-scrollbar">
              {quickLinks.map(([label, to]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/admin'}
                  className={({ isActive }) =>
                    `shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                      isActive
                        ? 'bg-husky-blue text-white'
                        : 'bg-white/65 text-husky-brown dark:bg-white/8 dark:text-husky-cream'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </header>
          <div className="px-4 py-5 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
