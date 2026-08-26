import { Check } from 'lucide-react'
import type { ConceptCard } from '../types'
import { useConceptProgress } from '../hooks/useConceptProgress'
import { scrollToId } from '../lib/scrollToId'
import { CodeBlock } from './CodeBlock'
import { MermaidDiagram } from './MermaidDiagram'

export function ConceptCardView({ concept, related }: { concept: ConceptCard; related?: { id: string; title: string }[] }) {
  const { isReviewed, toggleReviewed } = useConceptProgress()
  const reviewed = isReviewed(concept.id)

  return (
    <section id={concept.id} className="scroll-mt-6 border-b border-border py-7 first:pt-0 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold text-ink">{concept.title}</h3>
        <button
          onClick={() => toggleReviewed(concept.id)}
          aria-pressed={reviewed}
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors ${
            reviewed ? 'border-accent bg-accent-soft text-accent' : 'border-border text-ink-muted hover:text-ink'
          }`}
        >
          <Check size={11} strokeWidth={2.5} />
          {reviewed ? 'Reviewed' : 'Mark reviewed'}
        </button>
      </div>

      <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-ink">{concept.definition}</p>

      {concept.whyItMatters && concept.whyItMatters.length > 0 && (
        <div className="mt-4 max-w-[65ch]">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-ink-muted">Why it matters</p>
          <ul className="list-disc space-y-0.5 pl-5 text-sm text-ink-muted">
            {concept.whyItMatters.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {concept.example && (
        <div className="mt-4 max-w-[65ch]">
          <CodeBlock language={concept.example.code.language} code={concept.example.code.code} />
          {concept.example.note && (
            <p className="mt-2 rounded-md border-l-2 border-accent bg-accent-soft px-3 py-2 text-sm text-ink">
              {concept.example.note}
            </p>
          )}
        </div>
      )}

      {concept.diagram && (
        <div className="mt-4">
          <MermaidDiagram code={concept.diagram} />
        </div>
      )}

      {concept.remember && concept.remember.length > 0 && (
        <div className="mt-4 max-w-[65ch]">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-ink-muted">Remember</p>
          <ul className="space-y-1">
            {concept.remember.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink">
                <Check size={14} className="mt-0.5 shrink-0 text-accent" strokeWidth={2.5} />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {concept.interviewAngle && (
        <div className="mt-4 max-w-[65ch] rounded-md border border-border bg-surface p-3">
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-muted">Interview angle</p>
          <p className="text-sm text-ink">
            <span className="font-medium">Q:</span> {concept.interviewAngle.q}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            <span className="font-medium text-ink">A:</span> {concept.interviewAngle.a}
          </p>
        </div>
      )}

      {related && related.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">Related</span>
          {related.map((r) => (
            <button
              key={r.id}
              onClick={() => scrollToId(r.id)}
              className="rounded-full border border-border px-2 py-0.5 text-xs text-ink-muted hover:border-accent hover:text-accent"
            >
              {r.title}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
