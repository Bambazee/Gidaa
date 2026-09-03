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

    const { method } = req
    const id = String(req.query.id)
    if (method === 'PATCH') {
      const { resolved, admin_note } = req.body
      const updates: any = {}
      if (typeof resolved !== 'undefined') updates.resolved = resolved
      if (typeof admin_note !== 'undefined') updates.admin_note = admin_note

      const { data, error } = await supabaseAdmin.from('reports').update(updates).eq('id', id).select().single()
      if (error) return res.status(500).json({ error: error.message })

      // write to audit log
      await supabaseAdmin.from('audit_log').insert([{ actor_id: profile.id, action: 'update_report', meta: { report_id: id, updates } }])

      return res.status(200).json({ report: data })
    }

    res.setHeader('Allow', ['PATCH'])
    res.status(405).end(`Method ${method} Not Allowed`)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
