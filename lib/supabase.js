import { createClient } from "@supabase/supabase-js";

// Cliente do Supabase para uso APENAS no servidor (API routes).
// Usa a service_role key, que ignora as políticas de RLS.
// Nunca importe este arquivo em componentes de cliente.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Retorna null quando as variáveis não estão configuradas,
// assim o site ainda funciona (em modo "somente leitura") antes do setup.
export function getSupabaseAdmin() {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const isSupabaseConfigured = Boolean(url && serviceKey);
