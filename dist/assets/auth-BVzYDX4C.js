import{A as n,$ as r,t as s}from"./utils-CCU120BG.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";function m(a){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a)}function l(a){var u;const i={login:["Entrar","Entre para ver seu feed, stories, reels e mensagens."],cadastro:["Criar conta","Crie seu perfil e comece a postar."],forgot:["Recuperar senha","Enviaremos um link seguro para seu e-mail."]},[e,t]=i[a];r("#app").innerHTML=`
    <main class="auth-page">
      <form class="auth-card" id="auth-form">
        <div class="auth-logo">
          <img src="${n.logo}" alt="${n.name}">
          <h1>${n.name}</h1>
          <p>${t}</p>
        </div>
        ${a==="cadastro"?`
          <label class="label">Nome completo<input class="input" name="full_name" required></label>
          <label class="label">Nome de usuario<input class="input" name="username" required minlength="3"></label>
        `:""}
        <label class="label">E-mail<input class="input" name="email" type="email" required></label>
        ${a!=="forgot"?'<label class="label">Senha<input class="input" name="password" type="password" required minlength="6"></label>':""}
        ${a==="cadastro"?'<label class="label">Confirmar senha<input class="input" name="confirm" type="password" required minlength="6"></label>':""}
        <button class="btn" type="submit">${e}</button>
        ${a==="login"?'<button class="btn secondary" type="button" id="google">Entrar com Google</button>':""}
        <div class="between tiny" style="margin-top:16px">
          ${a!=="login"?'<a href="/login.html">Ja tenho conta</a>':'<a href="/cadastro.html">Criar conta</a>'}
          ${a!=="forgot"?'<a href="/esqueci-senha.html">Esqueci minha senha</a>':""}
        </div>
      </form>
    </main>`,r("#auth-form").addEventListener("submit",c=>p(c)),(u=r("#google"))==null||u.addEventListener("click",async()=>s("Configure o Supabase para usar login Google.","warn"))}async function p(a,i){a.preventDefault();const e=new FormData(a.currentTarget),t=String(e.get("email")||"").trim();if(String(e.get("password")||""),!m(t))return s("Informe um e-mail valido.","error");{s("Modo visual: configure /js/config.js para autenticar no Supabase."),location.href="/home.html";return}}const o=document.body.dataset.page;o==="login"&&l("login");o==="cadastro"&&l("cadastro");o==="forgot"&&l("forgot");
