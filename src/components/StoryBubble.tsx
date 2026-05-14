import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Story } from '../types/domain';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

export function StoryBubble({ story }: { story: Story }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <button type="button" className="w-24 shrink-0 text-center" onClick={() => setOpen(true)}>
        <span className="mx-auto block h-20 w-20 rounded-full bg-gradient-to-br from-husky-blue via-husky-beige to-husky-brown p-[3px] shadow-card">
          <span className="block h-full w-full overflow-hidden rounded-full bg-husky-cream">
            {story.media_url ? <img src={story.media_url} alt={story.title} className="h-full w-full object-cover" /> : null}
          </span>
        </span>
        <span className="mt-2 block truncate text-xs font-bold text-husky-brown dark:text-husky-cream">{story.title}</span>
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={story.title} size="sm">
        <div className="space-y-4">
          {story.media_url ? <img src={story.media_url} alt={story.title} className="aspect-square w-full rounded-brand object-cover" /> : null}
          {story.content ? <p className="text-husky-brown/75 dark:text-husky-cream/75">{story.content}</p> : null}
          {story.button_text && story.button_link ? (
            <Button
              className="w-full"
              onClick={() => {
                setOpen(false);
                navigate(story.button_link!);
              }}
            >
              {story.button_text}
            </Button>
          ) : null}
        </div>
      </Modal>
    </>
  );
}
