'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Search, X } from 'lucide-react'

export default function BeatsFilter({ genres, activeGenre, q }) {
  const router = useRouter()
  const params = useSearchParams()
  const [query, setQuery] = useState(q || '')

  function search(e) {
    e.preventDefault()
    const url = new URLSearchParams(params)
    if (query) url.set('q', query); else url.delete('q')
    router.push('/beats?' + url.toString())
  }

  return (
    <div className="space-y-4">
      <form onSubmit={search} className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50"/>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search beats, tags, genres…"
               className="input pl-10 pr-10"/>
        {query && (
          <button type="button" onClick={() => { setQuery(''); router.push('/beats') }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
            <X className="w-4 h-4"/>
          </button>
        )}
      </form>
      <div className="flex flex-wrap gap-2">
        <Link href="/beats"
          className={"px-4 py-1.5 rounded-full text-sm font-medium border transition " +
            (!activeGenre ? "bg-white text-dark-900 border-white" : "border-white/15 text-white/70 hover:text-white hover:border-white/30")}>
          All genres
        </Link>
        {genres.map(g => (
          <Link key={g} href={`/beats?genre=${g}`}
            className={"px-4 py-1.5 rounded-full text-sm font-medium border transition " +
              (activeGenre === g ? "bg-white text-dark-900 border-white" : "border-white/15 text-white/70 hover:text-white hover:border-white/30")}>
            {g}
          </Link>
        ))}
      </div>
    </div>
  )
}
