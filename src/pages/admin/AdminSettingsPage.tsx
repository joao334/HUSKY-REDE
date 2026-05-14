import { AdminCrudPage } from './AdminCrudPage';

export function AdminSettingsPage() {
  return (
    <AdminCrudPage
      table="settings"
      eyebrow="Configurações"
      title="Configurações gerais"
      description="Nome da confeitaria, WhatsApp, Instagram, horários, endereço, pedidos, tema, cores, logo e mascote."
      getTitle={(row) => String(row.key)}
      fields={[
        { name: 'key', label: 'Chave' },
        { name: 'value', label: 'Valor JSON', type: 'json', placeholder: '{ \"name\": \"Husky Confeiteiro\" }' },
      ]}
    />
  );
}
