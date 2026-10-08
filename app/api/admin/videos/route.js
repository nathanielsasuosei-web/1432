import { NextResponse } from 'next/server'
import { addVideo, getVideos, getSession } from '@/lib/store'
import { getSessionToken } from '@/lib/cookies'

function requireAdmin() {
  const user = getSession(getSessionToken())
  if (!user || user.role !== 'admin') return null
  return user
}

export async function GET() {
  return NextResponse.json(getVideos())
}

export async function POST(req) {
  if (!requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  if (!body.title) return NextResponse.json({ error: 'Missing title' }, { status: 400 })
  const video = addVideo({
    title: body.title,
    thumbnail: body.thumbnail,
    duration: body.duration || '0:00',
  })
  return NextResponse.json(video)
}
