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
  { name: "Jogo de Panelas", slug: "jogo-de-panelas", emoji: "🍳", url: "https://meli.la/1PSDCG2", image: "https://http2.mlstatic.com/D_NQ_NP_2X_668844-MLA95245567513_102025-F.webp" },
  { name: "Tábua de Corte", slug: "tabua-de-corte", emoji: "🔪", url: "https://meli.la/2epYsvB", image: "https://http2.mlstatic.com/D_NQ_NP_2X_637341-MLB85722803429_062025-F-tabua-de-corte-saudavel-pp-aco-inox-para-cortar-dupla-face.webp" },
  { name: "Descanso de Panela", slug: "descanso-de-panela", emoji: "🍲", url: "https://meli.la/1AZjEPx", image: "https://http2.mlstatic.com/D_NQ_NP_2X_844021-MLA114288048099_072026-F.webp" },
  { name: "Saca Rolha", slug: "saca-rolha", emoji: "🍾", url: "https://meli.la/1wqQTgQ", image: "https://http2.mlstatic.com/D_NQ_NP_2X_936112-MLA113059410824_072026-F.webp" },
  { name: "Liquidificador", slug: "liquidificador", emoji: "🥤", url: "https://meli.la/1ZpLG9T", image: "https://http2.mlstatic.com/D_NQ_NP_2X_744049-MLA99539379058_122025-F.webp" },
  { name: "Porta tempero", slug: "porta-tempero", emoji: "🧂", url: "https://meli.la/21TfLFc", image: "https://http2.mlstatic.com/D_NQ_NP_2X_965442-MLB109312929874_042026-F-porta-tempero-giratorio-inox-12-potes-vidro-cor-inox-redondo.webp" },
  { name: "Kit banheiro", slug: "kit-banheiro", emoji: "🚿", url: "https://meli.la/2dSjuy9", image: "https://http2.mlstatic.com/D_NQ_NP_2X_902220-MLB113999035518_072026-F-conjunto-acessorios-banheiro-4-pecas-ceramica-verde.webp" },
  { name: "Abajur", slug: "abajur", emoji: "💡", url: "https://s.shopee.com.br/2qTpC3YGQ5", image: "https://down-br.img.susercontent.com/file/sg-11134201-825ay-mfwa0sce6olr10.webp" },
  { name: "Abajur verde", slug: "abajur-verde", emoji: "💚", url: "https://s.shopee.com.br/7KwEYMXmmJ", image: "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mf0er0zoqc5i38@resize_w450_nl.webp" },
  { name: "Almofadas", slug: "almofadas", emoji: "🛋️", url: "https://s.shopee.com.br/5ArjyPaxpH", image: "https://down-br.img.susercontent.com/file/br-11134207-820me-mooslbe64ooz2d.webp" },
  { name: "Jogo de lençol", slug: "jogo-de-lencol", emoji: "🛏️", url: "https://meli.la/25mCSbd", image: "https://http2.mlstatic.com/D_NQ_NP_2X_847410-MLB80853036505_112024-F-jogo-lencol-casal-percal-400-fios-4-pcs-macio-e-toque-suave.webp" },
  { name: "Tapete de cozinha", slug: "tapete-de-cozinha", emoji: "🧺", url: "https://s.shopee.com.br/9fK9KvMZay", image: "https://down-br.img.susercontent.com/file/br-11134201-23010-irlujckus7lva1.webp" },
  { name: "Secador de cabelo", slug: "secador-de-cabelo", emoji: "💇", url: "https://meli.la/1J5pJbn", image: "https://http2.mlstatic.com/D_NQ_NP_2X_931087-MLA100025900529_122025-F.webp" },
  { name: "Leiteira", slug: "leiteira", emoji: "🥛", url: "https://meli.la/1F9SouE", image: "https://http2.mlstatic.com/D_NQ_NP_2X_796576-MLB111145986587_052026-F-fervedor-canecao-leiteira-no-12-antiaderente-tampa-de-vidro.webp" },
  { name: "Edredom", slug: "edredom", emoji: "🛌", url: "https://meli.la/1ciFFfj", image: "https://http2.mlstatic.com/D_NQ_NP_2X_689263-MLA89881136107_082025-F.webp" },
  { name: "Organizador Banheiro", slug: "organizador-banheiro", emoji: "🧴", url: "https://s.shopee.com.br/5ArjxjwOlX?share_channel_code=1", image: "https://down-br.img.susercontent.com/file/br-11134207-820mh-mrlntyv5exvo3f.webp" },
  { name: "Espelho Decorativo", slug: "espelho-decorativo", emoji: "🪞", url: "https://s.shopee.com.br/4LIcyIS8yk", image: "https://down-br.img.susercontent.com/file/br-11134207-820l7-mlhvy4prpnuv5f.webp" },
  { name: "Espelho Banheiro", slug: "espelho-banheiro", emoji: "🪞", url: "https://s.shopee.com.br/2LXYajJjIu", image: "https://down-br.img.susercontent.com/file/br-11134207-820lh-mpe05qz8asqtf5.webp" },
  { name: "Luminária", slug: "luminaria", emoji: "🔦", url: "https://s.shopee.com.br/1gHroTgIu1", image: "https://down-br.img.susercontent.com/file/br-11134207-81z1k-mgo771nvtgjk52.webp" },
  { name: "Tapete sala", slug: "tapete-sala", emoji: "🧶", url: "https://s.shopee.com.br/40fmanjoN0", image: "https://down-br.img.susercontent.com/file/br-11134207-820lr-mrlqhcxc0glh4d@resize_w450_nl.webp" },
  { name: "Rack", slug: "rack", emoji: "📺", url: "https://meli.la/1jV7H4k", image: "https://http2.mlstatic.com/D_NQ_NP_2X_962261-MLA100593516880_122025-F.webp" },
  { name: "Jogo de talheres", slug: "jogo-de-talheres", emoji: "🍴", url: "https://meli.la/2EsYsDp", image: "https://http2.mlstatic.com/D_NQ_NP_2X_640792-MLB91728082532_092025-F-jogo-talher-garfo-faca-24-pecas-victoria-black-aco-inox-luxo.webp" },
  { name: "Estante", slug: "estante", emoji: "🗄️", url: "https://s.shopee.com.br/20uiDOxU0y", image: "https://down-br.img.susercontent.com/file/br-11134207-820lz-mr04nz8pplvo4d.webp" },
  { name: "Tela grade", slug: "tela-grade", emoji: "🔲", url: "https://s.shopee.com.br/BT429sQlN", image: "https://down-br.img.susercontent.com/file/br-11134207-820l9-mmkraosihx52f2.webp" },
  { name: "Mixer", slug: "mixer", emoji: "🌀", url: "https://s.shopee.com.br/112B1hkanr", image: "https://down-br.img.susercontent.com/file/sg-11134201-825ar-mr7p9wksvd35d4_tn" },
  { name: "Quadro decorativo", slug: "quadro-decorativo", emoji: "🖼️", url: "https://s.shopee.com.br/904SYVIBJT", image: "https://down-br.img.susercontent.com/file/br-11134207-820l4-mnj7onxdlfr464.webp" },
  { name: "Kit 3 quadros", slug: "kit-3-quadros", emoji: "🖼️", url: "https://s.shopee.com.br/9pdZY6zaKc", image: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lw0mlhsdc2phb4.webp" },
  { name: "Quadro Stop Over Thinking", slug: "quadro-stop-overthinking", emoji: "🧠", url: "https://s.shopee.com.br/7fZ4yGDbgs", image: "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mivukgrb5c76d0.webp" },
  { name: "Toalhas", slug: "toalhas", emoji: "🛁", url: "https://meli.la/2ki5pER", image: "https://http2.mlstatic.com/D_NQ_NP_2X_803195-MLA87624557055_072025-F.webp" },
  { name: "Jogo de facas", slug: "jogo-de-facas", emoji: "🔪", url: "https://meli.la/1LtzJge", image: "https://http2.mlstatic.com/D_NQ_NP_2X_811512-MLA111876119816_062026-F.webp" },
  { name: "Potes", slug: "potes", emoji: "🫙", url: "https://meli.la/2SP8gbh", image: "https://http2.mlstatic.com/D_NQ_NP_2X_965015-MLA112697664618_062026-F.webp" },
  { name: "Puxa saco", slug: "puxa-saco", emoji: "🛍️", url: "https://meli.la/1JaeARE", image: "https://http2.mlstatic.com/D_NQ_NP_2X_634443-MLB115294032755_072026-F-kit-3-puxa-saco-organizador-porta-sacolas-plasticas-cozinha.webp" },
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
