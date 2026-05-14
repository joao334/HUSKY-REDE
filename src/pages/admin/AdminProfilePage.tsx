import { FormEvent, useMemo, useState } from 'react';
import { Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { ProfileHeader } from '../../components/ProfileHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { MediaUploader } from '../../components/ui/MediaUploader';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';
import type { Profile } from '../../types/domain';
import { formatCurrency } from '../../utils/format';

export function AdminProfilePage() {
  const { profile, setProfile } = useAuth();
  const toast = useToast();
  const dashboard = useAsync(() => dataService.getDashboard(), []);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Profile>>({});
  const profileForm = useMemo(() => ({ ...profile, ...form }), [form, profile]);

  function openEdit() {
    setForm(profile ?? {});
    setEditing(true);
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;
    const payload: Partial<Profile> = {
      name: profileForm.name?.trim() || profile.name,
      phone: profileForm.phone?.trim() || null,
      avatar_url: profileForm.avatar_url || null,
      birth_date: profileForm.birth_date || null,
      neighborhood: profileForm.neighborhood?.trim() || null,
      bio: profileForm.bio?.trim() || null,
    };
    const updated = await dataService.updateProfile(profile.id, payload);
    setProfile(updated);
    setEditing(false);
    toast.success('Perfil admin atualizado 💙', 'Sua gestão ficou em dia.');
  }

  async function updateAvatar(url: string) {
    if (!profile) return;
    const updated = await dataService.updateProfile(profile.id, { avatar_url: url });
    setProfile(updated);
    setForm((current) => ({ ...current, avatar_url: url }));
    toast.success('Foto atualizada 📸', 'O perfil da gestão foi renovado.');
  }

  if (!profile) return <EmptyState title="Perfil não encontrado" description="Entre novamente para acessar a gestão." />;

  return (
    <div>
      <PageHeader eyebrow="Perfil admin" title="Sua conta de gestão" description="Foto, dados e resumo da operação da Husky." />
      <ProfileHeader profile={profile} ordersCount={dashboard.data?.pendingOrders ?? 0} onEdit={openEdit} onAvatarChange={updateAvatar} />

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-husky-blue" />
            <h2 className="text-xl font-black">Acesso da gestão</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-brand bg-husky-beige/25 p-3 dark:bg-white/8">
              <p className="flex items-center gap-2 text-xs font-black uppercase text-husky-blue"><Mail className="h-4 w-4" /> E-mail</p>
              <p className="mt-1 break-words text-sm font-semibold">{profile.email}</p>
            </div>
            <div className="rounded-brand bg-husky-beige/25 p-3 dark:bg-white/8">
              <p className="text-xs font-black uppercase text-husky-blue">Permissão</p>
              <p className="mt-1 text-sm font-semibold">Administrador</p>
            </div>
          </div>
          <Button className="mt-4" variant="outline" onClick={openEdit}>
            Editar perfil ✏️
          </Button>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-husky-blue" />
            <h2 className="text-xl font-black">Hoje na Husky</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between rounded-brand bg-husky-beige/25 p-3 dark:bg-white/8">
              <span>Pedidos pendentes</span>
              <strong>{dashboard.data?.pendingOrders ?? 0}</strong>
            </div>
            <div className="flex justify-between rounded-brand bg-husky-beige/25 p-3 dark:bg-white/8">
              <span>Vendas do dia</span>
              <strong>{formatCurrency(dashboard.data?.salesToday ?? 0)}</strong>
            </div>
            <div className="flex justify-between rounded-brand bg-husky-beige/25 p-3 dark:bg-white/8">
              <span>Produtos ativos</span>
              <strong>{dashboard.data?.activeProducts ?? 0}</strong>
            </div>
          </div>
        </Card>
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Editar perfil admin" size="lg">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={saveProfile}>
          <div className="md:col-span-2">
            <MediaUploader
              value={profileForm.avatar_url}
              folder="avatars"
              label="Enviar foto 📸"
              accept="image/*"
              onChange={(url) => setForm((current) => ({ ...current, avatar_url: url }))}
            />
          </div>
          <Input label="Nome" value={profileForm.name ?? ''} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <Input label="Telefone" value={profileForm.phone ?? ''} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          <Input label="Data de aniversário" type="date" value={profileForm.birth_date ?? ''} onChange={(event) => setForm((current) => ({ ...current, birth_date: event.target.value }))} />
          <Input label="Bairro" value={profileForm.neighborhood ?? ''} onChange={(event) => setForm((current) => ({ ...current, neighborhood: event.target.value }))} />
          <Textarea label="Bio" className="md:col-span-2" value={profileForm.bio ?? ''} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} />
          <Button type="submit">Salvar perfil admin 💙</Button>
        </form>
      </Modal>
    </div>
  );
}
