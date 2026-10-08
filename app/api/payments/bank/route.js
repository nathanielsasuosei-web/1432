import { NextResponse } from 'next/server'
import { getBeat, addPurchase, getSession } from '@/lib/store'
import { getSessionToken } from '@/lib/cookies'
import { sendPurchaseConfirmation } from '@/lib/email'

export async function POST(req) {
  const user = getSession(getSessionToken())
  if (!user) return NextResponse.json({ error: 'Please log in first' }, { status: 401 })

  const { beatId, accountName, reference: userRef } = await req.json()
  const beat = getBeat(beatId)
  if (!beat) return NextResponse.json({ error: 'Beat not found' }, { status: 404 })
  if (!accountName || !userRef) return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })

  await new Promise(r => setTimeout(r, 1400))

  const reference = `BANK-${userRef.toUpperCase().slice(0,12)}`
  const purchase = addPurchase(user.id, beatId, 'bank', reference)
  sendPurchaseConfirmation({
    to: user.email,
    name: user.name,
    beat,
    downloadUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}${purchase.downloadUrl}`,
    reference,
    method: 'Bank Transfer',
  })
  try {
    const { sendNotification } = await import('@/lib/email')
    sendNotification({
      to: 'admin@beatforge.com',
      subject: `🏦 New bank transfer: ${beat.title}`,
      message: `${user.name} (${user.email}) submitted bank payment for "${beat.title}" ($${beat.price}). Account name: ${accountName}. Ref: ${reference}`,
    })
  } catch {}

  return NextResponse.json({ purchase })
}
