'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/Toast'
import {
  CheckCircle2, Calendar, MessageCircle, Music2, Headphones, Wand2, PenLine,
  Send, Loader2, Clock, User, Phone, Mail, Sparkles, ArrowRight,
} from 'lucide-react'

const SERVICES = [
  { name: 'Custom beat', price: 'from $50', icon: Music2, desc: 'A beat built around your style, references & vibe.' },
  { name: 'Full song production', price: 'from $150', icon: Wand2, desc: 'Complete track: beat, structure & topline guidance.' },
  { name: 'Mixing & mastering', price: 'from $40', icon: Headphones, desc: 'Radio-ready sound for your existing track.' },
  { name: 'Studio session', price: 'from $100', icon: Calendar, desc: 'In-studio or remote live production session.' },
  { name: 'Songwriting', price: 'from $80', icon: PenLine, desc: 'Hooks, melodies & lyric direction for your project.' },
]

const BUDGETS = ['Under $100', '$100 – $500', '$500 – $2,000', '$2,000+']

const STEPS = [
  { icon: Send, title: 'Send your booking', desc: 'Tell me the service, budget and what you need. Takes 2 minutes.' },
  { icon: MessageCircle, title: 'I get it instantly', desc: 'Your booking order lands on my dashboard and my WhatsApp the moment you hit send.' },
  { icon: Clock, title: 'Quick reply', desc: 'I confirm scope, price and timeline — usually within 24 hours.' },
  { icon: CheckCircle2, title: 'Deposit & start', desc: 'Pay 50% via MoMo or bank transfer, then delivery in stages.' },
]

