import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

// POST /api/claim -> reserva um presente direto pelo card
// body: { giftId, name }
export async function POST(request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "A reserva ainda não está ligada. Configure o Supabase (veja o README).",
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

  const name = (body.name || "").trim().slice(0, 80);
  const giftId = Number(body.giftId);

  if (!name) {
    return NextResponse.json(
      { error: "Por favor, informe seu nome." },
      { status: 400 }
    );
  }
  if (!giftId || giftId < 0) {
    return NextResponse.json({ error: "Presente inválido." }, { status: 400 });
  }

  // Reserva atômica: só marca se ainda estiver disponível.
  const { data: claimed, error } = await supabase
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

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!claimed) {
    return NextResponse.json(
      {
        error: "GIFT_TAKEN",
        message:
          "Ops! Esse presente acabou de ser escolhido por outra pessoa. 💕",
      },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true, name: claimed.name });
}
