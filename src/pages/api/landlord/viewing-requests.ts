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

    const { data, error } = await supabaseAdmin.from('viewing_requests').select('*').eq('landlord_id', user.id).order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ requests: data })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
