import { ReactNode } from 'react';
import { EmptyState } from './EmptyState';

export type DataTableColumn<T> = {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
};

type DataTableProps<T> = {
  rows: T[];
  columns: Array<DataTableColumn<T>>;
  getRowKey: (row: T) => string;
  emptyTitle?: string;
};

export function DataTable<T>({ rows, columns, getRowKey, emptyTitle = 'Nada por aqui ainda.' }: DataTableProps<T>) {
  if (!rows.length) return <EmptyState title={emptyTitle} description="Quando aparecer, a Husky organiza tudo aqui." />;

  return (
    <div className="overflow-hidden rounded-brand border border-husky-blue/10 bg-white/80 shadow-card dark:border-white/10 dark:bg-white/8">
      <div className="overflow-x-auto soft-scrollbar">
        <table className="min-w-full divide-y divide-husky-blue/10 text-left text-sm dark:divide-white/10">
          <thead className="bg-husky-blue/8 text-xs uppercase text-husky-brown/70 dark:bg-white/5 dark:text-husky-cream/60">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className={`whitespace-nowrap px-4 py-3 font-black ${column.className ?? ''}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-husky-blue/10 dark:divide-white/10">
            {rows.map((row) => (
              <tr key={getRowKey(row)} className="text-husky-cocoa transition hover:bg-husky-beige/18 dark:text-husky-cream dark:hover:bg-white/5">
                {columns.map((column) => (
                  <td key={column.header} className={`px-4 py-3 align-middle ${column.className ?? ''}`}>
                    {typeof column.accessor === 'function' ? column.accessor(row) : (row[column.accessor] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
