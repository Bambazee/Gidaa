import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

type Property = any

export default function Browse() {
  const [query, setQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [areaFilter, setAreaFilter] = useState('')
  const [minRent, setMinRent] = useState<number | ''>('')
  const [maxRent, setMaxRent] = useState<number | ''>('')
  const [propertyType, setPropertyType] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [amenities, setAmenities] = useState<number[]>([])

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [amenityList, setAmenityList] = useState<any[]>([])

  useEffect(() => {
    fetchAmenities()
    fetchResults()
  }, [])

  async function fetchAmenities() {
    const { data } = await supabase.from('amenities').select('*').order('id')
    setAmenityList(data || [])
  }

  async function fetchResults() {
    setLoading(true)
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (stateFilter) params.set('state', stateFilter)
    if (cityFilter) params.set('city', cityFilter)
    if (areaFilter) params.set('area', areaFilter)
    if (minRent !== '') params.set('min_rent', String(minRent))
    if (maxRent !== '') params.set('max_rent', String(maxRent))
    if (propertyType) params.set('property_type', propertyType)
    if (bedrooms) params.set('bedrooms', bedrooms)
    if (amenities.length) params.set('amenities', amenities.join(','))

    const res = await fetch(`/api/properties?${params.toString()}`)
    const data = await res.json()
    setProperties(data.properties || [])
    setLoading(false)
  }

  function clearFilters() {
    setQuery('')
    setStateFilter('')
    setCityFilter('')
    setAreaFilter('')
    setMinRent('')
    setMaxRent('')
    setPropertyType('')
    setBedrooms('')
    setAmenities([])
    fetchResults()
  }

  return (
    <div className="p-4 container">
      <h1 className="text-2xl font-semibold mb-4">Browse homes</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <aside className="md:col-span-1 border rounded p-3">
          <div className="mb-3">
            <label className="block mb-1">Search</label>
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full p-2 border" placeholder="Lekki, Gwarinpa, Yaba..." />
          </div>

          <div className="mb-3">
            <label className="block mb-1">State</label>
            <input value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="w-full p-2 border" />
          </div>

          <div className="mb-3">
            <label className="block mb-1">City</label>
            <input value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="w-full p-2 border" />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Area</label>
            <input value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className="w-full p-2 border" />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Min annual rent</label>
            <input type="number" value={minRent as any} onChange={(e) => setMinRent(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 border" />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Max annual rent</label>
            <input type="number" value={maxRent as any} onChange={(e) => setMaxRent(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 border" />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Property type</label>
            <input value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="w-full p-2 border" placeholder="e.g. 2 Bedroom" />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Bedrooms</label>
            <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="w-full p-2 border">
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4+</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block mb-1">Amenities</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto">
              {amenityList.map((a) => (
                <label key={a.id} className="text-sm">
                  <input type="checkbox" checked={amenities.includes(a.id)} onChange={(e) => setAmenities((s) => e.target.checked ? [...s, a.id] : s.filter((id) => id !== a.id))} /> {a.name}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={fetchResults} className="px-3 py-2 bg-blue-600 text-white rounded">Apply</button>
            <button onClick={clearFilters} className="px-3 py-2 border rounded">Clear</button>
          </div>
        </aside>

        <section className="md:col-span-3">
          {loading ? (
            <div>Loading results…</div>
          ) : properties.length === 0 ? (
            <div>No homes found in this area.</div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {properties.map((p: Property) => (
                <li key={p.id} className="border rounded p-3">
                  <Link href={`/properties/${p.id}`}>
                    <div className="block">
                      <h2 className="font-semibold">{p.title}</h2>
                      <div className="text-sm text-gray-600">{p.city} — ₦{Number(p.annual_rent).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{p.bedrooms} beds • {p.bathrooms} baths • {p.verification_status === 'verified' ? '✓ Verified' : ''}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
