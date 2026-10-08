import { NextResponse } from 'next/server'
import { getUserByEmail, setSession } from '@/lib/store'
import { makeToken, setSessionCookie } from '@/lib/cookies'

export async function POST(req) {
  try {
    const { email, password } = await req.json()
    const user = getUserByEmail(email)
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    const token = makeToken()
    setSession(token, user.id)
    setSessionCookie(token)
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, purchases: user.purchases }
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
