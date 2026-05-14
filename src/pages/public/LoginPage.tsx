import { Link, useLocation } from 'react-router-dom';
import { BrandMark } from '../../components/BrandMark';
import { GoogleSignInButton } from '../../components/GoogleSignInButton';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

function cleanRedirect(path?: string) {
  if (!path) return '/app/feed';
  if (path.startsWith('/admin')) return path;
  if (path.startsWith('/app')) return path;
  return '/app/feed';
}

export function LoginPage() {
  const { loginWithGoogle, loading } = useAuth();
  const location = useLocation();
  const from = cleanRedirect((location.state as { from?: string } | null)?.from);

  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <Card className="w-full max-w-md p-6">
        <BrandMark />
        <h1 className="mt-8 text-3xl font-black text-husky-cocoa dark:text-husky-cream">Entrar no Husky Club</h1>
        <p className="mt-2 text-sm leading-6 text-husky-brown/70 dark:text-husky-cream/70">
          Use sua conta Google para acessar seu perfil, pedidos, patinhas e cupons.
        </p>

        <div className="mt-6">
          <GoogleSignInButton isLoading={loading} onClick={() => loginWithGoogle(from)} />
        </div>

        <Link to="/" className="mt-5 inline-block text-sm font-bold text-husky-blue">
          Voltar
        </Link>
      </Card>
    </main>
  );
}
