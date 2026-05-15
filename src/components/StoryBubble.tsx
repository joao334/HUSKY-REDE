import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Story } from '../types/domain';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Avatar } from './ui/Avatar';
import { SocialMedia } from './SocialMedia';
import { huskyBrand } from '../config/huskyBrand';

export function StoryBubble({ story }: { story: Story }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const authorName = story.profile?.name ?? 'Husky Confeiteiro';
  const authorAvatar = story.profile?.avatar_url ?? huskyBrand.assets.logo;

  return (
    <>
      <button type="button" className="w-[74px] shrink-0 text-center" onClick={() => setOpen(true)}>
        <span className="insta-ring mx-auto block h-[66px] w-[66px] rounded-full p-0.5">
          <span className="block h-full w-full overflow-hidden rounded-full bg-white dark:bg-[#0d1118]">
            <SocialMedia url={story.media_url} mediaType={story.media_type} alt={story.title} className="h-full w-full object-cover" />
          </span>
        </span>
        <span className="mt-1 block truncate text-[11px] font-semibold">{story.title}</span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="" size="sm">
        <div className="relative overflow-hidden rounded-[22px] bg-black text-white">
          <SocialMedia url={story.media_url} mediaType={story.media_type} alt={story.title} className="aspect-[9/16] w-full object-cover" />
          <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/25">
              <div className="h-full w-2/3 rounded-full bg-white" />
            </div>
            <div className="flex items-center gap-2">
              <Avatar src={authorAvatar} name={authorName} size="sm" />
              <span className="text-sm font-black">{authorName}</span>
              <span className="text-xs text-white/65">agora</span>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {story.content ? <p className="mb-3 text-sm font-semibold leading-5">{story.content}</p> : null}
            {story.button_text && story.button_link ? (
              <Button
                className="w-full bg-white text-black hover:bg-white/90"
                onClick={() => {
                  setOpen(false);
                  navigate(story.button_link!);
                }}
              >
                {story.button_text} ✨
              </Button>
            ) : null}
          </div>
        </div>
      </Modal>
    </>
  );
}
