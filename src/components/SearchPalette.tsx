import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import type { Question, TopicMeta } from '../types'
import { TOPICS } from '../content'
import { getSubtopicsByCategory } from '../content/subtopics'
import { useSiteSearch, type SubtopicResult } from '../hooks/useSearch'
import { groupBy } from '../lib/groupBy'
import { DifficultyBadge } from './Badges'

const CAPS = {
  page: { topics: Infinity, subtopics: Infinity, questions: 20 },
  palette: { topics: 3, subtopics: 5, questions: 5 },
}

function SectionHeader({ label }: { label: string }) {
  return <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-ink-muted">{label}</p>
}

export function SearchPalette({ onClose, variant = 'page' }: { onClose?: () => void; variant?: 'page' | 'palette' }) {
  const [query, setQuery] = useState('')
  const results = useSiteSearch(query)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const caps = CAPS[variant]
  const isEmpty = !query.trim()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const goTopic = (topicId: string) => {
    navigate(`/topic/${topicId}`)
    onClose?.()
  }
  const goSubtopic = (topicId: string, subtopicId: string) => {
    navigate(`/topic/${topicId}/subtopic/${subtopicId}`)
    onClose?.()
  }
  const goQuestion = (topicId: string, questionId: string) => {
    navigate(`/topic/${topicId}/question/${questionId}`)
    onClose?.()
  }

  const defaultTopics: TopicMeta[] = TOPICS
  const defaultSubtopics: SubtopicResult[] = useMemo(
    () => (defaultTopics[0] ? getSubtopicsByCategory(defaultTopics[0].id).flatMap((g) => g.items.map((s) => ({ ...s, topicId: defaultTopics[0].id }))) : []),
    [defaultTopics],
  )

  const shownTopics = isEmpty ? defaultTopics : results.topics
  const shownTopicsCapped = shownTopics.slice(0, caps.topics)

  const shownSubtopics: SubtopicResult[] = (isEmpty ? defaultSubtopics : results.subtopics).slice(0, caps.subtopics)
  const subtopicGroups = groupBy(shownSubtopics, (s) => s.category)

  const shownQuestions: Question[] = isEmpty ? [] : results.questions.slice(0, caps.questions)

  const noMatches = !isEmpty && shownTopicsCapped.length === 0 && shownSubtopics.length === 0 && shownQuestions.length === 0

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2">
        <Search size={16} className="text-ink-muted" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, subtopics, questions…"
          autoComplete="off"
          className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
        />
        {onClose && (
          <button onClick={onClose} aria-label="Close search" className="text-ink-muted hover:text-ink">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="mt-3 max-h-[70vh] space-y-5 overflow-y-auto">
        {noMatches && <p className="py-6 text-center text-sm text-ink-muted">No matches for “{query}”.</p>}

        {shownTopicsCapped.length > 0 && (
          <div>
            <SectionHeader label="Topics" />
            {shownTopicsCapped.map((t) => (
              <button
                key={t.id}
                onClick={() => goTopic(t.id)}
                className="flex w-full items-center gap-3 border-b border-border py-3 text-left transition-colors hover:bg-accent-soft/40"
              >
                <span className="flex-1 text-sm text-ink">{t.label}</span>
                <span className="text-xs text-ink-muted">{t.description}</span>
              </button>
            ))}
          </div>
        )}

        {shownSubtopics.length > 0 && (
          <div>
            <SectionHeader label="Sub Topics" />
            {subtopicGroups.map(({ key, items }) => (
              <div key={key} className="mb-2">
                <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-ink-muted/70">{key}</p>
                {items.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => goSubtopic(s.topicId, s.id)}
                    className="flex w-full items-center gap-3 border-b border-border py-3 text-left transition-colors hover:bg-accent-soft/40"
                  >
                    <span className="flex-1 text-sm text-ink">{s.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {(isEmpty || shownQuestions.length > 0) && (
          <div>
            <SectionHeader label="Questions" />
            {isEmpty && <p className="py-2 text-sm text-ink-muted">Type to search questions…</p>}
            {shownQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => goQuestion(q.topic, q.id)}
                className="flex w-full items-center gap-3 border-b border-border py-3 text-left transition-colors hover:bg-accent-soft/40"
              >
                <span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">{q.topic}</span>
                <span className="flex-1 text-sm text-ink">{q.question}</span>
                <DifficultyBadge value={q.difficulty} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
