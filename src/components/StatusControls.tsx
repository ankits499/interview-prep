import { Check, AlertCircle, Bookmark } from 'lucide-react'
import type { ProgressStatus } from '../types'

interface Props {
  status: ProgressStatus
  onToggle: (status: ProgressStatus) => void
  size?: 'sm' | 'md'
}

const options: { status: ProgressStatus; label: string; icon: typeof Check }[] = [
  { status: 'mastered', label: 'Mastered', icon: Check },
  { status: 'needs-review', label: 'Needs review', icon: AlertCircle },
  { status: 'bookmarked', label: 'Bookmarked', icon: Bookmark },
]

export function StatusControls({ status, onToggle, size = 'md' }: Props) {
  const iconSize = size === 'sm' ? 13 : 15
  return (
    <div className="flex items-center gap-1.5">
      {options.map(({ status: s, label, icon: Icon }) => {
        const active = status === s
        return (
          <button
            key={s}
            onClick={() => onToggle(s)}
            aria-pressed={active}
            aria-label={label}
            title={label}
            className={`flex min-h-10 items-center gap-1 rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors ${
              active
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-border text-ink-muted hover:text-ink'
            }`}
          >
            <Icon size={iconSize} strokeWidth={2} />
            {size === 'md' && <span>[{s}]</span>}
          </button>
        )
      })}
    </div>
  )
}

export function StatusDot({ status }: { status: ProgressStatus }) {
  const color =
    status === 'mastered'
      ? 'bg-accent'
      : status === 'needs-review'
        ? 'bg-amber-500'
        : status === 'bookmarked'
          ? 'bg-sky-500'
          : 'bg-border'
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${color}`} aria-hidden />
}
