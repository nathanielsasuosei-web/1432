'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Headphones, Play, Sparkles, Download, CreditCard, Mail } from 'lucide-react'
import Equalizer from './Equalizer'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-28 noise">
      {/* Floating animated background blobs */}
      <motion.div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-600/30 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-gold-500/20 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl"
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-gold-400"/>
            <span className="text-white/80">New beats dropping every week</span>
            <motion.span
              animate={{ backgroundColor: ['#8b5cf6', '#fbbf24', '#8b5cf6'] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, delay: .1 }}
            className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight"
          >
            Beats that
            <span className="block relative">
              make you
              <span className="ml-3 inline-block bg-gradient-to-r from-brand-400 via-fuchsia-400 to-gold-400 bg-clip-text text-transparent">
                move.
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, delay: .25 }}
            className="mt-6 text-lg text-white/70 max-w-xl"
          >
            Premium beats crafted for artists who mean it. Browse, preview and buy
            instantly — pay with <span className="text-white font-medium">Mobile Money</span> or{' '}
            <span className="text-white font-medium">Bank Transfer</span>, and your track lands in
            your inbox in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, delay: .4 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href="/beats" className="btn-primary">
              <Headphones className="w-5 h-5"/> Explore Beats
            </Link>
            <Link href="/beats" className="btn-outline">
              <Play className="w-4 h-4 ml-0.5"/> Watch demo
            </Link>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: .7, delay: .6 }}
            className="mt-10 grid grid-cols-3 gap-3 max-w-lg"
          >
            {[
              { icon: Download, title: 'Instant Download', desc: 'Right after payment' },
              { icon: CreditCard, title: 'MoMo & Bank', desc: 'Easy local payment' },
              { icon: Mail, title: 'Email Delivery', desc: 'Beat sent to inbox' },
            ].map(f => (
              <div key={f.title} className="glass rounded-xl p-3">
                <f.icon className="w-5 h-5 text-brand-400 mb-1.5"/>
                <div className="text-xs font-semibold">{f.title}</div>
                <div className="text-[11px] text-white/50">{f.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Animated vinyl / visual */}
        <div className="relative h-[420px] lg:h-[520px] flex items-center justify-center">
          {/* Rotating vinyl */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: .3, duration: 1.2, delay: .3 }}
            className="relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full"
              style={{
                background: 'repeating-radial-gradient(circle at center, #111 0px, #111 2px, #1a1a1a 3px, #1a1a1a 4px)',
                boxShadow: '0 0 80px rgba(139,92,246,.35), inset 0 0 40px rgba(0,0,0,.8)',
              }}
            >
              {/* vinyl ridges */}
              <div className="absolute inset-4 rounded-full border border-white/5"/>
              <div className="absolute inset-8 rounded-full border border-white/5"/>
              <div className="absolute inset-12 rounded-full border border-white/5"/>
              <div className="absolute inset-16 rounded-full border border-white/5"/>
              {/* center label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-brand-500 via-fuchsia-500 to-gold-500 flex items-center justify-center shadow-2xl"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="w-8 h-8 rounded-full bg-dark-900 border-4 border-white/20"/>
                  <div className="absolute inset-3 rounded-full border border-white/10"/>
                  <span className="absolute bottom-8 text-[10px] font-bold tracking-widest text-dark-900">BEATFORGE</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: .9, duration: .6 }}
            className="absolute top-4 right-0 sm:right-6 glass rounded-2xl p-4 w-56 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <Equalizer playing={true} className="!h-4"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Midnight Dreams</p>
                <p className="text-xs text-white/60">Trap · 140 BPM</p>
              </div>
              <div className="text-gold-400 text-sm font-bold">$29</div>
            </div>
            <div className="mt-3 h-1 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-400 to-gold-400"
                initial={{ width: '0%' }}
                animate={{ width: '65%' }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: .6 }}
            className="absolute bottom-6 left-0 glass rounded-2xl p-4 w-56 shadow-2xl"
          >
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/> Payment confirmed
            </div>
            <p className="text-sm font-semibold">Your beat is on the way</p>
            <p className="text-xs text-white/60 mt-1">📧 Sent to your inbox</p>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="flex-1 h-1.5 bg-white/10 rounded overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-brand-400 to-gold-400"/>
              </div>
              <span className="text-xs font-semibold text-gold-400">✓</span>
            </div>
          </motion.div>

          {/* Orbiting dots */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-gold-400 shadow-lg shadow-gold-400/50"
                 style={{ transform: 'translate(220px, 0)' }}/>
          </motion.div>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full bg-brand-400 shadow-lg shadow-brand-400/50"
                 style={{ transform: 'translate(-200px, 40px)' }}/>
          </motion.div>
        </div>
      </div>

      {/* Scrolling marquee of genres */}
      <div className="relative mt-16 overflow-hidden border-y border-white/10 py-4">
        <motion.div
          className="flex gap-10 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {['Trap', 'Afrobeats', 'Hip-Hop', 'Drill', 'R&B', 'Dancehall', 'Amapiano', 'Pop', 'Trap', 'Afrobeats', 'Hip-Hop', 'Drill', 'R&B', 'Dancehall', 'Amapiano', 'Pop'].map((g, i) => (
            <span key={i} className="font-display text-2xl font-bold text-white/30 hover:text-white transition-colors flex items-center gap-10">
              {g}
              <span className="w-2 h-2 rounded-full bg-brand-500"/>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
