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
    const { method } = req
    if (method === 'POST') {
      const user = await getUserFromAuth(req)
      if (!user) return res.status(401).json({ error: 'Unauthorized' })

      const { property_id, preferred_date, preferred_time, message } = req.body
      if (!property_id || !preferred_date || !preferred_time) return res.status(400).json({ error: 'Missing required fields' })

      // retrieve landlord for property
      const { data: prop } = await supabaseAdmin.from('properties').select('landlord_id').eq('id', property_id).single()

      const payload = {
        property_id,
        renter_id: user.id,
        landlord_id: prop?.landlord_id || null,
        preferred_date,
        preferred_time,
        message,
        status: 'pending',
      }

      const { data, error } = await supabaseAdmin.from('viewing_requests').insert([payload]).select().single()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json({ request: data })
    }

    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
