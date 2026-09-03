import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../../lib/supabaseServer'

async function getUserFromAuth(req: NextApiRequest) {
  const auth = req.headers.authorization || ''
  const token = String(auth).replace('Bearer ', '')
  if (!token) return null
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error) return null
  return data.user
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req
    const { id, imageId } = req.query
    const propertyId = String(id)
    const imgId = String(imageId)

    if (method !== 'DELETE') {
      res.setHeader('Allow', ['DELETE'])
      return res.status(405).end(`Method ${method} Not Allowed`)
    }

    const user = await getUserFromAuth(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const { data: img } = await supabaseAdmin.from('property_images').select('*').eq('id', imgId).single()
    if (!img) return res.status(404).json({ error: 'Image not found' })

    const { data: prop } = await supabaseAdmin.from('properties').select('*').eq('id', propertyId).single()
    if (!prop) return res.status(404).json({ error: 'Property not found' })

    const { data: profile } = await supabaseAdmin.from('profiles').select('id,role').eq('id', user.id).single()
    const isAdmin = profile?.role === 'admin'
    const isOwner = prop.landlord_id === user.id
    if (!isAdmin && !isOwner) return res.status(403).json({ error: 'Forbidden' })

    // attempt to delete storage object if the URL points to our storage bucket
    try {
      const bucket = 'property-images'
      const url: string = img.url || ''
      const storageMarker = '/storage/v1/object/public/' + bucket + '/'
      let objectPath: string | null = null
      const idx = url.indexOf(storageMarker)
      if (idx !== -1) {
        objectPath = decodeURIComponent(url.substring(idx + storageMarker.length))
      } else {
        // fallback: if url contains the bucket name, try to extract path after bucket name
        const alt = `/${bucket}/`
        const altIdx = url.indexOf(alt)
        if (altIdx !== -1) objectPath = decodeURIComponent(url.substring(altIdx + alt.length))
      }

      if (objectPath) {
        try {
          const { error: rmErr } = await supabaseAdmin.storage.from(bucket).remove([objectPath])
          if (rmErr) console.warn('Failed to remove storage object', rmErr.message)
        } catch (e) {
          console.warn('Storage remove error', e)
        }
      }

    } catch (e) {
      console.warn('Error while attempting storage cleanup', e)
    }

    const { error } = await supabaseAdmin.from('property_images').delete().eq('id', imgId)
    if (error) return res.status(500).json({ error: error.message })
    await supabaseAdmin.from('audit_log').insert([{ actor_id: user.id, action: 'delete_property_image', meta: { property_id: propertyId, image_id: imgId } }])

    return res.status(200).json({ success: true })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
