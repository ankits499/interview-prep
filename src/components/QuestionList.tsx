import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Question } from '../types'
import { useProgress } from '../hooks/useProgress'
import { orderQuestions, readQuestionViewState, writeQuestionViewState } from '../lib/questionOrdering'
import { FilterBar } from './FilterBar'
import { QuestionListItem } from './QuestionListItem'

export function QuestionList({ questions }: { questions: Question[] }) {
  const { getStatus } = useProgress()
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => readQuestionViewState(searchParams), [searchParams])
  const canonicalParams = useMemo(() => writeQuestionViewState(filters, true), [filters])

  useEffect(() => {
    if (searchParams.toString() !== canonicalParams.toString()) setSearchParams(canonicalParams, { replace: true })
  }, [canonicalParams, searchParams, setSearchParams])

  const filtered = useMemo(() => orderQuestions(questions, filters), [questions, filters])
  const questionSearch = canonicalParams.toString()

  return (
    <div>
      <FilterBar filters={filters} onChange={(next) => setSearchParams(writeQuestionViewState(next, true), { replace: true })} />
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-muted">No questions match these filters.</p>
      ) : (
        filtered.map((q) => <QuestionListItem key={q.id} question={q} status={getStatus(q.id)} search={questionSearch} />)
      )}
    </div>
  )
}
