import { FormEvent, useMemo, useState } from 'react';
import { Bookmark, Grid3X3, MessageSquareText, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProfileHeader } from '../../components/ProfileHeader';
import { CouponCard } from '../../components/CouponCard';
import { SocialMedia } from '../../components/SocialMedia';
import { Button } from '../../components/ui/Button';
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

type ProfileTab = 'posts' | 'saved' | 'reviews';

export function ProfilePage() {
  const { profile, setProfile } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState<ProfileTab>('posts');
  const orders = useAsync(() => dataService.getOrders(profile?.id), [profile?.id]);
  const posts = useAsync(() => dataService.getPosts(profile?.id), [profile?.id]);
  const favorites = useAsync(() => dataService.getProducts({ favoritesOnly: true, userId: profile?.id }), [profile?.id]);
  const coupons = useAsync(() => dataService.getCoupons(), []);
  const reviews = useAsync(() => dataService.getProductReviews(), []);
  const [form, setForm] = useState<Partial<Profile>>({});

  const profileForm = useMemo(() => ({ ...profile, ...form }), [form, profile]);
  const ownReviews = useMemo(
    () => (reviews.data ?? []).filter((review) => !profile?.id || review.user_id === profile.id),
    [profile?.id, reviews.data],
  );
  const ownPosts = useMemo(
    () => (posts.data ?? []).filter((post) => post.created_by === profile?.id),
    [posts.data, profile?.id],
  );

  function openEdit() {
    setForm(profile ?? {});
    setEditing(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    toast.success('Perfil atualizado 💙', 'A matilha ja ve suas novidades.');
    setEditing(false);
  }

  async function handleAvatarChange(url: string) {
    if (!profile) return;
    const updated = await dataService.updateProfile(profile.id, { avatar_url: url });
    setProfile(updated);
    setForm((current) => ({ ...current, avatar_url: url }));
    toast.success('Foto atualizada 📸', 'Seu perfil ficou com a sua cara.');
  }

  if (!profile) return <EmptyState title="Perfil nao encontrado" description="Entre novamente para acessar sua matilha." />;

  return (
    <div className="mx-auto max-w-[935px] lg:mx-0">
      <ProfileHeader
        profile={profile}
        ordersCount={orders.data?.length ?? 0}
        postsCount={ownPosts.length}
        onEdit={openEdit}
        onAvatarChange={handleAvatarChange}
      />

      <div className="border-b border-black/10 bg-white dark:border-white/10 dark:bg-[#0d1118] lg:rounded-t-[12px] lg:border-x lg:border-t">
        <div className="grid grid-cols-3">
          {[
            { id: 'posts' as const, label: 'Posts', icon: Grid3X3 },
            { id: 'saved' as const, label: 'Guardados', icon: Bookmark },
            { id: 'reviews' as const, label: 'Uivos', icon: MessageSquareText },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex items-center justify-center gap-2 border-t-2 py-3 text-xs font-black uppercase tracking-wide ${
                  tab === item.id ? 'border-black dark:border-white' : 'border-transparent text-black/45 dark:text-white/45'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {tab === 'posts' ? (
        ownPosts.length ? (
          <div className="grid grid-cols-3 gap-0.5 bg-white dark:bg-[#0d1118] lg:rounded-b-[12px] lg:border-x lg:border-b lg:border-black/10 lg:dark:border-white/10">
            {ownPosts.map((post) => (
              <div key={post.id} className="relative aspect-square overflow-hidden bg-black">
                {post.media_url ? (
                  <SocialMedia url={post.media_url} mediaType={post.media_type} alt={post.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center bg-husky-blue p-3 text-center text-xs font-black text-white">{post.title}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Nenhum post ainda" description="Quando voce publicar no feed, aparece aqui." />
        )
      ) : null}

      {tab === 'saved' ? (
        favorites.data?.length ? (
          <div className="grid grid-cols-2 gap-0.5 bg-white dark:bg-[#0d1118] sm:grid-cols-3 lg:rounded-b-[12px] lg:border-x lg:border-b lg:border-black/10 lg:dark:border-white/10">
            {favorites.data.map((product) => (
              <Link key={product.id} to={`/app/produtos/${product.slug}`} className="relative aspect-square overflow-hidden bg-black">
                {product.image_url ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" /> : null}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2 text-xs font-black text-white">
                  {product.name}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="Nada guardado ainda" description="Favoritos aparecem aqui quando voce guardar um potinho." />
        )
      ) : null}

      {tab === 'reviews' ? (
        <div className="space-y-3 bg-white p-4 dark:bg-[#0d1118] lg:rounded-b-[12px] lg:border-x lg:border-b lg:border-black/10 lg:dark:border-white/10">
          {ownReviews.length ? (
            ownReviews.map((review) => (
              <div key={review.id} className="border-b border-black/10 pb-3 text-sm last:border-0 dark:border-white/10">
                <p className="flex items-center gap-2 font-black">
                  <Star className="h-4 w-4 fill-current text-husky-blue" />
                  {review.product?.name ?? 'Pedido Husky'} · {review.rating}/5
                </p>
                <p className="mt-1 text-black/70 dark:text-white/70">{review.comment}</p>
              </div>
            ))
          ) : (
            <EmptyState title="Sem uivos ainda" description="Suas avaliacoes aparecem aqui depois dos pedidos." />
          )}
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {(coupons.data ?? []).slice(0, 2).map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Editar perfil" size="lg">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <MediaUploader value={profileForm.avatar_url} folder="avatars" accept="image/*" onChange={(url) => setForm((current) => ({ ...current, avatar_url: url }))} />
          </div>
          <Input label="Nome" value={profileForm.name ?? ''} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <Input label="Telefone" value={profileForm.phone ?? ''} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          <Input label="Data de aniversario" type="date" value={profileForm.birth_date ?? ''} onChange={(event) => setForm((current) => ({ ...current, birth_date: event.target.value }))} />
          <Input label="Bairro" value={profileForm.neighborhood ?? ''} onChange={(event) => setForm((current) => ({ ...current, neighborhood: event.target.value }))} />
          <Textarea label="Bio" className="md:col-span-2" value={profileForm.bio ?? ''} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} />
          <Button type="submit">Salvar perfil 💙</Button>
        </form>
      </Modal>
    </div>
  );
}
