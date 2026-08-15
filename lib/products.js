// =========================================================
//  Lista de presentes (produtos) do chá de panela.
//
//  Cada produto tem:
//   - name : precisa ser IGUAL ao nome na tabela "gifts" do Supabase
//            (veja supabase/schema.sql)
//   - slug : usado para o nome do arquivo de foto
//   - emoji: ícone temporário mostrado enquanto não há foto
//   - query: o que será buscado nos marketplaces
//   - image: (opcional) URL ou caminho da foto. Se vazio, tenta
//            /images/produtos/<slug>.jpg e, se não achar, mostra o emoji.
//   - url  : (opcional) link direto/de busca preferido (vira o 1º botão)
// =========================================================

export const PRODUCTS = [
  {
    name: "Jogo de panelas antiaderente",
    slug: "jogo-de-panelas-antiaderente",
    emoji: "🍳",
    query: "jogo panelas 10 peças bianco antiaderente",
    url: "https://www.amazon.com.br/s?k=jogo+panelas+10+pe%C3%A7as+bianco+antiaderente",
    image: "",
  },
  {
    name: "Tábua de corte Bamboo Mor 50x30cm",
    slug: "tabua-de-corte-bamboo",
    emoji: "🔪",
    query: "tábua corte bamboo mor 50x30",
    url: "https://www.amazon.com.br/s?k=t%C3%A1bua+corte+bamboo+mor+50x30",
    image: "",
  },
  {
    name: "Faqueiro Tramontina Búzios 24 peças",
    slug: "faqueiro-tramontina-buzios",
    emoji: "🍴",
    query: "faqueiro tramontina búzios 24 peças",
    url: "https://www.amazon.com.br/s?k=faqueiro+tramontina+b%C3%BAzios+24+pe%C3%A7as",
    image: "",
  },
  {
    name: "Kit 4 descansos de panela de bambu",
    slug: "descanso-panela-bambu",
    emoji: "🍲",
    query: "kit 4 descanso panela bambu",
    url: "https://www.amazon.com.br/s?k=kit+4+descanso+panela+bambu",
    image: "",
  },
  {
    name: "Saca-rolhas Brinox",
    slug: "saca-rolhas-brinox",
    emoji: "🍾",
    query: "saca rolhas brinox",
    url: "https://www.amazon.com.br/s?k=saca+rolhas+brinox",
    image: "",
  },
  {
    name: "Liquidificador Mondial Easy Power 550W",
    slug: "liquidificador-mondial",
    emoji: "🥤",
    query: "liquidificador mondial easy power 550w",
    url: "https://www.amazon.com.br/s?k=liquidificador+mondial+easy+power+550w",
    image: "",
  },
  {
    name: "Porta-temperos inox 12 potes",
    slug: "porta-temperos-inox",
    emoji: "🧂",
    query: "porta tempero inox 12 potes giratorio",
    url: "https://www.amazon.com.br/s?k=porta+tempero+inox+12+potes+giratorio",
    image: "",
  },
  {
    name: "Espelho para banheiro",
    slug: "espelho-banheiro",
    emoji: "🪞",
    query: "espelho banheiro oval",
    url: "https://www.amazon.com.br/s?k=espelho+banheiro+oval",
    image: "",
  },
  {
    name: "Porta-escova de dentes Dental Up",
    slug: "porta-escova-dental-up",
    emoji: "🪥",
    query: "porta escova dental up",
    url: "https://www.amazon.com.br/s?k=porta+escova+dental+up",
    image: "",
  },
  {
    name: "Porta-sabonete líquido de vidro 330ml",
    slug: "porta-sabonete-vidro",
    emoji: "🧼",
    query: "porta sabonete liquido vidro 330ml",
    url: "https://www.amazon.com.br/s?k=porta+sabonete+liquido+vidro+330ml",
    image: "",
  },
  {
    name: "Abajur Home Line Charlot 51cm",
    slug: "abajur-charlot",
    emoji: "💡",
    query: "abajur home line charlot 51cm",
    url: "https://www.mercadolivre.com.br/jm/search?as_word=abajur%20home%20line%20charlot%2051cm",
    image: "",
  },
  {
    name: "Kit de almofadas decorativas",
    slug: "kit-almofadas",
    emoji: "🛋️",
    query: "kit almofadas decorativas",
    url: "https://www.amazon.com.br/s?k=kit+almofadas+decorativas",
    image: "",
  },
  {
    name: "Jogo de cama Teka Crystal 4 peças 100% algodão",
    slug: "jogo-cama-teka-crystal",
    emoji: "🛏️",
    query: "jogo cama teka crystal 4 peças",
    url: "https://www.amazon.com.br/s?k=jogo+cama+teka+crystal+4+pe%C3%A7as",
    image: "",
  },
  {
    name: "Tapete passadeira antiderrapante para cozinha 1,30m",
    slug: "tapete-passadeira-cozinha",
    emoji: "🧺",
    query: "passadeira antiderrapante cozinha 1,30m",
    url: "https://www.amazon.com.br/s?k=passadeira+antiderrapante+cozinha+1%2C30m",
    image: "",
  },
  {
    name: "Secador Mondial Travel Golden Rose",
    slug: "secador-mondial-travel",
    emoji: "💇",
    query: "secador mondial travel golden rose",
    url: "https://www.amazon.com.br/s?k=secador+mondial+travel+golden+rose",
    image: "",
  },
];

// Só os nomes — usado no fallback da API quando o Supabase não está configurado.
export const GIFT_NAMES = PRODUCTS.map((p) => p.name);

// Procura os metadados de um produto pelo nome (vindo do banco de dados).
export function findProduct(name) {
  return PRODUCTS.find((p) => p.name === name) || null;
}

// Detecta a qual marketplace uma URL pertence.
function detectMarketplace(url) {
  if (!url) return null;
  if (url.includes("mercadoliv")) return "ml";
  if (url.includes("amazon")) return "amazon";
  if (url.includes("magazineluiza") || url.includes("magalu")) return "magalu";
  if (url.includes("shopee")) return "shopee";
  return null;
}

// Monta os links de compra de um produto: o link escolhido (product.url)
// vira o primeiro botão; os demais marketplaces são buscas pelo nome.
export function marketplaceLinks(product) {
  const q = encodeURIComponent(product.query);
  const mlSlug = encodeURIComponent(product.query).replace(/%20/g, "-");

  const defaults = {
    ml: `https://lista.mercadolivre.com.br/${mlSlug}`,
    amazon: `https://www.amazon.com.br/s?k=${q}`,
    magalu: `https://www.magazineluiza.com.br/busca/${q}/`,
    shopee: `https://shopee.com.br/search?keyword=${q}`,
  };

  const labels = {
    ml: "Mercado Livre",
    amazon: "Amazon",
    magalu: "Magalu",
    shopee: "Shopee",
  };

  // Se o produto tem um link preferido, usamos ele no marketplace certo.
  const preferred = detectMarketplace(product.url);
  const links = { ...defaults };
  if (preferred && product.url) links[preferred] = product.url;

  // Ordena colocando o marketplace preferido primeiro.
  const order = ["ml", "amazon", "magalu", "shopee"];
  if (preferred) {
    order.splice(order.indexOf(preferred), 1);
    order.unshift(preferred);
  }

  return order.map((key) => ({ key, label: labels[key], url: links[key] }));
}
