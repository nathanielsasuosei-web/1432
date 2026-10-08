import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/store'
import { getSessionToken, clearSessionCookie } from '@/lib/cookies'

export async function POST() {
  const token = getSessionToken()
  if (token) clearSession(token)
  clearSessionCookie()
  return NextResponse.json({ ok: true })
}
