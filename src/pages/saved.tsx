import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function Saved() {
  const [saved, setSaved] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSaved()
  }, [])

  async function fetchSaved() {
    setLoading(true)
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    const res = await fetch('/api/saved-properties', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setSaved(data.saved || [])
    setLoading(false)
  }

  if (loading) return <div className="p-4">Loading saved properties…</div>
  if (!saved.length) return <div className="p-4">No saved properties yet.</div>

  return (
    <div className="p-4 container">
      <h1 className="text-2xl font-semibold mb-4">Saved properties</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {saved.map((s) => (
          <li key={s.id} className="border rounded p-3">
            <Link href={`/properties/${s.properties.id}`}>
              <a>
                <h2 className="font-semibold">{s.properties.title}</h2>
                <div className="text-sm text-gray-600">{s.properties.city} — ₦{Number(s.properties.annual_rent).toLocaleString()}</div>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
