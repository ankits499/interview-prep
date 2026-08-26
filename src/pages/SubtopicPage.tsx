import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { getTopicMeta, getConceptsForSubtopic, getQuestionsForSubtopic } from '../content'
import { getSubtopicsForTopic } from '../content/subtopics'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { SubtopicTabs } from '../components/SubtopicTabs'
import { ConceptSectionView } from '../components/ConceptSectionView'
import { QuestionList } from '../components/QuestionList'

export function SubtopicPage() {
  const { topicId = '', subtopicId = '' } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'concepts' | 'qna'>('concepts')

  const topic = getTopicMeta(topicId)
  const subtopics = getSubtopicsForTopic(topicId)
  const index = subtopics.findIndex((s) => s.id === subtopicId)
  const subtopic = subtopics[index]

  if (!topic || !subtopic) return <Navigate to={`/topic/${topicId}`} replace />

  const concepts = getConceptsForSubtopic(topicId, subtopicId)
  const questions = getQuestionsForSubtopic(topicId, subtopicId)

  const goTo = (i: number) => {
    const target = subtopics[i]
    if (target) navigate(`/topic/${topicId}/subtopic/${target.id}`)
  }

  return (
    <div>
      <Breadcrumbs
        crumbs={[
          { label: 'Home', to: '/' },
          { label: topic.label, to: `/topic/${topicId}` },
          { label: subtopic.label },
        ]}
      />
      <h1 className="mb-5 text-lg font-semibold text-ink">{subtopic.label}</h1>

      <SubtopicTabs active={tab} onChange={setTab} questionCount={questions.length} />

      <div className="mt-6">
        {tab === 'concepts' ? (
          concepts.length === 0 ? (
            <div className="max-w-[70ch]">
              <p className="text-sm text-ink-muted">
                No study material written for this subtopic yet. Ask to add it and it will show up here — see{' '}
                <Link to="/" className="underline hover:text-accent">
                  CONTENT.md
                </Link>{' '}
                for the workflow.
              </p>
            </div>
          ) : (
            concepts.map((section) => <ConceptSectionView key={section.id} section={section} />)
          )
        ) : questions.length === 0 ? (
          <p className="py-8 text-sm text-ink-muted">No questions written for this subtopic yet.</p>
        ) : (
          <QuestionList questions={questions} />
        )}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index <= 0}
          className="flex items-center gap-1 font-mono text-xs text-ink-muted disabled:opacity-30 hover:text-ink"
        >
          <ChevronLeft size={14} /> Prev subtopic
        </button>
        <button
          onClick={() => goTo(index + 1)}
          disabled={index >= subtopics.length - 1}
          className="flex items-center gap-1 font-mono text-xs text-ink-muted disabled:opacity-30 hover:text-ink"
        >
          Next subtopic <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
