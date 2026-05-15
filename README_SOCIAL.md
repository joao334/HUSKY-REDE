# FotoRede

Rede social web modular com HTML, CSS, JavaScript e Supabase.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra:

```txt
http://localhost:5173/login.html
```

## Configurar Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor.
3. Rode o arquivo:

```txt
supabase/social_network_schema.sql
```

4. Em Authentication, habilite e-mail/senha e Google, se quiser OAuth.
5. Em `js/config.js`, preencha:

```js
export const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
export const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANON';
```

## Deploy Vercel

Use:

```bash
npm run build
```

Na Vercel:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Páginas

- `login.html`
- `cadastro.html`
- `esqueci-senha.html`
- `home.html`
- `explorar.html`
- `reels.html`
- `stories.html`
- `criar-post.html`
- `editor-foto.html`
- `mensagens.html`
- `perfil.html`
- `configuracoes.html`
- `notificacoes.html`
- `admin.html`

## Observação

Sem Supabase configurado, a interface usa bots visuais para teste de layout, feed, stories, reels e mensagens. Com Supabase configurado, autenticação, storage e tabelas passam a ser usados pelos módulos JS.
