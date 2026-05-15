import { appShell, demoPosts, demoProfiles, requireUser, toast } from './utils.js';

async function renderAdmin() {
  await requireUser();
  const reports = [
    { id: 'r1', target_type: 'post', reason: 'Spam', status: 'pending' },
    { id: 'r2', target_type: 'profile', reason: 'Golpe', status: 'pending' },
  ];
  appShell('admin', `
    <div class="card pad">
      <h1>Painel administrativo</h1>
      <div class="grid-explore" style="grid-template-columns:repeat(5,1fr);gap:12px">
        ${[['Usuarios', demoProfiles.length], ['Posts', demoPosts.length], ['Stories', 3], ['Comentarios', 58], ['Denuncias', reports.length]].map(([k,v]) => `<div class="card pad"><strong style="font-size:28px">${v}</strong><br><span class="muted">${k}</span></div>`).join('')}
      </div>
    </div>
    <div class="card pad" style="margin-top:16px">
      <h2>Denuncias pendentes</h2>
      ${reports.map((r) => `<div class="between" style="padding:12px 0;border-bottom:1px solid var(--line)"><span><strong>${r.target_type}</strong><br><small>${r.reason}</small></span><span class="row"><button class="btn secondary">Remover post</button><button class="btn danger">Suspender usuario</button></span></div>`).join('')}
    </div>`);
  document.querySelectorAll('.btn').forEach((button) => button.onclick = () => toast('Acao de moderacao registrada.'));
}

if (document.body.dataset.page === 'admin') renderAdmin();
