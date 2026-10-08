'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Music, Download, Mail, Package, ShoppingBag, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [purchases, setPurchases] = useState(null)

  useEffect(() => {
    if (!loading && !user) router.push('/login?next=/dashboard')
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetch('/api/auth/me').then(r=>r.json()).then(u => setPurchases(u.purchases || []))
    }
  }, [user])

  if (loading || !user) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-brand-400"/>
    </div>
  )

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Greeting */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center text-2xl font-bold text-dark-900">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl">Hey, {user.name} 👋</h1>
          <p className="text-white/60 mt-1">Your beats and account details live here.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="card">
          <Package className="w-6 h-6 text-brand-400 mb-2"/>
          <div className="text-2xl font-display font-bold">{purchases?.length ?? 0}</div>
          <div className="text-sm text-white/60">Beats owned</div>
        </div>
        <div className="card">
          <Music className="w-6 h-6 text-gold-400 mb-2"/>
          <div className="text-2xl font-display font-bold">{purchases ? `$${purchases.reduce((s,p)=>s+p.price,0).toFixed(2)}` : '-'}</div>
          <div className="text-sm text-white/60">Total spent</div>
        </div>
        <div className="card">
          <Mail className="w-6 h-6 text-emerald-400 mb-2"/>
          <div className="text-2xl font-display font-bold">{purchases?.length ?? 0}</div>
          <div className="text-sm text-white/60">Emails received</div>
        </div>
        <div className="card">
          <Download className="w-6 h-6 text-sky-400 mb-2"/>
          <div className="text-2xl font-display font-bold">{purchases?.length ?? 0}</div>
          <div className="text-sm text-white/60">Downloads ready</div>
        </div>
      </div>

      {/* Purchases */}
      <h2 className="font-display font-bold text-2xl mb-4 flex items-center gap-2"><ShoppingBag className="w-6 h-6 text-brand-400"/> My Library</h2>
      {purchases === null ? (
        <div className="card text-center py-12 text-white/60"><Loader2 className="w-6 h-6 animate-spin mx-auto"/></div>
      ) : purchases.length === 0 ? (
        <div className="card text-center py-12">
          <Music className="w-12 h-12 mx-auto text-white/30 mb-3"/>
          <p className="text-white/70 font-medium">You haven't purchased any beats yet.</p>
          <p className="text-white/50 text-sm mt-1">Your purchased beats will show up here right after payment.</p>
          <Link href="/beats" className="btn-primary mt-6 inline-flex">Browse beats</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {purchases.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
              className="card flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center flex-shrink-0">
                <Music className="w-7 h-7 text-dark-900"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{p.beatTitle}</p>
                <p className="text-xs text-white/60">
                  {new Date(p.date).toLocaleString()} · {p.paymentMethod === 'momo' ? 'Mobile Money' : 'Bank Transfer'} ·{' '}
                  <span className="font-mono">{p.reference}</span>
                </p>
              </div>
              <div className="text-gold-400 font-bold mr-2">${p.price.toFixed(2)}</div>
              <a href={p.downloadUrl} onClick={e => { e.preventDefault(); alert('Demo: download link would be emailed to you in production.') }}
                 className="btn-primary py-2 px-4 text-sm">
                <Download className="w-4 h-4"/> Download
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
