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

-- Popula a lista de presentes -------------------------------
-- Limpa a lista antiga antes de inserir a nova (rode sempre que a lista mudar).
-- Como o rsvps.gift_id tem "on delete set null", nenhuma confirmação é perdida.
delete from public.gifts;

insert into public.gifts (name, position) values
  ('Jogo de Panelas', 1),
  ('Tábua de Corte', 2),
  ('Descanso de Panela', 3),
  ('Saca Rolha', 4),
  ('Liquidificador', 5),
  ('Porta tempero', 6),
  ('Kit banheiro', 7),
  ('Abajur', 8),
  ('Abajur verde', 9),
  ('Almofadas', 10),
  ('Jogo de lençol', 11),
  ('Tapete de cozinha', 12),
  ('Secador de cabelo', 13),
  ('Leiteira', 14),
  ('Edredom', 15),
  ('Organizador Banheiro', 16),
  ('Espelho Decorativo', 17),
  ('Espelho Banheiro', 18),
  ('Luminária', 19),
  ('Tapete sala', 20),
  ('Rack', 21),
  ('Jogo de talheres', 22),
  ('Estante', 23),
  ('Tela grade', 24),
  ('Mixer', 25),
  ('Quadro decorativo', 26),
  ('Kit 3 quadros', 27),
  ('Quadro Stop Over Thinking', 28),
  ('Toalhas', 29),
  ('Jogo de facas', 30),
  ('Potes', 31),
  ('Puxa saco', 32)
on conflict (name) do nothing;
