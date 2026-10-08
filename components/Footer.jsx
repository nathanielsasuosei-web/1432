import Link from 'next/link'
import { Music, Instagram, Youtube, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center">
              <Music className="w-5 h-5 text-dark-900" />
            </div>
            <span className="font-display font-bold text-xl">
              Beat<span className="bg-gradient-to-r from-brand-400 to-gold-400 bg-clip-text text-transparent">Forge</span>
            </span>
          </div>
          <p className="text-white/60 text-sm max-w-sm">
            Premium beats crafted by DJ Pulse. Pay with Mobile Money or Bank Transfer.
            Instant delivery straight to your inbox.
          </p>
          <div className="flex gap-3 mt-4">
            {[Instagram, Youtube, Twitter, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-white/80">Explore</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/beats" className="hover:text-white">Beats</Link></li>
            <li><Link href="/videos" className="hover:text-white">Videos</Link></li>
            <li><Link href="/#genres" className="hover:text-white">Genres</Link></li>
            <li><Link href="/#about" className="hover:text-white">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-white/80">Support</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><a href="#" className="hover:text-white">How to buy</a></li>
            <li><a href="#" className="hover:text-white">Licensing</a></li>
            <li><a href="#" className="hover:text-white">Payment methods</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-white/50">
          <p>© {new Date().getFullYear()} BeatForge. All rights reserved.</p>
          <p>Made with 🎧 by DJ Pulse</p>
        </div>
      </div>
    </footer>
  )
}
