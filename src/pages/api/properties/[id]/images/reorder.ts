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
    const propertyId = String(req.query.id)

    if (method !== 'POST') {
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${method} Not Allowed`)
    }

    const user = await getUserFromAuth(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const { data: prop } = await supabaseAdmin.from('properties').select('*').eq('id', propertyId).single()
    if (!prop) return res.status(404).json({ error: 'Property not found' })

    const { data: profile } = await supabaseAdmin.from('profiles').select('id,role').eq('id', user.id).single()
    const isAdmin = profile?.role === 'admin'
    const isOwner = prop.landlord_id === user.id
    if (!isAdmin && !isOwner) return res.status(403).json({ error: 'Forbidden' })

    const { order } = req.body || {}
    if (!Array.isArray(order)) return res.status(400).json({ error: 'Invalid payload' })

    for (const item of order) {
      const imgId = item.id
      const pos = Number(item.position) || 0
      await supabaseAdmin.from('property_images').update({ position: pos }).eq('id', imgId)
    }

    await supabaseAdmin.from('audit_log').insert([{ actor_id: user.id, action: 'reorder_property_images', meta: { property_id: propertyId, order } }])

    return res.status(200).json({ success: true })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
