import { APP } from './config.js';
import { dbError, supabase } from './supabase.js';
import { $, toast } from './utils.js';

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function renderAuth(mode) {
  const titles = {
    login: ['Entrar', 'Entre para ver seu feed, stories, reels e mensagens.'],
    cadastro: ['Criar conta', 'Crie seu perfil e comece a postar.'],
    forgot: ['Recuperar senha', 'Enviaremos um link seguro para seu e-mail.'],
  };
  const [title, subtitle] = titles[mode];
  $('#app').innerHTML = `
    <main class="auth-page">
      <form class="auth-card" id="auth-form">
        <div class="auth-logo">
          <img src="${APP.logo}" alt="${APP.name}">
          <h1>${APP.name}</h1>
          <p>${subtitle}</p>
        </div>
        ${mode === 'cadastro' ? `
          <label class="label">Nome completo<input class="input" name="full_name" required></label>
          <label class="label">Nome de usuario<input class="input" name="username" required minlength="3"></label>
        ` : ''}
        <label class="label">E-mail<input class="input" name="email" type="email" required></label>
        ${mode !== 'forgot' ? `<label class="label">Senha<input class="input" name="password" type="password" required minlength="6"></label>` : ''}
        ${mode === 'cadastro' ? `<label class="label">Confirmar senha<input class="input" name="confirm" type="password" required minlength="6"></label>` : ''}
        <button class="btn" type="submit">${title}</button>
        ${mode === 'login' ? `<button class="btn secondary" type="button" id="google">Entrar com Google</button>` : ''}
        <div class="between tiny" style="margin-top:16px">
          ${mode !== 'login' ? '<a href="/login.html">Ja tenho conta</a>' : '<a href="/cadastro.html">Criar conta</a>'}
          ${mode !== 'forgot' ? '<a href="/esqueci-senha.html">Esqueci minha senha</a>' : ''}
        </div>
      </form>
    </main>`;

  $('#auth-form').addEventListener('submit', (event) => handleAuth(event, mode));
  $('#google')?.addEventListener('click', async () => {
    if (!supabase) return toast('Configure o Supabase para usar login Google.', 'warn');
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/home.html` } });
    if (error) toast(dbError(error), 'error');
  });
}

async function handleAuth(event, mode) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const email = String(form.get('email') || '').trim();
  const password = String(form.get('password') || '');
  if (!validEmail(email)) return toast('Informe um e-mail valido.', 'error');
  if (!supabase) {
    toast('Modo visual: configure /js/config.js para autenticar no Supabase.');
    location.href = '/home.html';
    return;
  }

  if (mode === 'login') {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return toast(dbError(error, 'E-mail ou senha incorretos.'), 'error');
    location.href = '/home.html';
  }

  if (mode === 'cadastro') {
    const username = String(form.get('username') || '').trim().toLowerCase();
    const full_name = String(form.get('full_name') || '').trim();
    const confirm = String(form.get('confirm') || '');
    if (password.length < 6) return toast('Use uma senha com pelo menos 6 caracteres.', 'error');
    if (password !== confirm) return toast('As senhas nao conferem.', 'error');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return toast(dbError(error), 'error');
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({ id: data.user.id, username, full_name, avatar_url: APP.defaultAvatar });
      if (profileError) return toast(dbError(profileError), 'error');
    }
    toast('Conta criada. Verifique seu e-mail se a confirmacao estiver ativa.');
    location.href = '/home.html';
  }

  if (mode === 'forgot') {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/configuracoes.html` });
    if (error) return toast(dbError(error), 'error');
    toast('Link de recuperacao enviado.');
  }
}

const page = document.body.dataset.page;
if (page === 'login') renderAuth('login');
if (page === 'cadastro') renderAuth('cadastro');
if (page === 'forgot') renderAuth('forgot');
