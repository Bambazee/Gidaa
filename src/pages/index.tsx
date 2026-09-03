import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [query, setQuery] = useState('')
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [])

  async function fetchProperties() {
    setLoading(true)
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'published')
      .limit(20)
    if (error) {
      console.error(error)
    } else {
      setProperties(data || [])
    }
    setLoading(false)
  }

  async function onSearch(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const q = query.trim()
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .ilike('title', `%${q}%`)
      .or(`address.ilike.%${q}%,area.ilike.%${q}%,city.ilike.%${q}%,state.ilike.%${q}%`)
      .eq('status', 'published')
      .limit(50)
    if (error) console.error(error)
    setProperties(data || [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <Head>
        <title>RentDirect — Find verified rental homes in Nigeria</title>
      </Head>
      <main className="container">
        <h1 className="text-3xl font-semibold mb-2">Find verified rental homes in Nigeria.</h1>
        <p className="text-gray-600 mb-6">No agent wahala. No hidden fees.</p>

        <form onSubmit={onSearch} className="mb-6">
          <input
            className="w-full p-3 border rounded"
            placeholder="Search Lekki, Yaba, Gwarinpa..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <section>
          {loading ? (
            <div>Loading properties…</div>
          ) : properties.length === 0 ? (
            <div>No homes found in this area.</div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {properties.map((p) => (
                <li key={p.id} className="border rounded p-3">
                  <Link href={`/properties/${p.id}`}>
                    <a className="block">
                      <h2 className="font-semibold">{p.title}</h2>
                      <p className="text-sm text-gray-600">{p.city} — ₦{p.annual_rent?.toLocaleString()}</p>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
