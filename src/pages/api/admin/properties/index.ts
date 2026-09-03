import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabaseServer'

async function getUserProfile(req: NextApiRequest) {
  const auth = req.headers.authorization || ''
  const token = String(auth).replace('Bearer ', '')
  if (!token) return null
  const { data } = await supabaseAdmin.auth.getUser(token)
  if (!data.user) return null
  const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', data.user.id).single()
  return profile
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const profile = await getUserProfile(req)
    if (!profile || profile.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })

    const { data, error } = await supabaseAdmin.from('properties').select('*').eq('verification_status', 'pending').order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ properties: data })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
