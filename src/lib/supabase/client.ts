import { createBrowserClient } from '@supabase/ssr'
import { useAuth } from '@clerk/nextjs'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Use this function in components to get an authenticated client
export function useSupabaseClient() {
  const { getToken } = useAuth()
  
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Set Supabase JWT if available from Clerk
  getToken({ template: "supabase" }).then(token => {
    if (token) {
      client.auth.setSession({
        access_token: token,
        refresh_token: '',
      })
    }
  })

  return client
}
