import { AdminCrudPage } from './AdminCrudPage';

export function AdminPollsPage() {
  return (
    <AdminCrudPage
      table="polls"
      eyebrow="Participação"
      title="Enquetes Admin"
      description="Crie perguntas para a matilha votar. As opções podem ser cadastradas no Supabase em poll_options."
      getTitle={(row) => String(row.question)}
      fields={[
        { name: 'question', label: 'Pergunta', type: 'textarea' },
        { name: 'starts_at', label: 'Data de início', type: 'datetime' },
        { name: 'ends_at', label: 'Data final', type: 'datetime' },
        { name: 'is_active', label: 'Ativa', type: 'boolean' },
      ]}
    />
  );
}
