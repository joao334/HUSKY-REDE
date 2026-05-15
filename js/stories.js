import { appShell, demoStories, escapeHtml, requireUser, toast } from './utils.js';
import { uploadMedia } from './posts.js';

export function renderStories(stories = demoStories) {
  return `<div class="story-row">
    <a class="story-item" href="/stories.html"><span class="story-ring"><img src="/assets/default-avatar.png" alt="Seu story"></span><span>Seu story</span></a>
    ${stories.map((story) => `<button class="story-item open-story" data-story="${story.id}"><span class="story-ring"><img src="${story.profile?.avatar_url || story.media_url}" alt="${escapeHtml(story.profile?.username || 'story')}"></span><span>${escapeHtml(story.profile?.username || story.text_content || 'story')}</span></button>`).join('')}
  </div>`;
}

export function wireStoryViewer() {
  document.querySelectorAll('.open-story').forEach((button) => button.addEventListener('click', () => {
    const story = demoStories.find((item) => item.id === button.dataset.story);
    if (!story) return;
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `<div class="modal" style="max-width:420px;background:#000;color:white"><div style="height:4px;background:white;margin:14px;border-radius:9px"></div><div class="row pad"><img class="avatar" src="${story.profile?.avatar_url || '/assets/default-avatar.png'}"><strong>${story.profile?.username || 'story'}</strong><button class="icon-btn close" style="margin-left:auto;color:white">×</button></div>${story.media_type === 'video' ? `<video src="${story.media_url}" autoplay controls style="width:100%;aspect-ratio:9/16;object-fit:cover"></video>` : `<img src="${story.media_url}" style="width:100%;aspect-ratio:9/16;object-fit:cover">`}<div class="pad"><p>${escapeHtml(story.text_content || '')}</p><button class="btn secondary reply">Responder</button><button class="btn ghost like" style="color:white">♡ Curtir</button></div></div>`;
    document.body.appendChild(modal);
    modal.querySelector('.close').onclick = () => modal.remove();
    modal.querySelector('.reply').onclick = () => toast('Resposta enviada.');
    modal.querySelector('.like').onclick = () => toast('Story curtido.');
  }));
}

export async function renderStoriesPage() {
  await requireUser();
  appShell('criar', `
    <div class="card pad">
      <h1>Publicar story</h1>
      <p class="muted">Stories expiram automaticamente em 24 horas.</p>
      <form id="story-form" class="editor-page" style="grid-template-columns:minmax(0,1fr) 320px">
        <div class="editor-stage"><div id="story-preview" class="muted">Escolha foto ou video</div></div>
        <div class="editor-panel">
          <label class="label">Midia<input class="input" id="story-file" type="file" accept="image/*,video/*" required></label>
          <label class="label">Texto<textarea class="textarea" name="text_content"></textarea></label>
          <label class="label">Sticker/emoji<input class="input" name="sticker" placeholder="✨"></label>
          <label class="label">Link<input class="input" name="link" placeholder="https://"></label>
          <button class="btn">Publicar story</button>
        </div>
      </form>
    </div>`);
  const fileInput = document.querySelector('#story-file');
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    const url = URL.createObjectURL(file);
    document.querySelector('#story-preview').innerHTML = file.type.startsWith('video/') ? `<video src="${url}" controls style="max-height:70vh"></video>` : `<img src="${url}" style="max-height:70vh">`;
  });
  document.querySelector('#story-form').onsubmit = async (event) => {
    event.preventDefault();
    await uploadMedia(fileInput.files[0], 'stories');
    toast('Story publicado.');
    location.href = '/home.html';
  };
}

if (document.body.dataset.page === 'stories') renderStoriesPage();
