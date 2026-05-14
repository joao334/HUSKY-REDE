import { ReactNode } from 'react';
import { Card } from './ui/Card';
import { cn } from '../utils/cn';

type DashboardCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
  helper?: string;
};

export function DashboardCard({ label, value, icon, helper }: DashboardCardProps) {
  const longValue = value.length > 16;

  return (
    <Card className="p-4">
      <div className={cn('flex items-start justify-between gap-4', longValue && 'flex-col')}>
        <div>
          <p className="text-sm font-semibold text-husky-brown/65 dark:text-husky-cream/65">{label}</p>
          <p
            className={cn(
              'mt-2 break-words font-black text-husky-cocoa dark:text-husky-cream',
              longValue ? 'text-lg leading-tight' : 'text-2xl',
            )}
          >
            {value}
          </p>
          {helper ? <p className="mt-1 text-xs text-husky-brown/60 dark:text-husky-cream/60">{helper}</p> : null}
        </div>
        <div className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-brand bg-husky-blue/12 text-husky-blue dark:bg-husky-blue/25 dark:text-husky-cream', longValue && 'order-first')}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
