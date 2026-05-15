import { APP } from './config.js';
import { dbError, supabase } from './supabase.js';
import { copyText, currentUser, demoPosts, demoProfiles, escapeHtml, linkifyCaption, timeAgo, toast } from './utils.js';

export async function uploadMedia(file, bucket = 'posts') {
  if (!file) return null;
  if (!supabase) return URL.createObjectURL(file);
  if (file.size > APP.maxUpload[bucket]) throw new Error('Arquivo acima do limite permitido.');
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${(await currentUser()).id}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(dbError(error));
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function fetchPosts({ query = '', hashtag = '' } = {}) {
  if (!supabase) return demoPosts;
  let request = supabase.from('posts').select('*, profile:profiles(*)').eq('visibility', 'public').order('created_at', { ascending: false }).limit(APP.pageSize);
  if (query) request = request.ilike('caption', `%${query}%`);
  const { data, error } = await request;
  if (error) throw new Error(dbError(error));
  return (data || []).filter((post) => !hashtag || post.caption?.includes(`#${hashtag}`));
}

export async function createPost({ file, caption, location, visibility = 'public', mediaUrl, mediaType }) {
  const user = await currentUser();
  const url = mediaUrl || await uploadMedia(file, 'posts');
  const type = mediaType || (file?.type?.startsWith('video/') ? 'video' : 'image');
  if (!supabase) {
    const profile = demoProfiles[0];
    demoPosts.unshift({ id: crypto.randomUUID(), user_id: profile.id, profile, media_url: url, media_type: type, caption, location, visibility, likes_count: 0, comments_count: 0, saves_count: 0, created_at: new Date().toISOString() });
    return demoPosts[0];
  }
  const { data, error } = await supabase.from('posts').insert({ user_id: user.id, media_url: url, media_type: type, caption, location, visibility }).select('*').single();
  if (error) throw new Error(dbError(error));
  await syncHashtags(data.id, caption);
  return data;
}

async function syncHashtags(postId, caption = '') {
  if (!supabase) return;
  const tags = [...new Set((caption.match(/#([\p{L}\p{N}_]+)/gu) || []).map((tag) => tag.slice(1).toLowerCase()))];
  for (const name of tags) {
    const { data } = await supabase.from('hashtags').upsert({ name }, { onConflict: 'name' }).select('id').single();
    if (data) await supabase.from('post_hashtags').insert({ post_id: postId, hashtag_id: data.id });
  }
}

export async function toggleLike(post) {
  const user = await currentUser();
  if (!supabase) {
    post.__liked = !post.__liked;
    post.likes_count += post.__liked ? 1 : -1;
    return post.__liked;
  }
  const { data: existing } = await supabase.from('likes').select('id').eq('post_id', post.id).eq('user_id', user.id).maybeSingle();
  if (existing) {
    await supabase.from('likes').delete().eq('id', existing.id);
    return false;
  }
  await supabase.from('likes').insert({ post_id: post.id, user_id: user.id });
  return true;
}

export async function toggleSave(post) {
  const user = await currentUser();
  if (!supabase) {
    post.__saved = !post.__saved;
    toast(post.__saved ? 'Post salvo.' : 'Post removido dos salvos.');
    return post.__saved;
  }
  const { data: existing } = await supabase.from('saved_posts').select('id').eq('post_id', post.id).eq('user_id', user.id).maybeSingle();
  if (existing) {
    await supabase.from('saved_posts').delete().eq('id', existing.id);
    return false;
  }
  await supabase.from('saved_posts').insert({ post_id: post.id, user_id: user.id });
  return true;
}

export async function addComment(post, content) {
  const user = await currentUser();
  if (!content.trim()) return;
  if (!supabase) {
    post.comments_count += 1;
    toast('Comentario publicado.');
    return;
  }
  const { error } = await supabase.from('comments').insert({ post_id: post.id, user_id: user.id, content });
  if (error) throw new Error(dbError(error));
}

export function postCard(post) {
  const profile = post.profile || demoProfiles.find((item) => item.id === post.user_id) || demoProfiles[0];
  const media = post.media_type === 'video'
    ? `<video class="post-media" src="${post.media_url}" controls playsinline></video>`
    : `<img class="post-media" src="${post.media_url}" alt="${escapeHtml(post.caption || 'Post')}">`;
  return `
    <article class="card post" data-post="${post.id}">
      <div class="between pad">
        <a class="row" href="/perfil.html?u=${profile.username}">
          <img class="avatar story-ring" src="${profile.avatar_url || APP.defaultAvatar}" alt="${escapeHtml(profile.username || '')}">
          <span><strong>${escapeHtml(profile.username || profile.full_name || 'usuario')}</strong><br><span class="tiny muted">${escapeHtml(post.location || 'Feed')} · ${timeAgo(post.created_at)}</span></span>
        </a>
        <button class="icon-btn report-post">⋯</button>
      </div>
      ${media}
      <div class="post-actions">
        <div class="icon-actions">
          <button class="icon-btn like-post">♡</button>
          <button class="icon-btn comment-post">◌</button>
          <button class="icon-btn share-post">↗</button>
        </div>
        <button class="icon-btn save-post">▱</button>
      </div>
      <div class="caption">
        <p><strong class="likes-count">${post.likes_count || 0}</strong> curtidas</p>
        <p><strong>${escapeHtml(profile.username || 'usuario')}</strong> ${linkifyCaption(post.caption || '')}</p>
        <button class="icon-btn tiny muted comment-post">Ver ${post.comments_count || 0} comentarios</button>
      </div>
    </article>`;
}

export function wirePostActions(root, posts) {
  root.querySelectorAll('.post').forEach((card) => {
    const post = posts.find((item) => item.id === card.dataset.post);
    card.querySelector('.like-post')?.addEventListener('click', async (event) => {
      const liked = await toggleLike(post);
      event.currentTarget.classList.toggle('active', liked);
      card.querySelector('.likes-count').textContent = post.likes_count || 0;
    });
    card.querySelector('.save-post')?.addEventListener('click', async (event) => {
      const saved = await toggleSave(post);
      event.currentTarget.classList.toggle('active', saved);
    });
    card.querySelectorAll('.comment-post').forEach((button) => button.addEventListener('click', () => openComments(post)));
    card.querySelector('.share-post')?.addEventListener('click', () => copyText(`${location.origin}/home.html?post=${post.id}`));
    card.querySelector('.report-post')?.addEventListener('click', () => toast('Denuncia enviada para moderacao.'));
  });
}

function openComments(post) {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<div class="modal pad"><div class="between"><h2>Comentarios</h2><button class="icon-btn close">×</button></div><div class="comments"></div><form class="row"><input class="input" name="comment" placeholder="Adicionar comentario..."><button class="btn">Enviar</button></form></div>`;
  document.body.appendChild(modal);
  modal.querySelector('.close').onclick = () => modal.remove();
  modal.querySelector('form').onsubmit = async (event) => {
    event.preventDefault();
    await addComment(post, new FormData(event.currentTarget).get('comment'));
    modal.remove();
  };
}
