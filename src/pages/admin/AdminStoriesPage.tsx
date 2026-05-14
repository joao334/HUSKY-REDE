import { AdminCrudPage } from './AdminCrudPage';

export function AdminStoriesPage() {
  return (
    <AdminCrudPage
      table="stories"
      eyebrow="Stories"
      title="Gestão de stories"
      description="Stories desaparecem automaticamente pela data final configurada."
      getTitle={(row) => String(row.title)}
      fields={[
        { name: 'title', label: 'Título' },
        { name: 'content', label: 'Texto curto', type: 'textarea' },
        { name: 'media_url', label: 'Imagem/vídeo', type: 'media' },
        { name: 'media_type', label: 'Tipo da mídia', type: 'select', options: ['image', 'video'] },
        { name: 'button_text', label: 'Botão opcional' },
        { name: 'button_link', label: 'Link do botão' },
        { name: 'product_id', label: 'Produto vinculado' },
        { name: 'coupon_id', label: 'Cupom vinculado' },
        { name: 'starts_at', label: 'Data de início', type: 'datetime' },
        { name: 'ends_at', label: 'Data de fim', type: 'datetime' },
        { name: 'is_active', label: 'Ativo', type: 'boolean' },
      ]}
    />
  );
}
