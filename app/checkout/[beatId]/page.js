'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Smartphone, Building2, Shield, Clock, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'
import { useToast } from '@/components/Toast'

const MOMO_PROVIDERS = [
  { id: 'mtn', name: 'MTN Mobile Money', color: 'from-yellow-400 to-amber-500', hint: 'Dial *170#' },
  { id: 'vodafone', name: 'Vodafone Cash', color: 'from-red-500 to-red-600', hint: 'Dial *110#' },
  { id: 'airtel', name: 'AirtelTigo Money', color: 'from-blue-500 to-indigo-600', hint: 'Dial *110#' },
]

export default function CheckoutPage() {
  const { beatId } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const toast = useToast()
  const [beat, setBeat] = useState(null)
  const [method, setMethod] = useState('momo') // momo | bank
  const [provider, setProvider] = useState('mtn')
  const [phone, setPhone] = useState('')
  const [accountName, setAccountName] = useState('')
  const [ref, setRef] = useState('')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    import('@/lib/store').then(m => {
      // This is a server module; we'll load through an API client instead.
    }).catch(()=>{})
    // fetch beat from api
    fetch('/api/beats').then(r => r.json()).then(data => {
      setBeat(data.find(b => b.id === beatId))
    })
  }, [beatId])

  async function pay(e) {
    e.preventDefault()
    if (!user) { router.push(`/login?next=/checkout/${beatId}`); return }
    setProcessing(true)
    try {
      let res, data
      if (method === 'momo') {
        res = await fetch('/api/payments/momo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ beatId, provider, phone }),
        })
      } else {
        res = await fetch('/api/payments/bank', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ beatId, accountName, reference: ref }),
        })
      }
      data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payment failed')
      setSuccess(data.purchase)
      toast.success('Payment confirmed! Check your email 🎧')
    } catch (err) {
      toast.error(err.message)
    } finally { setProcessing(false) }
  }

  if (success) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale:0, rotate:-10 }} animate={{ scale:1, rotate:0 }} transition={{ type:'spring', bounce:.4 }}>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <CheckCircle2 className="w-12 h-12 text-white"/>
          </div>
        </motion.div>
        <h1 className="font-display font-bold text-4xl mt-6">Thanks for your purchase! 🎉</h1>
        <p className="text-white/70 mt-3">We've sent <strong className="text-white">{beat?.title}</strong> to your email at <strong className="text-white">{user?.email}</strong>.</p>
        <div className="card mt-8 text-left">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-white/60">Order reference</p>
              <p className="font-mono text-sm font-semibold">{success.reference}</p>
            </div>
            <span className="tag border-emerald-500/40 bg-emerald-500/15 text-emerald-300">Paid</span>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-white/5 flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
              {beat && <Image src={beat.cover} alt="" fill sizes="56px" className="object-cover"/>}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{success.beatTitle}</p>
              <p className="text-xs text-white/60">MP3 + WAV · Personal License</p>
            </div>
            <div className="text-gold-400 font-bold">${success.price}</div>
          </div>
          <a href="#" onClick={(e)=>{e.preventDefault(); toast.info('Download would start in production')} }
             className="btn-primary w-full mt-4">⬇️ Download beat files</a>
        </div>
        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          <Link href="/dashboard" className="btn-outline">View my library</Link>
          <Link href="/beats" className="btn-primary">Buy more beats</Link>
        </div>
      </section>
    )
  }

  if (!beat) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-white/60">Loading beat…</div>

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/beats" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4"/> Back to beats
      </Link>

      <h1 className="font-display font-bold text-3xl md:text-4xl mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Beat summary */}
        <aside className="lg:col-span-1">
          <div className="card sticky top-24">
            <p className="text-xs uppercase tracking-wider text-white/50 mb-3">Order summary</p>
            <div className="flex gap-4 items-center">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={beat.cover} alt={beat.title} fill sizes="80px" className="object-cover"/>
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold truncate">{beat.title}</h3>
                <p className="text-xs text-white/60">{beat.producer} · {beat.genre}</p>
                <p className="text-xs text-white/60">{beat.bpm} BPM · {beat.key}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-sm">
              <div className="flex justify-between text-white/70">
                <span>Beat license (MP3 + WAV)</span><span>${beat.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/70"><span>Processing fee</span><span>$0.00</span></div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                <span>Total</span><span className="text-gold-400">${beat.price.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-brand-500/10 border border-brand-500/20 text-xs flex items-start gap-2">
              <Shield className="w-4 h-4 text-brand-300 flex-shrink-0 mt-0.5"/>
              <span className="text-white/80">Your payment is secured. Files are emailed to you instantly after confirmation.</span>
            </div>
          </div>
        </aside>

        {/* Payment form */}
        <div className="lg:col-span-2">
          <form onSubmit={pay} className="card space-y-6">
            {!user && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400"/>
                <span>You'll be asked to log in before paying.</span>
              </div>
            )}

            {/* Method tabs */}
            <div>
              <label className="label">Payment method</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={()=>setMethod('momo')}
                  className={"p-4 rounded-xl border-2 transition flex items-center gap-3 text-left " +
                    (method === 'momo' ? "border-brand-500 bg-brand-500/10" : "border-white/10 hover:border-white/30")}>
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-dark-900"/>
                  </div>
                  <div>
                    <p className="font-semibold">Mobile Money</p>
                    <p className="text-xs text-white/60">Instant confirmation</p>
                  </div>
                </button>
                <button type="button" onClick={()=>setMethod('bank')}
                  className={"p-4 rounded-xl border-2 transition flex items-center gap-3 text-left " +
                    (method === 'bank' ? "border-brand-500 bg-brand-500/10" : "border-white/10 hover:border-white/30")}>
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white"/>
                  </div>
                  <div>
                    <p className="font-semibold">Bank Transfer</p>
                    <p className="text-xs text-white/60">Confirm in 5 minutes</p>
                  </div>
                </button>
              </div>
            </div>

            {method === 'momo' ? (
              <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-4">
                <div>
                  <label className="label">Mobile money provider</label>
                  <div className="grid grid-cols-3 gap-2">
                    {MOMO_PROVIDERS.map(p => (
                      <button type="button" key={p.id} onClick={()=>setProvider(p.id)}
                        className={"p-3 rounded-xl border-2 text-sm font-medium transition " +
                          (provider === p.id ? "border-white bg-white/10" : "border-white/10 hover:border-white/30")}>
                        <div className={"w-8 h-8 mx-auto rounded-md bg-gradient-to-br " + p.color + " mb-1.5"}/>
                        {p.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-white/50 flex items-center gap-1">
                    <Smartphone className="w-3 h-3"/>
                    You will receive a prompt on your phone to approve payment.
                  </p>
                </div>
                <div>
                  <label className="label">Mobile money number</label>
                  <input required value={phone} onChange={e=>setPhone(e.target.value)}
                         className="input" placeholder="e.g. 024 123 4567"/>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm space-y-2">
                  <p className="font-semibold mb-2">🏦 Bank Transfer Details</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-white/80">
                    <span className="text-white/50">Bank:</span><span>Guaranty Trust Bank</span>
                    <span className="text-white/50">Account name:</span><span>BeatForge / DJ Pulse</span>
                    <span className="text-white/50">Account number:</span><span className="font-mono font-semibold">2051 2345 6789</span>
                    <span className="text-white/50">Amount:</span><span className="text-gold-400 font-semibold">${beat.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-white/50 mt-2">Send the exact amount and enter your payment reference below.</p>
                </div>
                <div>
                  <label className="label">Your bank account name</label>
                  <input required value={accountName} onChange={e=>setAccountName(e.target.value)}
                         className="input" placeholder="Name on your bank account"/>
                </div>
                <div>
                  <label className="label">Transaction reference / ID</label>
                  <input required value={ref} onChange={e=>setRef(e.target.value)}
                         className="input font-mono" placeholder="e.g. 2345678901"/>
                </div>
              </motion.div>
            )}

            <button disabled={processing} className="btn-primary w-full text-base py-4 disabled:opacity-60">
              {processing ? <><Loader2 className="w-5 h-5 animate-spin"/> Processing payment…</>
                         : <><Shield className="w-5 h-5"/> Pay ${beat.price.toFixed(2)} securely</>}
            </button>
            <p className="text-center text-xs text-white/50">
              By paying you agree to the BeatForge License terms. Beat will be delivered to{' '}
              <strong className="text-white/70">{user?.email || 'your email'}.</strong>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
