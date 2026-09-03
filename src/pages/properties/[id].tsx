import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import ScheduleViewingForm from '../../components/ScheduleViewingForm'

export default function PropertyDetail() {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [saved, setSaved] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/properties/${id}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    checkSaved()
  }, [id])

  async function checkSaved() {
    if (!id) return
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    if (!token) return setSaved(false)
    const res = await fetch('/api/saved-properties', { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return
    const data = await res.json()
    const list = data.saved || []
    setSaved(list.some((s: any) => s.properties?.id === id))
  }

  async function toggleSave() {
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    if (!token) return router.push('/auth/login')

    try {
      if (!saved) {
        await fetch('/api/saved-properties', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ property_id: id }) })
        setSaved(true)
      } else {
        await fetch('/api/saved-properties', { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ property_id: id }) })
        setSaved(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="p-4">Loading property…</div>
  if (!data || !data.property) return <div className="p-4">Property not found</div>

  const { property, images, amenities, landlord } = data

  const totalMoveIn = (Number(property.annual_rent || 0) + Number(property.agency_fee || 0) + Number(property.legal_fee || 0) + Number(property.caution_deposit || 0) + Number(property.service_charge || 0))

  return (
    <div className="min-h-screen p-4">
      <div className="container">
        <h1 className="text-2xl font-semibold mb-2">{property.title}</h1>
        {property.verification_status === 'verified' && (
          <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mb-4">✓ RentDirect Verified</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            {images && images.length > 0 ? (
              <div className="mb-4">
                <img src={images[0].url} alt="cover" className="w-full h-64 object-cover rounded" />
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {images.map((img: any) => (
                    <img key={img.id} src={img.url} alt="img" className="h-20 w-full object-cover rounded" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 bg-gray-100 rounded mb-4 flex items-center justify-center">No images</div>
            )}

            <div className="mb-4">
              <h2 className="text-lg font-semibold">Details</h2>
              <p className="text-gray-700">{property.description}</p>
            </div>

            <div>
              <h3 className="font-semibold">Amenities</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {(amenities || []).map((a: string) => (
                  <span key={a} className="px-2 py-1 bg-gray-100 rounded text-sm">{a}</span>
                ))}
              </div>
            </div>
          </div>

          <aside className="p-4 border rounded">
            <div className="mb-3">
              <div className="text-xl font-bold">₦{Number(property.annual_rent || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600">{property.bedrooms} beds • {property.bathrooms} baths • {property.parking_spaces || 0} parking</div>
            </div>

            <div className="mb-3">
              <h4 className="font-semibold">Fees</h4>
              <div className="text-sm">Agency fee: ₦{Number(property.agency_fee || 0).toLocaleString()}</div>
              <div className="text-sm">Legal fee: ₦{Number(property.legal_fee || 0).toLocaleString()}</div>
              <div className="text-sm">Caution deposit: ₦{Number(property.caution_deposit || 0).toLocaleString()}</div>
              <div className="text-sm">Service charge: ₦{Number(property.service_charge || 0).toLocaleString()}</div>
            </div>

            <div className="mb-3">
              <h4 className="font-semibold">Estimated first payment</h4>
              <div className="text-2xl font-bold">₦{totalMoveIn.toLocaleString()}</div>
            </div>

            <div className="mb-3">
              <h4 className="font-semibold">Landlord</h4>
              <div>{landlord?.full_name}</div>
              <div className="mt-2">
                <a className="inline-block bg-green-600 text-white px-3 py-2 rounded mr-2" href={`https://wa.me/${formatPhoneForWhatsapp(landlord?.phone)}`} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
                <a className="inline-block bg-gray-200 px-3 py-2 rounded" href={`tel:${landlord?.phone}`}>Call Landlord</a>
              </div>
            </div>

            <div className="mb-3 flex gap-2">
              <button onClick={toggleSave} className={`px-3 py-2 rounded ${saved ? 'bg-red-500 text-white' : 'bg-gray-100'}`}>{saved ? 'Saved' : 'Save'}</button>
              <button onClick={() => setShowSchedule(true)} className="px-3 py-2 rounded bg-blue-600 text-white">Schedule a viewing</button>
            </div>

            <div>
              <button onClick={() => setShowReport(true)} className="w-full bg-red-100 text-red-800 p-2 rounded">Report this listing</button>
            </div>
          </aside>
        </div>

        {showSchedule && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="w-full max-w-md p-4">
              <ScheduleViewingForm propertyId={property.id} onClose={() => setShowSchedule(false)} onSuccess={() => {}} />
            </div>
          </div>
        )}

        {showReport && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="w-full max-w-md p-4">
              <ReportForm propertyId={property.id} onClose={() => setShowReport(false)} onSuccess={() => {}} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function formatPhoneForWhatsapp(phone?: string) {
  if (!phone) return ''
  // normalize Nigerian numbers to international format for wa.me links
  let p = phone.replace(/[^0-9]/g, '')
  if (p.startsWith('0')) p = '234' + p.slice(1)
  if (!p.startsWith('234')) p = '234' + p
  return p
}
