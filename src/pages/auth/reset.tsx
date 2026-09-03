import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/auth/login' })
      if (error) throw error
      setStatus('Check your email for a password reset link.')
    } catch (err: any) {
      setStatus(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md border rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Reset password</h2>
        <label className="block mb-2">Email</label>
        <input className="w-full p-2 border mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        {status && <div className="mb-3 text-sm text-gray-700">{status}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</button>
      </form>
    </div>
  )
}
