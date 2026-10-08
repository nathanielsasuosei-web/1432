'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { motion } from 'framer-motion'
import { Music, Headphones, Video, User, LogOut, LayoutDashboard, Upload, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, loading } = useAuth()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/', label: 'Home' },
    { href: '/beats', label: 'Beats', icon: Headphones },
    { href: '/videos', label: 'Videos', icon: Video },
  ]

  async function handleLogout() {
    await logout()
    router.push('/')
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 5 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center shadow-lg shadow-brand-500/30"
          >
            <Music className="w-5 h-5 text-dark-900" />
          </motion.div>
          <span className="font-display font-bold text-xl tracking-tight">
            Beat<span className="bg-gradient-to-r from-brand-400 to-gold-400 bg-clip-text text-transparent">Forge</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(l => {
            const active = pathname === l.href
            const Icon = l.icon
            return (
              <Link key={l.href} href={l.href}
                className={"relative px-4 py-2 rounded-full text-sm font-medium transition-colors " +
                  (active ? "text-white" : "text-white/70 hover:text-white")}>
                {active && (
                  <motion.span layoutId="nav-pill"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: 'spring', bounce: .2, duration: .5 }} />
                )}
                <span className="relative flex items-center gap-1.5">
                  {Icon && <Icon className="w-4 h-4" />}
                  {l.label}
                </span>
              </Link>
            )
          })}
          {user?.role === 'admin' && (
            <Link href="/admin"
              className={"relative px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 " +
                (pathname.startsWith('/admin') ? "text-white" : "text-gold-400 hover:text-gold-300")}>
              {pathname.startsWith('/admin') && (
                <motion.span layoutId="nav-pill" className="absolute inset-0 bg-gold-500/15 rounded-full" transition={{ type: 'spring', bounce: .2, duration: .5 }}/>
              )}
              <Upload className="w-4 h-4 relative" /><span className="relative">Upload</span>
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {loading ? null : user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="btn-outline py-2 px-4 text-sm">
                <LayoutDashboard className="w-4 h-4"/> Dashboard
              </Link>
              <button onClick={handleLogout} className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white" title="Logout">
                <LogOut className="w-5 h-5"/>
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center text-sm font-bold text-dark-900">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white">Log in</Link>
              <Link href="/signup" className="btn-primary py-2 px-5 text-sm">
                <User className="w-4 h-4"/> Sign up free
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
        </button>
      </nav>

      {open && (
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          className="md:hidden px-4 pb-4 space-y-2">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block px-4 py-2 rounded-lg hover:bg-white/10 text-white/80">
              {l.label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link href="/admin" onClick={() => setOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-white/10 text-gold-400">Upload (Admin)</Link>
          )}
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-white/10">Dashboard</Link>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 rounded-lg hover:bg-white/10 text-red-400">Log out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-white/10">Log in</Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="block btn-primary text-center mt-2">Sign up free</Link>
            </>
          )}
        </motion.div>
      )}
    </header>
  )
}
