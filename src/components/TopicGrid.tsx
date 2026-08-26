import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { TOPICS } from '../content'
import { getSubtopicsForTopic } from '../content/subtopics'

export function TopicGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {TOPICS.map((topic) => (
        <Link
          key={topic.id}
          to={`/topic/${topic.id}`}
          className="group flex flex-col justify-between rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent"
        >
          <div>
            <h3 className="font-mono text-sm font-semibold text-ink">{topic.label}</h3>
            <p className="mt-2 text-sm text-ink-muted">{topic.description}</p>
          </div>
          <div className="mt-4 flex items-center justify-between font-mono text-xs text-ink-muted">
            <span>
              {getSubtopicsForTopic(topic.id).length} subtopics · {topic.questionCount} Q&amp;A
            </span>
            <ArrowRight size={14} className="text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
          </div>
        </Link>
      ))}
    </div>
  )
}
