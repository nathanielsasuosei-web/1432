import { NextResponse } from 'next/server'
import { createUser, setSession } from '@/lib/store'
import { makeToken, setSessionCookie } from '@/lib/cookies'
import { sendWelcome } from '@/lib/email'

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }
    if (password.length < 6) return NextResponse.json({ error: 'Password too short' }, { status: 400 })

    const user = createUser({ name, email, password })
    const token = makeToken()
    setSession(token, user.id)
    setSessionCookie(token)

    sendWelcome({ to: user.email, name: user.name })

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, purchases: [] }
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
