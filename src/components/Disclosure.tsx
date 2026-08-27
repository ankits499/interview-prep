import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export function Disclosure({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border py-3 last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center justify-between text-left font-mono text-xs uppercase tracking-wide text-ink-muted hover:text-ink"
      >
        {label}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="mt-3 text-sm leading-relaxed text-ink">{children}</div>}
    </div>
  )
}
