'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { useToast } from '@/components/Toast'
import { Mail, Lock, LogIn } from 'lucide-react'

export default function LoginForm() {
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
  )
}
