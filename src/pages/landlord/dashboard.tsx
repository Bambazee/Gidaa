import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export default function LandlordDashboard() {
  const [properties, setProperties] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token

    const [propsRes, reqRes] = await Promise.all([
      fetch('/api/landlord/properties', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch('/api/landlord/viewing-requests', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])

    setProperties(propsRes.properties || [])
    setRequests(reqRes.requests || [])
    setLoading(false)
  }

  async function updateProperty(id: string, updates: Record<string, any>) {
    setActionLoading(true)
    try {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token
      const res = await fetch(`/api/properties/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(updates) })
      if (!res.ok) throw new Error('Update failed')
      await fetchData()
    } catch (err) {
      console.error(err)
      alert('Action failed')
    } finally {
      setActionLoading(false)
    }
  }

  function confirmAction(fn: () => void) {
    // small confirmation prompt to avoid accidental clicks
    if (confirm('Are you sure?')) fn()
  }

  if (loading) return <div className="p-4">Loading dashboard…</div>

  return (
    <div className="p-4 container">
      <h1 className="text-2xl font-semibold mb-4">Landlord Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="border rounded p-4">
          <h2 className="font-semibold mb-2">My properties ({properties.length})</h2>
          <Link href="/properties/add"><a className="inline-block mb-3 text-sm text-blue-600">+ Add Property</a></Link>
            {properties.length === 0 ? (
            <div>No properties yet.</div>
          ) : (
            <ul>
              {properties.map((p) => (
                <li key={p.id} className="py-2 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{p.title}</div>
                      <div className="text-sm text-gray-600">{p.city} • {p.status} • {p.verification_status}</div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/properties/${p.id}`}><a className="text-sm text-blue-600">View</a></Link>
                      <Link href={`/properties/edit/${p.id}`}><a className="text-sm text-gray-600">Edit</a></Link>
                      {p.status !== 'published' && (
                        <button disabled={actionLoading} onClick={() => confirmAction(() => updateProperty(p.id, { status: 'published' }))} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Publish</button>
                      )}
                      {p.status === 'published' && (
                        <button disabled={actionLoading} onClick={() => confirmAction(() => updateProperty(p.id, { status: 'draft' }))} className="px-3 py-1 bg-yellow-400 text-black rounded text-sm">Unpublish</button>
                      )}
                      <button disabled={actionLoading} onClick={() => confirmAction(() => updateProperty(p.id, { verification_status: 'pending' }))} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Submit for verification</button>
                      <button disabled={actionLoading} onClick={() => confirmAction(() => updateProperty(p.id, { status: 'archived' }))} className="px-3 py-1 bg-gray-200 text-sm rounded">Archive</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border rounded p-4">
          <h2 className="font-semibold mb-2">Viewing requests ({requests.length})</h2>
          {requests.length === 0 ? (
            <div>No viewing requests yet.</div>
          ) : (
            <ul>
              {requests.map((r) => (
                <li key={r.id} className="py-2 border-b">
                  <div className="font-semibold">{r.preferred_date} {r.preferred_time}</div>
                  <div className="text-sm text-gray-600">{r.message}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
