import { APP } from './config.js';
import { appShell, currentUser, demoPosts, demoProfiles, escapeHtml, requireUser, toast } from './utils.js';

async function renderProfile() {
  await requireUser();
  const params = new URLSearchParams(location.search);
  const username = params.get('u');
  const me = await currentUser();
  const profile = demoProfiles.find((item) => item.username === username) || demoProfiles[0];
  const posts = demoPosts.filter((post) => post.user_id === profile.id || !username);
  appShell('perfil', `
    <section class="profile-head">
      <div class="profile-banner"></div>
      <div class="profile-info">
        <img class="avatar" src="${profile.avatar_url || APP.defaultAvatar}" alt="${escapeHtml(profile.username)}">
        <div>
          <div class="between" style="align-items:flex-start">
            <h1>${escapeHtml(profile.full_name || profile.username)} ${profile.is_verified ? '✓' : ''}</h1>
            <div class="row">
              <button class="btn secondary" id="edit-profile">${profile.id === 'demo-me' || profile.id === me?.id ? 'Editar perfil' : 'Seguir'}</button>
              <a class="btn secondary" href="/mensagens.html">Mensagem</a>
            </div>
          </div>
          <div class="stats"><span class="stat"><strong>${posts.length}</strong> posts</span><span class="stat"><strong>12,8k</strong> seguidores</span><span class="stat"><strong>340</strong> seguindo</span></div>
          <p><strong>@${escapeHtml(profile.username)}</strong></p>
          <p>${escapeHtml(profile.bio || '')}</p>
          <p class="muted">${escapeHtml(profile.location || 'Brasil')} · <a href="#">${escapeHtml(profile.website || 'site.example')}</a></p>
        </div>
      </div>
      <div class="tabs"><button class="tab active">Posts</button><button class="tab">Reels</button><button class="tab">Salvos</button><button class="tab">Marcados</button></div>
    </section>
    <div class="grid-explore" style="margin-top:4px">${posts.map((post) => `<a class="tile" href="/home.html?post=${post.id}">${post.media_type === 'video' ? `<video src="${post.media_url}"></video>` : `<img src="${post.media_url}">`}</a>`).join('')}</div>`);
  document.querySelector('#edit-profile').onclick = () => toast(profile.id === 'demo-me' ? 'Abra configuracoes para editar perfil.' : 'Solicitacao registrada.');
}

if (document.body.dataset.page === 'perfil') renderProfile();
