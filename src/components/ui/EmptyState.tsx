import { ReactNode } from 'react';
import { PawPrint } from 'lucide-react';
import { Button } from './Button';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="rounded-brand border border-dashed border-husky-blue/25 bg-white/60 p-8 text-center shadow-card dark:border-white/10 dark:bg-white/5">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-husky-beige text-husky-brown">
        {icon ?? <PawPrint className="h-8 w-8" />}
      </div>
      <h3 className="mt-4 text-lg font-black text-husky-cocoa dark:text-husky-cream">{title}</h3>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm text-husky-brown/70 dark:text-husky-cream/70">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
