'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const signOut = () => supabase.auth.signOut()

  const signInWithGoogle = (ref) => {
    const redirectTo = `${window.location.origin}/auth/callback${ref ? `?ref=${ref}` : ''}`
    return supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })
  }

  const signInWithEmail = (email, ref) =>
    supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback${ref ? `?ref=${ref}` : ''}` },
    })

  return { user, session, loading, signOut, signInWithGoogle, signInWithEmail }
}
