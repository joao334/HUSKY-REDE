import { FormEvent, useState } from 'react';
import { Bell, Camera, ImagePlus, Search, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { PostCard } from '../../components/PostCard';
import { SocialMedia } from '../../components/SocialMedia';
import { StoryBubble } from '../../components/StoryBubble';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { MediaUploader } from '../../components/ui/MediaUploader';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';
import { mediaTypeFromFile } from '../../utils/media';

export function FeedPage() {
  const { profile } = useAuth();
  const toast = useToast();
  const [postText, setPostText] = useState('');
  const [postMediaUrl, setPostMediaUrl] = useState<string | null>(null);
  const [postMediaType, setPostMediaType] = useState<'image' | 'video'>('image');
  const [posting, setPosting] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyTitle, setStoryTitle] = useState('');
  const [storyText, setStoryText] = useState('');
  const [storyMediaUrl, setStoryMediaUrl] = useState<string | null>(null);
  const [storyMediaType, setStoryMediaType] = useState<'image' | 'video'>('image');
  const [storyPosting, setStoryPosting] = useState(false);
  const stories = useAsync(() => dataService.getStories(), []);
  const posts = useAsync(() => dataService.getPosts(profile?.id), [profile?.id]);

  async function publishPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;
    setPosting(true);
    try {
      await dataService.createUserPost({
        userId: profile.id,
        content: postText,
        mediaUrl: postMediaUrl,
        mediaType: postMediaType,
      });
      setPostText('');
      setPostMediaUrl(null);
      await posts.reload();
      toast.success('Post publicado ✨', 'Sua matilha já pode curtir, comentar e repostar.');
    } catch (error) {
      toast.error('Nao deu para publicar', error instanceof Error ? error.message : undefined);
    } finally {
      setPosting(false);
    }
  }

  async function publishStory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile || !storyMediaUrl) return;
    setStoryPosting(true);
    try {
      await dataService.createUserStory({
        userId: profile.id,
        title: storyTitle,
        content: storyText,
        mediaUrl: storyMediaUrl,
        mediaType: storyMediaType,
      });
      setStoryTitle('');
      setStoryText('');
      setStoryMediaUrl(null);
      setStoryOpen(false);
      await stories.reload();
      toast.success('Story no ar 📸', 'Ele fica disponível por 24 horas.');
    } catch (error) {
      toast.error('Nao deu para publicar o story', error instanceof Error ? error.message : undefined);
    } finally {
      setStoryPosting(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Feed Social"
        title={`Oi, ${profile?.name?.split(' ')[0] ?? 'matilha'}!`}
        description="Pronto para adoçar o dia? Veja stories, posts e lançamentos da Husky Confeiteiro."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="icon" title="Buscar">
              <Search className="h-5 w-5" />
              Buscar 🔎
            </Button>
            <Link to="/app/notificacoes">
              <Button variant="outline" size="icon" title="Notificações">
                <Bell className="h-5 w-5" />
                Notificações 🔔
              </Button>
            </Link>
            <Link to="/app/carrinho">
              <Button size="icon" title="Carrinho">
                <ShoppingBag className="h-5 w-5" />
                Carrinho 🛒
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mb-5 flex gap-4 overflow-x-auto pb-2 soft-scrollbar">
        <button type="button" className="w-24 shrink-0 text-center" onClick={() => setStoryOpen(true)}>
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-husky-blue text-white shadow-card">
            <Camera className="h-7 w-7" />
          </span>
          <span className="mt-2 block truncate text-xs font-bold text-husky-brown dark:text-husky-cream">Seu story +</span>
        </button>
        {stories.loading ? (
          <LoadingSpinner className="min-h-24 w-full" label="Abrindo stories..." />
        ) : stories.data?.length ? (
          stories.data.map((story) => <StoryBubble key={story.id} story={story} />)
        ) : (
          <EmptyState title="Sem stories agora" description="A Husky volta logo com novidades fresquinhas." />
        )}
      </div>

      <div className="mx-auto max-w-2xl space-y-5">
        <Card className="p-4">
          <form className="space-y-3" onSubmit={publishPost}>
            <div className="flex gap-3">
              <Avatar src={profile?.avatar_url} name={profile?.name} />
              <Textarea
                value={postText}
                onChange={(event) => setPostText(event.target.value)}
                placeholder="Compartilhe uma foto, vídeo ou novidade com a matilha..."
                className="min-h-24"
              />
            </div>
            {postMediaUrl ? (
              <div className="overflow-hidden rounded-brand border border-husky-blue/10 dark:border-white/10">
                <SocialMedia url={postMediaUrl} mediaType={postMediaType} alt="Prévia do post" />
              </div>
            ) : null}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <MediaUploader
                folder="feed"
                label="Foto/vídeo 📸"
                accept="image/*,video/*"
                showPreview={false}
                onChange={(url, file) => {
                  setPostMediaUrl(url);
                  setPostMediaType(mediaTypeFromFile(file));
                }}
              />
              <Button type="submit" isLoading={posting} disabled={!postText.trim() && !postMediaUrl} leftIcon={<ImagePlus className="h-4 w-4" />}>
                Publicar ✨
              </Button>
            </div>
          </form>
        </Card>
        {posts.loading ? (
          <LoadingSpinner />
        ) : posts.data?.length ? (
          posts.data.map((post) => <PostCard key={post.id} post={post} onChange={() => posts.reload().catch(() => undefined)} />)
        ) : (
          <EmptyState title="Feed quietinho" description="Quando a cozinha postar, aparece aqui." />
        )}
      </div>

      <Modal open={storyOpen} onClose={() => setStoryOpen(false)} title="Novo story" size="lg">
        <form className="space-y-4" onSubmit={publishStory}>
          <Input label="Título" value={storyTitle} onChange={(event) => setStoryTitle(event.target.value)} placeholder="Ex.: Meu potinho favorito" />
          <Textarea label="Legenda" value={storyText} onChange={(event) => setStoryText(event.target.value)} placeholder="Escreva uma legenda curta..." />
          {storyMediaUrl ? (
            <SocialMedia url={storyMediaUrl} mediaType={storyMediaType} alt="Prévia do story" className="max-h-[420px] w-full rounded-brand object-cover" />
          ) : null}
          <MediaUploader
            folder="stories"
            label="Escolher foto/vídeo 📸"
            accept="image/*,video/*"
            showPreview={false}
            onChange={(url, file) => {
              setStoryMediaUrl(url);
              setStoryMediaType(mediaTypeFromFile(file));
            }}
          />
          <Button type="submit" isLoading={storyPosting} disabled={!storyMediaUrl}>
            Publicar story 💙
          </Button>
        </form>
      </Modal>
    </div>
  );
}
