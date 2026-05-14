# Husky Club RLS

As políticas de Row Level Security estão aplicadas na migration:

- `supabase/migrations/202605130001_husky_club_schema.sql`

Resumo:

- clientes acessam e editam apenas seus próprios perfis, carrinhos, pedidos, notificações, histórico de patinhas e conversas;
- clientes podem ver produtos disponíveis, posts publicados, stories ativos, cupons ativos, enquetes ativas e avaliações visíveis;
- clientes podem criar comentários, curtidas, favoritos, votos, pedidos e avaliações;
- administradores passam pela função `public.is_admin()` e podem gerenciar todas as tabelas;
- o ranking público usa a função segura `public.get_public_ranking()` para expor só dados não sensíveis.
