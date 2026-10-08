import { NextResponse } from 'next/server'
import { getBeats } from '@/lib/store'

export async function GET() {
  const beats = getBeats().map(b => ({
    id: b.id, title: b.title, genre: b.genre, bpm: b.bpm, key: b.key,
    price: b.price, duration: b.duration, cover: b.cover, producer: b.producer,
    tags: b.tags, plays: b.plays, description: b.description,
  }))
  return NextResponse.json(beats)
}
