-- =========================================================
--  Schema do banco de dados (Supabase / PostgreSQL)
--
--  Como usar:
--  1. Acesse o painel do seu projeto no Supabase
--  2. Vá em "SQL Editor" -> "New query"
--  3. Cole TODO este arquivo e clique em "Run"
--
--  Isso cria as tabelas e já insere a lista de presentes.
-- =========================================================

-- Tabela de presentes do chá de panela ----------------------
create table if not exists public.gifts (
  id          bigint generated always as identity primary key,
  name        text        not null unique,
  position    int         not null default 0,
  claimed     boolean     not null default false,
  claimed_by  text,
  claimed_at  timestamptz
);

-- Tabela de confirmações de presença ------------------------
create table if not exists public.rsvps (
  id          bigint generated always as identity primary key,
  name        text        not null,
  attending   boolean     not null default true,
  guests      int         not null default 1,
  gift_id     bigint      references public.gifts(id) on delete set null,
  gift_name   text,
  is_pix      boolean     not null default false,
  message     text,
  created_at  timestamptz not null default now()
);

-- Segurança: mantemos RLS ligado. Todo o acesso do site passa
-- pela service_role (nas API routes), que ignora o RLS.
alter table public.gifts enable row level security;
alter table public.rsvps enable row level security;

-- Popula a lista de presentes (idempotente) -----------------
insert into public.gifts (name, position) values
  ('Jogo de panelas antiaderente', 1),
  ('Tábua de corte Bamboo Mor 50x30cm', 2),
  ('Faqueiro Tramontina Búzios 24 peças', 3),
  ('Kit 4 descansos de panela de bambu', 4),
  ('Saca-rolhas Brinox', 5),
  ('Liquidificador Mondial Easy Power 550W', 6),
  ('Porta-temperos inox 12 potes', 7),
  ('Espelho para banheiro', 8),
  ('Porta-escova de dentes Dental Up', 9),
  ('Porta-sabonete líquido de vidro 330ml', 10),
  ('Abajur Home Line Charlot 51cm', 11),
  ('Kit de almofadas decorativas', 12),
  ('Jogo de cama Teka Crystal 4 peças 100% algodão', 13),
  ('Tapete passadeira antiderrapante para cozinha 1,30m', 14),
  ('Secador Mondial Travel Golden Rose', 15)
on conflict (name) do nothing;
