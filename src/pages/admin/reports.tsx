import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adminNote, setAdminNote] = useState('')

  useEffect(() => {
    fetchReports()
  }, [])

  async function fetchReports() {
    setLoading(true)
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    const res = await fetch('/api/admin/reports', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setReports(data.reports || [])
    setLoading(false)
  }

  async function markResolved(id: string) {
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    await fetch(`/api/admin/reports/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ resolved: true, admin_note: adminNote }) })
    fetchReports()
  }

  if (loading) return <div className="p-4">Loading reports…</div>

  return (
    <div className="p-4 container">
      <h1 className="text-2xl font-semibold mb-4">Reports</h1>
      {reports.length === 0 ? (
        <div>No reports found.</div>
      ) : (
        <ul>
          {reports.map((r) => (
            <li key={r.id} className="border rounded p-3 mb-3">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{r.reason} {r.resolved && <span className="text-sm text-green-600">(Resolved)</span>}</div>
                  <div className="text-sm text-gray-600">Reported by: {r.profiles?.full_name || r.reporter_id}</div>
                  <div className="text-sm">Property: {r.properties?.title}</div>
                  <div className="text-sm">Message: {r.message}</div>
                </div>
                <div className="flex flex-col gap-2">
                  {!r.resolved && (
                    <div>
                      <textarea className="w-full border p-2 mb-2" placeholder="Admin note (optional)" value={adminNote} onChange={(e) => setAdminNote(e.target.value)} />
                      <button onClick={() => markResolved(r.id)} className="px-3 py-2 bg-green-600 text-white rounded">Mark resolved</button>
                    </div>
                  )}
                  {r.admin_note && <div className="text-sm text-gray-700 mt-2"><strong>Admin note:</strong> {r.admin_note}</div>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
