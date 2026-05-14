import { Eye, EyeOff, Star } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { useToast } from '../../contexts/ToastContext';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';
import type { Review } from '../../types/domain';
import { formatDateTime } from '../../utils/format';

export function AdminReviewsPage() {
  const toast = useToast();
  const reviews = useAsync(() => dataService.listCrud<Review>('reviews'), []);

  async function update(row: Review, values: Partial<Review>) {
    await dataService.updateCrud('reviews', row.id, values);
    toast.success('Avaliação atualizada', 'Os uivos da matilha foram revisados.');
    await reviews.reload();
  }

  return (
    <div>
      <PageHeader eyebrow="Uivos" title="Gestão de avaliações" description="Aprove feedbacks, destaque avaliações e acompanhe notas." />
      <DataTable
        rows={reviews.data ?? []}
        getRowKey={(row) => row.id}
        columns={[
          { header: 'Nota', accessor: (row) => `${row.rating}/5` },
          { header: 'Comentário', accessor: 'comment' },
          { header: 'Produto', accessor: 'product_id' },
          { header: 'Pedido', accessor: 'order_id' },
          { header: 'Data', accessor: (row) => formatDateTime(row.created_at) },
          {
            header: 'Ações',
            accessor: (row) => (
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => update(row, { is_visible: !row.is_visible })}>
                  {row.is_visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => update(row, { is_highlighted: !row.is_highlighted })}>
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
