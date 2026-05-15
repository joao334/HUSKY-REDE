import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config.js';

export const isSupabaseReady =
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('https://'));

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function authRequired() {
  if (!supabase) throw new Error('Configure SUPABASE_URL e SUPABASE_ANON_KEY em /js/config.js.');
  return supabase;
}

export function dbError(error, fallback = 'Nao foi possivel concluir a acao.') {
  if (!error) return fallback;
  return error.message || error.error_description || fallback;
}
