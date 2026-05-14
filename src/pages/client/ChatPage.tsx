import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ImagePlus, Send } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { useRealtimeRefresh } from '../../hooks/useRealtimeRefresh';
import { dataService } from '../../services/dataService';
import type { ChatConversation, ChatMessage } from '../../types/domain';
import { formatDateTime } from '../../utils/format';
import { huskyBrand } from '../../config/huskyBrand';

export function ChatPage() {
  const { profile } = useAuth();
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const messages = useAsync<ChatMessage[]>(async () => {
    if (!profile) return [];
    const current = conversation ?? (await dataService.getOrCreateConversation(profile.id));
    setConversation(current);
    return dataService.getChatMessages(current.id);
  }, [profile?.id, conversation?.id]);

  const reload = useCallback(() => messages.reload().catch(() => undefined), [messages]);
  useRealtimeRefresh('chat_messages', reload, conversation?.id ? `conversation_id=eq.${conversation.id}` : undefined);

  useEffect(() => {
    const el = document.getElementById('chat-bottom');
    el?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.data?.length]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile || !conversation || (!message.trim() && !imageUrl)) return;
    await dataService.sendChatMessage(conversation.id, profile.id, message.trim(), imageUrl);
    setMessage('');
    setImageUrl(null);
    await messages.reload();
  }

  async function upload(file?: File) {
    if (!file) return;
    const url = await dataService.uploadMedia(file, 'chat');
    setImageUrl(url);
  }

  async function sendSticker(sticker: (typeof huskyBrand.chatStickers)[number]) {
    if (!profile || !conversation) return;
    await dataService.sendChatMessage(conversation.id, profile.id, sticker.label, sticker.image);
    await messages.reload();
  }

  return (
    <div>
      <PageHeader eyebrow="Chat" title="Fale com a Husky" description="Converse com a confeitaria em tempo real." />
      <Card className="overflow-hidden">
        <div className="h-[58vh] overflow-y-auto p-4 soft-scrollbar">
          {messages.loading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-4">
              {(messages.data ?? []).map((item) => {
                const mine = item.sender_id === profile?.id;
                return (
                  <div key={item.id} className={`flex gap-3 ${mine ? 'justify-end' : ''}`}>
                    {!mine ? <Avatar src={huskyBrand.assets.mascot} name="Husky Confeiteiro" /> : null}
                    <div className={`max-w-[78%] rounded-brand px-4 py-3 ${mine ? 'bg-husky-blue text-white' : 'bg-husky-beige/35 text-husky-cocoa dark:bg-white/8 dark:text-husky-cream'}`}>
                      {item.image_url ? <img src={item.image_url} alt="Anexo do chat" className="mb-2 max-h-56 rounded-brand object-cover" /> : null}
                      {item.message ? <p className="text-sm leading-6">{item.message}</p> : null}
                      <p className={`mt-2 text-[11px] font-semibold ${mine ? 'text-white/70' : 'text-husky-brown/55 dark:text-husky-cream/55'}`}>{formatDateTime(item.created_at)}</p>
                    </div>
                  </div>
                );
              })}
              <div id="chat-bottom" />
            </div>
          )}
        </div>
        {imageUrl ? (
          <div className="border-t border-husky-blue/10 px-4 py-2 dark:border-white/10">
            <img src={imageUrl} alt="Prévia" className="h-16 w-16 rounded-brand object-cover" />
          </div>
        ) : null}
        <div className="space-y-3 border-t border-husky-blue/10 px-4 py-3 dark:border-white/10">
          <div className="flex gap-2 overflow-x-auto pb-1 soft-scrollbar">
            {huskyBrand.chatEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-husky-beige/60 text-lg transition hover:bg-husky-blue hover:text-white"
                onClick={() => setMessage((current) => `${current}${current ? ' ' : ''}${emoji}`)}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 soft-scrollbar">
            {huskyBrand.chatStickers.slice(0, 6).map((sticker) => (
              <button
                key={sticker.id}
                type="button"
                title={sticker.label}
                className="h-14 w-14 shrink-0 overflow-hidden rounded-brand border border-husky-blue/10 bg-white p-1 shadow-card transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/8"
                onClick={() => sendSticker(sticker)}
              >
                <img src={sticker.image} alt={sticker.label} className="h-full w-full rounded-[10px] object-cover" />
              </button>
            ))}
          </div>
        </div>
        <form className="flex gap-2 border-t border-husky-blue/10 p-4 dark:border-white/10" onSubmit={send}>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => upload(event.target.files?.[0])} />
          <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
            <ImagePlus className="h-5 w-5" />
          </Button>
          <Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Mensagem para a Husky..." />
          <Button type="submit" size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
