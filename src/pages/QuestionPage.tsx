import { useCallback, useEffect, useMemo } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getQuestionById, getQuestionsForSubtopic, getTopicMeta } from '../content'
import { getSubtopicMeta } from '../content/subtopics'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { QuestionDetail } from '../components/QuestionDetail'
import { orderQuestions, readQuestionViewState, writeQuestionViewState } from '../lib/questionOrdering'

export function QuestionPage() {
  const { topicId = '', questionId = '' } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const topic = getTopicMeta(topicId)
  const question = getQuestionById(questionId)
  const subtopicId = question?.subtopic ?? ''
  const subtopic = getSubtopicMeta(topicId, subtopicId)
  const allQuestions = getQuestionsForSubtopic(topicId, subtopicId)
  const view = useMemo(() => readQuestionViewState(searchParams), [searchParams])
  const questions = useMemo(() => orderQuestions(allQuestions, view), [allQuestions, view])
  const index = questions.findIndex((q) => q.id === questionId)
  const canonicalParams = useMemo(() => writeQuestionViewState(view, true), [view])
  const canonicalSearch = canonicalParams.toString()

  const goTo = useCallback((i: number) => {
    const target = questions[i]
    if (target) navigate({ pathname: `/topic/${topicId}/question/${target.id}`, search: `?${canonicalSearch}` })
  }, [canonicalSearch, navigate, questions, topicId])

  useEffect(() => {
    if (index === -1 && question) {
      const relaxed = writeQuestionViewState({ ...view, difficulty: 'All', seniority: 'All' }, true)
      setSearchParams(relaxed, { replace: true })
      return
    }
    if (searchParams.toString() !== canonicalSearch) setSearchParams(canonicalParams, { replace: true })
  }, [canonicalParams, canonicalSearch, index, question, searchParams, setSearchParams, view])

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'j' || e.key === 'n') goTo(index + 1)
      if (e.key === 'k' || e.key === 'p') goTo(index - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goTo, index])

  if (!topic || !question) return <Navigate to="/" replace />

  return (
    <div>
      <Breadcrumbs
        crumbs={[
          { label: 'Home', to: '/' },
          { label: topic.label, to: `/topic/${topicId}` },
          ...(subtopic ? [{ label: subtopic.label, to: { pathname: `/topic/${topicId}/subtopic/${subtopicId}`, search: `?${canonicalSearch}` } }] : []),
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
