import type { ConceptSection } from '../types'
import { ConceptIndex } from './ConceptIndex'
import { ConceptCardView } from './ConceptCardView'

export function ConceptSectionView({ section }: { section: ConceptSection }) {
  const byId = new Map(section.concepts.map((c) => [c.id, c]))

  return (
    <div>
      {section.intro && <p className="mb-6 max-w-[65ch] text-sm leading-relaxed text-ink-muted">{section.intro}</p>}

      <ConceptIndex concepts={section.concepts} />

      <div>
        {section.concepts.map((concept) => (
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
