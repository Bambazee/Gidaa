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

      const { property_id, reason, message } = req.body
      if (!property_id || !reason) return res.status(400).json({ error: 'property_id and reason required' })

      const payload = { property_id, reporter_id: user.id, reason, message }
      const { data, error } = await supabaseAdmin.from('reports').insert([payload]).select().single()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json({ report: data })
    }

    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
