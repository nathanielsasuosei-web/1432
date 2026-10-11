import { NextResponse } from 'next/server'
import { addBooking } from '@/lib/store'
import { normalizePhone, notifyProducerNewBooking } from '@/lib/whatsapp'
import { sendNotification } from '@/lib/email'

const SERVICES = ['Custom beat', 'Full song production', 'Mixing & mastering', 'Studio session', 'Songwriting', 'Other']

export async function POST(req) {
  let body
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const name = String(body.name || '').trim()
  const phone = normalizePhone(body.phone)
  const email = String(body.email || '').trim()
  const service = SERVICES.includes(body.service) ? body.service : 'Other'
  const message = String(body.message || '').trim()
  const budget = String(body.budget || '').trim()
  const date = String(body.date || '').trim()
  const tracks = body.tracks ? Math.min(20, Math.max(1, Number(body.tracks) || 1)) : ''

  if (name.length < 2) return NextResponse.json({ error: 'Please tell us your name' }, { status: 400 })
  if (phone.length < 7 || phone.length > 15) return NextResponse.json({ error: 'A valid WhatsApp number is required' }, { status: 400 })
  if (message.length < 10) return NextResponse.json({ error: 'Please describe your project (at least 10 characters)' }, { status: 400 })
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Email address looks invalid' }, { status: 400 })

  const booking = addBooking({
    name, phone, email, service, message,
    budget, date, tracks,
  })

  // 1) Producer gets the booking order straight on his WhatsApp
  let whatsapp = { live: false }
  try {
    whatsapp = await notifyProducerNewBooking(booking)
  } catch (err) {
    console.error('[bookings] producer WhatsApp notification failed:', err.message)
    whatsapp = { live: false, error: err.message }
  }

  // 2) Email confirmations (client + producer)
  try {
    if (email) {
      sendNotification({
        to: email,
        subject: `📅 Your booking request is in — BeatForge`,
        message: `Hi ${name},\n\nThanks for reaching out! Your "${service}" booking request has been received and sent to DJ Pulse (website dashboard + WhatsApp).\n\nBudget: ${budget || '—'}\nDate: ${date || '—'}\n\nHe usually replies within 24 hours on ${phone} or by email.\n\nKeep creating,\n— The BeatForge Team`,
      })
    }
    sendNotification({
      to: 'admin@beatforge.com',
      subject: `📅 New booking order: ${service}`,
      message: `${name} (${phone}${email ? `, ${email}` : ''}) wants: ${service}\nBudget: ${budget || '—'} | Date: ${date || '—'}\n\n"${message}"\n\nManage it in the admin dashboard → Bookings.`,
    })
  } catch (err) {
    console.error('[bookings] email notifications failed:', err.message)
  }

  return NextResponse.json({ booking, whatsapp })
}
