// WhatsApp message delivery for BeatForge.
//
// Two modes (mirrors the .mailbox demo pattern used by lib/email.js):
//
// 1. LIVE  — when WHATSAPP_ACCESS_TOKEN + WHATSAPP_PHONE_NUMBER_ID are set,
//            messages are sent straight to a phone number through the
//            Meta WhatsApp Business Cloud API (graph.facebook.com).
//
// 2. DEMO  — otherwise, every message is written to .whatsapp/*.json
//            (the WhatsApp "outbox") and logged, so the whole flow works
//            end-to-end without an external account.
//
// Env vars:
//   WHATSAPP_ACCESS_TOKEN        permanent token from the Meta developer app
//   WHATSAPP_PHONE_NUMBER_ID     phone number id of the sender (producer's business number)
//   WHATSAPP_PRODUCER_NUMBER     producer's WhatsApp number, intl format without "+" (receives booking alerts)
//   NEXT_PUBLIC_WHATSAPP_NUMBER  producer's number shown on public "Chat on WhatsApp" buttons

import fs from 'fs'
import path from 'path'

const OUTBOX = path.join(process.cwd(), '.whatsapp')
try { fs.mkdirSync(OUTBOX, { recursive: true }) } catch {}

const GRAPH_BASE = process.env.WHATSAPP_GRAPH_BASE || 'https://graph.facebook.com/v20.0'
const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const PRODUCER_NUMBER = process.env.WHATSAPP_PRODUCER_NUMBER || '2332400000000'

export function isLive() {
  return Boolean(TOKEN && PHONE_NUMBER_ID)
}

export function producerWhatsAppNumber() {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PRODUCER_NUMBER
}

export function normalizePhone(phone) {
  if (!phone) return ''
  let d = String(phone).replace(/\D/g, '')
  if (d.startsWith('00')) d = d.slice(2)
  return d
}

// https://wa.me deep link so a human can also open the chat manually
export function whatsappLink(phone, text) {
  const num = normalizePhone(phone)
  if (!num) return null
  const url = `https://wa.me/${num}`
  return text ? `${url}?text=${encodeURIComponent(text)}` : url
}

async function sendLive(to, body) {
  const res = await fetch(`${GRAPH_BASE}/${PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: normalizePhone(to),
      type: 'text',
      text: { body },
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(`WhatsApp API ${res.status}: ${data.error?.message || JSON.stringify(data)}`)
  }
  return { live: true, apiMessageId: (data.messages || [])[0]?.id }
}

function sendDemo(to, body, note) {
  const filename = path.join(OUTBOX, `${Date.now()}-${normalizePhone(to) || 'unknown'}.json`)
  const record = {
    to: normalizePhone(to),
    body,
    sentAt: new Date().toISOString(),
    mode: 'demo',
  }
  if (note) record.note = note
  fs.writeFileSync(filename, JSON.stringify(record, null, 2))
  console.log(`[whatsapp] → ${to || '(no number)'}\n${body}\n  (demo — saved to ${filename})`)
  return { live: false, demo: true, file: filename }
}

// Send a WhatsApp text message. Never throws — falls back to the demo outbox
// so a booking is never lost because WhatsApp is unconfigured/unreachable.
export async function sendWhatsApp(to, body) {
  try {
    return isLive() ? await sendLive(to, body) : sendDemo(to, body)
  } catch (err) {
    console.error('[whatsapp] live send failed, writing to demo outbox:', err.message)
    return sendDemo(to, body, `live send failed: ${err.message}`)
  }
}

// ----- Message templates -----

export function formatBookingMessage(b) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
  return [
    '🔔 *NEW BOOKING ORDER — BeatForge*',
    '',
    `👤 ${b.name}`,
    `📱 ${b.phone}${b.email ? `  ·  ✉️ ${b.email}` : ''}`,
    `🎛 ${b.service}`,
    b.date ? `📅 Preferred start: ${b.date}` : null,
    b.budget ? `💵 Budget: ${b.budget}` : null,
    b.tracks ? `🎵 Tracks: ${b.tracks}` : null,
    '',
    '💬 *Details:*',
    b.message,
    '',
    `Confirm it on your dashboard: ${appUrl}/admin`,
  ]
    .filter(line => line !== null)
    .join('\n')
}

export function formatReplyMessage(b, text) {
  return `🎧 *BeatForge (DJ Pulse)* — reply to your "${b.service}" booking:\n\n${text}`
}

// ----- High-level notifications -----

// Producer side: booking order lands straight on his WhatsApp
export async function notifyProducerNewBooking(b) {
  return sendWhatsApp(PRODUCER_NUMBER, formatBookingMessage(b))
}

// Client side: producer's reply lands on the artist's WhatsApp
export async function sendReplyToClient(b, text) {
  return sendWhatsApp(b.phone, formatReplyMessage(b, text))
}
