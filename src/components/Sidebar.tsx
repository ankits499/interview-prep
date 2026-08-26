import { NavLink, useParams } from 'react-router-dom'
import { BookOpen, Search, Bookmark, Home } from 'lucide-react'
import { TOPICS } from '../content'
import { getSubtopicsForTopic } from '../content/subtopics'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
    isActive ? 'bg-accent-soft text-accent font-medium' : 'text-ink-muted hover:bg-accent-soft/50 hover:text-ink'
  }`

const subLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block truncate rounded-md py-1.5 pl-8 pr-3 text-xs transition-colors ${
    isActive ? 'text-accent font-medium' : 'text-ink-muted hover:text-ink'
  }`

export function Sidebar() {
  const { topicId } = useParams()

  return (
    <aside className="hidden md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col md:border-r md:border-border md:bg-surface">
      <div className="px-4 py-5">
        <span className="font-mono text-sm font-semibold tracking-tight text-ink">interview-prep</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-4">
        <NavLink to="/" end className={navLinkClass}>
          <Home size={16} strokeWidth={2} />
          Home
        </NavLink>
        <NavLink to="/search" className={navLinkClass}>
          <Search size={16} strokeWidth={2} />
          Search
        </NavLink>
        <NavLink to="/review" className={navLinkClass}>
          <Bookmark size={16} strokeWidth={2} />
          Review
        </NavLink>

        <div className="pt-4">
          <p className="px-3 pb-1 font-mono text-xs uppercase tracking-wide text-ink-muted">Topics</p>
          {TOPICS.map((topic) => {
            const subtopics = getSubtopicsForTopic(topic.id)
            const isActiveTopic = topic.id === topicId
            return (
              <div key={topic.id}>
                <NavLink to={`/topic/${topic.id}`} className={navLinkClass}>
                  <BookOpen size={16} strokeWidth={2} />
                  {topic.label}
                </NavLink>
                {isActiveTopic && subtopics.length > 0 && (
                  <div className="mt-1 space-y-0.5">
                    {subtopics.map((s) => (
                      <NavLink key={s.id} to={`/topic/${topic.id}/subtopic/${s.id}`} className={subLinkClass}>
                        {s.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
