import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { ProgressStatus, Question } from '../types'
import { getSubtopicsForTopic } from '../content/subtopics'
import { DifficultyBadge } from './Badges'
import { StatusDot } from './StatusControls'

export function QuestionListItem({
  question,
  status,
  showSubtopic = false,
}: {
  question: Question
  status: ProgressStatus
  showSubtopic?: boolean
}) {
  const subtopicLabel = showSubtopic
    ? getSubtopicsForTopic(question.topic).find((s) => s.id === question.subtopic)?.label ?? question.subtopic
    : undefined

  return (
    <Link
      to={`/topic/${question.topic}/question/${question.id}`}
      className="flex items-center gap-3 border-b border-border py-3 transition-colors hover:bg-accent-soft/40"
    >
      <StatusDot status={status} />
      <span className="flex-1 min-w-0">
        <span className="block text-sm text-ink">{question.question}</span>
        {subtopicLabel && (
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">{subtopicLabel}</span>
        )}
      </span>
      <DifficultyBadge value={question.difficulty} />
      <ChevronRight size={14} className="text-ink-muted shrink-0" />
    </Link>
  )
}
