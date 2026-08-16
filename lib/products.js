// =========================================================
//  Lista de presentes (produtos) do chá de panela.
//
//  Cada produto tem:
//   - name : precisa ser IGUAL ao nome na tabela "gifts" do Supabase
//            (veja supabase/schema.sql)
//   - slug : usado para o nome do arquivo de foto (public/images/produtos)
//   - emoji: ícone temporário mostrado enquanto não há foto
//   - url  : link direto do produto (Mercado Livre / Shopee)
//   - image: (opcional) URL/caminho da foto. Se vazio, tenta
//            /images/produtos/<slug>.jpg e, se não achar, mostra o emoji.
// =========================================================

export const PRODUCTS = [
  { name: "Jogo de Panelas", slug: "jogo-de-panelas", emoji: "🍳", url: "https://meli.la/1PSDCG2" },
  { name: "Tábua de Corte", slug: "tabua-de-corte", emoji: "🔪", url: "https://meli.la/2epYsvB" },
  { name: "Descanso de Panela", slug: "descanso-de-panela", emoji: "🍲", url: "https://meli.la/1AZjEPx" },
  { name: "Saca Rolha", slug: "saca-rolha", emoji: "🍾", url: "https://meli.la/1wqQTgQ" },
  { name: "Liquidificador", slug: "liquidificador", emoji: "🥤", url: "https://meli.la/1ZpLG9T" },
  { name: "Porta tempero", slug: "porta-tempero", emoji: "🧂", url: "https://meli.la/21TfLFc" },
  { name: "Kit banheiro", slug: "kit-banheiro", emoji: "🚿", url: "https://meli.la/2dSjuy9" },
  { name: "Abajur", slug: "abajur", emoji: "💡", url: "https://s.shopee.com.br/2qTpC3YGQ5" },
  { name: "Abajur verde", slug: "abajur-verde", emoji: "💚", url: "https://s.shopee.com.br/7KwEYMXmmJ" },
  { name: "Almofadas", slug: "almofadas", emoji: "🛋️", url: "https://s.shopee.com.br/5ArjyPaxpH" },
  { name: "Jogo de lençol", slug: "jogo-de-lencol", emoji: "🛏️", url: "https://meli.la/25mCSbd" },
  { name: "Tapete de cozinha", slug: "tapete-de-cozinha", emoji: "🧺", url: "https://s.shopee.com.br/9fK9KvMZay" },
  { name: "Secador de cabelo", slug: "secador-de-cabelo", emoji: "💇", url: "https://meli.la/1J5pJbn" },
  { name: "Leiteira", slug: "leiteira", emoji: "🥛", url: "https://meli.la/1F9SouE" },
  { name: "Edredom", slug: "edredom", emoji: "🛌", url: "https://meli.la/1ciFFfj" },
  { name: "Organizador Banheiro", slug: "organizador-banheiro", emoji: "🧴", url: "https://s.shopee.com.br/5ArjxjwOlX?share_channel_code=1" },
  { name: "Espelho Decorativo", slug: "espelho-decorativo", emoji: "🪞", url: "https://s.shopee.com.br/4LIcyIS8yk" },
  { name: "Espelho Banheiro", slug: "espelho-banheiro", emoji: "🪞", url: "https://s.shopee.com.br/2LXYajJjIu" },
  { name: "Luminária", slug: "luminaria", emoji: "🔦", url: "https://s.shopee.com.br/1gHroTgIu1" },
  { name: "Tapete sala", slug: "tapete-sala", emoji: "🧶", url: "https://s.shopee.com.br/40fmanjoN0" },
  { name: "Rack", slug: "rack", emoji: "📺", url: "https://meli.la/1jV7H4k" },
  { name: "Jogo de talheres", slug: "jogo-de-talheres", emoji: "🍴", url: "https://meli.la/2EsYsDp" },
  { name: "Estante", slug: "estante", emoji: "🗄️", url: "https://s.shopee.com.br/20uiDOxU0y" },
  { name: "Tela grade", slug: "tela-grade", emoji: "🔲", url: "https://s.shopee.com.br/BT429sQlN" },
  { name: "Mixer", slug: "mixer", emoji: "🌀", url: "https://s.shopee.com.br/112B1hkanr" },
  { name: "Quadro decorativo", slug: "quadro-decorativo", emoji: "🖼️", url: "https://s.shopee.com.br/904SYVIBJT" },
  { name: "Kit 3 quadros", slug: "kit-3-quadros", emoji: "🖼️", url: "https://s.shopee.com.br/9pdZY6zaKc" },
  { name: "Quadro Stop Over Thinking", slug: "quadro-stop-overthinking", emoji: "🧠", url: "https://s.shopee.com.br/7fZ4yGDbgs" },
  { name: "Toalhas", slug: "toalhas", emoji: "🛁", url: "https://meli.la/2ki5pER" },
  { name: "Jogo de facas", slug: "jogo-de-facas", emoji: "🔪", url: "https://meli.la/1LtzJge" },
  { name: "Potes", slug: "potes", emoji: "🫙", url: "https://meli.la/2SP8gbh" },
  { name: "Puxa saco", slug: "puxa-saco", emoji: "🛍️", url: "https://meli.la/1JaeARE" },
];

// Só os nomes — usado no fallback da API quando o Supabase não está configurado.
export const GIFT_NAMES = PRODUCTS.map((p) => p.name);

// Procura os metadados de um produto pelo nome (vindo do banco de dados).
export function findProduct(name) {
  return PRODUCTS.find((p) => p.name === name) || null;
}

// Detecta a loja pelo link do produto (para a tag "Produto de ...").
export function marketplaceOf(url) {
  const u = (url || "").toLowerCase();
  if (u.includes("shopee")) return { key: "shopee", label: "Shopee" };
  if (u.includes("meli.la") || u.includes("mercadoliv"))
    return { key: "ml", label: "Mercado Livre" };
  if (u.includes("amazon")) return { key: "amazon", label: "Amazon" };
  if (u.includes("magazineluiza") || u.includes("magalu"))
    return { key: "magalu", label: "Magalu" };
  return { key: "loja", label: "Loja" };
}
