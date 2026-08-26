import type { Difficulty, Seniority } from '../types'

const difficultyColor: Record<Difficulty, string> = {
  Basic: 'text-ink-muted border-border',
  Intermediate: 'text-accent border-accent/40',
  Advanced: 'text-accent border-accent/60',
  Expert: 'text-accent border-accent bg-accent-soft',
}

export function DifficultyBadge({ value }: { value: Difficulty }) {
  return (
    <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${difficultyColor[value]}`}>
      {value}
    </span>
  )
}

export function SeniorityBadge({ value }: { value: Seniority }) {
  return (
    <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-ink-muted">
      {value}
    </span>
  )
}
