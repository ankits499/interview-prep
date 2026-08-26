import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getQuestionById, getQuestionsForSubtopic, getTopicMeta } from '../content'
import { getSubtopicMeta } from '../content/subtopics'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { QuestionDetail } from '../components/QuestionDetail'

export function QuestionPage() {
  const { topicId = '', questionId = '' } = useParams()
  const navigate = useNavigate()
  const topic = getTopicMeta(topicId)
  const question = getQuestionById(questionId)
  const subtopicId = question?.subtopic ?? ''
  const subtopic = getSubtopicMeta(topicId, subtopicId)
  const questions = getQuestionsForSubtopic(topicId, subtopicId)
  const index = questions.findIndex((q) => q.id === questionId)

  const goTo = (i: number) => {
    const target = questions[i]
    if (target) navigate(`/topic/${topicId}/question/${target.id}`)
  }

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'j' || e.key === 'n') goTo(index + 1)
      if (e.key === 'k' || e.key === 'p') goTo(index - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  if (!topic || !question) return <Navigate to="/" replace />

  return (
    <div>
      <Breadcrumbs
        crumbs={[
          { label: 'Home', to: '/' },
          { label: topic.label, to: `/topic/${topicId}` },
          ...(subtopic ? [{ label: subtopic.label, to: `/topic/${topicId}/subtopic/${subtopicId}` }] : []),
          { label: `Question ${index + 1}` },
        ]}
      />
      <QuestionDetail
        question={question}
        onPrev={index > 0 ? () => goTo(index - 1) : undefined}
        onNext={index < questions.length - 1 ? () => goTo(index + 1) : undefined}
      />
    </div>
  )
}
