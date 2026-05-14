import { FormEvent, useState } from 'react';
import { Bookmark, MessageCircle, PawPrint, Repeat2, Send, Share2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Post, PostComment } from '../types/domain';
import { dataService } from '../services/dataService';
import { formatDate } from '../utils/format';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
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
    toast.success('Comentário publicado 💬', 'Você ganhou patinhas pela participação.');
    onChange?.();
  }

  async function sharePost() {
    const url = `${window.location.origin}/app/feed?post=${post.id}`;
    if (navigator.share) {
      await navigator.share({ title: post.title, text: post.content, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.info('Link copiado', 'Agora é só mandar para a matilha.');
    }
  }

  const authorName = post.profile?.name ?? (post.created_by ? 'Cliente da Matilha' : 'Husky Confeiteiro');
  const authorAvatar = post.profile?.avatar_url ?? (post.created_by ? null : huskyBrand.assets.mascot);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <Avatar src={authorAvatar} name={authorName} />
        <div className="min-w-0 flex-1">
          <p className="font-black text-husky-cocoa dark:text-husky-cream">{authorName}</p>
          <p className="text-xs font-semibold text-husky-brown/60 dark:text-husky-cream/60">{formatDate(post.created_at)} · {post.type}</p>
        </div>
        <Badge tone="cream">{post.type}</Badge>
      </div>
      <SocialMedia url={post.media_url} mediaType={post.media_type} alt={post.title} />
      <div className="p-4">
        <h3 className="text-xl font-black text-husky-cocoa dark:text-husky-cream">{post.title}</h3>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-husky-brown/78 dark:text-husky-cream/72">{post.content}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button variant={post.is_liked ? 'cream' : 'ghost'} leftIcon={<PawPrint className="h-5 w-5" />} onClick={handlePaw}>
            Curtir 🐾
          </Button>
          <Button variant="ghost" leftIcon={<MessageCircle className="h-5 w-5" />} onClick={openComments}>
            Comentar 💬
          </Button>
          <Button variant={post.is_reposted ? 'cream' : 'ghost'} leftIcon={<Repeat2 className="h-5 w-5" />} onClick={handleRepost}>
            Repostar 🔁
          </Button>
          <Button variant="ghost" leftIcon={<Share2 className="h-5 w-5" />} onClick={sharePost}>
            Compartilhar ✨
          </Button>
          <Button variant={post.is_saved ? 'cream' : 'ghost'} leftIcon={<Bookmark className="h-5 w-5" />} onClick={handleSave}>
            Salvar 💙
          </Button>
          {post.product ? (
            <Button leftIcon={<ShoppingBag className="h-4 w-4" />} onClick={() => addToCart(post.product!)}>
              Pedir agora 🍰
            </Button>
          ) : null}
        </div>
        <div className="mt-3 flex gap-4 text-sm font-semibold text-husky-brown/65 dark:text-husky-cream/65">
          <span>{post.likes_count ?? 0} patinhas</span>
          <span>{post.comments_count ?? 0} comentários</span>
          <span>{post.reposts_count ?? 0} reposts</span>
          <span>{post.saves_count ?? 0} salvos</span>
        </div>
        {commentsOpen ? (
          <div className="mt-4 border-t border-husky-blue/10 pt-4 dark:border-white/10">
            {loadingComments ? (
              <p className="text-sm text-husky-brown/60 dark:text-husky-cream/60">Farejando comentários...</p>
            ) : comments.length ? (
              <div className="space-y-3">
                {comments.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <Avatar src={item.profile?.avatar_url} name={item.profile?.name ?? 'Cliente'} size="sm" />
                    <div className="rounded-brand bg-husky-beige/25 px-3 py-2 text-sm dark:bg-white/8">
                      <p className="font-bold text-husky-cocoa dark:text-husky-cream">{item.profile?.name ?? 'Cliente da Matilha'}</p>
                      <p className="text-husky-brown/75 dark:text-husky-cream/75">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Ainda sem comentários" description="Seja a primeira pessoa a dar um uivo por aqui." />
            )}
            <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={handleComment}>
              <Textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Escreva um uivo rápido..." className="min-h-12 sm:min-h-12" />
              <Button type="submit" size="lg" leftIcon={<Send className="h-4 w-4" />}>
                Enviar 💬
              </Button>
            </form>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
