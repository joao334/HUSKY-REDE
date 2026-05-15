import { appShell, demoPosts, escapeHtml, requireUser, toast } from './utils.js';

async function renderReels() {
  await requireUser();
  const reels = demoPosts.filter((post) => post.media_type === 'video').concat(demoPosts);
  appShell('reels', `
    <div class="reels-feed">
      ${reels.map((post) => `<section class="reel">${post.media_type === 'video' ? `<video src="${post.media_url}" autoplay loop playsinline></video>` : `<img src="${post.media_url}" style="width:100%;height:100%;object-fit:cover">`}<div class="reel-info"><strong>@${escapeHtml(post.profile?.username || 'creator')}</strong><p>${escapeHtml(post.caption || '')}</p><small>Audio original · ${post.views_count || 1200} views</small></div><div class="reel-actions"><button class="icon-btn">♡</button><button class="icon-btn">◌</button><button class="icon-btn">↗</button><button class="icon-btn">▱</button></div></section>`).join('')}
    </div>`);
  document.querySelectorAll('.reel .icon-btn').forEach((button) => button.onclick = () => toast('Acao registrada.'));
  document.querySelectorAll('.reel video').forEach((video) => video.onclick = () => video.paused ? video.play() : video.pause());
}

if (document.body.dataset.page === 'reels') renderReels();
