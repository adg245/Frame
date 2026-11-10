import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

let adminClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return !!(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Admin client using the service-role key.
 * Server-only — this key must never reach the frontend or any log output.
 * Used to verify user JWTs sent from the client (auth.getUser) and, where
 * needed, for privileged operations that bypass Row Level Security.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  }
  if (!adminClient) {
    adminClient = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return adminClient;
}
