import BeatCard from '@/components/BeatCard'
import PlayerBar from '@/components/PlayerBar'
import { getBeats } from '@/lib/store'
import { Suspense } from 'react'
import BeatsFilter from './BeatsFilter'

export const metadata = { title: 'Beats — BeatForge' }

export default function BeatsPage({ searchParams }) {
  const allBeats = getBeats()
  const genre = searchParams?.genre
  const q = searchParams?.q?.toLowerCase()
  const beats = allBeats.filter(b => {
    if (genre && b.genre !== genre) return false
    if (q && !b.title.toLowerCase().includes(q) && !b.tags.join(' ').toLowerCase().includes(q) && !b.genre.toLowerCase().includes(q)) return false
    return true
  })
  const genres = Array.from(new Set(allBeats.map(b => b.genre)))

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <span className="tag mb-3">🎧 Beats Catalog</span>
        <h1 className="font-display font-bold text-4xl md:text-5xl">All Beats</h1>
        <p className="text-white/60 mt-2 max-w-xl">Preview every beat, pick your favorite and pay with Mobile Money or Bank Transfer. Delivered instantly.</p>
      </div>

      <Suspense>
        <BeatsFilter genres={genres} activeGenre={genre} q={q}/>
      </Suspense>

      {beats.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-white/60">No beats match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {beats.map((b, i) => <BeatCard key={b.id} beat={b} index={i}/>)}
        </div>
      )}
      <PlayerBar/>
    </section>
  )
}
