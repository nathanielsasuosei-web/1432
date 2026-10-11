'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/Toast'
import {
  CalendarCheck, RefreshCw, MessageCircle, Send, Check, X, Clock,
  Phone, Mail, DollarSign, Music2, ExternalLink, Inbox,
} from 'lucide-react'

const STATUS_STYLES = {
  pending:   'bg-gold-400/15 text-gold-300 border-gold-400/40',
  confirmed: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/40',
  declined:  'bg-red-400/15 text-red-300 border-red-400/40',
  completed: 'bg-brand-400/15 text-brand-300 border-brand-400/40',
}
const STATUS_LABELS = { pending: 'Pending', confirmed: 'Confirmed', declined: 'Declined', completed: 'Complete' }

function timeAgo(iso) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function waLink(phone, text) {
  if (!phone) return null
  const num = String(phone).replace(/\D/g, '')
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`
}

export default function BookingInbox({ onStats }) {
  const toast = useToast()
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('all')
  const [replies, setReplies] = useState({}) // bookingId -> draft text
  const [sending, setSending] = useState(null)
  const [busyStatus, setBusyStatus] = useState(null)
  const [polling, setPolling] = useState(true)
  const timer = useRef(null)

  async function load(silent = false) {
    try {
      const res = await fetch('/api/admin/bookings', { cache: 'no-store' })
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      setBookings(data)
      onStats?.({
        total: data.length,
        pending: data.filter(b => b.status === 'pending').length,
      })
    } catch {
      if (!silent) toast.error('Could not load bookings')
    }
  }

  useEffect(() => {
    load()
    timer.current = setInterval(() => load(true), 15000)
    return () => clearInterval(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polling])

  async function setStatus(id, status) {
    setBusyStatus(id)
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      toast.info(`Booking marked ${STATUS_LABELS[status].toLowerCase()}`)
      load(true)
    } catch (err) { toast.error(err.message) }
    finally { setBusyStatus(null) }
  }

  async function sendReply(id) {
    const text = (replies[id] || '').trim()
    if (!text) return
    setSending(id)
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reply: text }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send reply')
      const b = data.booking
      toast.success(data.whatsapp?.live
        ? `Reply delivered to ${b.name} on WhatsApp ✓`
        : `Reply saved to the thread — WhatsApp outbox (demo) ✓`)
      setReplies(r => ({ ...r, [id]: '' }))
      load(true)
    } catch (err) { toast.error(err.message) }
    finally { setSending(null) }
  }

  const visible = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)
  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    declined: bookings.filter(b => b.status === 'declined').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="card flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'confirmed', 'declined', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={"px-3.5 py-1.5 rounded-full text-xs font-medium border transition " +
                (filter === f ? "bg-white text-dark-900 border-white" : "border-white/15 text-white/60 hover:text-white")}>
              {f === 'all' ? 'All' : STATUS_LABELS[f]} ({counts[f]})
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span className={polling ? "w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" : "w-2 h-2 rounded-full bg-white/30"} />
          Auto-refresh 15s
          <button onClick={() => load()} title="Refresh now" className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="card text-center py-14">
          <Inbox className="w-10 h-10 mx-auto text-white/30 mb-3" />
          <p className="font-display font-bold text-lg">No bookings here</p>
          <p className="text-sm text-white/50 mt-1">New booking orders will land here (and on your WhatsApp) instantly.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {visible.map(b => (
              <motion.div key={b.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={"card " + (b.status === 'pending' ? "border-gold-400/30" : "")}>
                {/* Header */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="font-display font-bold">{b.name}</span>
                  <span className="tag">{b.service}</span>
                  <span className={"inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border " + (STATUS_STYLES[b.status] || '')}>
                    {b.status === 'pending' && <Clock className="w-3 h-3" />}
                    {b.status === 'confirmed' && <Check className="w-3 h-3" />}
                    {b.status === 'completed' && <Check className="w-3 h-3" />}
                    {b.status === 'declined' && <X className="w-3 h-3" />}
                    {STATUS_LABELS[b.status]}
                  </span>
                  <span className="ml-auto text-xs text-white/40">{timeAgo(b.createdAt)} · {b.id}</span>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-white/60 mb-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-brand-400" /> {b.phone}
                    {waLink(b.phone, `Hi ${b.name}, this is DJ Pulse from BeatForge — regarding your ${b.service} booking…`) && (
                      <a href={waLink(b.phone, `Hi ${b.name}, this is DJ Pulse from BeatForge — regarding your ${b.service} booking…`)}
                        target="_blank" rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" /> chat
                      </a>
                    )}
                  </span>
                  {b.email && <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-brand-400" /> {b.email}</span>}
                  {b.date && <span className="inline-flex items-center gap-1.5"><CalendarCheck className="w-3.5 h-3.5 text-brand-400" /> {b.date}</span>}
                  {b.budget && <span className="inline-flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-brand-400" /> {b.budget}</span>}
                  {b.tracks && <span className="inline-flex items-center gap-1.5"><Music2 className="w-3.5 h-3.5 text-brand-400" /> {b.tracks} track{b.tracks > 1 ? 's' : ''}</span>}
                </div>

                {/* Thread */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1 mb-3">
                  {b.messages.map(m => (
                    <div key={m.id}
                      className={"flex " + (m.from === 'producer' || m.from === 'system' ? "justify-end" : "justify-start")}>
                      <div className={
                        "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm " +
                        (m.from === 'client' ? "bg-white/8 border border-white/10" :
                         m.from === 'system' ? "bg-white/5 border border-dashed border-white/15 text-white/50 text-xs" :
                         "bg-brand-600/30 border border-brand-400/30")
                      }>
                        {m.from === 'client' && <p className="text-[11px] font-semibold text-gold-300 mb-0.5">{b.name} · {timeAgo(m.at)}</p>}
                        {m.from === 'producer' && <p className="text-[11px] font-semibold text-brand-300 mb-0.5">You · {timeAgo(m.at)} <span className="text-emerald-400 font-normal">via WhatsApp</span></p>}
                        <p className="whitespace-pre-wrap">{m.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply */}
                <div className="flex gap-2">
                  <input
                    value={replies[b.id] || ''}
                    onChange={e => setReplies(r => ({ ...r, [b.id]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(b.id) } }}
                    placeholder={`Reply to ${b.name} — sent to their WhatsApp…`}
                    className="input flex-1 py-2.5"
                    disabled={b.status === 'declined'}
                  />
                  <button onClick={() => sendReply(b.id)} disabled={sending === b.id || !(replies[b.id] || '').trim() || b.status === 'declined'}
                    className="btn-primary px-4 py-2.5 disabled:opacity-40" title="Save in thread + send to client's WhatsApp">
                    {sending === b.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>

                {/* Status actions */}
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/10">
                  {b.status !== 'confirmed' && (
                    <button disabled={busyStatus === b.id}
                      onClick={() => setStatus(b.id, 'confirmed')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/25 transition disabled:opacity-50">
                      <Check className="w-3.5 h-3.5" /> Confirm booking
                    </button>
                  )}
                  {b.status === 'confirmed' && (
                    <button disabled={busyStatus === b.id}
                      onClick={() => setStatus(b.id, 'completed')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-500/15 border border-brand-400/40 text-brand-300 hover:bg-brand-500/25 transition disabled:opacity-50">
                      <Check className="w-3.5 h-3.5" /> Mark complete
                    </button>
                  )}
                  {b.status !== 'declined' && (
                    <button disabled={busyStatus === b.id}
                      onClick={() => setStatus(b.id, 'declined')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 border border-red-400/30 text-red-300 hover:bg-red-500/20 transition disabled:opacity-50">
                      <X className="w-3.5 h-3.5" /> Decline
                    </button>
                  )}
                  {(b.status === 'declined' || b.status === 'completed') && (
                    <button disabled={busyStatus === b.id}
                      onClick={() => setStatus(b.id, 'pending')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 transition disabled:opacity-50">
                      <RefreshCw className="w-3.5 h-3.5" /> Reopen as pending
                    </button>
                  )}
                  <span className="ml-auto text-[11px] text-white/40 inline-flex items-center gap-1">
                    Replies are delivered to {b.phone} via WhatsApp <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
