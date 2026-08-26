import { TopicGrid } from '../components/TopicGrid'

export function HomePage() {
  return (
    <div>
      <h1 className="mb-1 text-lg font-semibold text-ink">Topics</h1>
      <p className="mb-6 text-sm text-ink-muted">Pick a topic to revise concepts or drill through Q&amp;A.</p>
      <TopicGrid />
    </div>
  )
}
