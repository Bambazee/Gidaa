import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export default function AdminVerificationPage() {
  const [props, setProps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState('')

  useEffect(() => { fetchPending() }, [])

  async function fetchPending() {
    setLoading(true)
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    const res = await fetch('/api/admin/properties', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setProps(data.properties || [])
    setLoading(false)
  }

  async function takeAction(id: string, status: 'verified' | 'rejected') {
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    const res = await fetch(`/api/properties/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ verification_status: status, admin_note: note }) })
    if (!res.ok) alert('Action failed')
    else fetchPending()
  }

  if (loading) return <div className="p-4">Loading pending properties…</div>

  return (
    <div className="p-4 container">
      <h1 className="text-2xl font-semibold mb-4">Property verification</h1>
      {props.length === 0 ? (
        <div>No pending properties.</div>
      ) : (
        <ul>
          {props.map((p) => (
            <li key={p.id} className="border rounded p-3 mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/properties/${p.id}`}><a className="font-semibold text-blue-600">{p.title}</a></Link>
                  <div className="text-sm text-gray-600">{p.city} • {p.area}</div>
                </div>
                <div className="w-64">
                  <textarea placeholder="Admin note (optional)" className="w-full border p-2 mb-2" value={note} onChange={(e) => setNote(e.target.value)} />
                  <div className="flex gap-2">
                    <button onClick={() => takeAction(p.id, 'verified')} className="px-3 py-2 bg-green-600 text-white rounded">Approve</button>
                    <button onClick={() => takeAction(p.id, 'rejected')} className="px-3 py-2 bg-red-600 text-white rounded">Reject</button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
