import { AdminCrudPage } from './AdminCrudPage';

export function AdminProductsPage() {
  return (
    <AdminCrudPage
      table="products"
      eyebrow="Cardápio"
      title="Gestão de produtos"
      description="Cadastre potinhos, preços, estoque, fotos, galeria e selos do cardápio."
      getTitle={(row) => String(row.name)}
      fields={[
        { name: 'name', label: 'Nome' },
        { name: 'slug', label: 'Slug' },
        { name: 'category', label: 'Categoria', type: 'select', options: ['Bolos de pote', 'Brownies', 'Combos', 'Bebidas', 'Presentes', 'Promoções'] },
        { name: 'short_description', label: 'Descrição curta', type: 'textarea' },
        { name: 'full_description', label: 'Descrição completa', type: 'textarea' },
        { name: 'price', label: 'Preço', type: 'number' },
        { name: 'promotional_price', label: 'Preço promocional', type: 'number' },
        { name: 'estimated_cost', label: 'Custo estimado', type: 'number' },
        { name: 'stock_quantity', label: 'Estoque disponível', type: 'number' },
        { name: 'image_url', label: 'Imagem principal', type: 'media' },
        { name: 'ingredients_text', label: 'Ingredientes principais', type: 'textarea' },
        { name: 'size', label: 'Peso/tamanho' },
        { name: 'is_available', label: 'Disponível', type: 'boolean' },
        { name: 'is_featured', label: 'Produto destaque', type: 'boolean' },
        { name: 'is_best_seller', label: 'Mais vendido', type: 'boolean' },
        { name: 'is_limited', label: 'Produto limitado', type: 'boolean' },
      ]}
    />
  );
}
