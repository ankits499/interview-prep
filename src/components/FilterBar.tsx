import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import type { Difficulty, Seniority } from '../types'
import type { QuestionViewState } from '../lib/questionOrdering'

const difficulties: (Difficulty | 'All')[] = ['All', 'Basic', 'Intermediate', 'Advanced', 'Expert']
const seniorities: (Seniority | 'All')[] = ['All', 'Mid', 'Senior', 'Lead', 'Staff']

interface Props {
  filters: QuestionViewState
  onChange: (filters: QuestionViewState) => void
}

export function FilterBar({ filters, onChange }: Props) {
  const [open, setOpen] = useState(false)

  const controls = (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={filters.difficulty}
        onChange={(e) => onChange({ ...filters, difficulty: e.target.value as QuestionViewState['difficulty'] })}
        className="min-h-11 rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs text-ink"
      >
        {difficulties.map((d) => (
          <option key={d} value={d}>
            {d === 'All' ? 'All difficulties' : d}
          </option>
        ))}
      </select>
      <select
        value={filters.seniority}
        onChange={(e) => onChange({ ...filters, seniority: e.target.value as QuestionViewState['seniority'] })}
        className="min-h-11 rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs text-ink"
      >
        {seniorities.map((s) => (
          <option key={s} value={s}>
            {s === 'All' ? 'All seniority' : s}
          </option>
        ))}
      </select>
      <select
        value={filters.sortBy}
        onChange={(e) => onChange({ ...filters, sortBy: e.target.value as QuestionViewState['sortBy'] })}
        className="min-h-11 rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs text-ink"
      >
        <option value="default">Default order</option>
        <option value="alphabetical">Alphabetical</option>
        <option value="difficulty">By difficulty</option>
      </select>
    </div>
  )

  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 font-mono text-xs text-ink-muted sm:hidden"
      >
        <SlidersHorizontal size={14} />
        Filters
      </button>
      <div className={`${open ? 'mt-3 block' : 'hidden'} sm:mt-0 sm:block`}>{controls}</div>
    </div>
  )
}
