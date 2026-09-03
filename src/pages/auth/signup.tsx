import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function Signup() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<'renter' | 'landlord'>('renter')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data, error: signError } = await supabase.auth.signUp({ email, password })
      if (signError) throw signError
      const user = data.user
      if (!user) throw new Error('No user returned from signup')

      const { error: profileError } = await supabase.from('profiles').upsert([
        {
          id: user.id,
          full_name: fullName,
          email,
          phone,
          role,
        },
      ])
      if (profileError) throw profileError

      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md border rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Create your account</h2>
        <label className="block mb-2">Full name</label>
        <input className="w-full p-2 border mb-3" value={fullName} onChange={(e) => setFullName(e.target.value)} />

        <label className="block mb-2">Email</label>
        <input className="w-full p-2 border mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="block mb-2">Password</label>
        <input type="password" className="w-full p-2 border mb-3" value={password} onChange={(e) => setPassword(e.target.value)} />

        <label className="block mb-2">Phone (Nigerian)</label>
        <input className="w-full p-2 border mb-3" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08123456789" />

        <label className="block mb-2">I want to</label>
        <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full p-2 border mb-4">
          <option value="renter">I want to Rent</option>
          <option value="landlord">I have a Property</option>
        </select>

        {error && <div className="text-red-600 mb-2">{error}</div>}

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={loading}>
          {loading ? 'Creating…' : 'Sign up'}
        </button>
      </form>
    </div>
  )
}
