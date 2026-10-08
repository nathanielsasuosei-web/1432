'use client'
import { clsx } from 'clsx'

export default function Equalizer({ playing = false, bars = 7, className = '' }) {
  return (
    <div className={clsx('waveform flex items-end h-6', className, playing ? 'opacity-100' : 'opacity-40')}>
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} className="eq-bar" style={{ animationPlayState: playing ? 'running' : 'paused' }} />
      ))}
    </div>
  )
}
