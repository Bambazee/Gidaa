import { useState } from 'react'
import { useRouter } from 'next/router'
import ImageUploader from '../../components/ImageUploader'
import { supabase } from '../../lib/supabaseClient'

export default function AddProperty() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [basic, setBasic] = useState({ title: '', property_type: '', bedrooms: 1, bathrooms: 1, address: '', area: '', city: '', state: '' })
  const [pricing, setPricing] = useState({ annual_rent: 0, agency_fee: 0, legal_fee: 0, caution_deposit: 0, service_charge: 0 })
  const [amenities, setAmenities] = useState<number[]>([])
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function next() {
    setStep((s) => Math.min(6, s + 1))
  }
  function prev() {
    setStep((s) => Math.max(1, s - 1))
  }

  async function submit() {
    setError(null)
    if (images.length < 3) return setError('Please upload at least 3 photos')
    setLoading(true)
    try {
      const user = await supabase.auth.getUser()
      const landlordId = user.data.user?.id
      if (!landlordId) throw new Error('Not authenticated')

      const payload = {
        landlord_id: landlordId,
        ...basic,
        ...pricing,
        description,
        status: 'pending',
        verification_status: 'pending',
      }

      // create property (server will use service key)
      const res = await fetch('/api/properties', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create property')
      const propertyId = data.property.id

      // upload images to Supabase Storage
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        const filename = `${Date.now()}-${i}-${file.name.replace(/[^a-zA-Z0-9.]/g, '-')}`
        const path = `property-images/${propertyId}/${filename}`
        const { data: uploadData, error: uploadErr } = await supabase.storage.from('property-images').upload(path, file, { cacheControl: '3600', upsert: false })
        if (uploadErr) console.error('uploadErr', uploadErr)

        // create public URL
        const { data: publicUrlData } = supabase.storage.from('property-images').getPublicUrl(path)
        const imageUrl = publicUrlData.publicUrl

        // register image in DB
        await fetch(`/api/properties/${propertyId}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: imageUrl, position: i, is_cover: i === 0 }),
        })
      }

      router.push(`/properties/${propertyId}`)
    } catch (err: any) {
      setError(err.message || 'Failed to submit')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4">
      <div className="container">
        <h1 className="text-2xl font-semibold mb-4">Add Property</h1>

        <div className="mb-4">Step {step} / 6</div>

        {step === 1 && (
          <div>
            <label className="block mb-2">Title</label>
            <input className="w-full p-2 border mb-3" value={basic.title} onChange={(e) => setBasic({ ...basic, title: e.target.value })} />

            <label className="block mb-2">Property type</label>
            <input className="w-full p-2 border mb-3" value={basic.property_type} onChange={(e) => setBasic({ ...basic, property_type: e.target.value })} placeholder="e.g. 2 Bedroom" />

            <label className="block mb-2">Bedrooms</label>
            <input type="number" className="w-full p-2 border mb-3" value={basic.bedrooms} onChange={(e) => setBasic({ ...basic, bedrooms: Number(e.target.value) })} />

            <label className="block mb-2">Bathrooms</label>
            <input type="number" className="w-full p-2 border mb-3" value={basic.bathrooms} onChange={(e) => setBasic({ ...basic, bathrooms: Number(e.target.value) })} />

            <label className="block mb-2">Address</label>
            <input className="w-full p-2 border mb-3" value={basic.address} onChange={(e) => setBasic({ ...basic, address: e.target.value })} />

            <label className="block mb-2">Area</label>
            <input className="w-full p-2 border mb-3" value={basic.area} onChange={(e) => setBasic({ ...basic, area: e.target.value })} />

            <label className="block mb-2">City</label>
            <input className="w-full p-2 border mb-3" value={basic.city} onChange={(e) => setBasic({ ...basic, city: e.target.value })} />

            <label className="block mb-2">State</label>
            <input className="w-full p-2 border mb-3" value={basic.state} onChange={(e) => setBasic({ ...basic, state: e.target.value })} />
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block mb-2">Annual rent</label>
            <input type="number" className="w-full p-2 border mb-3" value={pricing.annual_rent} onChange={(e) => setPricing({ ...pricing, annual_rent: Number(e.target.value) })} />

            <label className="block mb-2">Agency fee</label>
            <input type="number" className="w-full p-2 border mb-3" value={pricing.agency_fee} onChange={(e) => setPricing({ ...pricing, agency_fee: Number(e.target.value) })} />

            <label className="block mb-2">Legal fee</label>
            <input type="number" className="w-full p-2 border mb-3" value={pricing.legal_fee} onChange={(e) => setPricing({ ...pricing, legal_fee: Number(e.target.value) })} />

            <label className="block mb-2">Caution deposit</label>
            <input type="number" className="w-full p-2 border mb-3" value={pricing.caution_deposit} onChange={(e) => setPricing({ ...pricing, caution_deposit: Number(e.target.value) })} />

            <label className="block mb-2">Service charge</label>
            <input type="number" className="w-full p-2 border mb-3" value={pricing.service_charge} onChange={(e) => setPricing({ ...pricing, service_charge: Number(e.target.value) })} />

            <div className="mt-3">Total move-in cost: ₦{(Number(pricing.annual_rent || 0) + Number(pricing.agency_fee || 0) + Number(pricing.legal_fee || 0) + Number(pricing.caution_deposit || 0) + Number(pricing.service_charge || 0)).toLocaleString()}</div>
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="block mb-2">Select amenities (IDs)</label>
            <input className="w-full p-2 border mb-3" placeholder="e.g. 1,3,5" value={amenities.join(',')} onChange={(e) => setAmenities(e.target.value.split(',').map((v) => Number(v.trim())).filter(Boolean))} />
            <div className="text-sm text-gray-500">(Amenities will be mapped by id; seed data includes common amenities)</div>
          </div>
        )}

        {step === 4 && (
          <div>
            <ImageUploader onChange={(files) => setImages(files)} />
            <div className="text-sm text-gray-500 mt-2">Tip: Upload at least 3 photos. First image will become the cover.</div>
          </div>
        )}

        {step === 5 && (
          <div>
            <label className="block mb-2">Description</label>
            <textarea className="w-full p-2 border mb-3" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        )}

        {step === 6 && (
          <div>
            <h3 className="font-semibold">Review</h3>
            <div className="mb-2">Title: {basic.title}</div>
            <div className="mb-2">Type: {basic.property_type}</div>
            <div className="mb-2">Rent: ₦{Number(pricing.annual_rent).toLocaleString()}</div>
            <div className="mb-2">Photos: {images.length} uploaded</div>
            <div className="mb-2">Description: {description}</div>
          </div>
        )}

        {error && <div className="text-red-600 my-2">{error}</div>}

        <div className="flex gap-2 mt-4">
          {step > 1 && <button onClick={prev} className="px-4 py-2 border rounded">Back</button>}
          {step < 6 && <button onClick={next} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>}
          {step === 6 && <button onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded" disabled={loading}>{loading ? 'Submitting…' : 'Submit for Verification'}</button>}
        </div>
      </div>
    </div>
  )
}
