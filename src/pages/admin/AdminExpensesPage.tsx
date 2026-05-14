import { AdminCrudPage } from './AdminCrudPage';

export function AdminExpensesPage() {
  return (
    <AdminCrudPage
      table="expenses"
      eyebrow="Financeiro"
      title="Despesas"
      description="Registre ingredientes, embalagens, entregas, marketing, taxas, equipamentos e outros."
      getTitle={(row) => String(row.description)}
      fields={[
        { name: 'description', label: 'Descrição' },
        { name: 'category', label: 'Categoria', type: 'select', options: ['Ingredientes', 'Embalagens', 'Entregas', 'Marketing', 'Taxas', 'Equipamentos', 'Outros'] },
        { name: 'amount', label: 'Valor', type: 'number' },
        { name: 'date', label: 'Data', type: 'date' },
        { name: 'payment_method', label: 'Forma de pagamento' },
        { name: 'receipt_url', label: 'Comprovante', type: 'media' },
        { name: 'observation', label: 'Observação', type: 'textarea' },
      ]}
    />
  );
}
