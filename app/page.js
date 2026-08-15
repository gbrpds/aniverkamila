"use client";

import { useEffect, useState, useCallback } from "react";
import { EVENT } from "../lib/config";
import { findProduct, marketplaceLinks } from "../lib/products";

/* Sticker PNG posicionado de forma absoluta como decoração */
function Sticker({ src, alt = "", w, rot = 0, float = false, slow = false, className = "", style = {} }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/${src}`}
      alt={alt}
      aria-hidden={alt === "" ? "true" : undefined}
      className={`sticker${float ? " float" : ""}${slow ? " slow" : ""}${className ? " " + className : ""}`}
      style={{ width: w, "--rot": `${rot}deg`, ...style }}
    />
  );
}

export default function Home() {
  const [gifts, setGifts] = useState(null);
  const [configured, setConfigured] = useState(true);

  const loadGifts = useCallback(async () => {
    try {
      const res = await fetch("/api/gifts", { cache: "no-store" });
      const data = await res.json();
      setGifts(data.gifts || []);
      setConfigured(data.configured !== false);
    } catch {
      setGifts([]);
    }
  }, []);

  useEffect(() => {
    loadGifts();
  }, [loadGifts]);

  return (
    <main className="page">
      <Hero />
      <EventInfo />
      <ComemorarSection />
      <GiftSection gifts={gifts} configured={configured} onReload={loadGifts} />
      <RsvpSection />
      <Footer />
    </main>
  );
}

/* ---------------- SLIDE 1: Capa ---------------- */
function Hero() {
  return (
    <section className="card hero">
      <Sticker src="sparkles.png" w={58} rot={-8} float slow style={{ top: 10, left: 10 }} />
      <Sticker src="estrela-prata.png" w={46} rot={12} float style={{ top: 12, right: 12 }} />

      <div className="hero-inner">
        <div className="hero-text">
          <span className="disco">🪩</span>
          <div className="kicker">✩ Anos 2000 ✩</div>
          <div className="title-top">Aniversário</div>
          <div className="big-number">{EVENT.idade}</div>
          <div className="title-top" style={{ fontSize: "20px" }}>
            anos
          </div>
          <span className="amp">&amp;</span>
          <div className="title-bottom">Chá de Panela</div>
          <div className="names">💗 {EVENT.aniversariante} 💗</div>
          <div className="hero-cta">
            <a href="#confirmar" className="btn btn-primary">
              Confirmar presença ✨
            </a>
          </div>
        </div>

        <div className="hero-photo-free">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="girl-free" src="/images/garota.png" alt={`${EVENT.aniversariante} sorrindo com chapéu de festa`} />
          <Sticker src="flip-phone.png" w={70} rot={-12} float style={{ top: -6, right: -8 }} />
          <Sticker src="camera.png" w={78} rot={10} float slow style={{ bottom: 0, left: -20 }} />
        </div>
      </div>
    </section>
  );
}

/* ---------------- SLIDE 2: Info do evento ---------------- */
function EventInfo() {
  const dias = [
    { d: "20", m: "ago" },
    { d: "21", m: "ago" },
    { d: "22", m: "ago", on: true },
    { d: "23", m: "ago" },
    { d: "24", m: "ago" },
  ];
  return (
    <section className="card">
      <Sticker src="baby.png" w={60} rot={8} float style={{ top: 4, right: 6 }} />
      <h2 className="section-title">É meu aniversárioooo</h2>
      <p className="section-sub">Marca aí no calendário! 📌</p>

      <div className="calendar">
        {dias.map((x) => (
          <div key={x.d} className={`cal-day${x.on ? " on" : ""}`}>
            <div className="m">{x.m}</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{x.d}</div>
          </div>
        ))}
      </div>

      <div className="info-grid">
        <div className="info-item">
          <div className="ico">🗓️</div>
          <div className="label">Data</div>
          <div className="value">{EVENT.data}</div>
        </div>
        <div className="info-item">
          <div className="ico">🕖</div>
          <div className="label">Horário</div>
          <div className="value">{EVENT.horario}</div>
        </div>
        <div className="info-item full">
          <div className="ico">📍</div>
          <div className="label">Local</div>
          <div className="value">{EVENT.local}</div>
          <div style={{ opacity: 0.85 }}>{EVENT.endereco}</div>
          {EVENT.mapsUrl ? (
            <div style={{ marginTop: 12 }}>
              <a href={EVENT.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                🗺️ Ver no mapa
              </a>
            </div>
          ) : null}
        </div>
      </div>

      <Sticker
        src="justin.png"
        w={118}
        rot={-6}
        float
        slow
        className="justin-sticker"
        style={{ bottom: 6, left: 6 }}
      />
    </section>
  );
}

/* ---------------- SLIDE 3: Vem comemorar ---------------- */
function ComemorarSection() {
  return (
    <section className="card">
      <Sticker src="boca.png" w={66} rot={-10} float style={{ top: 10, right: 10 }} />
      <Sticker src="estrela-rosa.png" w={44} rot={8} float slow style={{ top: 18, left: 12 }} />
      <h2 className="section-title">Vem comemorar comigo!</h2>
      <div className="ribbon">{EVENT.observacoes}</div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="nokia-feature" src="/images/nokia.png" alt={EVENT.cardapio} />
      <p className="section-sub" style={{ marginTop: 14, marginBottom: 0 }}>
        {EVENT.cardapio}
      </p>
    </section>
  );
}

/* ---------------- SLIDE 4: Presentes (cards de produto) ---------------- */
function GiftSection({ gifts, configured, onReload }) {
  const [modal, setModal] = useState(null); // { gift }
  const total = gifts ? gifts.length : 0;
  const taken = gifts ? gifts.filter((g) => g.claimed).length : 0;

  return (
    <section className="card" id="presentes">
      <Sticker src="sparkles.png" w={58} rot={12} float style={{ top: 12, right: 10 }} />
      <h2 className="section-title">Lista de presentes</h2>
      <p className="gift-highlight">
        🛍️ Clique em um site pra <strong>comprar</strong> e marque o que você vai
        dar — <strong>assim ninguém repete</strong> 💕
      </p>

      {!configured && (
        <div className="alert warn" style={{ marginBottom: 16 }}>
          ⚙️ A reserva ainda não está ligada (falta configurar o Supabase). Os
          links de compra já funcionam normalmente. 🛍️
        </div>
      )}

      {gifts && configured && (
        <p className="gift-count">
          🎁 {taken} de {total} presentes já reservados
        </p>
      )}

      <div className="prod-grid">
        {gifts === null
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="prod-card skeleton-card" />
            ))
          : gifts.map((g) => (
              <ProductCard
                key={g.id}
                gift={g}
                configured={configured}
                onReserve={() => setModal({ gift: g })}
              />
            ))}
      </div>

      <div className="pix-box">
        <Sticker src="baby.png" w={64} rot={-10} style={{ top: -22, left: 10 }} />
        <div style={{ fontWeight: 600 }}>Prefere ajudar com um Pix? 💸</div>
        <div style={{ fontSize: 14, opacity: 0.85 }}>
          Você também pode fazer um Pix de qualquer valor
        </div>
        <div className="pix-key">{EVENT.chavePix}</div>
        <CopyPix />
      </div>

      {modal && (
        <ClaimModal
          gift={modal.gift}
          onClose={() => setModal(null)}
          onDone={() => {
            setModal(null);
            onReload();
          }}
          onReload={onReload}
        />
      )}
    </section>
  );
}

function ProductCard({ gift, configured, onReserve }) {
  const p = findProduct(gift.name) || {
    name: gift.name,
    slug: "",
    emoji: "🎁",
    query: gift.name,
  };
  const links = marketplaceLinks(p);

  return (
    <div className={`prod-card${gift.claimed ? " reserved" : ""}`}>
      <ProductImage product={p} />
      <div className="prod-body">
        <div className="prod-name">{gift.name}</div>

        <div className="prod-buy">
          <span className="prod-buy-label">Comprar em:</span>
          <div className="prod-links">
            {links.map((l) => (
              <a
                key={l.key}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`mkt mkt-${l.key}`}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {gift.claimed ? (
          <div className="prod-reserved">✅ Já reservado 💝</div>
        ) : (
          <button
            className="btn btn-primary btn-block prod-pick"
            onClick={onReserve}
            disabled={!configured}
            title={configured ? "" : "Reserva indisponível até configurar o banco"}
          >
            🎁 Vou dar esse!
          </button>
        )}
      </div>
    </div>
  );
}

function ProductImage({ product }) {
  const [err, setErr] = useState(false);
  const src = product.image || (product.slug ? `/images/produtos/${product.slug}.jpg` : null);
  if (err || !src) {
    return (
      <div className="prod-img prod-img-emoji" aria-hidden="true">
        <span>{product.emoji}</span>
      </div>
    );
  }
  return (
    <div className="prod-img">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={product.name} onError={() => setErr(true)} loading="lazy" />
    </div>
  );
}

function ClaimModal({ gift, onClose, onDone, onReload }) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState({ state: "idle" });

  async function confirm() {
    if (!name.trim()) {
      setStatus({ state: "error", msg: "Digite seu nome. 💗" });
      return;
    }
    setStatus({ state: "loading" });
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giftId: gift.id, name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "GIFT_TAKEN") {
          setStatus({ state: "error", msg: data.message });
          onReload();
          return;
        }
        setStatus({ state: "error", msg: data.error || "Não foi possível reservar." });
        return;
      }
      setStatus({ state: "ok" });
      setTimeout(onDone, 1100);
    } catch {
      setStatus({ state: "error", msg: "Erro de conexão. Tente novamente." });
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {status.state === "ok" ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48 }}>💝</div>
            <h3 className="modal-title">Presente reservado!</h3>
            <p>
              Obrigada! Você vai dar <strong>{gift.name}</strong> 🎁
            </p>
          </div>
        ) : (
          <>
            <button className="modal-x" onClick={onClose} aria-label="Fechar">
              ✕
            </button>
            <h3 className="modal-title">Reservar presente</h3>
            <p className="modal-gift">🎁 {gift.name}</p>
            <div className="field">
              <label>Seu nome</label>
              <input
                type="text"
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                placeholder="Pra Kamila saber quem vai dar"
                maxLength={80}
                onKeyDown={(e) => e.key === "Enter" && confirm()}
              />
            </div>
            {status.state === "error" && <div className="alert err">{status.msg}</div>}
            <button
              className="btn btn-primary btn-block"
              onClick={confirm}
              disabled={status.state === "loading"}
            >
              {status.state === "loading" ? "Reservando..." : "Confirmar reserva 💗"}
            </button>
            <p className="modal-note">
              Não esqueça de comprar o presente pelos botões do card. 💕
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function CopyPix() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="btn btn-ghost"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(EVENT.chavePix);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? "✅ Copiado!" : "📋 Copiar chave Pix"}
    </button>
  );
}

/* ---------------- SLIDE 5: Confirmar presença ---------------- */
function RsvpSection() {
  const [attending, setAttending] = useState(true);
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ state: "idle" });
  const [configured, setConfigured] = useState(true);

  const whatsappHref = () => {
    const parts = [
      `Oi ${EVENT.aniversariante}! Confirmando minha presença no seu aniversário 🎉`,
      `Nome: ${name || "(preencha)"}`,
      attending ? `Vou sim! Nº de pessoas: ${guests}` : "Infelizmente não poderei ir 😢",
    ];
    if (message) parts.push(`Recado: ${message}`);
    return `https://wa.me/${EVENT.whatsapp}?text=${encodeURIComponent(parts.join("\n"))}`;
  };

  async function submit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setStatus({ state: "error", msg: "Por favor, preencha seu nome. 💗" });
      return;
    }
    setStatus({ state: "loading" });
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          attending,
          guests,
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 503) setConfigured(false);
        setStatus({
          state: "error",
          msg: data.error || "Não foi possível confirmar. Use o WhatsApp abaixo.",
        });
        return;
      }
      setStatus({ state: "ok" });
    } catch {
      setStatus({ state: "error", msg: "Erro de conexão. Tente pelo WhatsApp." });
    }
  }

  if (status.state === "ok") {
    return (
      <section className="card" id="confirmar">
        <Sticker src="sparkles.png" w={60} rot={-10} float style={{ top: 12, left: 12 }} />
        <Sticker src="estrela-rosa.png" w={46} rot={10} float slow style={{ top: 16, right: 14 }} />
        <div className="success">
          <div className="emoji">🎉💗🪩</div>
          <h2 className="section-title" style={{ fontSize: 34 }}>
            {attending ? "Presença confirmada!" : "Que pena!"}
          </h2>
          <p className="section-sub">
            {attending
              ? `Obrigada, ${name.split(" ")[0]}! Sua presença torna tudo ainda mais especial. ✨`
              : "Vamos sentir sua falta! Obrigada por avisar. 💗"}
          </p>
          <div style={{ marginTop: 8 }}>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
              💬 Avisar no WhatsApp também
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="card" id="confirmar">
      <Sticker src="flip-phone.png" w={70} rot={12} float style={{ top: -10, right: 6 }} />
      <h2 className="section-title">Confirme sua presença!</h2>
      <p className="section-sub">
        Por favor, confirme até <strong>{EVENT.confirmarAte}</strong> 💌
      </p>

      {!configured && (
        <div className="alert warn" style={{ marginBottom: 16 }}>
          ⚙️ O envio automático ainda não está ligado. Você pode confirmar pelo
          botão do WhatsApp abaixo. 👇
        </div>
      )}

      <form className="form" onSubmit={submit}>
        <div className="toggle-row">
          <div className={`toggle${attending ? " active" : ""}`} onClick={() => setAttending(true)}>
            ✅ Eu vou!
          </div>
          <div className={`toggle no${!attending ? " active" : ""}`} onClick={() => setAttending(false)}>
            😢 Não vou
          </div>
        </div>

        <div className="field">
          <label>Seu nome *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Como você quer aparecer na lista"
            maxLength={80}
          />
        </div>

        {attending && (
          <div className="field">
            <label>Quantas pessoas no total (incluindo você)?</label>
            <input
              type="number"
              min={1}
              max={20}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            />
          </div>
        )}

        <div className="field">
          <label>Deixe um recado (opcional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Um recadinho carinhoso..."
            maxLength={500}
          />
        </div>

        {status.state === "error" && <div className="alert err">{status.msg}</div>}

        <button type="submit" className="btn btn-primary btn-block" disabled={status.state === "loading"}>
          {status.state === "loading"
            ? "Enviando..."
            : attending
            ? "Confirmar presença 💗"
            : "Enviar resposta"}
        </button>

        <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-block">
          💬 Ou fale comigo no WhatsApp
        </a>
      </form>
    </section>
  );
}

function Footer() {
  return (
    <div className="footer">
      <div className="hearts">💗 🪩 ⭐ 🦋 💗</div>
      <div>
        Fale comigo:{" "}
        <a
          href={`https://wa.me/${EVENT.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--pink-hot)", fontWeight: 600 }}
        >
          {EVENT.whatsappExibicao}
        </a>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
        Feito com carinho • Tema anos 2000 ✨
      </div>
    </div>
  );
}
