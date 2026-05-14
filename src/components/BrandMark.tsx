import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';
import { huskyBrand } from '../config/huskyBrand';

export function BrandMark({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn('flex items-center gap-3', className)}>
      <img src={huskyBrand.assets.logo} alt="Husky Club" className="h-12 w-12 rounded-brand object-cover shadow-card" />
      {!compact ? (
        <span>
          <span className="block text-lg font-black leading-none text-husky-cocoa dark:text-husky-cream">Husky Club</span>
          <span className="mt-1 block text-xs font-bold text-husky-blue">A rede doce da matilha.</span>
        </span>
      ) : null}
    </Link>
  );
}
