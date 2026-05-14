import { Vote } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';

export function PollsPage() {
  const { profile } = useAuth();
  const toast = useToast();
  const polls = useAsync(() => dataService.getPolls(profile?.id), [profile?.id]);

  async function vote(pollId: string, optionId: string) {
    if (!profile) return;
    await dataService.votePoll(pollId, optionId, profile.id);
    toast.success('Voto registrado', 'A matilha ouviu sua escolha.');
    await polls.reload();
  }

  return (
    <div>
      <PageHeader eyebrow="Enquetes" title="A matilha manda" description="Vote em sabores, ideias e próximos lançamentos." />
      <div className="grid gap-4 lg:grid-cols-2">
        {polls.data?.length ? (
          polls.data.map((poll) => {
            const totalVotes = poll.options?.reduce((sum, option) => sum + (option.votes_count ?? 0), 0) ?? 0;
            const alreadyVoted = Boolean(poll.user_vote_option_id);
            return (
              <Card key={poll.id} className="p-5">
                <div className="flex items-center gap-2">
                  <Vote className="h-5 w-5 text-husky-blue" />
                  <Badge tone="cream">Enquete ativa</Badge>
                </div>
                <h2 className="mt-4 text-xl font-black">{poll.question}</h2>
                <div className="mt-4 space-y-3">
                  {poll.options?.map((option) => {
                    const percent = totalVotes ? ((option.votes_count ?? 0) / totalVotes) * 100 : 0;
                    return (
                      <div key={option.id}>
                        <Button
                          variant={poll.user_vote_option_id === option.id ? 'primary' : 'outline'}
                          className="w-full justify-start"
                          onClick={() => vote(poll.id, option.id)}
                          disabled={alreadyVoted}
                        >
                          {option.option_text}
                        </Button>
                        {alreadyVoted ? (
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-husky-beige/45 dark:bg-white/10">
                            <div className="h-full bg-husky-blue" style={{ width: `${percent}%` }} />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })
        ) : (
          <EmptyState title="Sem enquetes agora" description="Logo a Husky pergunta qual sabor vem aí." />
        )}
      </div>
    </div>
  );
}
