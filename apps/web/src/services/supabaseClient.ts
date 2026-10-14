import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://fbdujgzxywfzkbzxgzee.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_uRm1uMY8fYYeAnXk0STcNQ_u-AXvLkV';

let client: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!client && SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (err) {
      console.error('Gagal inisialisasi Supabase client:', err);
    }
  }
  return client;
};

export const supabase = getSupabase();
