import { Eye, EyeOff, Star, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { useToast } from '../../contexts/ToastContext';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';
import type { PostComment } from '../../types/domain';
import { formatDateTime } from '../../utils/format';

export function AdminCommentsPage() {
  const toast = useToast();
  const comments = useAsync(() => dataService.listCrud<PostComment>('post_comments'), []);

  async function update(row: PostComment, values: Partial<PostComment>) {
    await dataService.updateCrud('post_comments', row.id, values);
    toast.success('Comentário atualizado', 'A conversa da matilha foi organizada.');
    await comments.reload();
  }

  async function remove(row: PostComment) {
    await dataService.deleteCrud('post_comments', row.id);
    toast.success('Comentário excluído');
    await comments.reload();
  }

  return (
    <div>
      <PageHeader eyebrow="Moderação" title="Gestão de comentários" description="Aprove, oculte, exclua, responda e destaque comentários." />
      <DataTable
        rows={comments.data ?? []}
        getRowKey={(row) => row.id}
        columns={[
          { header: 'Comentário', accessor: 'content' },
          { header: 'Post', accessor: 'post_id' },
          { header: 'Cliente', accessor: 'user_id' },
          { header: 'Data', accessor: (row) => formatDateTime(row.created_at) },
          { header: 'Visível', accessor: (row) => (row.is_visible ? 'Sim' : 'Não') },
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
                <Button variant="ghost" size="icon" onClick={() => remove(row)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
