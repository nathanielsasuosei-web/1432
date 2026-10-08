'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { useToast } from '@/components/Toast'
import { Mail, Lock, User as UserIcon, UserPlus, Music } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()
  const toast = useToast()

  async function onSubmit(e) {
    e.preventDefault()
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await signup(name, email, password)
      toast.success('Welcome to BeatForge! 🎉')
      router.push('/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally { setLoading(false) }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative">
      <motion.div
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-gold-500/20 blur-3xl"
      />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center">
              <Music className="w-5 h-5 text-dark-900"/>
            </div>
            <span className="font-display font-bold text-2xl">BeatForge</span>
          </Link>
          <h1 className="font-display font-bold text-3xl mt-6">Create artist account</h1>
          <p className="text-white/60 mt-2 text-sm">Start buying beats in less than a minute.</p>
        </div>

        <form onSubmit={onSubmit} className="card space-y-4">
          <div>
            <label className="label">Artist / Stage name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"/>
              <input required value={name} onChange={e => setName(e.target.value)}
                     className="input pl-11" placeholder="e.g. King Flame"/>
            </div>
          </div>
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
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                     className="input pl-11" placeholder="At least 6 characters"/>
            </div>
          </div>
          <button disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Creating account…' : <><UserPlus className="w-4 h-4"/> Create account</>}
          </button>
          <p className="text-[11px] text-white/50 text-center">
            By signing up you agree to our Terms and License policy.
          </p>
          <div className="text-center text-sm text-white/60">
            Already have an account? <Link href="/login" className="text-brand-300 hover:text-brand-200 font-medium">Log in</Link>
          </div>
        </form>
      </div>
    </section>
  )
}
