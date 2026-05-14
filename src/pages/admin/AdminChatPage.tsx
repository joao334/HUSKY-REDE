import { FormEvent, useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';
import type { ChatConversation } from '../../types/domain';
import { formatDateTime } from '../../utils/format';

export function AdminChatPage() {
  const { profile } = useAuth();
  const conversations = useAsync(() => dataService.getConversations(), []);
  const [selected, setSelected] = useState<ChatConversation | null>(null);
  const [message, setMessage] = useState('');
  const messages = useAsync(() => (selected ? dataService.getChatMessages(selected.id) : Promise.resolve([])), [selected?.id]);

  useEffect(() => {
    if (!selected && conversations.data?.length) setSelected(conversations.data[0]);
  }, [conversations.data, selected]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !profile || !message.trim()) return;
    await dataService.sendChatMessage(selected.id, profile.id, message.trim());
    setMessage('');
    await messages.reload();
  }

  return (
    <div>
      <PageHeader eyebrow="Atendimento" title="Chat com clientes" description="Responda conversas da matilha em tempo real." />
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <Card className="overflow-hidden">
          <div className="border-b border-husky-blue/10 p-4 font-black dark:border-white/10">Conversas</div>
          <div className="divide-y divide-husky-blue/10 dark:divide-white/10">
            {(conversations.data ?? []).map((conversation) => (
              <button key={conversation.id} type="button" className="flex w-full items-center gap-3 p-4 text-left hover:bg-husky-beige/20 dark:hover:bg-white/8" onClick={() => setSelected(conversation)}>
                <Avatar src={conversation.profile?.avatar_url} name={conversation.profile?.name ?? 'Cliente'} />
                <span>
                  <span className="block font-black">{conversation.profile?.name ?? conversation.user_id}</span>
                  <span className="text-xs text-husky-brown/60 dark:text-husky-cream/60">{conversation.status}</span>
                </span>
              </button>
            ))}
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="h-[58vh] overflow-y-auto p-4 soft-scrollbar">
            {(messages.data ?? []).map((item) => {
              const mine = item.sender_id === profile?.id;
              return (
                <div key={item.id} className={`mb-3 flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-brand px-4 py-3 text-sm ${mine ? 'bg-husky-blue text-white' : 'bg-husky-beige/35 dark:bg-white/8'}`}>
                    <p>{item.message}</p>
                    <p className="mt-2 text-[11px] opacity-70">{formatDateTime(item.created_at)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <form className="flex gap-2 border-t border-husky-blue/10 p-4 dark:border-white/10" onSubmit={send}>
            <Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Responder cliente..." />
            <Button type="submit" size="icon">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
