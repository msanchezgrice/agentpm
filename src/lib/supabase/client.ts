import { createBrowserClient } from '@supabase/ssr'
import { useAuth } from '@clerk/nextjs'
import { useEffect, useMemo } from 'react'

// Simple non-authenticated client (for public routes)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Enhanced hook that properly handles async token fetching
export function useSupabaseClient() {
  const { getToken, userId } = useAuth()

  // Create client only once using useMemo
  const client = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), [])
  
  // Set JWT token whenever auth state changes
  useEffect(() => {
    // Only attempt to get token if user is signed in
    if (!userId) return
    
    // Async function to get and set the token
    const setSupabaseToken = async () => {
      try {
        // Get the session token directly (no template needed in newer Clerk versions)
        const token = await getToken()
        if (token) {
          await client.auth.setSession({
            access_token: token,
            refresh_token: '',
          })
          console.log('Successfully set Supabase auth token')
        }
      } catch (error) {
        console.error('Error setting Supabase token:', error)
      }
    }
    
    setSupabaseToken()
  }, [userId, getToken, client])
  
  return client
}
