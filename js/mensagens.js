import { appShell, demoProfiles, requireUser, toast } from './utils.js';

async function renderMessages() {
  await requireUser();
  appShell('mensagens', `
    <section class="card message-layout">
      <aside class="conversation-list pad">
        <h2>Mensagens</h2>
        <input class="input" placeholder="Buscar usuario">
        ${demoProfiles.slice(1).map((p) => `<button class="nav-link convo" data-user="${p.username}"><img class="avatar" src="${p.avatar_url}"><span><strong>${p.username}</strong><br><small class="muted">Toque para conversar</small></span></button>`).join('')}
      </aside>
      <div class="chat-window">
        <header class="pad row"><img class="avatar" src="${demoProfiles[1].avatar_url}"><strong id="chat-name">${demoProfiles[1].username}</strong></header>
        <div class="chat-messages" id="messages"><div class="bubble">Oi! Gostei do seu post.</div><div class="bubble me">Valeu! ✨</div></div>
        <form class="row pad" id="message-form"><input class="input" name="message" placeholder="Mensagem..."><button class="btn">Enviar</button></form>
      </div>
    </section>`);
  document.querySelectorAll('.convo').forEach((btn) => btn.onclick = () => {
    document.querySelector('#chat-name').textContent = btn.dataset.user;
    toast('Conversa aberta.');
  });
  document.querySelector('#message-form').onsubmit = (event) => {
    event.preventDefault();
    const text = new FormData(event.currentTarget).get('message');
    if (!text) return;
    document.querySelector('#messages').insertAdjacentHTML('beforeend', `<div class="bubble me">${text}</div>`);
    event.currentTarget.reset();
  };
}

if (document.body.dataset.page === 'mensagens') renderMessages();
