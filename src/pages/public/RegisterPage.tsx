import { Link } from 'react-router-dom';
import { BrandMark } from '../../components/BrandMark';
import { GoogleSignInButton } from '../../components/GoogleSignInButton';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';

export function RegisterPage() {
  const { loginWithGoogle, loading } = useAuth();

  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <Card className="w-full max-w-md p-6">
        <BrandMark />
        <h1 className="mt-8 text-3xl font-black text-husky-cocoa dark:text-husky-cream">Criar conta</h1>
        <p className="mt-2 text-sm leading-6 text-husky-brown/70 dark:text-husky-cream/70">
          Sua conta é criada com Google. No primeiro acesso, você entra como cliente da matilha.
        </p>

        <div className="mt-6">
          <GoogleSignInButton label="Criar conta com Google" isLoading={loading} onClick={() => loginWithGoogle('/app/feed')} />
        </div>

        {!isSupabaseConfigured ? (
          <p className="mt-4 rounded-brand bg-husky-beige/35 p-3 text-xs font-semibold text-husky-brown dark:bg-white/8 dark:text-husky-cream/75">
            O cadastro Google precisa do Supabase configurado.
          </p>
        ) : null}

        <Link to="/" className="mt-5 inline-block text-sm font-bold text-husky-blue">
          Voltar
        </Link>
      </Card>
    </main>
  );
}
