import { NextResponse } from 'next/server'
import { getBookings, getBooking, updateBooking, addBookingMessage, getSession } from '@/lib/store'
import { getSessionToken } from '@/lib/cookies'
import { sendReplyToClient } from '@/lib/whatsapp'
import { sendNotification } from '@/lib/email'

function requireAdmin() {
  const user = getSession(getSessionToken())
  if (!user || user.role !== 'admin') return null
  return user
}

const STATUSES = ['pending', 'confirmed', 'declined', 'completed']

export async function GET() {
  if (!requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(getBookings())
}

// PATCH { id, status? } and/or { id, reply }
// - status: move the booking through the pipeline
// - reply:  producer's message → saved in the thread AND pushed to the client's WhatsApp
export async function PATCH(req) {
  if (!requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  const { id, status, reply } = body
  const booking = getBooking(id)
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

  if (status) {
    if (!STATUSES.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    addBookingMessage(id, 'system', `Booking marked ${status}`, 'dashboard')
    updateBooking(id, { status })
  }

  let whatsapp = null
  if (reply !== undefined) {
    const text = String(reply).trim()
    if (text.length < 1) return NextResponse.json({ error: 'Reply cannot be empty' }, { status: 400 })
    addBookingMessage(id, 'producer', text, 'whatsapp')
    try {
      whatsapp = await sendReplyToClient(booking, text)
    } catch (err) {
      console.error('[admin/bookings] client WhatsApp reply failed:', err.message)
      whatsapp = { live: false, error: err.message }
    }
  }

  // Keep the artist in the loop by email too, when we change the status
  if (status && booking.email) {
    try {
      const statusLabels = { pending: 'pending', confirmed: 'confirmed', declined: 'declined', completed: 'complete' }
      sendNotification({
        to: booking.email,
        subject: `📅 Your BeatForge booking is now ${statusLabels[status] || status}`,
        message: `Hi ${booking.name},\n\nYour "${booking.service}" booking has been marked as ${status} by DJ Pulse.\n\nHe will reach out on ${booking.phone} with next steps.\n\n— The BeatForge Team`,
      })
    } catch {}
  }

  return NextResponse.json({ booking: getBooking(id), whatsapp })
}
