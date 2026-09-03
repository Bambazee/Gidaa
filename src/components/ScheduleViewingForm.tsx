import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ScheduleViewingForm({ propertyId, onClose, onSuccess }: { propertyId: string; onClose: () => void; onSuccess?: () => void }) {
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!preferredDate || !preferredTime) return setError('Please pick date and time')
    setLoading(true)
    try {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token
      if (!token) throw new Error('You must be signed in to schedule a viewing')

      const res = await fetch('/api/viewing-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ property_id: propertyId, preferred_date: preferredDate, preferred_time: preferredTime, message }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to request viewing')
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
      <h3 className="font-semibold mb-2">Schedule a viewing</h3>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <label className="block mb-2">Preferred date</label>
      <input type="date" className="w-full p-2 border mb-3" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} />

      <label className="block mb-2">Preferred time</label>
      <input type="time" className="w-full p-2 border mb-3" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} />

      <label className="block mb-2">Message (optional)</label>
      <textarea className="w-full p-2 border mb-3" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />

      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="px-3 py-2 border rounded">Cancel</button>
        <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Sending…' : 'Request viewing'}</button>
      </div>
    </form>
  )
}
