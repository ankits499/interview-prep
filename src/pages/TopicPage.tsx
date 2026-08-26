import { Navigate, useParams } from 'react-router-dom'
import { getTopicMeta, getQuestionsForTopic, getConceptsForTopic } from '../content'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { SubtopicList } from '../components/SubtopicList'

export function TopicPage() {
  const { topicId = '' } = useParams()
  const topic = getTopicMeta(topicId)

  if (!topic) return <Navigate to="/" replace />

  const questions = getQuestionsForTopic(topicId)
  const concepts = getConceptsForTopic(topicId)

  return (
    <div>
      <Breadcrumbs crumbs={[{ label: 'Home', to: '/' }, { label: topic.label }]} />
      <h1 className="mb-1 text-lg font-semibold text-ink">{topic.label}</h1>
      <p className="mb-6 text-sm text-ink-muted">{topic.description}</p>

      <SubtopicList topicId={topicId} concepts={concepts} questions={questions} />
    </div>
  )
}
