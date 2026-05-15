import { Grid3X3, MapPin, PawPrint, PlusCircle, ShoppingBag } from 'lucide-react';
import type { Profile } from '../types/domain';
import { formatDate } from '../utils/format';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { MediaUploader } from './ui/MediaUploader';

type ProfileHeaderProps = {
  profile: Profile;
  ordersCount?: number;
  postsCount?: number;
  onEdit?: () => void;
  onAvatarChange?: (url: string) => void;
};

export function ProfileHeader({ profile, ordersCount = 0, postsCount = 0, onEdit, onAvatarChange }: ProfileHeaderProps) {
  return (
    <section className="border-b border-black/10 bg-white px-4 py-5 dark:border-white/10 dark:bg-[#0d1118] lg:rounded-[12px] lg:border">
      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <Avatar src={profile.avatar_url} name={profile.name} className="insta-ring h-24 w-24 p-1 sm:h-32 sm:w-32" />
          {onAvatarChange ? (
            <div className="absolute -bottom-1 -right-1">
              <MediaUploader
                value={profile.avatar_url}
                folder="avatars"
                label="📸"
                accept="image/*"
                showPreview={false}
                onChange={onAvatarChange}
              />
            </div>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-black sm:text-2xl">{profile.name}</h1>
            {onEdit ? (
              <Button variant="outline" size="sm" onClick={onEdit}>
                Editar perfil
              </Button>
            ) : null}
          </div>
          <div className="mt-4 grid max-w-sm grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-black">{postsCount}</p>
              <p className="text-xs font-semibold text-black/55 dark:text-white/55">posts</p>
            </div>
            <div>
              <p className="text-lg font-black">{profile.points}</p>
              <p className="text-xs font-semibold text-black/55 dark:text-white/55">patinhas</p>
            </div>
            <div>
              <p className="text-lg font-black">{ordersCount}</p>
              <p className="text-xs font-semibold text-black/55 dark:text-white/55">pedidos</p>
            </div>
          </div>
          <div className="mt-4 text-sm leading-6">
            <p className="font-black">@husky_{profile.name?.split(' ')[0]?.toLowerCase() ?? 'matilha'}</p>
            <p className="font-semibold">{profile.bio || 'Perfil doce da matilha Husky.'}</p>
            <p className="text-black/55 dark:text-white/55">{profile.level} · desde {formatDate(profile.created_at, 'MMM/yyyy')}</p>
            {profile.neighborhood ? (
              <p className="flex items-center gap-1 text-black/55 dark:text-white/55">
                <MapPin className="h-4 w-4" /> {profile.neighborhood}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-4 overflow-x-auto pb-1 soft-scrollbar">
        {[
          { label: 'Patinhas', icon: PawPrint },
          { label: 'Pedidos', icon: ShoppingBag },
          { label: 'Posts', icon: Grid3X3 },
          { label: 'Novo', icon: PlusCircle },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="w-20 shrink-0 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-black/15 bg-white dark:border-white/15 dark:bg-white/5">
                <Icon className="h-7 w-7" />
              </div>
              <p className="mt-1 truncate text-xs font-semibold">{item.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
