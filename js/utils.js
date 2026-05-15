import { APP } from './config.js';
import { supabase } from './supabase.js';

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export const demoProfiles = [
  { id: 'demo-me', username: 'voce', full_name: 'Seu Perfil', avatar_url: APP.defaultAvatar, bio: 'Criando uma rede social moderna.', is_verified: true },
  { id: 'bot-ana', username: 'ana.frame', full_name: 'Ana Frame', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop', bio: 'Fotografia, viagens e cafe.', is_verified: true },
  { id: 'bot-lucas', username: 'lucas.reels', full_name: 'Lucas Reels', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop', bio: 'Videos curtos e bastidores.' },
  { id: 'bot-maya', username: 'maya.design', full_name: 'Maya Design', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop', bio: 'Cores, editoriais e produtos.' },
];

export const demoPosts = [
  { id: 'post-1', user_id: 'bot-ana', profile: demoProfiles[1], media_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&fit=crop', media_type: 'image', caption: 'Fim de tarde perfeito para testar o editor. #viagem #foto', likes_count: 182, comments_count: 12, saves_count: 9, location: 'Serra Azul', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'post-2', user_id: 'bot-maya', profile: demoProfiles[3], media_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&fit=crop', media_type: 'image', caption: 'Grade visual, contraste e textura. #editorial #design', likes_count: 421, comments_count: 38, saves_count: 72, location: 'Studio', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'post-3', user_id: 'bot-lucas', profile: demoProfiles[2], media_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', media_type: 'video', caption: 'Video curto para testar reels, pause e comentarios. #reels', likes_count: 99, comments_count: 8, saves_count: 5, location: 'Jardim', created_at: new Date(Date.now() - 10800000).toISOString() },
];

export const demoStories = demoProfiles.slice(1).map((profile, index) => ({
  id: `story-${profile.id}`,
  user_id: profile.id,
  profile,
  media_url: demoPosts[index]?.media_url,
  media_type: demoPosts[index]?.media_type ?? 'image',
  text_content: ['Nova foto no feed', 'Video do dia', 'Bastidor do editor'][index] ?? 'Story',
  created_at: new Date(Date.now() - index * 900000).toISOString(),
  expires_at: new Date(Date.now() + 86400000).toISOString(),
}));

export function applyTheme() {
  document.documentElement.dataset.theme = localStorage.getItem('social-theme') || 'light';
}

export function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('social-theme', next);
  toast(`Tema ${next === 'dark' ? 'escuro' : 'claro'} ativado.`);
}

export function toast(message, type = 'info') {
  let wrap = $('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const item = document.createElement('div');
  item.className = `toast toast-${type}`;
  item.textContent = message;
  wrap.appendChild(item);
  setTimeout(() => item.remove(), 3600);
}

export function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function linkifyCaption(text = '') {
  return escapeHtml(text)
    .replace(/#([\p{L}\p{N}_]+)/gu, '<a class="muted" href="/explorar.html?tag=$1">#$1</a>')
    .replace(/@([\p{L}\p{N}_.]+)/gu, '<a class="muted" href="/perfil.html?u=$1">@$1</a>');
}

export function timeAgo(date) {
  const diff = Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 60000));
  if (diff < 60) return `${diff} min`;
  if (diff < 1440) return `${Math.round(diff / 60)} h`;
  return `${Math.round(diff / 1440)} d`;
}

export function setActiveNav(page) {
  $$('.nav-link,.bottom-nav a').forEach((link) => {
    link.classList.toggle('active', link.dataset.page === page);
  });
}

export function appShell(page, content) {
  const nav = [
    ['home', 'Inicio', '⌂', '/home.html'],
    ['explorar', 'Explorar', '⌕', '/explorar.html'],
    ['criar', 'Criar', '⊞', '/criar-post.html'],
    ['reels', 'Reels', '▻', '/reels.html'],
    ['mensagens', 'Mensagens', '◌', '/mensagens.html'],
    ['notificacoes', 'Notificacoes', '♡', '/notificacoes.html'],
    ['perfil', 'Perfil', '◎', '/perfil.html'],
  ];
  const navHtml = nav.map(([id, label, icon, href]) => `<a class="nav-link" data-page="${id}" href="${href}"><span class="ico">${icon}</span><span>${label}</span></a>`).join('');
  const bottom = nav.slice(0, 5).map(([id,, icon, href]) => `<a data-page="${id}" href="${href}">${icon}</a>`).join('');
  $('#app').innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <a class="brand" href="/home.html"><img src="${APP.logo}" alt="${APP.name}"><span>${APP.name}</span></a>
        <a class="shop-cta" href="/explorar.html?filter=shop">🛍️ Abrir loja</a>
        <nav class="nav-list">${navHtml}</nav>
        <button class="nav-link" id="theme-toggle" type="button"><span class="ico">☾</span><span>Tema</span></button>
        <button class="nav-link" id="logout" type="button"><span class="ico">↪</span><span>Sair</span></button>
      </aside>
      <main class="shell-main">
        <header class="topbar">
          <a class="brand" href="/home.html"><img src="${APP.logo}" alt="${APP.name}"><span>${APP.name}</span></a>
          <div class="row"><a href="/criar-post.html">⊞</a><a href="/notificacoes.html">♡</a><a href="/mensagens.html">◌</a></div>
        </header>
        <section class="content">${content}</section>
      </main>
    </div>
    <nav class="bottom-nav"><div class="bottom-nav-inner">${bottom}</div></nav>`;
  setActiveNav(page);
  $('#theme-toggle')?.addEventListener('click', toggleTheme);
  $('#logout')?.addEventListener('click', async () => {
    if (supabase) await supabase.auth.signOut();
    location.href = '/login.html';
  });
}

export async function currentUser() {
  if (!supabase) return { id: 'demo-me', email: 'demo@local.test' };
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) location.href = '/login.html';
  return user;
}

export function filePreview(file) {
  return file ? URL.createObjectURL(file) : '';
}

export function copyText(text) {
  navigator.clipboard?.writeText(text);
  toast('Link copiado.');
}

export function skeleton(count = 3) {
  return Array.from({ length: count }, () => '<div class="card pad skeleton"></div>').join('');
}

applyTheme();
