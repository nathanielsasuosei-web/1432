'use client'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Music, Download, ArrowLeft } from 'lucide-react'

export default function DownloadPage() {
  const { slug } = useParams()
  useEffect(() => {
    // In production this would stream the file. Demo just shows a fake success.
  }, [slug])
  return (
    <section className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center mx-auto mb-6">
        <Download className="w-10 h-10 text-dark-900"/>
      </div>
      <h1 className="font-display font-bold text-3xl">Your download is ready</h1>
      <p className="text-white/60 mt-3">This is a demo environment. In production, the MP3 and WAV files would download here, and have already been emailed to your inbox.</p>
      <div className="card mt-8 text-left">
        <p className="text-xs font-mono text-white/60">package: <span className="text-white">{slug}</span></p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex justify-between"><span>📀 beat.mp3</span><span className="text-white/50">320kbps</span></li>
          <li className="flex justify-between"><span>🎚 beat.wav</span><span className="text-white/50">24-bit stems</span></li>
          <li className="flex justify-between"><span>📄 license.pdf</span><span className="text-white/50">Personal use</span></li>
        </ul>
        <button className="btn-primary w-full mt-4"><Download className="w-4 h-4"/> Download .zip</button>
      </div>
      <Link href="/beats" className="inline-flex items-center gap-2 mt-6 text-white/60 hover:text-white text-sm">
        <ArrowLeft className="w-4 h-4"/> Back to beats
      </Link>
    </section>
  )
}
