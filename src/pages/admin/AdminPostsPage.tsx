import { AdminCrudPage } from './AdminCrudPage';

export function AdminPostsPage() {
  return (
    <AdminCrudPage
      table="posts"
      eyebrow="Feed"
      title="Gestão de posts"
      description="Crie posts de produto, promoção, bastidores, feedback, enquete, novidade e comunicado."
      getTitle={(row) => String(row.title)}
      fields={[
        { name: 'title', label: 'Título' },
        { name: 'content', label: 'Texto', type: 'textarea' },
        {
          name: 'type',
          label: 'Tipo de post',
          type: 'select',
          options: ['Produto', 'Promoção', 'Bastidores', 'Feedback', 'Enquete', 'Novidade', 'Comunicado', 'Lançamento'],
        },
        { name: 'media_url', label: 'Imagem/vídeo', type: 'media' },
        { name: 'media_type', label: 'Tipo da mídia', type: 'select', options: ['image', 'video'] },
        { name: 'product_id', label: 'Produto vinculado opcional' },
        { name: 'coupon_id', label: 'Cupom vinculado opcional' },
        { name: 'poll_id', label: 'Enquete vinculada opcional' },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'] },
      ]}
    />
  );
}
