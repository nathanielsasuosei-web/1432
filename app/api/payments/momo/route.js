import { NextResponse } from 'next/server'
import { getBeat, addPurchase, getSession, getPurchases } from '@/lib/store'
import { getSessionToken } from '@/lib/cookies'
import { sendPurchaseConfirmation } from '@/lib/email'

export async function POST(req) {
  const user = getSession(getSessionToken())
  if (!user) return NextResponse.json({ error: 'Please log in first' }, { status: 401 })

  const { beatId, provider, phone } = await req.json()
  const beat = getBeat(beatId)
  if (!beat) return NextResponse.json({ error: 'Beat not found' }, { status: 404 })
  if (!phone) return NextResponse.json({ error: 'Phone number required' }, { status: 400 })

  // Simulate MoMo payment processing delay
  await new Promise(r => setTimeout(r, 1200))

  const reference = `MoMo-${provider.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
  const purchase = addPurchase(user.id, beatId, 'momo', reference)
  sendPurchaseConfirmation({
    to: user.email,
    name: user.name,
    beat,
    downloadUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}${purchase.downloadUrl}`,
    reference,
    method: `${provider.toUpperCase()} Mobile Money`,
  })
  // Also send a notification to admin
  try {
    const { sendNotification } = await import('@/lib/email')
    sendNotification({
      to: 'admin@beatforge.com',
      subject: `💰 New MoMo sale: ${beat.title}`,
      message: `${user.name} (${user.email}) bought "${beat.title}" for $${beat.price} via ${provider} MoMo. Ref: ${reference}`,
    })
  } catch {}

  return NextResponse.json({ purchase })
}
