'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { useToast } from '@/components/Toast'
import { Upload as UploadIcon, Music, Video as VideoIcon, Trash2, Loader2, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [tab, setTab] = useState('beats')
  const [beats, setBeats] = useState([])
  const [videos, setVideos] = useState([])

  // beat form
  const [b, setB] = useState({ title:'', genre:'Trap', bpm:140, key:'C min', price:29.99, duration:'3:00', cover:'', tags:'' })
  // video form
  const [v, setV] = useState({ title:'', thumbnail:'', duration:'10:00' })
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    const all = await fetch('/api/beats').then(r=>r.json())
    setBeats(all)
    const vids = await fetch('/api/admin/videos').then(r=>r.ok ? r.json() : [])
    setVideos(vids)
  }
  useEffect(() => { load() }, [])
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.replace('/login?next=/admin')
  }, [user, loading, router])

  async function uploadBeat(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const cover = b.cover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80'
      const res = await fetch('/api/admin/beats', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ ...b, cover, tags: b.tags.split(',').map(s=>s.trim()).filter(Boolean) })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      toast.success('Beat uploaded! 🎉')
      setB({ title:'', genre:'Trap', bpm:140, key:'C min', price:29.99, duration:'3:00', cover:'', tags:'' })
      load()
    } catch (err) { toast.error(err.message) }
    finally { setSubmitting(false) }
  }

  async function uploadVideo(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const thumbnail = v.thumbnail || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80'
      const res = await fetch('/api/admin/videos', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ ...v, thumbnail })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      toast.success('Video added!')
      setV({ title:'', thumbnail:'', duration:'10:00' })
      load()
    } catch (err) { toast.error(err.message) }
    finally { setSubmitting(false) }
  }

  async function removeBeat(id) {
    if (!confirm('Delete this beat?')) return
    await fetch('/api/admin/beats?id='+id, { method:'DELETE' })
    toast.info('Beat deleted')
    load()
  }

  if (loading || !user || user.role !== 'admin') return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-brand-400"/>
    </div>
  )

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <span className="tag border-gold-400/40 bg-gold-500/10 text-gold-300 mb-3">⚡ Admin panel</span>
        <h1 className="font-display font-bold text-4xl">Upload & manage content</h1>
        <p className="text-white/60 mt-2">Add new beats and videos. They go live instantly.</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={()=>setTab('beats')}
          className={"px-5 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 " +
            (tab==='beats' ? "bg-white text-dark-900" : "border border-white/15 text-white/70 hover:text-white")}>
          <Music className="w-4 h-4"/> Beats ({beats.length})
        </button>
        <button onClick={()=>setTab('videos')}
          className={"px-5 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 " +
            (tab==='videos' ? "bg-white text-dark-900" : "border border-white/15 text-white/70 hover:text-white")}>
          <VideoIcon className="w-4 h-4"/> Videos ({videos.length})
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Upload form */}
        <div className="lg:col-span-2">
          {tab === 'beats' ? (
            <form onSubmit={uploadBeat} className="card space-y-4">
              <h3 className="font-display font-bold text-lg flex items-center gap-2"><Plus className="w-5 h-5"/> Upload new beat</h3>
              <div><label className="label">Beat title</label>
                <input required value={b.title} onChange={e=>setB({...b, title:e.target.value})} className="input" placeholder="e.g. Midnight Dreams"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Genre</label>
                  <select value={b.genre} onChange={e=>setB({...b, genre:e.target.value})} className="input">
                    {['Trap','Afrobeats','Hip-Hop','Drill','R&B','Dancehall','Amapiano','Pop'].map(g=><option key={g}>{g}</option>)}
                  </select></div>
                <div><label className="label">Duration</label>
                  <input value={b.duration} onChange={e=>setB({...b, duration:e.target.value})} className="input" placeholder="3:24"/></div>
                <div><label className="label">BPM</label>
                  <input type="number" value={b.bpm} onChange={e=>setB({...b, bpm:+e.target.value})} className="input"/></div>
                <div><label className="label">Key</label>
                  <input value={b.key} onChange={e=>setB({...b, key:e.target.value})} className="input" placeholder="F# min"/></div>
              </div>
              <div><label className="label">Price (USD)</label>
                <input type="number" step="0.01" value={b.price} onChange={e=>setB({...b, price:+e.target.value})} className="input"/></div>
              <div><label className="label">Cover image URL (optional)</label>
                <input value={b.cover} onChange={e=>setB({...b, cover:e.target.value})} className="input" placeholder="https://..."/></div>
              <div><label className="label">Tags (comma separated)</label>
                <input value={b.tags} onChange={e=>setB({...b, tags:e.target.value})} className="input" placeholder="dark, melodic"/></div>
              <div>
                <label className="label">Audio file</label>
                <div className="input flex items-center justify-center flex-col py-6 cursor-pointer hover:border-brand-400 border-dashed">
                  <UploadIcon className="w-6 h-6 text-white/50 mb-1"/>
                  <p className="text-sm text-white/60">Drop audio here or click to upload</p>
                  <p className="text-xs text-white/40 mt-1">MP3 / WAV — max 20MB</p>
                </div>
              </div>
              <button disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                {submitting ? 'Uploading…' : 'Publish beat'}
              </button>
            </form>
          ) : (
            <form onSubmit={uploadVideo} className="card space-y-4">
              <h3 className="font-display font-bold text-lg flex items-center gap-2"><Plus className="w-5 h-5"/> Add new video</h3>
              <div><label className="label">Video title</label>
                <input required value={v.title} onChange={e=>setV({...v, title:e.target.value})} className="input" placeholder="Studio session: ..."/></div>
              <div><label className="label">Duration</label>
                <input value={v.duration} onChange={e=>setV({...v, duration:e.target.value})} className="input" placeholder="12:34"/></div>
              <div><label className="label">Thumbnail URL (optional)</label>
                <input value={v.thumbnail} onChange={e=>setV({...v, thumbnail:e.target.value})} className="input" placeholder="https://..."/></div>
              <div>
                <label className="label">Video file</label>
                <div className="input flex items-center justify-center flex-col py-6 cursor-pointer hover:border-brand-400 border-dashed">
                  <UploadIcon className="w-6 h-6 text-white/50 mb-1"/>
                  <p className="text-sm text-white/60">Drop video here or click to upload</p>
                  <p className="text-xs text-white/40 mt-1">MP4 — max 500MB</p>
                </div>
              </div>
              <button disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                {submitting ? 'Uploading…' : 'Publish video'}
              </button>
            </form>
          )}
        </div>

        {/* List */}
        <div className="lg:col-span-3">
          <div className="card">
            <h3 className="font-display font-bold text-lg mb-4">{tab==='beats' ? 'All beats' : 'All videos'}</h3>
            <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
              {tab==='beats' && beats.map(b => (
                <motion.div key={b.id} layout
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-dark-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.cover} alt="" className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{b.title}</p>
                    <p className="text-xs text-white/60">{b.genre} · {b.bpm} BPM · {b.duration}</p>
                  </div>
                  <div className="text-gold-400 font-bold text-sm mr-2">${b.price}</div>
                  <button onClick={()=>removeBeat(b.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </motion.div>
              ))}
              {tab==='videos' && videos.map(vid => (
                <motion.div key={vid.id} layout
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                  <div className="relative w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-dark-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={vid.thumbnail} alt="" className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{vid.title}</p>
                    <p className="text-xs text-white/60">{vid.duration} · {vid.views.toLocaleString()} views</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
