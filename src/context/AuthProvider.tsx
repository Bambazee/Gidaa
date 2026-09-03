import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Profile = any

type AuthContextType = {
  session: any | null
  user: any | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function init() {
      const { data: sessData } = await supabase.auth.getSession()
      const s = sessData.session || null
      if (!mounted) return
      setSession(s)
      setUser(s?.user || null)
      if (s?.user) await loadProfile(s.user.id)
      setLoading(false)
    }

    init()

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, _session) => {
      const current = await supabase.auth.getSession()
      const s = current.data.session || null
      setSession(s)
      setUser(s?.user || null)
      if (s?.user) await loadProfile(s.user.id)
      if (!s) setProfile(null)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  async function loadProfile(userId: string) {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (data) setProfile(data)
      else setProfile(null)
    } catch (err) {
      setProfile(null)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut }}>{children}</AuthContext.Provider>
  )
}
