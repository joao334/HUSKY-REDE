import { FormEvent, useState } from 'react';
import { Camera, ImagePlus, PlusCircle } from 'lucide-react';
import { PostCard } from '../../components/PostCard';
import { SocialMedia } from '../../components/SocialMedia';
import { StoryBubble } from '../../components/StoryBubble';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
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
      toast.success('Post publicado ✨', 'Sua matilha ja pode curtir, comentar e repostar.');
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
      toast.success('Story no ar 📸', 'Ele fica disponivel por 24 horas.');
    } catch (error) {
      toast.error('Nao deu para publicar o story', error instanceof Error ? error.message : undefined);
    } finally {
      setStoryPosting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[470px] lg:mx-0">
      <section className="border-b border-black/10 bg-white py-3 dark:border-white/10 dark:bg-[#0d1118] lg:rounded-[12px] lg:border">
        <div className="flex gap-3 overflow-x-auto px-3 pb-1 soft-scrollbar">
          <button type="button" className="w-[74px] shrink-0 text-center" onClick={() => setStoryOpen(true)}>
            <span className="relative mx-auto block h-[66px] w-[66px] rounded-full border border-black/10 p-0.5 dark:border-white/10">
              <Avatar src={profile?.avatar_url} name={profile?.name} className="h-full w-full" />
              <span className="absolute bottom-0 right-0 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-husky-blue text-white dark:border-[#0d1118]">
                <PlusCircle className="h-4 w-4" />
              </span>
            </span>
            <span className="mt-1 block truncate text-[11px] font-semibold">Seu story</span>
          </button>
          {stories.loading ? (
            <LoadingSpinner className="min-h-[74px] w-full" label="Abrindo stories..." />
          ) : stories.data?.length ? (
            stories.data.map((story) => <StoryBubble key={story.id} story={story} />)
          ) : (
            <div className="grid min-w-[220px] place-items-center text-center text-xs font-semibold text-black/45 dark:text-white/45">
              Sem stories agora
            </div>
          )}
        </div>
      </section>

      <section className="mt-3 border-y border-black/10 bg-white dark:border-white/10 dark:bg-[#0d1118] lg:rounded-[12px] lg:border">
        <form onSubmit={publishPost}>
          <div className="flex items-start gap-3 p-3">
            <Avatar src={profile?.avatar_url} name={profile?.name} />
            <Textarea
              value={postText}
              onChange={(event) => setPostText(event.target.value)}
              placeholder="Compartilhe uma foto, video ou uivo doce..."
              className="min-h-[76px] border-0 bg-transparent px-0 shadow-none ring-0 focus:ring-0"
            />
          </div>
          {postMediaUrl ? (
            <div className="border-y border-black/10 dark:border-white/10">
              <SocialMedia url={postMediaUrl} mediaType={postMediaType} alt="Previa do post" className="aspect-square w-full object-cover" />
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3 border-t border-black/10 px-3 py-2 dark:border-white/10">
            <MediaUploader
              folder="feed"
              label="Foto/video 📸"
              accept="image/*,video/*"
              showPreview={false}
              onChange={(url, file) => {
                setPostMediaUrl(url);
                setPostMediaType(mediaTypeFromFile(file));
              }}
            />
            <Button type="submit" isLoading={posting} disabled={!postText.trim() && !postMediaUrl} leftIcon={<ImagePlus className="h-4 w-4" />}>
              Publicar
            </Button>
          </div>
        </form>
      </section>

      <section className="mt-3 space-y-3">
        {posts.loading ? (
          <LoadingSpinner />
        ) : posts.data?.length ? (
          posts.data.map((post) => <PostCard key={post.id} post={post} onChange={() => posts.reload().catch(() => undefined)} />)
        ) : (
          <EmptyState title="Feed quietinho" description="Quando a matilha postar, aparece aqui." />
        )}
      </section>

      <Modal open={storyOpen} onClose={() => setStoryOpen(false)} title="Novo story" size="lg">
        <form className="grid gap-4 md:grid-cols-[1fr_0.9fr]" onSubmit={publishStory}>
          <div className="overflow-hidden rounded-[22px] bg-black">
            {storyMediaUrl ? (
              <SocialMedia url={storyMediaUrl} mediaType={storyMediaType} alt="Previa do story" className="aspect-[9/16] w-full object-cover" />
            ) : (
              <div className="grid aspect-[9/16] place-items-center p-8 text-center text-white/70">
                <Camera className="mb-3 h-9 w-9" />
                Escolha uma foto ou video vertical para o story
              </div>
            )}
          </div>
          <div className="space-y-4">
            <Input label="Titulo" value={storyTitle} onChange={(event) => setStoryTitle(event.target.value)} placeholder="Ex.: Meu potinho favorito" />
            <Textarea label="Legenda" value={storyText} onChange={(event) => setStoryText(event.target.value)} placeholder="Escreva uma legenda curta..." />
            <MediaUploader
              folder="stories"
              label="Escolher foto/video 📸"
              accept="image/*,video/*"
              showPreview={false}
              onChange={(url, file) => {
                setStoryMediaUrl(url);
                setStoryMediaType(mediaTypeFromFile(file));
              }}
            />
            <Button type="submit" isLoading={storyPosting} disabled={!storyMediaUrl} className="w-full">
              Publicar story 💙
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
