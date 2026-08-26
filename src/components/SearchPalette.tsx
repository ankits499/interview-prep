import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { ALL_QUESTIONS } from '../content'
import { useSearch } from '../hooks/useSearch'
import { DifficultyBadge } from './Badges'

export function SearchPalette({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState('')
  const results = useSearch(ALL_QUESTIONS, query)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const go = (topicId: string, questionId: string) => {
    navigate(`/topic/${topicId}/question/${questionId}`)
    onClose?.()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2">
        <Search size={16} className="text-ink-muted" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions, topics, tags…"
          className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
        />
        {onClose && (
          <button onClick={onClose} aria-label="Close search" className="text-ink-muted hover:text-ink">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="mt-3">
        {query.trim() && results.length === 0 && (
          <p className="py-6 text-center text-sm text-ink-muted">No matches for “{query}”.</p>
        )}
        {results.map((q) => (
          <button
            key={q.id}
            onClick={() => go(q.topic, q.id)}
            className="flex w-full items-center gap-3 border-b border-border py-3 text-left transition-colors hover:bg-accent-soft/40"
          >
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">{q.topic}</span>
            <span className="flex-1 text-sm text-ink">{q.question}</span>
            <DifficultyBadge value={q.difficulty} />
          </button>
        ))}
      </div>
    </div>
  )
}
