import { CalendarDays, MapPin, PawPrint, ShoppingBag } from 'lucide-react';
import type { Profile } from '../types/domain';
import { formatDate } from '../utils/format';
import { getLoyaltyProgress } from '../utils/loyalty';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

type ProfileHeaderProps = {
  profile: Profile;
  ordersCount?: number;
  onEdit?: () => void;
};

export function ProfileHeader({ profile, ordersCount = 0, onEdit }: ProfileHeaderProps) {
  return (
    <Card className="overflow-hidden">
      <div className="h-28 bg-gradient-to-r from-husky-blue via-husky-sky to-husky-beige" />
      <div className="-mt-12 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <Avatar src={profile.avatar_url} name={profile.name} size="xl" />
            <div className="pb-1">
              <h2 className="text-2xl font-black text-husky-cocoa dark:text-husky-cream">{profile.name}</h2>
              <p className="text-sm text-husky-brown/70 dark:text-husky-cream/70">{profile.bio || 'Um perfil doce da matilha.'}</p>
            </div>
          </div>
          {onEdit ? (
            <Button variant="outline" onClick={onEdit}>
              Editar perfil
            </Button>
          ) : null}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge tone="blue">{profile.level}</Badge>
          {profile.neighborhood ? <Badge tone="muted"><MapPin className="h-3.5 w-3.5" />{profile.neighborhood}</Badge> : null}
          <Badge tone="muted"><CalendarDays className="h-3.5 w-3.5" />Desde {formatDate(profile.created_at, 'MMM/yyyy')}</Badge>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-brand bg-husky-beige/30 p-4 dark:bg-white/8">
            <p className="flex items-center gap-2 text-sm font-bold text-husky-brown/70 dark:text-husky-cream/70">
              <PawPrint className="h-4 w-4" /> Patinhas
            </p>
            <p className="mt-1 text-2xl font-black text-husky-cocoa dark:text-husky-cream">{profile.points}</p>
          </div>
          <div className="rounded-brand bg-husky-beige/30 p-4 dark:bg-white/8">
            <p className="flex items-center gap-2 text-sm font-bold text-husky-brown/70 dark:text-husky-cream/70">
              <ShoppingBag className="h-4 w-4" /> Pedidos
            </p>
            <p className="mt-1 text-2xl font-black text-husky-cocoa dark:text-husky-cream">{ordersCount}</p>
          </div>
          <div className="rounded-brand bg-husky-beige/30 p-4 dark:bg-white/8">
            <p className="text-sm font-bold text-husky-brown/70 dark:text-husky-cream/70">Próximo nível</p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/70 dark:bg-black/20">
              <div className="h-full rounded-full bg-husky-blue" style={{ width: `${getLoyaltyProgress(profile.points)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
