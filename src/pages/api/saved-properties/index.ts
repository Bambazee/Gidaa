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
    const user = await getUserFromAuth(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const { method } = req
    if (method === 'GET') {
      const { data, error } = await supabaseAdmin
        .from('saved_properties')
        .select('id, created_at, properties(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json({ saved: data })
    }

    if (method === 'POST') {
      const { property_id } = req.body
      if (!property_id) return res.status(400).json({ error: 'property_id required' })
      const { data, error } = await supabaseAdmin.from('saved_properties').insert([{ user_id: user.id, property_id }]).select().single()
      if (error) return res.status(400).json({ error: error.message })
      return res.status(201).json({ saved: data })
    }

    if (method === 'DELETE') {
      const { property_id } = req.body
      if (!property_id) return res.status(400).json({ error: 'property_id required' })
      const { error } = await supabaseAdmin.from('saved_properties').delete().match({ user_id: user.id, property_id })
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json({ success: true })
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
    res.status(405).end(`Method ${method} Not Allowed`)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
