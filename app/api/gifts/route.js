import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { GIFT_ITEMS } from "../../../lib/config";

export const dynamic = "force-dynamic";

// GET /api/gifts -> lista de presentes com status de reservado
export async function GET() {
  const supabase = getSupabaseAdmin();

  // Sem Supabase configurado: devolve a lista estática (tudo disponível)
  // para o site ainda renderizar antes do setup.
  if (!supabase) {
    const fallback = GIFT_ITEMS.map((name, i) => ({
      id: -(i + 1),
      name,
      claimed: false,
    }));
    return NextResponse.json({ configured: false, gifts: fallback });
  }

  const { data, error } = await supabase
    .from("gifts")
    .select("id, name, claimed")
    .order("position", { ascending: true });

  if (error) {
    return NextResponse.json(
      { configured: true, error: error.message, gifts: [] },
      { status: 500 }
    );
  }

  return NextResponse.json({ configured: true, gifts: data ?? [] });
}
