import { useState } from 'react'
import type { ConceptSection } from '../types'
import { ConceptIndex } from './ConceptIndex'
import { ConceptCardView } from './ConceptCardView'

export function ConceptSectionView({ section }: { section: ConceptSection }) {
  const [essentialsOnly, setEssentialsOnly] = useState(true)
  const byId = new Map(section.concepts.map((c) => [c.id, c]))
  const concepts = essentialsOnly
    ? section.concepts.filter((concept) => (concept.importance ?? 'useful') !== 'deep-dive')
    : section.concepts

  return (
    <div>
      {section.intro && <p className="mb-6 max-w-[65ch] text-sm leading-relaxed text-ink-muted">{section.intro}</p>}

      <div className="mb-5 flex items-center gap-1 rounded-md border border-border bg-surface p-1 sm:w-fit">
        <button
          onClick={() => setEssentialsOnly(true)}
          aria-pressed={essentialsOnly}
          className={`min-h-10 rounded px-3 font-mono text-xs ${essentialsOnly ? 'bg-accent-soft text-accent' : 'text-ink-muted hover:text-ink'}`}
        >
          Interview essentials
        </button>
        <button
          onClick={() => setEssentialsOnly(false)}
          aria-pressed={!essentialsOnly}
          className={`min-h-10 rounded px-3 font-mono text-xs ${!essentialsOnly ? 'bg-accent-soft text-accent' : 'text-ink-muted hover:text-ink'}`}
        >
          All concepts
        </button>
      </div>

      <ConceptIndex concepts={concepts} />

      <div>
        {concepts.map((concept) => (
          <ConceptCardView
            key={concept.id}
            concept={concept}
            related={concept.related?.map((id) => ({ id, title: byId.get(id)?.title ?? id }))}
          />
        ))}
      </div>
    </div>
  )
}
