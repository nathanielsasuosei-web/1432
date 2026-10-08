import Hero from '@/components/Hero'
import BeatCard from '@/components/BeatCard'
import PlayerBar from '@/components/PlayerBar'
import { getBeats } from '@/lib/store'
import Link from 'next/link'
import { ArrowRight, PlayCircle, TrendingUp, Users, Headphones, Award } from 'lucide-react'

export default function HomePage() {
  const beats = getBeats().slice(0, 6)
  return (
    <>
      <Hero/>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Headphones, value: '500+', label: 'Beats released' },
            { icon: Users,      value: '12k+', label: 'Artists served' },
            { icon: TrendingUp, value: '2M+',  label: 'Total plays' },
            { icon: Award,      value: '4.9★', label: 'Artist rating' },
          ].map(s => (
            <div key={s.label} className="card text-center py-6">
              <s.icon className="w-7 h-7 text-brand-400 mx-auto mb-2"/>
              <div className="font-display text-3xl font-bold">{s.value}</div>
              <div className="text-sm text-white/60 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured beats */}
      <section id="beats" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="tag mb-3">🔥 Featured</span>
            <h2 className="font-display font-bold text-4xl">Fresh beats this week</h2>
            <p className="text-white/60 mt-2">Click to preview. Add to cart and pay in 2 minutes.</p>
          </div>
          <Link href="/beats" className="hidden md:inline-flex items-center gap-1 text-brand-300 hover:text-brand-200 font-medium">
            View all <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {beats.map((b, i) => <BeatCard key={b.id} beat={b} index={i}/>)}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href="/beats" className="btn-outline">View all beats <ArrowRight className="w-4 h-4"/></Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <span className="tag mb-3">How it works</span>
          <h2 className="font-display font-bold text-4xl">From click to drop in 3 steps</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Create an account', desc: 'Sign up as an artist. It takes 30 seconds and it\'s free to browse.' },
            { step: '02', title: 'Preview & pay', desc: 'Listen to previews, pick your beat, pay with Mobile Money or Bank Transfer.' },
            { step: '03', title: 'Instant email delivery', desc: 'Your beat, license and download link land in your inbox right away.' },
          ].map(s => (
            <div key={s.step} className="card relative overflow-hidden">
              <div className="absolute -top-6 -right-4 font-display text-9xl font-black text-white/5">{s.step}</div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center font-bold text-dark-900 mb-4">{s.step}</div>
                <h3 className="font-display text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-white/60 text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Genres */}
      <section id="genres" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-display font-bold text-4xl mb-8">Browse by genre</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Trap',       color: 'from-purple-600 to-fuchsia-600' },
            { name: 'Afrobeats',  color: 'from-orange-500 to-red-500' },
            { name: 'Hip-Hop',    color: 'from-blue-600 to-cyan-500' },
            { name: 'Drill',      color: 'from-rose-600 to-pink-600' },
            { name: 'R&B',        color: 'from-indigo-600 to-violet-600' },
            { name: 'Dancehall',  color: 'from-emerald-500 to-teal-600' },
            { name: 'Amapiano',   color: 'from-amber-500 to-gold-500' },
            { name: 'Pop',        color: 'from-sky-500 to-blue-500' },
          ].map(g => (
            <Link key={g.name} href={`/beats?genre=${g.name}`}
              className={"group relative h-32 rounded-2xl overflow-hidden bg-gradient-to-br " + g.color}>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition"/>
              <div className="absolute inset-0 flex items-end p-4">
                <div>
                  <h3 className="font-display font-bold text-2xl">{g.name}</h3>
                  <PlayCircle className="w-6 h-6 mt-1 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition"/>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 glass border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-700/40 via-transparent to-gold-500/20"/>
          <div className="relative text-center">
            <h2 className="font-display font-bold text-4xl md:text-5xl">Ready to make your next hit?</h2>
            <p className="mt-4 text-white/70 max-w-xl mx-auto">Create a free artist account and get 10% off your first beat.</p>
            <div className="mt-8 flex justify-center gap-3 flex-wrap">
              <Link href="/signup" className="btn-gold">Create free account</Link>
              <Link href="/beats" className="btn-outline">Browse beats</Link>
            </div>
          </div>
        </div>
      </section>

      <PlayerBar/>
    </>
  )
}
