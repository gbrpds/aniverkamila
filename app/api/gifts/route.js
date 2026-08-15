import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { GIFT_NAMES } from "../../../lib/products";

export const dynamic = "force-dynamic";

// GET /api/gifts -> lista de presentes com status de reservado
export async function GET() {
  const supabase = getSupabaseAdmin();

  // Sem Supabase configurado: devolve a lista estática (tudo disponível)
  // para o site ainda renderizar antes do setup.
  if (!supabase) {
    const fallback = GIFT_NAMES.map((name, i) => ({
      id: -(i + 1),
      name,
      claimed: false,
      claimed_by: null,
    }));
    return NextResponse.json({ configured: false, gifts: fallback });
  }

  const { data, error } = await supabase
    .from("gifts")
    .select("id, name, claimed, claimed_by")
    .order("position", { ascending: true });

  if (error) {
    return NextResponse.json(
      { configured: true, error: error.message, gifts: [] },
      { status: 500 }
    );
  }

  return NextResponse.json({ configured: true, gifts: data ?? [] });
}
