"use client";

import { useEffect, useState, useCallback } from "react";
import { EVENT } from "../lib/config";

/* Sticker PNG posicionado de forma absoluta como decoração */
function Sticker({ src, alt = "", w, rot = 0, float = false, slow = false, style = {} }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/${src}`}
      alt={alt}
      aria-hidden={alt === "" ? "true" : undefined}
      className={`sticker${float ? " float" : ""}${slow ? " slow" : ""}`}
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
      <GiftSection gifts={gifts} configured={configured} />
      <RsvpSection gifts={gifts} configured={configured} onReload={loadGifts} />
      <Footer />
    </main>
  );
}

/* ---------------- SLIDE 1: Capa ---------------- */
function Hero() {
  return (
    <section className="card hero">
      <Sticker src="sparkles.png" w={70} rot={-8} float slow style={{ top: 10, left: 10 }} />
      <Sticker src="estrela-prata.png" w={54} rot={12} float style={{ top: 16, right: 14 }} />
      <span className="disco">🪩</span>
      <div className="kicker">✩ Anos 2000 ✩</div>
      <div className="title-top">Aniversário</div>
      <div className="big-number">{EVENT.idade}</div>
      <div className="title-top" style={{ fontSize: "22px" }}>
        anos
      </div>
      <span className="amp">&amp;</span>
      <div className="title-bottom">Chá de Panela</div>

      <div className="hero-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="girl" src="/images/garota.png" alt={`${EVENT.aniversariante} sorrindo com chapéu de festa`} />
        <Sticker src="flip-phone.png" w={92} rot={-12} float style={{ top: -18, right: -22 }} />
        <Sticker src="camera.png" w={104} rot={10} float slow style={{ bottom: -14, left: -26 }} />
        <Sticker src="estrela-rosa.png" w={48} rot={-6} style={{ top: 4, left: -18 }} />
      </div>

      <div className="names">💗 {EVENT.aniversariante} 💗</div>
      <div style={{ marginTop: 18 }}>
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
      <Sticker src="baby.png" w={74} rot={8} float style={{ top: 6, right: 8 }} />
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
              <a
                href={EVENT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                🗺️ Ver no mapa
              </a>
            </div>
          ) : null}
        </div>
      </div>

      <Sticker src="justin.png" w={74} rot={-6} float slow style={{ bottom: 8, left: 8 }} />
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

      {/* Nokia com o recado do cardápio (imagem do Canva) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="nokia-feature" src="/images/nokia.png" alt={EVENT.cardapio} />
      <p className="section-sub" style={{ marginTop: 14, marginBottom: 0 }}>
        {EVENT.cardapio}
      </p>
    </section>
  );
}

/* ---------------- SLIDE 4: Presentes ---------------- */
function GiftSection({ gifts, configured }) {
  return (
    <section className="card" id="presentes">
      <Sticker src="sparkles.png" w={58} rot={12} float style={{ top: 12, right: 10 }} />
      <h2 className="section-title">Itens para presente</h2>
      <p className="section-sub">
        Sugestões pro chá de panela — escolha 1 na hora de confirmar 💕
      </p>

      {!configured && (
        <div className="alert warn" style={{ marginBottom: 16 }}>
          ⚙️ Lista ainda não conectada ao banco de dados. Os itens abaixo são
          apenas as sugestões do convite.
        </div>
      )}

      <div className="gift-legend">
        <span>
          <i className="dot free" /> Disponível
        </span>
        <span>
          <i className="dot taken" /> Já escolhido
        </span>
      </div>

      <GiftList gifts={gifts} />

      <div className="pix-box">
        <Sticker src="baby.png" w={64} rot={-10} style={{ top: -22, left: 10 }} />
        <div style={{ fontWeight: 600 }}>Prefere ajudar com um Pix? 💸</div>
        <div style={{ fontSize: 14, opacity: 0.85 }}>
          Você também pode fazer um Pix de qualquer valor
        </div>
        <div className="pix-key">{EVENT.chavePix}</div>
        <CopyPix />
      </div>
    </section>
  );
}

function GiftList({ gifts }) {
  if (gifts === null) {
    return (
      <ul className="gift-list">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="skeleton" />
        ))}
      </ul>
    );
  }
  return (
    <ul className="gift-list">
      {gifts.map((g) => (
        <li key={g.id} className={`gift-row${g.claimed ? " taken" : ""}`}>
          <span className="heart">{g.claimed ? "🩶" : "💗"}</span>
          <span className="name">{g.name}</span>
          <span className="badge">{g.claimed ? "Reservado" : "Livre"}</span>
        </li>
      ))}
    </ul>
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
function RsvpSection({ gifts, configured, onReload }) {
  const [attending, setAttending] = useState(true);
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [giftId, setGiftId] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ state: "idle" });
  const [doneGift, setDoneGift] = useState(null);

  const available = (gifts || []).filter((g) => !g.claimed);

  const whatsappHref = () => {
    const parts = [
      `Oi ${EVENT.aniversariante}! Confirmando minha presença no seu aniversário 🎉`,
      `Nome: ${name || "(preencha)"}`,
      attending
        ? `Vou sim! Nº de pessoas: ${guests}`
        : "Infelizmente não poderei ir 😢",
    ];
    if (attending && giftId) {
      const g = available.find((x) => String(x.id) === String(giftId));
      if (g) parts.push(`Presente: ${g.name}`);
    }
    if (message) parts.push(`Recado: ${message}`);
    return `https://wa.me/${EVENT.whatsapp}?text=${encodeURIComponent(
      parts.join("\n")
    )}`;
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
          giftId: attending && giftId ? Number(giftId) : null,
          isPix: false,
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "GIFT_TAKEN") {
          setStatus({ state: "error", msg: data.message });
          setGiftId("");
          onReload();
          return;
        }
        setStatus({
          state: "error",
          msg: data.error || "Não foi possível confirmar. Tente novamente.",
        });
        return;
      }
      setDoneGift(data.giftName || null);
      setStatus({ state: "ok" });
      onReload();
    } catch {
      setStatus({
        state: "error",
        msg: "Erro de conexão. Tente novamente ou fale pelo WhatsApp.",
      });
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
          {doneGift && (
            <div className="note-box" style={{ maxWidth: 380, margin: "0 auto" }}>
              🎁 Presente reservado: <strong>{doneGift}</strong>
            </div>
          )}
          <div style={{ marginTop: 20 }}>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa"
            >
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
          <div
            className={`toggle${attending ? " active" : ""}`}
            onClick={() => setAttending(true)}
          >
            ✅ Eu vou!
          </div>
          <div
            className={`toggle no${!attending ? " active" : ""}`}
            onClick={() => setAttending(false)}
          >
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
          <>
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

            <div className="field">
              <label>Presente que você vai levar (opcional)</label>
              <select value={giftId} onChange={(e) => setGiftId(e.target.value)}>
                <option value="">— Escolher depois / vou de Pix —</option>
                {available.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <div className="help">
                Só aparecem os itens que ainda estão disponíveis 💕
              </div>
            </div>
          </>
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

        {status.state === "error" && (
          <div className="alert err">{status.msg}</div>
        )}

        {configured && (
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={status.state === "loading"}
          >
            {status.state === "loading"
              ? "Enviando..."
              : attending
              ? "Confirmar presença 💗"
              : "Enviar resposta"}
          </button>
        )}

        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-wa btn-block"
        >
          💬 {configured ? "Ou fale comigo no WhatsApp" : "Confirmar pelo WhatsApp"}
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
