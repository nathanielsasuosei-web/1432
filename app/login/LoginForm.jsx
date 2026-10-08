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
  const isAdminLogin = params.get('next') === '/admin'
  const next = params.get('next')
  const safeNext = next?.startsWith('/') && !next.startsWith('//') && !next.includes('\\') ? next : null

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(email, password, isAdminLogin ? 'admin' : undefined)
      toast.success('Welcome back!')
      router.push(safeNext || (user.role === 'admin' ? '/admin' : '/dashboard'))
    } catch (err) {
      toast.error(err.message)
    } finally { setLoading(false) }
  }

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="font-display font-bold text-3xl">{isAdminLogin ? 'Producer / Admin login' : 'Welcome back'}</h1>
        <p className="text-white/60 mt-2 text-sm">
          {isAdminLogin ? 'Sign in with your admin account to upload and manage beats and videos.' : 'Log in to your artist account.'}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4" aria-label="Account login options">
        <Link href="/login" aria-current={!isAdminLogin ? 'page' : undefined}
          className={'text-center rounded-xl px-3 py-3 text-sm ' + (!isAdminLogin ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5')}>Artist login</Link>
        <Link href="/login?next=/admin" aria-current={isAdminLogin ? 'page' : undefined}
          className={'text-center rounded-xl px-3 py-3 text-sm ' + (isAdminLogin ? 'bg-gold-500/15 text-gold-300' : 'text-gold-400 hover:bg-white/5')}>Producer / Admin</Link>
      </div>
      <form onSubmit={onSubmit} className="card space-y-4">
      <div>
        <label htmlFor="login-email" className="label">Email</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"/>
          <input id="login-email" autoComplete="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                 className="input pl-11" placeholder="you@email.com"/>
        </div>
      </div>
      <div>
        <label htmlFor="login-password" className="label">Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"/>
          <input id="login-password" autoComplete="current-password" type="password" required value={password} onChange={e => setPassword(e.target.value)}
                 className="input pl-11" placeholder="••••••••"/>
        </div>
      </div>
      <button disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? 'Signing in…' : <><LogIn className="w-4 h-4"/> Log in</>}
      </button>
      {!isAdminLogin && <div className="text-center text-sm text-white/60">
        Don't have an account? <Link href="/signup" className="text-brand-300 hover:text-brand-200 font-medium">Sign up</Link>
      </div>}
      </form>
    </>
  )
}
