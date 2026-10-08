import { getVideos } from '@/lib/store'
import { Play, Eye, Clock, Calendar } from 'lucide-react'

export const metadata = { title: 'Videos — BeatForge' }

export default function VideosPage() {
  const videos = getVideos()
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <span className="tag mb-3">🎬 Behind the beats</span>
        <h1 className="font-display font-bold text-4xl md:text-5xl">Videos</h1>
        <p className="text-white/60 mt-2">Studio sessions, tutorials and producer breakdowns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(v => (
          <article key={v.id} className="card group cursor-pointer">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-dark-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.thumbnail} alt={v.title}
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-brand-500/90 flex items-center justify-center group-hover:scale-110 transition shadow-2xl">
                  <Play className="w-7 h-7 text-white ml-1"/>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-xs font-medium flex items-center gap-1">
                <Clock className="w-3 h-3"/>{v.duration}
              </div>
            </div>
            <h3 className="font-display font-semibold text-lg group-hover:text-brand-300 transition-colors">{v.title}</h3>
            <div className="mt-2 flex items-center gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5"/>{v.views.toLocaleString()} views</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/>{new Date(v.date).toLocaleDateString()}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
