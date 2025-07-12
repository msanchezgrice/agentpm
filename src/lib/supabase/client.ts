import { createBrowserClient } from '@supabase/ssr'

// Simple client that can be used anywhere
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Simple hook that just returns a client - authentication handled separately
export function useSupabaseClient() {
  return createClient()
}
