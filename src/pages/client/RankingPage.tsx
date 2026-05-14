import { Medal, Trophy } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';
import { useState } from 'react';

const tabs = ['Semana', 'Mês', 'Todos os tempos'];

export function RankingPage() {
  const [tab, setTab] = useState(tabs[0]);
  const ranking = useAsync(() => dataService.getRanking(), []);

  return (
    <div>
      <PageHeader eyebrow="Ranking da Matilha" title="Clientes mais ativos" description="Quem mais participa, compra e dá patinha sobe no pódio." />
      <Tabs items={tabs} value={tab} onChange={setTab} />
      <Card className="mt-5 overflow-hidden">
        <div className="bg-husky-blue p-5 text-white">
          <Trophy className="h-8 w-8" />
          <h2 className="mt-2 text-2xl font-black">Top 10 · {tab}</h2>
        </div>
        <div className="divide-y divide-husky-blue/10 dark:divide-white/10">
          {(ranking.data ?? []).slice(0, 10).map((profile, index) => (
            <div key={profile.id} className="flex items-center gap-3 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-husky-beige font-black text-husky-brown">
                {index < 3 ? <Medal className="h-5 w-5" /> : index + 1}
              </span>
              <Avatar src={profile.avatar_url} name={profile.name} />
              <div className="min-w-0 flex-1">
                <p className="font-black">{profile.name}</p>
                <p className="text-sm text-husky-brown/60 dark:text-husky-cream/60">{profile.level}</p>
              </div>
              <Badge tone="blue">{profile.points} patinhas</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
