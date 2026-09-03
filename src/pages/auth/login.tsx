import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error: signError } = await supabase.auth.signInWithPassword({ email, password })
      if (signError) throw signError
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md border rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Sign in</h2>
        <label className="block mb-2">Email</label>
        <input className="w-full p-2 border mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="block mb-2">Password</label>
        <input type="password" className="w-full p-2 border mb-3" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <div className="text-red-600 mb-2">{error}</div>}

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
