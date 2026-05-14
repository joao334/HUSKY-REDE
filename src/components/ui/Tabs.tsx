import { cn } from '../../utils/cn';

type TabsProps = {
  items: string[];
  value: string;
  onChange: (value: string) => void;
};

export function Tabs({ items, value, onChange }: TabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 soft-scrollbar" role="tablist">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={value === item}
          className={cn(
            'h-10 shrink-0 rounded-full px-4 text-sm font-bold transition',
            value === item
              ? 'bg-husky-blue text-white shadow-card'
              : 'bg-white/70 text-husky-brown hover:bg-husky-beige/40 dark:bg-white/8 dark:text-husky-cream',
          )}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
