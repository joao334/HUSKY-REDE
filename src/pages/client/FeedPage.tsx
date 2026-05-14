import { Bell, Search, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { PostCard } from '../../components/PostCard';
import { StoryBubble } from '../../components/StoryBubble';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';

export function FeedPage() {
  const { profile } = useAuth();
  const stories = useAsync(() => dataService.getStories(), []);
  const posts = useAsync(() => dataService.getPosts(profile?.id), [profile?.id]);

  return (
    <div>
      <PageHeader
        eyebrow="Feed Social"
        title={`Oi, ${profile?.name?.split(' ')[0] ?? 'matilha'}!`}
        description="Pronto para adoçar o dia? Veja stories, posts e lançamentos da Husky Confeiteiro."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/app/notificacoes">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/app/carrinho">
              <Button size="icon">
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mb-5 flex gap-4 overflow-x-auto pb-2 soft-scrollbar">
        {stories.loading ? (
          <LoadingSpinner className="min-h-24 w-full" label="Abrindo stories..." />
        ) : stories.data?.length ? (
          stories.data.map((story) => <StoryBubble key={story.id} story={story} />)
        ) : (
          <EmptyState title="Sem stories agora" description="A Husky volta logo com novidades fresquinhas." />
        )}
      </div>

      <div className="mx-auto max-w-2xl space-y-5">
        {posts.loading ? (
          <LoadingSpinner />
        ) : posts.data?.length ? (
          posts.data.map((post) => <PostCard key={post.id} post={post} onChange={() => posts.reload().catch(() => undefined)} />)
        ) : (
          <EmptyState title="Feed quietinho" description="Quando a cozinha postar, aparece aqui." />
        )}
      </div>
    </div>
  );
}
