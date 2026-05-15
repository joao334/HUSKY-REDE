import { FormEvent, useState } from 'react';
import { Bookmark, MessageCircle, MoreHorizontal, PawPrint, Repeat2, Send, ShoppingBag } from 'lucide-react';
import type { Post, PostComment } from '../types/domain';
import { dataService } from '../services/dataService';
import { formatDate } from '../utils/format';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { EmptyState } from './ui/EmptyState';
import { huskyBrand } from '../config/huskyBrand';
import { SocialMedia } from './SocialMedia';

export function PostCard({ post, onChange }: { post: Post; onChange?: () => void }) {
  const { profile } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [comment, setComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  async function handlePaw() {
    if (!profile) return;
    const liked = await dataService.togglePostLike(post.id, profile.id);
    toast.success(liked ? 'Patinha enviada 🐾' : 'Patinha removida', liked ? 'A matilha sentiu o carinho.' : undefined);
    onChange?.();
  }

  async function handleSave() {
    if (!profile) return;
    const saved = await dataService.togglePostSave(post.id, profile.id);
    toast.success(saved ? 'Post salvo 💙' : 'Post removido dos salvos', saved ? 'Guardado no pote.' : undefined);
    onChange?.();
  }

  async function handleRepost() {
    if (!profile) return;
    const reposted = await dataService.togglePostRepost(post.id, profile.id);
    toast.success(reposted ? 'Republicado 🔁' : 'Repost removido', reposted ? 'Esse post foi para sua matilha.' : undefined);
    onChange?.();
  }

  async function openComments() {
    setCommentsOpen((value) => !value);
    if (!commentsOpen && !comments.length) {
      setLoadingComments(true);
      try {
        setComments(await dataService.getPostComments(post.id));
      } finally {
        setLoadingComments(false);
      }
    }
  }

  async function handleComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile || !comment.trim()) return;
    const created = await dataService.addPostComment(post.id, profile.id, comment.trim());
    setComments((current) => [...current, { ...created, profile }]);
    setComment('');
    toast.success('Comentario publicado 💬', 'Voce ganhou patinhas pela participacao.');
    onChange?.();
  }

  async function sharePost() {
    const url = `${window.location.origin}/app/feed?post=${post.id}`;
    if (navigator.share) {
      await navigator.share({ title: post.title, text: post.content, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.info('Link copiado', 'Agora e so mandar para a matilha.');
    }
  }

  const authorName = post.profile?.name ?? (post.created_by ? 'Cliente da Matilha' : 'Husky Confeiteiro');
  const authorAvatar = post.profile?.avatar_url ?? (post.created_by ? null : huskyBrand.assets.logo);

  return (
    <article className="overflow-hidden border-y border-black/10 bg-white dark:border-white/10 dark:bg-[#0d1118] lg:rounded-[12px] lg:border">
      <header className="flex items-center gap-3 px-3 py-3">
        <Avatar src={authorAvatar} name={authorName} size="sm" className="insta-ring h-10 w-10 p-0.5" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black">{authorName}</p>
          <p className="truncate text-[11px] font-semibold text-black/50 dark:text-white/50">{formatDate(post.created_at)} · {post.type}</p>
        </div>
        <MoreHorizontal className="h-5 w-5" />
      </header>

      <div className="bg-black">
        {post.media_url ? (
          <SocialMedia url={post.media_url} mediaType={post.media_type} alt={post.title} className="max-h-[620px] w-full object-cover" />
        ) : (
          <div className="grid aspect-square place-items-center bg-gradient-to-br from-husky-blue via-husky-sky to-husky-beige p-8 text-center text-2xl font-black text-white">
            {post.title}
          </div>
        )}
      </div>

      <div className="px-3 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button type="button" title="Dar patinha" onClick={handlePaw} className={post.is_liked ? 'text-husky-blue' : undefined}>
              <PawPrint className="h-7 w-7" />
            </button>
            <button type="button" title="Comentar" onClick={openComments}>
              <MessageCircle className="h-7 w-7" />
            </button>
            <button type="button" title="Compartilhar" onClick={sharePost}>
              <Send className="h-7 w-7" />
            </button>
            <button type="button" title="Republicar" onClick={handleRepost} className={post.is_reposted ? 'text-husky-blue' : undefined}>
              <Repeat2 className="h-7 w-7" />
            </button>
          </div>
          <button type="button" title="Salvar" onClick={handleSave} className={post.is_saved ? 'text-husky-blue' : undefined}>
            <Bookmark className="h-7 w-7" />
          </button>
        </div>

        <p className="mt-3 text-sm font-black">{post.likes_count ?? 0} patinhas</p>
        <p className="mt-1 text-sm leading-6">
          <span className="font-black">{authorName}</span>{' '}
          <span className="font-semibold">{post.title}</span>{' '}
          <span className="whitespace-pre-line text-black/82 dark:text-white/82">{post.content}</span>
        </p>
        <button type="button" onClick={openComments} className="mt-2 text-sm font-semibold text-black/45 dark:text-white/45">
          Ver todos os {post.comments_count ?? 0} comentarios
        </button>
        <div className="mt-1 flex gap-3 text-xs font-semibold text-black/45 dark:text-white/45">
          <span>{post.reposts_count ?? 0} reposts</span>
          <span>{post.saves_count ?? 0} salvos</span>
        </div>

        {post.product ? (
          <Button className="mt-3 w-full" leftIcon={<ShoppingBag className="h-4 w-4" />} onClick={() => addToCart(post.product!)}>
            Pedir agora 🍰
          </Button>
        ) : null}

        {commentsOpen ? (
          <div className="mt-4 border-t border-black/10 pt-4 dark:border-white/10">
            {loadingComments ? (
              <p className="text-sm text-black/50 dark:text-white/50">Farejando comentarios...</p>
            ) : comments.length ? (
              <div className="space-y-3">
                {comments.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <Avatar src={item.profile?.avatar_url} name={item.profile?.name ?? 'Cliente'} size="sm" />
                    <p className="min-w-0 text-sm leading-5">
                      <span className="font-black">{item.profile?.name ?? 'Cliente da Matilha'}</span>{' '}
                      <span className="text-black/78 dark:text-white/78">{item.content}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Ainda sem comentarios" description="Seja a primeira pessoa a dar um uivo por aqui." />
            )}
            <form className="mt-4 flex items-end gap-2" onSubmit={handleComment}>
              <Textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Adicione um comentario..." className="min-h-11 resize-none rounded-full" />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
                Enviar
              </Button>
            </form>
          </div>
        ) : null}
      </div>
    </article>
  );
}
