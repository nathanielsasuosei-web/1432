'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const ToastCtx = createContext(null)

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = useCallback((msg, type = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])
  const remove = (id) => setToasts(t => t.filter(x => x.id !== id))
  const api = {
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error'),
    info: (m) => push(m, 'info'),
  }
  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] space-y-2 w-80">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: .95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: .95 }}
              className={
                "glass rounded-xl p-4 flex items-start gap-3 shadow-2xl " +
                (t.type === 'success' ? "border-emerald-400/40" :
                 t.type === 'error'   ? "border-red-400/40" : "border-white/20")
              }
            >
              {t.type === 'success' && <CheckCircle2 className="text-emerald-400 w-5 h-5 mt-0.5" />}
              {t.type === 'error' && <XCircle className="text-red-400 w-5 h-5 mt-0.5" />}
              {t.type === 'info' && <Info className="text-brand-400 w-5 h-5 mt-0.5" />}
              <p className="text-sm flex-1">{t.msg}</p>
              <button onClick={() => remove(t.id)} className="text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}
