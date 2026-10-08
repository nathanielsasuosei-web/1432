'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Pause, ShoppingCart, Clock, Disc3 } from 'lucide-react'
import { usePlayer } from '@/lib/CartContext'
import Equalizer from './Equalizer'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { useToast } from './Toast'

export default function BeatCard({ beat, index = 0 }) {
  const { nowPlaying, play, stop } = usePlayer()
  const { user } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const isPlaying = nowPlaying?.id === beat.id

  function togglePlay(e) {
    e.preventDefault(); e.stopPropagation()
    if (isPlaying) stop(); else play(beat)
  }

  function handleBuy(e) {
    e.preventDefault(); e.stopPropagation()
    if (!user) { toast.info('Please log in to purchase beats'); router.push('/login') ; return }
    router.push(`/checkout/${beat.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: .5, delay: index * .05 }}
    >
      <Link href={`/checkout/${beat.id}`} className="card group block relative overflow-hidden">
        <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-dark-700">
          <Image src={beat.cover} alt={beat.title} fill sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 25vw"
                 className="object-cover group-hover:scale-105 transition-transform duration-700"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
          <button
            onClick={togglePlay}
            className="absolute top-3 right-3 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-brand-500 hover:scale-110 transition-all"
          >
            {isPlaying ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5 ml-0.5"/>}
          </button>
          {isPlaying && (
            <div className="absolute bottom-3 left-3">
              <Equalizer playing={true}/>
            </div>
          )}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur px-2 py-1 rounded-md text-xs">
            <Clock className="w-3 h-3"/> {beat.duration}
          </div>
        </div>

        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-lg truncate group-hover:text-brand-300 transition-colors">{beat.title}</h3>
            <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
              <Disc3 className="w-3 h-3"/>
              <span>{beat.genre}</span>
              <span>·</span>
              <span>{beat.bpm} BPM</span>
              <span>·</span>
              <span>{beat.key}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gold-400 font-bold text-lg">${beat.price}</div>
          </div>
        </div>

        <div className="flex gap-1 mt-3 flex-wrap">
          {beat.tags.slice(0,3).map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>

        <button
          onClick={handleBuy}
          className="mt-4 w-full btn-primary text-sm py-2.5"
        >
          <ShoppingCart className="w-4 h-4"/> Buy now
        </button>
      </Link>
    </motion.div>
  )
}
