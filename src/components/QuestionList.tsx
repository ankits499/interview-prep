import { useMemo, useState } from 'react'
import type { Question } from '../types'
import { useProgress } from '../hooks/useProgress'
import { FilterBar, type Filters } from './FilterBar'
import { QuestionListItem } from './QuestionListItem'

const difficultyOrder = ['Basic', 'Intermediate', 'Advanced', 'Expert']

export function QuestionList({ questions }: { questions: Question[] }) {
  const { getStatus } = useProgress()
  const [filters, setFilters] = useState<Filters>({ difficulty: 'All', seniority: 'All', sortBy: 'default' })

  const filtered = useMemo(() => {
    let list = questions.filter(
      (q) =>
        (filters.difficulty === 'All' || q.difficulty === filters.difficulty) &&
        (filters.seniority === 'All' || q.seniority === filters.seniority),
    )
    if (filters.sortBy === 'alphabetical') {
      list = [...list].sort((a, b) => a.question.localeCompare(b.question))
    } else if (filters.sortBy === 'difficulty') {
      list = [...list].sort((a, b) => difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty))
    }
    return list
  }, [questions, filters])

  return (
    <div>
      <FilterBar filters={filters} onChange={setFilters} />
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-muted">No questions match these filters.</p>
      ) : (
        filtered.map((q) => <QuestionListItem key={q.id} question={q} status={getStatus(q.id)} />)
      )}
    </div>
  )
}
