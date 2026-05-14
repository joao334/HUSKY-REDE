import { AdminCrudPage } from './AdminCrudPage';

export function AdminRecipesPage() {
  return (
    <AdminCrudPage
      table="product_recipes"
      eyebrow="Ficha técnica"
      title="Ficha técnica dos produtos"
      description="Vincule ingredientes do estoque a cada produto para calcular custo, lucro bruto e margem."
      fields={[
        { name: 'product_id', label: 'Produto' },
        { name: 'inventory_item_id', label: 'Ingrediente usado' },
        { name: 'quantity_used', label: 'Quantidade usada', type: 'number' },
        { name: 'cost', label: 'Custo por ingrediente', type: 'number' },
      ]}
    />
  );
}
