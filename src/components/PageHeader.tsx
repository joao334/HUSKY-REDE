import { ReactNode } from 'react';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="text-xs font-black uppercase text-husky-blue">{eyebrow}</p> : null}
        <h1 className="mt-1 text-2xl font-black tracking-normal text-husky-cocoa dark:text-husky-cream sm:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-husky-brown/72 dark:text-husky-cream/72">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
