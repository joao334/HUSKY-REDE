# Husky Club

Husky Club é a rede social, cardápio digital, sistema de pedidos, fidelidade e painel de gestão da Husky Confeiteiro.

Esta versão também incorpora os assets e dados públicos do app de referência `HUSKY-APP-main.zip`: logo, mascote, fotos reais dos produtos, stickers de WhatsApp, Instagram `@huskyconfeiteiro`, WhatsApp `5511945198349`, bairros de atendimento, horários, cupons e configuração InfinitePay.

## Stack

- React + Vite
- TypeScript
- Tailwind CSS
- Supabase Auth, Database, Storage e Realtime
- Vercel-ready com `vercel.json`

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz:

```env
VITE_SUPABASE_URL=https://ztnrkxrprxorphhnstqm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0bnJreHJwcnhvcnBoaG5zdHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MDI4NjUsImV4cCI6MjA5NDI3ODg2NX0.InXXJC_IATDgfyApBqU_aJtN4pe9ywBLCktVUSZHFas
```

Sem essas variáveis, o login Google fica bloqueado. O conteúdo público ainda pode carregar dados locais para preview visual.

## Supabase

1. Crie um projeto no Supabase.
2. Se o banco estiver vazio, rode as migrations em `supabase/migrations`.
3. Se aparecer `relation "users_profiles" already exists`, pare e rode somente `supabase/RUN_THIS_ONLY_IF_TABLES_ALREADY_EXIST.sql`.
4. Em Authentication > Providers, ative o Google e preencha Client ID e Client Secret do Google Cloud.
5. Em Authentication > URL Configuration, adicione as URLs de redirect do app, por exemplo `http://localhost:5173/app/feed`, `http://localhost:5173/admin` e as equivalentes da Vercel.
6. Rode `supabase/seed.sql` para inserir produtos, posts, stories, cupons, estoque, fichas técnicas e configurações iniciais.
7. Cada novo login Google cria automaticamente um perfil `customer`.
8. Para liberar a gestão, promova manualmente apenas o e-mail do administrador:

```sql
update public.users_profiles
set role = 'admin', level = 'Husky Supremo'
where email = 'email-do-admin@exemplo.com';
```

O bucket público `husky-media` é criado pela migration para imagens de produtos, posts, stories, chat, comprovantes e avatar.

Os arquivos de marca usados pelo seed ficam em `public/assets/husky`. Ao publicar na Vercel, esses caminhos continuam disponíveis como `/assets/husky/...`.

## Rodar localmente

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy na Vercel

1. Importe o repositório na Vercel.
2. Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
3. Use o build command `npm run build`.
4. Use o output directory `dist`.

O arquivo `vercel.json` redireciona rotas SPA para `index.html`, evitando tela branca ao atualizar páginas internas.
