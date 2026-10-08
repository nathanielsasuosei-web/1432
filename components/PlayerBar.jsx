'use client'
import { usePlayer } from '@/lib/CartContext'
import { AnimatePresence, motion } from 'framer-motion'
import Equalizer from './Equalizer'
import { Pause, SkipForward, Volume2, X } from 'lucide-react'
import Image from 'next/image'

export default function PlayerBar() {
  const { nowPlaying, stop } = usePlayer()
  return (
    <AnimatePresence>
      {nowPlaying && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/10 px-4 py-3"
        >
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={nowPlaying.cover} alt={nowPlaying.title} fill sizes="48px" className="object-cover"/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{nowPlaying.title}</p>
              <p className="text-xs text-white/60 truncate">{nowPlaying.producer} · {nowPlaying.genre}</p>
            </div>
            <div className="flex items-center gap-3">
              <Equalizer playing={true}/>
              <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-full bg-white/5">
                <button className="text-white/80 hover:text-white"><Pause className="w-4 h-4"/></button>
                <div className="w-40 h-1 rounded-full bg-white/10 overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-brand-400 to-gold-400"
                    initial={{ width: '0%' }}
                    animate={{ width: '70%' }}
                    transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}/>
                </div>
                <button className="text-white/80 hover:text-white"><SkipForward className="w-4 h-4"/></button>
                <Volume2 className="w-4 h-4 text-white/60"/>
              </div>
              <button onClick={stop} className="p-2 rounded-full hover:bg-white/10 text-white/60">
                <X className="w-5 h-5"/>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
