// =========================================================
//  Lista de presentes (produtos) do chá de panela.
//
//  Cada produto tem:
//   - name : precisa ser IGUAL ao nome na tabela "gifts" do Supabase
//            (veja supabase/schema.sql)
//   - slug : usado para o nome do arquivo de foto e para o link do Mercado Livre
//   - emoji: ícone temporário mostrado enquanto não há foto
//   - query: o que será buscado nos marketplaces
//   - image: (opcional) caminho/URL da foto. Se vazio, tenta /images/produtos/<slug>.jpg
// =========================================================

export const PRODUCTS = [
  { name: "Jogo de panelas (antiaderente)", slug: "jogo-de-panelas-antiaderente", emoji: "🍳", query: "jogo de panelas antiaderente" },
  { name: "Tábua de corte", slug: "tabua-de-corte", emoji: "🔪", query: "tábua de corte cozinha" },
  { name: "Talheres (jogo completo)", slug: "jogo-de-talheres", emoji: "🍴", query: "jogo de talheres inox 24 peças" },
  { name: "Descanso de panela", slug: "descanso-de-panela", emoji: "🍲", query: "descanso de panela" },
  { name: "Saca-rolha", slug: "saca-rolha", emoji: "🍾", query: "saca rolha abridor de vinho" },
  { name: "Liquidificador", slug: "liquidificador", emoji: "🥤", query: "liquidificador" },
  { name: "Porta-temperos", slug: "porta-temperos", emoji: "🧂", query: "porta temperos organizador" },
  { name: "Espelho para banheiro", slug: "espelho-banheiro", emoji: "🪞", query: "espelho para banheiro" },
  { name: "Porta-escova de dentes", slug: "porta-escova-de-dentes", emoji: "🪥", query: "porta escova de dentes" },
  { name: "Porta-sabonete", slug: "porta-sabonete", emoji: "🧼", query: "porta sabonete líquido" },
  { name: "Abajur", slug: "abajur", emoji: "💡", query: "abajur de mesa" },
  { name: "Almofadas", slug: "almofadas", emoji: "🛋️", query: "almofadas decorativas" },
  { name: "Lençol / Fronhas", slug: "lencol-fronhas", emoji: "🛏️", query: "jogo de lençol casal" },
  { name: "Tapete para cozinha", slug: "tapete-cozinha", emoji: "🧺", query: "tapete para cozinha" },
  { name: "Secador de cabelo", slug: "secador-de-cabelo", emoji: "💇", query: "secador de cabelo" },
];

// Só os nomes — usado no fallback da API quando o Supabase não está configurado.
export const GIFT_NAMES = PRODUCTS.map((p) => p.name);

// Procura os metadados de um produto pelo nome (vindo do banco de dados).
export function findProduct(name) {
  return PRODUCTS.find((p) => p.name === name) || null;
}

// Monta os links de busca em cada marketplace para um produto.
export function marketplaceLinks(product) {
  const q = encodeURIComponent(product.query);
  return [
    {
      key: "ml",
      label: "Mercado Livre",
      url: `https://lista.mercadolivre.com.br/${product.slug}`,
    },
    {
      key: "amazon",
      label: "Amazon",
      url: `https://www.amazon.com.br/s?k=${q}`,
    },
    {
      key: "magalu",
      label: "Magalu",
      url: `https://www.magazineluiza.com.br/busca/${q}/`,
    },
    {
      key: "shopee",
      label: "Shopee",
      url: `https://shopee.com.br/search?keyword=${q}`,
    },
  ];
}
