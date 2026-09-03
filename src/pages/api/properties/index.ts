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
    if (method === 'GET') {
      const { q, state, city, area, min_rent, max_rent, property_type, bedrooms, page = '1', limit = '12', amenities } = req.query

      const pageNum = Math.max(1, Number(page) || 1)
      const pageSize = Math.min(100, Number(limit) || 12)
      const offset = (pageNum - 1) * pageSize

      // base query
      let query = supabaseAdmin.from('properties').select('*')

      // search and filters
      if (q) {
        const s = String(q)
        query = query.or(`title.ilike.%${s}%,address.ilike.%${s}%,area.ilike.%${s}%,city.ilike.%${s}%,state.ilike.%${s}%`)
      }
      if (state) query = query.eq('state', String(state))
      if (city) query = query.eq('city', String(city))
      if (area) query = query.eq('area', String(area))
      if (property_type) query = query.eq('property_type', String(property_type))
      if (bedrooms) query = query.eq('bedrooms', Number(bedrooms))
      if (min_rent) query = query.gte('annual_rent', Number(min_rent))
      if (max_rent) query = query.lte('annual_rent', Number(max_rent))
      // only published properties for public listing
      query = query.eq('status', 'published')

      const { data: props, error: propErr } = await query.order('created_at', { ascending: false }).range(offset, offset + pageSize - 1)
      if (propErr) return res.status(500).json({ error: propErr.message })

      let properties = props || []

      // if amenities filter provided (comma separated IDs), filter server-side
      if (amenities && properties.length) {
        const wanted = String(amenities).split(',').map((v) => v.trim()).filter(Boolean)
        if (wanted.length) {
          const ids = properties.map((p: any) => p.id)
          const { data: pa } = await supabaseAdmin.from('property_amenities').select('*').in('property_id', ids)
          const amenityMap: Record<string, string[]> = {}
          (pa || []).forEach((r: any) => {
            amenityMap[r.property_id] = amenityMap[r.property_id] || []
            amenityMap[r.property_id].push(String(r.amenity_id))
          })
          properties = properties.filter((p: any) => {
            const have = amenityMap[p.id] || []
            return wanted.every((w) => have.includes(w))
          })
        }
      }

      // attach cover image for each property
      const propIds = properties.map((p: any) => p.id)
      let images: any[] = []
      if (propIds.length) {
        const { data: imgs } = await supabaseAdmin.from('property_images').select('*').in('property_id', propIds).order('position', { ascending: true })
        images = imgs || []
      }
      const propertyMap = properties.map((p: any) => {
        const imgs = images.filter((i) => i.property_id === p.id)
        const cover = imgs.find((i) => i.is_cover) || imgs[0]
        return { ...p, cover_image: cover?.url || null }
      })

      return res.status(200).json({ properties: propertyMap })
    }

    // POST (create) - requires Authorization header with bearer token
    if (method === 'POST') {
      const user = await getUserFromAuth(req)
      if (!user) return res.status(401).json({ error: 'Unauthorized' })

      const body = req.body || {}
      // force landlord_id to the authenticated user
      body.landlord_id = user.id
      body.status = body.status || 'draft'
      body.verification_status = body.verification_status || 'pending'

      const { data, error } = await supabaseAdmin.from('properties').insert([body]).select().single()
      if (error) return res.status(400).json({ error: error.message })
      return res.status(201).json({ property: data })
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
