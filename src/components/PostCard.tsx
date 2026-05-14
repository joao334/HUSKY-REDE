import { FormEvent, useState } from 'react';
import { MessageCircle, PawPrint, Send, Share2, ShoppingBag, Bookmark } from 'lucide-react';
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
    await dataService.togglePostLike(post.id, profile.id);
    toast.success('Patinha enviada', 'A Husky sentiu o carinho.');
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
    toast.success('Comentário publicado', 'Você ganhou patinhas pela participação.');
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

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <Avatar src={huskyBrand.assets.mascot} name="Husky Confeiteiro" />
        <div className="min-w-0 flex-1">
          <p className="font-black text-husky-cocoa dark:text-husky-cream">Husky Confeiteiro</p>
          <p className="text-xs font-semibold text-husky-brown/60 dark:text-husky-cream/60">{formatDate(post.created_at)} · {post.type}</p>
        </div>
        <Badge tone="cream">{post.type}</Badge>
      </div>
      {post.media_url ? <img src={post.media_url} alt={post.title} className="max-h-[560px] w-full object-cover" /> : null}
      <div className="p-4">
        <h3 className="text-xl font-black text-husky-cocoa dark:text-husky-cream">{post.title}</h3>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-husky-brown/78 dark:text-husky-cream/72">{post.content}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button variant="ghost" leftIcon={<PawPrint className="h-5 w-5" />} onClick={handlePaw}>
            Dar patinha 🐾
          </Button>
          <Button variant="ghost" leftIcon={<MessageCircle className="h-5 w-5" />} onClick={openComments}>
            Comentar 💬
          </Button>
          <Button variant="ghost" leftIcon={<Share2 className="h-5 w-5" />} onClick={sharePost}>
            Compartilhar ✨
          </Button>
          <Button variant="ghost" leftIcon={<Bookmark className="h-5 w-5" />} onClick={() => toast.success('Post salvo', 'Guardado no pote.')}>
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
                Enviar
              </Button>
            </form>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
