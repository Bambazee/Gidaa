import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ImageUploader from '../../../components/ImageUploader'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import type { DropResult } from 'react-beautiful-dnd'
import { supabase } from '../../../lib/supabaseClient'

export default function EditPropertyPage() {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [basic, setBasic] = useState({ title: '', property_type: '', bedrooms: 1, bathrooms: 1, address: '', area: '', city: '', state: '' })
  const [pricing, setPricing] = useState({ annual_rent: 0, agency_fee: 0, legal_fee: 0, caution_deposit: 0, service_charge: 0 })
  const [description, setDescription] = useState('')
  const [existingImages, setExistingImages] = useState<any[]>([])
  const [removingIds, setRemovingIds] = useState<string[]>([])
  const [liveMessage, setLiveMessage] = useState('')
  const [newImages, setNewImages] = useState<File[]>([])

  useEffect(() => {
    if (!id) return
    fetchProperty(String(id))
  }, [id])

  async function fetchProperty(propId: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/properties/${propId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load')
      const p = data.property
      setBasic({ title: p.title || '', property_type: p.property_type || '', bedrooms: p.bedrooms || 1, bathrooms: p.bathrooms || 1, address: p.address || '', area: p.area || '', city: p.city || '', state: p.state || '' })
      setPricing({ annual_rent: p.annual_rent || 0, agency_fee: p.agency_fee || 0, legal_fee: p.legal_fee || 0, caution_deposit: p.caution_deposit || 0, service_charge: p.service_charge || 0 })
      setDescription(p.description || '')
      setExistingImages(data.images || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  async function deleteImage(imageId: string) {
    if (!id) return
    const ok = confirm('Delete this image?')
    if (!ok) return
    setRemovingIds((s) => [...s, imageId])
    setLiveMessage('Removing image')
    try {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token
      const res = await fetch(`/api/properties/${id}/images/${imageId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed to delete')
      setExistingImages((s) => s.filter((i) => i.id !== imageId))
      setRemovingIds((s) => s.filter((x) => x !== imageId))
      setLiveMessage('Image deleted')
    } catch (err: any) {
      setRemovingIds((s) => s.filter((x) => x !== imageId))
      alert(err.message || 'Failed to delete image')
    }
  }

  async function saveOrder(imagesArr: any[]) {
    if (!id) return
    try {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token
      const order = imagesArr.map((img: any, idx: number) => ({ id: img.id, position: idx }))
      const res = await fetch(`/api/properties/${id}/images/reorder`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ order }) })
      if (!res.ok) throw new Error('Failed to save order')
    } catch (err: any) {
      console.error('saveOrder', err)
      alert('Failed to save image order')
    }
  }

  function moveExisting(fromIndex: number, toIndex: number) {
    const arr = [...existingImages]
    const [item] = arr.splice(fromIndex, 1)
    arr.splice(toIndex, 0, item)
    setExistingImages(arr)
    saveOrder(arr)
  }

  async function submit() {
    if (!id) return
    setError(null)
    setLoading(true)
    try {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token
      const payload = { ...basic, ...pricing, description }
      const res = await fetch(`/api/properties/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update property')

      // upload new images if any
      if (newImages.length > 0) {
        for (let i = 0; i < newImages.length; i++) {
          const file = newImages[i]
          const filename = `${Date.now()}-${i}-${file.name.replace(/[^a-zA-Z0-9.]/g, '-')}`
          const path = `property-images/${id}/${filename}`
          const { data: uploadData, error: uploadErr } = await supabase.storage.from('property-images').upload(path, file, { cacheControl: '3600', upsert: false })
          if (uploadErr) console.error('uploadErr', uploadErr)
          const { data: publicUrlData } = supabase.storage.from('property-images').getPublicUrl(path)
          const imageUrl = publicUrlData.publicUrl
          await fetch(`/api/properties/${id}/images`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: imageUrl, position: existingImages.length + i, is_cover: false }) })
        }
      }

      router.push(`/properties/${id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to submit')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-4">Loading…</div>

  return (
    <div className="min-h-screen p-4 container">
      <div className="sr-only" aria-live="polite">{liveMessage}</div>
      <h1 className="text-2xl font-semibold mb-4">Edit Property</h1>

      <label className="block mb-2">Title</label>
      <input className="w-full p-2 border mb-3" value={basic.title} onChange={(e) => setBasic({ ...basic, title: e.target.value })} />

      <label className="block mb-2">Property type</label>
      <input className="w-full p-2 border mb-3" value={basic.property_type} onChange={(e) => setBasic({ ...basic, property_type: e.target.value })} />

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

      <div className="mt-4">
        <h3 className="font-semibold">Existing Photos</h3>
        <div className="mt-2">
          <DragDropContext onDragEnd={(res: DropResult) => {
            if (!res.destination) return
            const src = res.source.index
            const dst = res.destination.index
            const arr = Array.from(existingImages)
            const [moved] = arr.splice(src, 1)
            arr.splice(dst, 0, moved)
            setExistingImages(arr)
            saveOrder(arr)
          }}>
            <Droppable droppableId="existing-images">
              {(provided: any) => (
                <div className="grid grid-cols-3 gap-2" ref={provided.innerRef} {...provided.droppableProps}>
                  {existingImages.map((img: any, idx: number) => (
                    <Draggable key={img.id} draggableId={img.id} index={idx}>
                      {(prov: any, snapshot: any) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          className={`relative transition-transform duration-150 ease-in-out ${snapshot.isDragging ? 'scale-105 z-10' : ''} ${removingIds.includes(img.id) ? 'opacity-0' : 'opacity-100'}`}
                          style={{ transitionProperty: 'transform, opacity' }}
                        >
                          <img src={img.url} className="h-28 w-full object-cover rounded" alt="img" />
                          <div className="absolute top-1 right-1 flex flex-col gap-1">
                            <div {...prov.dragHandleProps} className="bg-white/80 rounded px-1 text-xs">≡</div>
                            <button onClick={() => deleteImage(img.id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs">Del</button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Add New Photos</h3>
        <ImageUploader onChange={(files) => setNewImages(files)} />
      </div>

      <div className="mt-4">
        <label className="block mb-2">Description</label>
        <textarea className="w-full p-2 border mb-3" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      {error && <div className="text-red-600 my-2">{error}</div>}

      <div className="flex gap-2 mt-4">
        <button onClick={() => router.push(`/properties/${id}`)} className="px-4 py-2 border rounded">Cancel</button>
        <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Saving…' : 'Save Changes'}</button>
      </div>
    </div>
  )
}
