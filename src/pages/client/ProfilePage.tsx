import { FormEvent, useMemo, useState } from 'react';
import { Gift, Heart, Star } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { ProfileHeader } from '../../components/ProfileHeader';
import { ProductCard } from '../../components/ProductCard';
import { CouponCard } from '../../components/CouponCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { MediaUploader } from '../../components/ui/MediaUploader';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { useAuth } from '../../contexts/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';
import type { Profile } from '../../types/domain';
import { useToast } from '../../contexts/ToastContext';

export function ProfilePage() {
  const { profile, setProfile } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const orders = useAsync(() => dataService.getOrders(profile?.id), [profile?.id]);
  const favorites = useAsync(() => dataService.getProducts({ favoritesOnly: true, userId: profile?.id }), [profile?.id]);
  const coupons = useAsync(() => dataService.getCoupons(), []);
  const reviews = useAsync(() => dataService.getProductReviews(), []);
  const [form, setForm] = useState<Partial<Profile>>({});

  const profileForm = useMemo(() => ({ ...profile, ...form }), [form, profile]);

  function openEdit() {
    setForm(profile ?? {});
    setEditing(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;
    const updated = await dataService.updateProfile(profile.id, form);
    setProfile(updated);
    toast.success('Perfil atualizado', 'A matilha já vê suas novidades.');
    setEditing(false);
  }

  if (!profile) return <EmptyState title="Perfil não encontrado" description="Entre novamente para acessar sua matilha." />;

  return (
    <div>
      <PageHeader eyebrow="Perfil" title="Seu canto na matilha" description="Avatar, bio, patinhas, favoritos e cupons ficam aqui." />
      <ProfileHeader profile={profile} ordersCount={orders.data?.length ?? 0} onEdit={openEdit} />

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-husky-blue" />
              <h2 className="text-xl font-black">Guardados no pote</h2>
            </div>
            {favorites.data?.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {favorites.data.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState title="Nada guardado ainda" description="Favoritos aparecem aqui quando você guardar um potinho." />
            )}
          </Card>
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-husky-blue" />
              <h2 className="text-xl font-black">Uivos da Matilha</h2>
            </div>
            <div className="space-y-3">
              {(reviews.data ?? []).slice(0, 4).map((review) => (
                <div key={review.id} className="rounded-brand bg-husky-beige/25 p-3 text-sm dark:bg-white/8">
                  <p className="font-black">{review.product?.name ?? 'Pedido Husky'} · {review.rating}/5</p>
                  <p className="mt-1 text-husky-brown/72 dark:text-husky-cream/72">{review.comment}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-5">
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Gift className="h-5 w-5 text-husky-blue" />
              <h2 className="text-xl font-black">Cupons disponíveis</h2>
            </div>
            <div className="space-y-3">
              {(coupons.data ?? []).slice(0, 2).map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Editar perfil" size="lg">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <MediaUploader value={profileForm.avatar_url} folder="avatars" onChange={(url) => setForm((current) => ({ ...current, avatar_url: url }))} />
          </div>
          <Input label="Nome" value={profileForm.name ?? ''} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <Input label="Telefone" value={profileForm.phone ?? ''} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          <Input label="Data de aniversário" type="date" value={profileForm.birth_date ?? ''} onChange={(event) => setForm((current) => ({ ...current, birth_date: event.target.value }))} />
          <Input label="Bairro" value={profileForm.neighborhood ?? ''} onChange={(event) => setForm((current) => ({ ...current, neighborhood: event.target.value }))} />
          <Textarea label="Bio" className="md:col-span-2" value={profileForm.bio ?? ''} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} />
          <Button type="submit">Salvar perfil</Button>
        </form>
      </Modal>
    </div>
  );
}
