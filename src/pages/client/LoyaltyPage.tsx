import { Gift, PawPrint, Sparkles } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../contexts/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';
import { getLoyaltyLevel, getLoyaltyProgress, getNextLoyaltyLevel, loyaltyLevels } from '../../utils/loyalty';
import { formatDateTime } from '../../utils/format';

const rules = [
  'A cada R$1,00 em compras, ganhar 1 patinha',
  'Avaliação de pedido: +5 patinhas',
  'Comentário em produto ou post: +2 patinhas',
  'Indicação de amigo: +20 patinhas',
  'Compra no aniversário: bônus especial',
];

export function LoyaltyPage() {
  const { profile } = useAuth();
  const history = useAsync(() => dataService.getLoyaltyHistory(profile?.id ?? ''), [profile?.id]);
  const current = getLoyaltyLevel(profile?.points ?? 0);
  const next = getNextLoyaltyLevel(profile?.points ?? 0);
  const progress = getLoyaltyProgress(profile?.points ?? 0);

  return (
    <div>
      <PageHeader eyebrow="Clube da Matilha" title="Patinhas e recompensas" description="Compre, comente, avalie e suba de nível na matilha." />
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-husky-blue via-husky-sky to-husky-beige p-6 text-white">
          <PawPrint className="h-10 w-10" />
          <h2 className="mt-4 text-3xl font-black">{profile?.points ?? 0} patinhas</h2>
          <p className="mt-1 font-semibold">{current.name}</p>
        </div>
        <div className="p-5">
          <div className="flex justify-between text-sm font-bold text-husky-brown/70 dark:text-husky-cream/70">
            <span>{current.name}</span>
            <span>{next ? next.name : 'Topo da matilha'}</span>
          </div>
          <div className="mt-3 h-4 overflow-hidden rounded-full bg-husky-beige/45 dark:bg-white/10">
            <div className="h-full rounded-full bg-husky-blue" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 text-sm text-husky-brown/70 dark:text-husky-cream/70">{current.benefit}</p>
        </div>
      </Card>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <Card className="p-5">
          <h2 className="text-xl font-black">Níveis da matilha</h2>
          <div className="mt-4 grid gap-3">
            {loyaltyLevels.map((level) => (
              <div key={level.name} className="rounded-brand bg-white/70 p-4 dark:bg-white/8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge tone={level.name === current.name ? 'blue' : 'muted'}>{level.name}</Badge>
                  <span className="text-sm font-bold text-husky-brown/60 dark:text-husky-cream/60">
                    {level.min} {level.max ? `a ${level.max}` : '+'} patinhas
                  </span>
                </div>
                <p className="mt-2 text-sm text-husky-brown/72 dark:text-husky-cream/72">{level.benefit}</p>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-xl font-black"><Sparkles className="h-5 w-5 text-husky-blue" />Como ganhar</h2>
            <ul className="mt-4 space-y-2">
              {rules.map((rule) => (
                <li key={rule} className="rounded-brand bg-husky-beige/25 p-3 text-sm font-semibold dark:bg-white/8">{rule}</li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-xl font-black"><Gift className="h-5 w-5 text-husky-blue" />Histórico</h2>
            <div className="mt-4 space-y-3">
              {history.data?.length ? (
                history.data.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3 rounded-brand bg-white/65 p-3 text-sm dark:bg-white/8">
                    <span>
                      <strong>{item.reason}</strong>
                      <span className="block text-xs text-husky-brown/60 dark:text-husky-cream/60">{formatDateTime(item.created_at)}</span>
                    </span>
                    <strong className={item.points > 0 ? 'text-husky-blue' : 'text-red-500'}>{item.points > 0 ? '+' : ''}{item.points}</strong>
                  </div>
                ))
              ) : (
                <EmptyState title="Sem histórico ainda" description="Suas patinhas vão aparecer aqui." />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
