import { FormEvent, useState } from 'react';
import { Gift, PawPrint, ShieldOff } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../contexts/ToastContext';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';
import type { Profile } from '../../types/domain';
import { formatDate } from '../../utils/format';
import { getLoyaltyLevel } from '../../utils/loyalty';

export function AdminCustomersPage() {
  const toast = useToast();
  const profiles = useAsync(() => dataService.listCrud<Profile>('users_profiles'), []);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [points, setPoints] = useState(0);

  async function adjustPoints(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const nextPoints = Math.max(0, Number(selected.points) + Number(points));
    await dataService.updateProfile(selected.id, {
      points: nextPoints,
      level: getLoyaltyLevel(nextPoints).name,
    });
    toast.success('Patinhas atualizadas', `${selected.name} agora tem ${nextPoints} patinhas.`);
    setSelected(null);
    await profiles.reload();
  }

  return (
    <div>
      <PageHeader eyebrow="Matilha" title="Gestão de clientes" description="Veja histórico, patinhas, bairro, última compra e ações de relacionamento." />
      <DataTable
        rows={profiles.data ?? []}
        getRowKey={(row) => row.id}
        columns={[
          {
            header: 'Cliente',
            accessor: (row) => (
              <div className="flex items-center gap-3">
                <Avatar src={row.avatar_url} name={row.name} />
                <span><strong>{row.name}</strong><span className="block text-xs text-husky-brown/60 dark:text-husky-cream/60">{row.email}</span></span>
              </div>
            ),
          },
          { header: 'WhatsApp', accessor: 'phone' },
          { header: 'Bairro', accessor: 'neighborhood' },
          { header: 'Cadastro', accessor: (row) => formatDate(row.created_at, 'dd/MM/yyyy') },
          { header: 'Patinhas', accessor: (row) => <strong>{row.points}</strong> },
          { header: 'Nível', accessor: 'level' },
          {
            header: 'Ações',
            accessor: (row) => (
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setSelected(row)}>
                  <PawPrint className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => toast.info('Cupom pronto', 'Use Cupons Admin para enviar campanhas segmentadas.')}>
                  <Gift className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => toast.info('Bloqueio', 'A política de bloqueio fica em users_profiles quando ativada no banco.')}>
                  <ShieldOff className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
      />
      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Ajustar patinhas">
        <form className="space-y-4" onSubmit={adjustPoints}>
          <p className="text-sm text-husky-brown/70 dark:text-husky-cream/70">Use valores positivos para adicionar e negativos para remover.</p>
          <Input label="Patinhas" type="number" value={points} onChange={(event) => setPoints(Number(event.target.value))} />
          <Button type="submit">Salvar ajuste</Button>
        </form>
      </Modal>
    </div>
  );
}
