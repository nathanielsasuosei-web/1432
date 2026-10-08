import { NextResponse } from 'next/server'
import { addBeat, deleteBeat, getSession } from '@/lib/store'
import { getSessionToken } from '@/lib/cookies'

function requireAdmin() {
  const user = getSession(getSessionToken())
  if (!user || user.role !== 'admin') return null
  return user
}

export async function POST(req) {
  if (!requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  if (!body.title || !body.price) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const beat = addBeat({
    title: body.title, genre: body.genre || 'Trap',
    bpm: Number(body.bpm) || 140, key: body.key || 'C min',
    price: Number(body.price), duration: body.duration || '3:00',
    cover: body.cover, tags: Array.isArray(body.tags) ? body.tags : [],
    description: body.description || '',
  })
  return NextResponse.json(beat)
}

export async function DELETE(req) {
  if (!requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  deleteBeat(id)
  return NextResponse.json({ ok: true })
}
