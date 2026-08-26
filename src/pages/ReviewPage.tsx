import { Breadcrumbs } from '../components/Breadcrumbs'
import { QuestionListItem } from '../components/QuestionListItem'
import { ALL_QUESTIONS } from '../content'
import { useProgress } from '../hooks/useProgress'

export function ReviewPage() {
  const { progress, getStatus } = useProgress()
  const flagged = ALL_QUESTIONS.filter((q) => progress[q.id] === 'bookmarked' || progress[q.id] === 'needs-review')

  return (
    <div>
      <Breadcrumbs crumbs={[{ label: 'Home', to: '/' }, { label: 'Review' }]} />
      <h1 className="mb-1 text-lg font-semibold text-ink">Review</h1>
      <p className="mb-5 text-sm text-ink-muted">Bookmarked and needs-review questions across all topics.</p>

      {flagged.length === 0 ? (
        <p className="py-8 text-sm text-ink-muted">
          Nothing flagged yet. Mark a question as bookmarked or needs-review to see it here.
        </p>
      ) : (
        flagged.map((q) => <QuestionListItem key={q.id} question={q} status={getStatus(q.id)} showSubtopic />)
      )}
    </div>
  )
}
