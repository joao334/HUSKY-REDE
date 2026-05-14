import { Bell, CheckCheck } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../contexts/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { useRealtimeRefresh } from '../../hooks/useRealtimeRefresh';
import { dataService } from '../../services/dataService';
import { formatDateTime } from '../../utils/format';
import { useCallback } from 'react';

export function NotificationsPage() {
  const { profile } = useAuth();
  const notifications = useAsync(() => dataService.getNotifications(profile?.id ?? ''), [profile?.id]);
  const reload = useCallback(() => notifications.reload().catch(() => undefined), [notifications]);
  useRealtimeRefresh('notifications', reload, profile?.id ? `user_id=eq.${profile.id}` : undefined);

  async function markRead(id: string) {
    await dataService.markNotificationRead(id);
    await notifications.reload();
  }

  return (
    <div>
      <PageHeader eyebrow="Central" title="Notificações" description="Status do pedido, cupons, posts, stories e patinhas recebidas." />
      <div className="space-y-3">
        {notifications.data?.length ? (
          notifications.data.map((notification) => (
            <Card key={notification.id} className={`p-4 ${notification.is_read ? 'opacity-70' : ''}`}>
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-brand bg-husky-blue/12 text-husky-blue">
                  <Bell className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-black">{notification.title}</p>
                  <p className="mt-1 text-sm text-husky-brown/70 dark:text-husky-cream/70">{notification.content}</p>
                  <p className="mt-2 text-xs font-semibold text-husky-brown/50 dark:text-husky-cream/50">{formatDateTime(notification.created_at)}</p>
                </div>
                {!notification.is_read ? (
                  <Button variant="ghost" size="icon" onClick={() => markRead(notification.id)}>
                    <CheckCheck className="h-5 w-5" />
                  </Button>
                ) : null}
              </div>
            </Card>
          ))
        ) : (
          <EmptyState title="Nenhum aviso por enquanto" description="Quando a Husky latir novidade, aparece aqui." />
        )}
      </div>
    </div>
  );
}
