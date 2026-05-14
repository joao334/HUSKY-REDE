import { AdminCrudPage } from './AdminCrudPage';

export function AdminCouponsPage() {
  return (
    <AdminCrudPage
      table="coupons"
      eyebrow="Achadinhos"
      title="Cupons Admin"
      description="Configure descontos por porcentagem, valor fixo, frete grátis ou brinde."
      getTitle={(row) => String(row.code)}
      fields={[
        { name: 'code', label: 'Código' },
        { name: 'description', label: 'Descrição', type: 'textarea' },
        { name: 'discount_type', label: 'Tipo de desconto', type: 'select', options: ['percentage', 'fixed', 'free_shipping', 'gift'] },
        { name: 'discount_value', label: 'Valor', type: 'number' },
        { name: 'starts_at', label: 'Data de início', type: 'datetime' },
        { name: 'ends_at', label: 'Data de fim', type: 'datetime' },
        { name: 'max_uses', label: 'Uso máximo', type: 'number' },
        { name: 'uses_per_customer', label: 'Uso por cliente', type: 'number' },
        { name: 'minimum_order_value', label: 'Valor mínimo do pedido', type: 'number' },
        { name: 'product_id', label: 'Produto específico opcional' },
        { name: 'category', label: 'Categoria específica opcional' },
        { name: 'is_active', label: 'Ativo', type: 'boolean' },
      ]}
    />
  );
}
