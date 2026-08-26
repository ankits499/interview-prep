import { Link } from 'react-router-dom'
import { ChevronRight, CheckCircle2 } from 'lucide-react'
import type { ConceptSection, Question } from '../types'
import { getSubtopicsForTopic } from '../content/subtopics'
import { useProgress } from '../hooks/useProgress'

export function SubtopicList({
  topicId,
  concepts,
  questions,
}: {
  topicId: string
  concepts: ConceptSection[]
  questions: Question[]
}) {
  const subtopics = getSubtopicsForTopic(topicId)
  const { progress } = useProgress()

  return (
    <div className="grid gap-2 lg:grid-cols-2">
      {subtopics.map((s, i) => {
        const hasConcept = concepts.some((c) => c.subtopic === s.id)
        const subtopicQuestions = questions.filter((q) => q.subtopic === s.id)
        const mastered = subtopicQuestions.filter((q) => progress[q.id] === 'mastered').length

        return (
          <Link
            key={s.id}
            to={`/topic/${topicId}/subtopic/${s.id}`}
            className="flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3 transition-colors hover:border-accent"
          >
            <span className="w-7 shrink-0 font-mono text-xs text-ink-muted">{String(i + 1).padStart(2, '0')}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-ink">{s.label}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-ink-muted">
                {hasConcept ? 'Study material' : 'Coming soon'}
                {subtopicQuestions.length > 0 && ` · ${subtopicQuestions.length} Q&A`}
              </p>
            </div>
            {mastered > 0 && (
              <span className="flex shrink-0 items-center gap-1 font-mono text-[10px] text-accent">
                <CheckCircle2 size={12} />
                {mastered}/{subtopicQuestions.length}
              </span>
            )}
            <ChevronRight size={14} className="shrink-0 text-ink-muted" />
          </Link>
        )
      })}
    </div>
  )
}
