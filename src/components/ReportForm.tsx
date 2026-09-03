import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const REASONS = [
  'Fake property',
  'Wrong information',
  "Property doesn't exist",
  'Fraud/scam',
  'Already rented',
  'Incorrect price',
  'Inappropriate content',
  'Other',
]

export default function ReportForm({ propertyId, onClose, onSuccess }: { propertyId: string; onClose: () => void; onSuccess?: () => void }) {
  const [reason, setReason] = useState(REASONS[0])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token
      if (!token) throw new Error('You must be signed in to report a listing')

      const res = await fetch('/api/reports', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ property_id: propertyId, reason, message }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit report')
      if (onSuccess) onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Report this listing</h3>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <label className="block mb-2">Reason</label>
      <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-2 border mb-3">
        {REASONS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      <label className="block mb-2">Message (optional)</label>
      <textarea className="w-full p-2 border mb-3" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />

      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="px-3 py-2 border rounded">Cancel</button>
        <button type="submit" className="px-3 py-2 bg-red-600 text-white rounded" disabled={loading}>{loading ? 'Reporting…' : 'Report listing'}</button>
      </div>
    </form>
  )
}
