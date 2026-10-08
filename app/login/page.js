'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { useToast } from '@/components/Toast'
import { Mail, Lock, LogIn, Music } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const toast = useToast()

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      router.push(params.get('next') || '/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally { setLoading(false) }
  }

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
          <h1 className="font-display font-bold text-3xl mt-6">Welcome back</h1>
          <p className="text-white/60 mt-2 text-sm">Log in to your artist account.</p>
        </div>

        <form onSubmit={onSubmit} className="card space-y-4">
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"/>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                     className="input pl-11" placeholder="you@email.com"/>
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"/>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                     className="input pl-11" placeholder="••••••••"/>
            </div>
          </div>
          <button disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Signing in…' : <><LogIn className="w-4 h-4"/> Log in</>}
          </button>
          <div className="text-center text-sm text-white/60">
            Don't have an account? <Link href="/signup" className="text-brand-300 hover:text-brand-200 font-medium">Sign up</Link>
          </div>
        </form>

        <div className="mt-6 p-4 rounded-xl glass text-xs text-white/60">
          <strong className="text-white/80">Demo admin:</strong> admin@beatforge.com / admin123
        </div>
      </div>
    </section>
  )
}
