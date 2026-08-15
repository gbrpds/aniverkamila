# 🪩 Aniversário 25 anos + Chá de Panela — Site de Convite

Site de convite com tema **anos 2000 / Y2K** onde os convidados podem:

- ✅ Confirmar presença (e dizer quantas pessoas vão)
- 🎁 Escolher um presente da lista do chá de panela — **cada item some da lista
  assim que alguém escolhe**, então ninguém repete
- 💸 Copiar a chave Pix
- 💬 Confirmar também pelo WhatsApp
- 💌 Deixar um recadinho

Feito em **Next.js** + **Supabase**, pronto para hospedar na **Vercel**.

---

## 🚀 Passo a passo pra colocar no ar

### 1. Criar o banco de dados (Supabase) — grátis

1. Acesse [supabase.com](https://supabase.com) e crie uma conta (pode usar o Google).
2. Clique em **New project**. Dê um nome (ex: `aniverkamila`) e escolha uma senha.
3. Espere ~2 minutos o projeto ficar pronto.
4. No menu lateral, vá em **SQL Editor → New query**.
5. Abra o arquivo [`supabase/schema.sql`](./supabase/schema.sql) deste projeto,
   copie **todo o conteúdo**, cole no editor e clique em **Run**.
   - Isso cria as tabelas e já preenche a lista de presentes. ✅
6. Vá em **Project Settings (engrenagem) → API** e anote:
   - **Project URL** (algo como `https://xxxx.supabase.co`)
   - A chave **`service_role`** (em *Project API keys* — clique em *Reveal*).
     ⚠️ Essa chave é **secreta**, nunca compartilhe nem suba no git.

### 2. Publicar na Vercel

1. Suba este projeto para o seu GitHub (a branch já está criada).
2. Acesse [vercel.com](https://vercel.com), faça login com o GitHub.
3. **Add New → Project** e importe este repositório.
4. Antes de clicar em *Deploy*, abra **Environment Variables** e adicione:

   | Name                        | Value                                  |
   | --------------------------- | -------------------------------------- |
   | `NEXT_PUBLIC_SUPABASE_URL`  | a *Project URL* do Supabase            |
   | `SUPABASE_SERVICE_ROLE_KEY` | a chave *service_role* do Supabase     |

5. Clique em **Deploy**. Em ~1 minuto seu site estará no ar com uma URL
   `.vercel.app`. 🎉

> 💡 O site **funciona mesmo sem o Supabase configurado** (mostra a lista de
> presentes e o botão de WhatsApp), então você pode publicar primeiro e conectar
> o banco depois.

---

## 👀 Ver as confirmações

No painel do Supabase, vá em **Table Editor**:

- Tabela **`rsvps`** → todas as confirmações (nome, nº de pessoas, presente, recado).
- Tabela **`gifts`** → a coluna `claimed` mostra o que já foi escolhido e por quem.

---

## 🎁 Como funcionam os cards de presente

Cada presente aparece num card com:

- **Foto do produto** (coloque em `public/images/produtos/` — veja o
  [README de lá](./public/images/produtos/README.md); enquanto não houver foto,
  aparece um ícone).
- **Botões de compra** que abrem a busca do produto no Mercado Livre, Amazon,
  Magalu e Shopee (é só referência — o convidado compra onde quiser).
- **Botão "Vou dar esse!"** que reserva o item: ele sai da lista pros outros,
  então ninguém repete.

Os produtos (nome, ícone, busca) ficam em
[`lib/products.js`](./lib/products.js) e precisam ter o **mesmo nome** dos itens
na tabela `gifts` do Supabase ([`supabase/schema.sql`](./supabase/schema.sql)).

## ✏️ Como editar as informações

Os dados do evento (data, horário, endereço, WhatsApp, chave Pix) ficam em
**um único arquivo**: [`lib/config.js`](./lib/config.js).

## 🖼️ Imagens

- Stickers do Canva (capa, Nokia, etc.): pasta [`public/images/`](./public/images/).
- Fotos dos produtos: pasta [`public/images/produtos/`](./public/images/produtos/).

---

## 🧑‍💻 Rodar no seu computador (opcional)

```bash
npm install
cp .env.example .env.local   # preencha com suas chaves do Supabase
npm run dev                  # abre em http://localhost:3000
```

---

Feito com 💗 — tema anos 2000 ✨
