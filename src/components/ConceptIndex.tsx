import type { ConceptCard } from '../types'
import { useConceptProgress } from '../hooks/useConceptProgress'
import { scrollToId } from '../lib/scrollToId'

function groupConcepts(concepts: ConceptCard[]) {
  const order: string[] = []
  const map = new Map<string, ConceptCard[]>()
  for (const c of concepts) {
    if (!map.has(c.group)) {
      map.set(c.group, [])
      order.push(c.group)
    }
    map.get(c.group)!.push(c)
  }
  return order.map((group) => ({ group, items: map.get(group)! }))
}

export function ConceptIndex({ concepts }: { concepts: ConceptCard[] }) {
  const { isReviewed } = useConceptProgress()
  const groups = groupConcepts(concepts)
  const reviewedCount = concepts.filter((c) => isReviewed(c.id)).length

  return (
    <nav className="mb-8 max-w-[420px] rounded-md border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">On this page</span>
        <span className="font-mono text-[10px] text-ink-muted">
          {reviewedCount}/{concepts.length} reviewed
        </span>
      </div>
      <div className="space-y-4">
        {groups.map((g) => (
          <div key={g.group}>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-ink-muted">{g.group}</p>
            <ul>
              {g.items.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => scrollToId(c.id)}
                    className="flex w-full items-center justify-between gap-3 rounded px-1 py-1 text-left text-sm text-ink hover:bg-accent-soft/50 hover:text-accent"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span
                        className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${isReviewed(c.id) ? 'bg-accent' : 'bg-border'}`}
                        aria-hidden
                      />
                      <span className="truncate">{c.title}</span>
                    </span>
                    {c.readMinutes && (
                      <span className="shrink-0 font-mono text-[11px] text-ink-muted">{c.readMinutes} min</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}
