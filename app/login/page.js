'use client'
import Link from 'next/link'
import { Suspense } from 'react'
import { Music } from 'lucide-react'
import { motion } from 'framer-motion'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative">
      <motion.div
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        className="absolute -top-20 right-10 w-72 h-72 rounded-full bg-brand-600/20 blur-3xl"
      />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center">
              <Music className="w-5 h-5 text-dark-900"/>
            </div>
            <span className="font-display font-bold text-2xl">BeatForge</span>
          </Link>
        </div>

        {/* LoginForm reads useSearchParams(), which must stay inside a Suspense
            boundary — otherwise Next.js bails out of CSR and can't prerender /login. */}
        <Suspense fallback={<div className="card h-[268px] animate-pulse"/>}>
          <LoginForm/>
        </Suspense>

        <div className="mt-6 p-4 rounded-xl glass text-xs text-white/60">
          <strong className="text-white/80">Demo admin:</strong> admin@beatforge.com / admin123
        </div>
      </div>
    </section>
  )
}
