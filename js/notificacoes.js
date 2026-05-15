import { appShell, demoProfiles, requireUser } from './utils.js';

async function renderNotifications() {
  await requireUser();
  const rows = [
    ['♡', `${demoProfiles[1].username} curtiu seu post`, 'agora'],
    ['◌', `${demoProfiles[2].username} comentou: muito bom!`, '12 min'],
    ['◎', `${demoProfiles[3].username} comecou a seguir voce`, '1 h'],
    ['▻', 'Seu reel passou de 1.000 visualizacoes', 'ontem'],
  ];
  appShell('notificacoes', `<section class="card pad"><h1>Notificacoes</h1>${rows.map(([icon, text, time]) => `<div class="between" style="border-bottom:1px solid var(--line);padding:14px 0"><span class="row"><span style="font-size:28px">${icon}</span><strong>${text}</strong></span><small class="muted">${time}</small></div>`).join('')}</section>`);
}

if (document.body.dataset.page === 'notificacoes') renderNotifications();
