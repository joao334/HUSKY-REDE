import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { huskyBrand } from '../config/huskyBrand';

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <Card className="max-w-md p-6 text-center">
        <img src={huskyBrand.assets.mascot} alt="Husky Club" className="mx-auto h-28 w-28 rounded-brand" />
        <h1 className="mt-5 text-3xl font-black">Essa trilha sumiu da matilha</h1>
        <p className="mt-2 text-sm text-husky-brown/70 dark:text-husky-cream/70">A página não foi encontrada, mas o cardápio continua quentinho.</p>
        <Link to="/app/feed" className="mt-5 inline-block">
          <Button>Voltar ao feed ✨</Button>
        </Link>
      </Card>
    </main>
  );
}
