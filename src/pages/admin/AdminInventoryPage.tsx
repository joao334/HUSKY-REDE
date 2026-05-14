import { AdminCrudPage } from './AdminCrudPage';

export function AdminInventoryPage() {
  return (
    <AdminCrudPage
      table="inventory_items"
      eyebrow="Cozinha"
      title="Estoque"
      description="Controle ingredientes, embalagens, fornecedores, quantidades mínimas e alertas."
      getTitle={(row) => String(row.name)}
      afterLoad={(rows) =>
        rows.map((row) => ({
          ...row,
          status:
            Number(row.current_quantity) <= Number(row.minimum_quantity) * 0.5
              ? 'Crítico'
              : Number(row.current_quantity) <= Number(row.minimum_quantity)
                ? 'Baixo'
                : 'Normal',
        }))
      }
      fields={[
        { name: 'name', label: 'Nome' },
        { name: 'category', label: 'Categoria', type: 'select', options: ['Ingredientes', 'Embalagens', 'Limpeza', 'Outros'] },
        { name: 'unit', label: 'Unidade de medida' },
        { name: 'current_quantity', label: 'Quantidade atual', type: 'number' },
        { name: 'minimum_quantity', label: 'Quantidade mínima', type: 'number' },
        { name: 'unit_cost', label: 'Custo unitário', type: 'number' },
        { name: 'supplier', label: 'Fornecedor' },
        { name: 'last_purchase_date', label: 'Data da última compra', type: 'date' },
      ]}
    />
  );
}
