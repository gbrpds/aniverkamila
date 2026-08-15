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
  ('Jogo de panelas (antiaderente)', 1),
  ('Tábua de corte', 2),
  ('Talheres (jogo completo)', 3),
  ('Descanso de panela', 4),
  ('Saca-rolha', 5),
  ('Liquidificador', 6),
  ('Porta-temperos', 7),
  ('Espelho para banheiro', 8),
  ('Porta-escova de dentes', 9),
  ('Porta-sabonete', 10),
  ('Abajur', 11),
  ('Almofadas', 12),
  ('Lençol / Fronhas', 13),
  ('Tapete para cozinha', 14),
  ('Secador de cabelo', 15)
on conflict (name) do nothing;
