'use client'
import { createContext, useContext, useState, useCallback } from 'react'

const CartCtx = createContext(null)

export function CartProvider({ children }) {
  const [nowPlaying, setNowPlaying] = useState(null) // beat

  const play = useCallback((beat) => setNowPlaying(beat), [])
  const stop = useCallback(() => setNowPlaying(null), [])

  return (
    <CartCtx.Provider value={{ nowPlaying, play, stop }}>
      {children}
    </CartCtx.Provider>
  )
}

export function usePlayer() {
  return useContext(CartCtx)
}
