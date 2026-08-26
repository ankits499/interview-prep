import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Question } from '../types'
import { useProgress } from '../hooks/useProgress'
import { DifficultyBadge, SeniorityBadge } from './Badges'
import { StatusControls } from './StatusControls'
import { Disclosure } from './Disclosure'
import { CodeBlock } from './CodeBlock'

interface Props {
  question: Question
  onPrev?: () => void
  onNext?: () => void
}

export function QuestionDetail({ question, onPrev, onNext }: Props) {
  const { getStatus, toggleStatus } = useProgress()
  const status = getStatus(question.id)

  return (
    <div className="max-w-[70ch]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <DifficultyBadge value={question.difficulty} />
        <SeniorityBadge value={question.seniority} />
        {question.subtopic && (
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">{question.subtopic}</span>
        )}
      </div>

      <h1 className="text-lg font-semibold leading-snug text-ink md:text-xl">{question.question}</h1>

      <div className="mt-4 rounded-md border-l-2 border-accent bg-accent-soft px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-wide text-accent">Short answer</p>
        <p className="mt-1 text-sm leading-relaxed text-ink">{question.shortAnswer}</p>
      </div>

      <div className="mt-4">
        {question.keyPoints && question.keyPoints.length > 0 && (
          <Disclosure label="Key points">
            <ul className="list-disc space-y-1 pl-5">
              {question.keyPoints.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </Disclosure>
        )}
        {question.detailedAnswer && <Disclosure label="Detailed answer">{question.detailedAnswer}</Disclosure>}
        {question.seniorFollowUps && question.seniorFollowUps.length > 0 && (
          <Disclosure label="Senior follow-ups">
            <ul className="list-disc space-y-1 pl-5">
              {question.seniorFollowUps.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </Disclosure>
        )}
        {question.example && (
          <Disclosure label="Example">
            {question.example.includes('\n') || question.example.length > 60 ? (
              <CodeBlock language="text" code={question.example} />
            ) : (
              question.example
            )}
          </Disclosure>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <StatusControls status={status} onToggle={(s) => toggleStatus(question.id, s)} />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={!onPrev}
          className="flex items-center gap-1 font-mono text-xs text-ink-muted disabled:opacity-30 hover:text-ink"
        >
          <ChevronLeft size={14} /> Prev
        </button>
        <button
          onClick={onNext}
          disabled={!onNext}
          className="flex items-center gap-1 font-mono text-xs text-ink-muted disabled:opacity-30 hover:text-ink"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>

      {question.source && (
        <p className="mt-6 font-mono text-[10px] text-ink-muted">
          Source:{' '}
          <a href={question.source.url} target="_blank" rel="noreferrer" className="hover:text-accent">
            {question.source.name}
          </a>
        </p>
      )}
    </div>
  )
}