export default function BookPage() {
  const toast = useToast()
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    service: SERVICES[0].name, date: '', budget: BUDGETS[1], tracks: 1, message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(null) // { booking, whatsapp }

  // Pre-fill from a logged-in artist account
  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then(u => {
        if (u?.name) setForm(f => ({ ...f, name: u.name || f.name, email: u.email || f.email }))
      })
      .catch(() => {})
  }, [])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const waChatLink = useMemo(() => {
    const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2332400000000'
    const text = `Hi DJ Pulse! I'd like to book a session with you on BeatForge. My project: `
    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`
  }, [])

  const sentWaChatLink = useMemo(() => {
    if (!sent) return null
    const b = sent.booking
    const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2332400000000'
    const text = `Hi DJ Pulse! I just sent a booking request on BeatForge (${b.service}, ref ${b.id}). Happy to chat here too!`
    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`
  }, [sent])

  async function submit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong — try again')
      setSent(data)
      toast.success('Booking sent! DJ Pulse has been notified. 🎧')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="tag mb-3">🎧 Work with me</span>
        <h1 className="font-display font-bold text-4xl md:text-5xl">
          Book a session with <span className="bg-gradient-to-r from-brand-400 to-gold-400 bg-clip-text text-transparent">DJ Pulse</span>
        </h1>
        <p className="text-white/60 mt-3 max-w-2xl mx-auto">
          Custom production, mixing, studio sessions — tell me what you're working on.
          Your booking order goes straight to my dashboard <strong className="text-white/80">and my WhatsApp</strong>, so you'll get a fast reply.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        {/* Form / success */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.form
                key="form"
                onSubmit={submit}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="card space-y-5"
              >
                <h3 className="font-display font-bold text-lg">Your booking details</h3>

                {/* Service picker */}
                <div>
                  <label className="label">What do you need?</label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {SERVICES.map(s => {
                      const active = form.service === s.name
                      const Icon = s.icon
                      return (
                        <button
                          type="button"
                          key={s.name}
                          onClick={() => setForm({ ...form, service: s.name })}
                          className={
                            "text-left p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 " +
                            (active
                              ? "border-brand-400 bg-brand-500/15 shadow-lg shadow-brand-500/10"
                              : "border-white/10 bg-white/5 hover:border-white/25")
                          }
                        >
                          <div className={"w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 " +
                            (active ? "bg-gradient-to-br from-brand-500 to-gold-500 text-dark-900" : "bg-white/10 text-white/70")}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm">{s.name}
                              <span className="ml-2 text-xs font-medium text-gold-300">{s.price}</span>
                            </p>
                            <p className="text-xs text-white/50 mt-0.5">{s.desc}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div><label className="label">Full name</label>
                    <input required value={form.name} onChange={set('name')} className="input" placeholder="e.g. Ama Serwaa" /></div>
                  <div><label className="label">WhatsApp number *</label>
                    <input required value={form.phone} onChange={set('phone')} className="input" placeholder="+233 24 123 4567"
                      title="I'll confirm your booking on this number" /></div>
                  <div><label className="label">Email (optional)</label>
                    <input type="email" value={form.email} onChange={set('email')} className="input" placeholder="you@email.com" /></div>
                  <div><label className="label">Preferred start date</label>
                    <input type="date" value={form.date} onChange={set('date')} className="input" /></div>
                  <div><label className="label">Budget</label>
                    <select value={form.budget} onChange={set('budget')} className="input">
                      {BUDGETS.map(b => <option key={b}>{b}</option>)}
                    </select></div>
                  <div><label className="label">Number of tracks</label>
                    <input type="number" min="1" max="20" value={form.tracks} onChange={set('tracks')} className="input" /></div>
                </div>

                <div><label className="label">Project details *</label>
                  <textarea required rows={4} value={form.message} onChange={set('message')} className="input resize-none"
                    placeholder="Describe your project — references, vibe, deadline, what's included in the price… The more detail, the faster I can quote you." /></div>

                <button disabled={submitting} className="btn-gold w-full disabled:opacity-60">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                  {submitting ? 'Sending booking…' : 'Send booking order'}
                </button>
                <p className="text-xs text-white/40 text-center -mt-2">
                  Instant delivery to DJ Pulse's website dashboard + WhatsApp. No spam — this goes straight to the producer.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}
                className="card text-center py-10 px-6"
              >
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: .1 }}
                  className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-4"
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </motion.div>
                <h3 className="font-display font-bold text-2xl">Booking sent! 🎉</h3>
                <p className="text-white/60 mt-2 max-w-md mx-auto">
                  Your <strong className="text-white/80">{sent.booking.service}</strong> order (ref <code className="text-gold-300">{sent.booking.id}</code>) has been
                  delivered to DJ Pulse's dashboard and WhatsApp. Watch for a reply on <strong className="text-white/80">{sent.booking.phone}</strong> or in your inbox.
                </p>
                <div className="mt-6 flex justify-center gap-3 flex-wrap">
                  <a href={sentWaChatLink} target="_blank" rel="noreferrer" className="btn-primary">
                    <MessageCircle className="w-4 h-4" /> Chat on WhatsApp now
                  </a>
                  <button onClick={() => { setSent(null); setForm({ ...form, message: '' }) }} className="btn-outline">
                    Send another booking
                  </button>
                </div>
                <Link href="/beats" className="inline-flex items-center gap-1 text-sm text-brand-300 hover:text-brand-200 mt-6">
                  Or browse the beat catalog while you wait <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <h3 className="font-display font-bold mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-gold-400" /> What happens next</h3>
            <div className="space-y-4">
              {STEPS.map((s, i) => (
                <div key={s.title} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center flex-shrink-0 text-dark-900">
                    <s.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{i + 1}. {s.title}</p>
                    <p className="text-xs text-white/55 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card border-emerald-400/20">
            <h3 className="font-display font-bold mb-2 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" /> Prefer to just chat?
            </h3>
            <p className="text-sm text-white/60 mb-4">
              Skip the form — message me directly on WhatsApp and I'll set up your booking there.
            </p>
            <a href={waChatLink} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-semibold text-sm hover:bg-emerald-500/25 transition">
              <MessageCircle className="w-4 h-4" /> WhatsApp DJ Pulse
            </a>
          </div>

          <div className="card text-xs text-white/50 space-y-1.5">
            <p className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-brand-400" /> Bookings are handled personally by the producer</p>
            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-brand-400" /> Replies come on your WhatsApp number — keep it handy</p>
            <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-brand-400" /> Add an email to get confirmations in your inbox too</p>
          </div>
        </div>
      </div>
    </section>
  )
}
