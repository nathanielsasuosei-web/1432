import { NextResponse } from 'next/server'
import { getSession } from '@/lib/store'
import { getSessionToken } from '@/lib/cookies'

export async function GET() {
  const token = getSessionToken()
  const user = getSession(token)
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  return NextResponse.json({
    id: user.id, name: user.name, email: user.email, role: user.role,
    purchases: user.purchases,
  })
}
