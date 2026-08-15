import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

// POST /api/rsvp -> registra confirmação de presença
// body: { name, attending, guests, giftId, isPix, message }
export async function POST(request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "O site ainda não foi conectado ao banco de dados. Configure o Supabase (veja o README).",
      },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const attending = body.attending !== false;
  const guests = Math.max(1, Math.min(20, parseInt(body.guests, 10) || 1));
  const message = (body.message || "").trim().slice(0, 500);
  const isPix = Boolean(body.isPix);
  const giftId =
    body.giftId != null && Number(body.giftId) > 0 ? Number(body.giftId) : null;

  if (!name) {
    return NextResponse.json(
      { error: "Por favor, informe seu nome." },
      { status: 400 }
    );
  }

  let giftName = null;

  // Se a pessoa vai e escolheu um presente da lista (não Pix),
  // tentamos "reservar" de forma atômica: o update só afeta a linha
  // se ela ainda estiver disponível (claimed = false).
  if (attending && giftId && !isPix) {
    const { data: claimed, error: claimErr } = await supabase
      .from("gifts")
      .update({
        claimed: true,
        claimed_by: name,
        claimed_at: new Date().toISOString(),
      })
      .eq("id", giftId)
      .eq("claimed", false)
      .select("id, name")
      .maybeSingle();

    if (claimErr) {
      return NextResponse.json({ error: claimErr.message }, { status: 500 });
    }

    if (!claimed) {
      // Alguém pegou esse presente primeiro.
      return NextResponse.json(
        {
          error: "GIFT_TAKEN",
          message:
            "Ops! Esse presente acabou de ser escolhido por outra pessoa. Escolha outro. 💕",
        },
        { status: 409 }
      );
    }

    giftName = claimed.name;
  }

  const { error: insertErr } = await supabase.from("rsvps").insert({
    name,
    attending,
    guests: attending ? guests : 1,
    gift_id: giftName ? giftId : null,
    gift_name: isPix ? "Pix" : giftName,
    is_pix: isPix,
    message: message || null,
  });

  if (insertErr) {
    // Rollback da reserva do presente se a confirmação falhou.
    if (giftName) {
      await supabase
        .from("gifts")
        .update({ claimed: false, claimed_by: null, claimed_at: null })
        .eq("id", giftId);
    }
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, giftName });
}
