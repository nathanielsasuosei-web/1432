import { cookies } from 'next/headers'

const COOKIE_NAME = 'bf_session'

export function getSessionToken() {
  const c = cookies()
  return c.get(COOKIE_NAME)?.value || null
}

export function setSessionCookie(token) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME)
}

export function makeToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
