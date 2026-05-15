import { appShell, demoProfiles, demoStories, escapeHtml, requireUser, skeleton, toast } from './utils.js';
import { createPost, fetchPosts, postCard, uploadMedia, wirePostActions } from './posts.js';
import { renderStories, wireStoryViewer } from './stories.js';

export async function renderHome() {
  await requireUser();
  appShell('home', `
    <div class="feed-layout">
      <section id="feed-column">
        <div class="card">${renderStories(demoStories)}</div>
        <form class="card composer pad" id="quick-post" style="margin-top:14px">
          <div class="row">
            <img class="avatar" src="/assets/default-avatar.png" alt="Avatar">
            <textarea name="caption" placeholder="No que voce esta pensando? Use #hashtags e @mencoes"></textarea>
          </div>
          <div id="quick-preview"></div>
          <div class="between" style="margin-top:12px">
            <input id="quick-file" type="file" accept="image/*,video/*">
            <button class="btn">Publicar</button>
          </div>
        </form>
        <div id="feed-list" style="margin-top:14px">${skeleton(3)}</div>
      </section>
      <aside class="right-rail">
        <div class="card pad">
          <h3>Sugestoes para seguir</h3>
          ${demoProfiles.slice(1).map((profile) => `<div class="between" style="margin-top:12px"><span class="row"><img class="avatar" src="${profile.avatar_url}"><strong>${profile.username}</strong></span><button class="btn secondary follow-btn">Seguir</button></div>`).join('')}
        </div>
        <a class="shop-cta" href="/explorar.html?filter=shop">🛍️ Ir para a loja</a>
      </aside>
    </div>`);

  wireStoryViewer();
  document.querySelectorAll('.follow-btn').forEach((button) => button.addEventListener('click', () => {
    button.textContent = 'Seguindo';
    toast('Usuario seguido.');
  }));

  const posts = await fetchPosts();
  const list = document.querySelector('#feed-list');
  list.innerHTML = posts.map(postCard).join('');
  wirePostActions(list, posts);

  document.querySelector('#quick-file').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    document.querySelector('#quick-preview').innerHTML = file.type.startsWith('video/')
      ? `<video class="post-media" src="${url}" controls></video>`
      : `<img class="post-media" src="${url}" alt="Preview">`;
  });
  document.querySelector('#quick-post').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = document.querySelector('#quick-file').files[0];
    if (!file && !form.get('caption')) return toast('Escolha uma midia ou escreva uma legenda.', 'error');
    const mediaUrl = file ? await uploadMedia(file, 'posts') : '';
    const post = await createPost({ file, mediaUrl, caption: escapeHtml(form.get('caption')), location: 'Feed', visibility: 'public' });
    posts.unshift(post);
    list.insertAdjacentHTML('afterbegin', postCard(post));
    wirePostActions(list, posts);
    event.currentTarget.reset();
    document.querySelector('#quick-preview').innerHTML = '';
    toast('Post publicado.');
  });
}

if (document.body.dataset.page === 'home') renderHome();
