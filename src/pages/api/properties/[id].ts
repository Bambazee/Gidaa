import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../lib/supabaseServer'

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
    const {
      query: { id },
      method,
    } = req

    const propertyId = String(id)

    if (method === 'GET') {
      const { data: property, error: propErr } = await supabaseAdmin.from('properties').select('*').eq('id', propertyId).single()
      if (propErr) return res.status(404).json({ error: 'Property not found' })

      const { data: images } = await supabaseAdmin.from('property_images').select('*').eq('property_id', propertyId).order('position', { ascending: true })

      const { data: amenityRows } = await supabaseAdmin.from('property_amenities').select('amenity_id') .eq('property_id', propertyId)
      const amenityIds = (amenityRows || []).map((r: any) => r.amenity_id)
      const { data: amenities } = await supabaseAdmin.from('amenities').select('*').in('id', amenityIds)

      const { data: landlord } = await supabaseAdmin.from('profiles').select('id,full_name,avatar_url,phone,role,created_at').eq('id', property.landlord_id).single()

      return res.status(200).json({ property, images: images || [], amenities: amenities || [], landlord })
    }

    if (method === 'PATCH') {
      const user = await getUserFromAuth(req)
      if (!user) return res.status(401).json({ error: 'Unauthorized' })

      // check property exists
      const { data: existing, error: exErr } = await supabaseAdmin.from('properties').select('*').eq('id', propertyId).single()
      if (exErr || !existing) return res.status(404).json({ error: 'Property not found' })

      // only owner or admin may update
      const { data: profile } = await supabaseAdmin.from('profiles').select('id,role').eq('id', user.id).single()
      const isAdmin = profile?.role === 'admin'
      const isOwner = existing.landlord_id === user.id
      if (!isAdmin && !isOwner) return res.status(403).json({ error: 'Forbidden' })

      const updates = req.body || {}
      // prevent landlord from setting verification_status to verified
      if (!isAdmin && updates.verification_status && updates.verification_status === 'verified') {
        return res.status(403).json({ error: 'Only admin can verify properties' })
      }

      // apply update
      const { data, error } = await supabaseAdmin.from('properties').update(updates).eq('id', propertyId).select().single()
      if (error) return res.status(500).json({ error: error.message })

      // if admin updated verification_status, handle side effects and audit
      if (isAdmin && typeof updates.verification_status !== 'undefined') {
        const ver = updates.verification_status
        if (ver === 'verified') {
          await supabaseAdmin.from('properties').update({ status: 'published' }).eq('id', propertyId)
        }
        // write audit log including optional admin_note
        await supabaseAdmin.from('audit_log').insert([
          { actor_id: user.id, action: 'update_property_verification', meta: { property_id: propertyId, verification_status: ver, admin_note: updates.admin_note || null } },
        ])
      }
      return res.status(200).json({ property: data })
    }

    if (method === 'DELETE') {
      const user = await getUserFromAuth(req)
      if (!user) return res.status(401).json({ error: 'Unauthorized' })

      const { data: existing, error: exErr } = await supabaseAdmin.from('properties').select('*').eq('id', propertyId).single()
      if (exErr || !existing) return res.status(404).json({ error: 'Property not found' })

      const { data: profile } = await supabaseAdmin.from('profiles').select('id,role').eq('id', user.id).single()
      const isAdmin = profile?.role === 'admin'
      const isOwner = existing.landlord_id === user.id
      if (!isAdmin && !isOwner) return res.status(403).json({ error: 'Forbidden' })

      const { error } = await supabaseAdmin.from('properties').delete().eq('id', propertyId)
      if (error) return res.status(500).json({ error: error.message })
      await supabaseAdmin.from('audit_log').insert([{ actor_id: user.id, action: 'delete_property', meta: { property_id: propertyId } }])
      return res.status(200).json({ success: true })
    }

    res.setHeader('Allow', ['GET', 'PATCH', 'DELETE'])
    return res.status(405).end(`Method ${method} Not Allowed`)
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
