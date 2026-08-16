"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { EVENT } from "../lib/config";
import { findProduct, marketplaceOf } from "../lib/products";

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
      <Confetti />
      <MusicPlayer />
      <Hero />
      <EventInfo />
      <ComemorarSection />
      <GiftSection gifts={gifts} configured={configured} onReload={loadGifts} />
      <RsvpSection />
      <Footer />
    </main>
  );
}

/* ---------------- Confete de aniversário (na entrada) ---------------- */
function Confetti() {
  const ref = useRef(null);
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = ref.current;
    if (!canvas || reduce) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const colors = ["#8b2fd6", "#a95fe6", "#ff5fa2", "#ffd1ea", "#ffe14d", "#c9a3f0", "#ffffff"];
    // Dois "canhões" nas laterais de baixo, mirando pra cima/centro
    const parts = [];
    const spawn = (ox, oy, dir) => {
      for (let i = 0; i < 70; i++) {
        const angle = (-Math.PI / 2) + dir * (Math.random() * 0.7) - 0.35 * dir;
        const speed = 9 + Math.random() * 9;
        parts.push({
          x: ox,
          y: oy,
          vx: Math.cos(angle) * speed + dir * 2,
          vy: Math.sin(angle) * speed - Math.random() * 4,
          r: 5 + Math.random() * 7,
          c: colors[(Math.random() * colors.length) | 0],
          rot: Math.random() * Math.PI,
          vr: -0.25 + Math.random() * 0.5,
          shape: Math.random() < 0.5 ? "rect" : "circ",
        });
      }
    };
    spawn(w * 0.08, h + 10, 1);
    spawn(w * 0.92, h + 10, -1);
    spawn(w * 0.5, h + 10, 0);

    const start = performance.now();
    let raf;
    const frame = (t) => {
      const elapsed = t - start;
      ctx.clearRect(0, 0, w, h);
      parts.forEach((p) => {
        p.vy += 0.22; // gravidade
        p.vx *= 0.995;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        const fade = elapsed > 3500 ? Math.max(0, 1 - (elapsed - 3500) / 2000) : 1;
        ctx.globalAlpha = fade;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        if (p.shape === "rect") ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.55);
        else {
          ctx.beginPath();
          ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      ctx.globalAlpha = 1;
      if (elapsed < 5500) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="confetti-canvas" aria-hidden="true" />;
}

/* ---------------- Player de música (autoplay + volume) ---------------- */
function MusicPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [started, setStarted] = useState(false); // já começou alguma vez?

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;

    // 1) tenta tocar automaticamente ao entrar
    a.play()
      .then(() => setPlaying(true))
      .catch(() => {
        // 2) se o navegador bloquear, começa no primeiro toque/clique/tecla
        const onFirst = () => {
          const el = audioRef.current;
          if (el && el.paused) {
            el.play().then(() => setPlaying(true)).catch(() => {});
          }
          remove();
        };
        const evts = ["pointerdown", "touchstart", "keydown"];
        const remove = () => evts.forEach((e) => window.removeEventListener(e, onFirst));
        evts.forEach((e) => window.addEventListener(e, onFirst, { passive: true }));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
    } else {
      a.play().catch(() => {});
    }
  }
  function changeVol(e) {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }

  return (
    <div className={`music-player${!started ? " nudge" : ""}`}>
      <audio
        ref={audioRef}
        src="/music/tema.mp3"
        loop
        preload="auto"
        onPlay={() => {
          setPlaying(true);
          setStarted(true);
        }}
        onPause={() => setPlaying(false)}
      />
      <button
        className="mp-toggle"
        onClick={toggle}
        aria-label={playing ? "Pausar música" : "Tocar música"}
        title={playing ? "Pausar música" : "Tocar música"}
      >
        {playing ? (
          <span className="eq" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        ) : (
          <span aria-hidden="true">🎵</span>
        )}
      </button>
      <div className="mp-vol">
        <span aria-hidden="true">{volume === 0 ? "🔇" : "🔉"}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={changeVol}
          aria-label="Volume da música"
        />
      </div>
    </div>
  );
}

/* Título estilo revista / letras recortadas (ransom note) */
function Ransom({ text }) {
  const bg = ["#ffffff", "var(--pink-hot)", "var(--accent-pink)", "var(--pink)", "var(--ink)", "#ffe14d", "var(--purple)"];
  const fg = ["var(--pink-hot)", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "var(--ink)", "#ffffff"];
  const rot = [-6, 4, -3, 6, -5, 2, -2, 5, -4, 3];
  const fonts = [
    '"Bagel Fat One", cursive',
    'Georgia, serif',
    '"Fredoka", sans-serif',
    '"Courier New", monospace',
    '"Times New Roman", serif',
  ];
  return (
    <div className="ransom" aria-label={text}>
      {text.split("").map((ch, i) => {
        if (ch === " ") return <span key={i} style={{ background: "transparent", boxShadow: "none", width: 8 }} aria-hidden="true" />;
        const c = i % bg.length;
        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              background: bg[c],
              color: fg[c],
              fontFamily: fonts[i % fonts.length],
              transform: `rotate(${rot[i % rot.length]}deg)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
}

/* ---------------- SLIDE 1: Capa (colagem estilo convite) ---------------- */
function Hero() {
  return (
    <section className="card hero">
      {/* bandeirinhas + decorações do topo */}
      <div className="bunting" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <i key={i} />
        ))}
      </div>
      <Sticker src="estrela-prata.png" w={50} rot={-10} float slow style={{ top: 30, left: 8 }} />
      <Sticker src="sparkles.png" w={46} rot={8} float style={{ top: 64, left: 20 }} />
      <Sticker src="estrela-rosa.png" w={44} rot={12} float style={{ top: 34, right: 12 }} />

      <div className="kicker">✩ Anos 2000 ✩</div>

      <div className="hero-collage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="girl-bw" src="/images/garota.png" alt={`${EVENT.aniversariante} sorrindo com chapéu de festa`} />

        {/* stickers ao redor da foto */}
        <Sticker src="boca.png" w={52} rot={-12} style={{ top: "26%", right: "-4%" }} />
        <Sticker src="boca.png" w={40} rot={10} style={{ top: "48%", left: "-6%" }} />
        <Sticker src="estrela-rosa.png" w={40} rot={-8} float style={{ top: "6%", left: "-2%" }} />
        <Sticker src="sparkles.png" w={38} rot={6} float slow style={{ bottom: "18%", right: "-4%" }} />

        {/* número balão */}
        <div className="balloon-number">{EVENT.idade}</div>
      </div>

      <Ransom text="ANIVERSÁRIO" />
      <div className="hero-sub2">&amp; Chá de Panela 🍳</div>

      <div className="hero-datetime">
        {EVENT.data} <span>|</span> {EVENT.horario}
      </div>
      <div className="hero-loc">
        📍 {EVENT.local} · {EVENT.endereco}
      </div>
      <div className="hero-note">
        Sua presença torna tudo ainda mais especial! 💜
      </div>

      <div className="hero-cta">
        <a href="#confirmar" className="btn btn-primary">
          Confirmar presença ✨
        </a>
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
        🛍️ Clique em <strong>Comprar Agora</strong> pra ir direto ao produto e
        marque <strong>Vou dar esse!</strong> — assim{" "}
        <strong>ninguém repete</strong> 💕
      </p>
      <div className="delivery-note">
        📦 Você pode <strong>entregar o presente no dia da festa</strong> ou{" "}
        <strong>enviar para o endereço da Kamila</strong>:
        <br />
        <span className="delivery-address">
          Rua Família Gonçalves Carneiro, 441 — Apartamento 303, Bloco 17
        </span>
      </div>

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
    url: "",
  };
  const mkt = marketplaceOf(p.url);
  const hasStore = Boolean(p.url) && mkt.key !== "loja";

  return (
    <div className={`prod-card${gift.claimed ? " reserved" : ""}`}>
      <ProductImage product={p} />
      <div className="prod-body">
        <div className="prod-name">{gift.name}</div>

        {hasStore && (
          <div className="prod-buy">
            <span className="prod-buy-label">Produto de</span>
            <span className={`mkt-tag mkt-${mkt.key}`}>{mkt.label}</span>
          </div>
        )}

        <div className="prod-actions">
          {p.url ? (
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn prod-buy-btn"
            >
              🛒 Comprar Agora
            </a>
          ) : null}

          {gift.claimed ? (
            <div className="prod-reserved">✅ Já reservado 💝</div>
          ) : (
            <button
              className="btn btn-primary prod-pick"
              onClick={onReserve}
              disabled={!configured}
              title={configured ? "" : "Reserva indisponível até configurar o banco"}
            >
              🎁 Vou dar esse!
            </button>
          )}
        </div>
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
