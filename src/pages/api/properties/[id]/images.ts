import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabaseServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req
    const propertyId = String(req.query.id)

    if (method === 'POST') {
      const { url, position = 0, is_cover = false } = req.body
      const payload = { property_id: propertyId, url, position, is_cover }
      const { data, error } = await supabaseAdmin.from('property_images').insert([payload]).select().single()
      if (error) return res.status(400).json({ error: error.message })
      return res.status(201).json({ image: data })
    }

    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
