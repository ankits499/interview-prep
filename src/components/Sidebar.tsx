import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { BookOpen, Bookmark, ChevronDown, ChevronRight, Home, PanelLeftClose, PanelLeftOpen, Search, Settings } from 'lucide-react'
import { TOPICS } from '../content'
import { getSubtopicsByCategory } from '../content/subtopics'

const OPEN_TOPICS_KEY = 'interview-prep-sidebar-topics'

function loadOpenTopics(): string[] {
  try {
    const value = localStorage.getItem(OPEN_TOPICS_KEY)
    const stored = value ? (JSON.parse(value) as string[]) : []
    const activeTopic = window.location.hash.match(/^#\/topic\/([^/]+)/)?.[1]
    return activeTopic && !stored.includes(activeTopic) ? [...stored, activeTopic] : stored
  } catch {
    return []
  }
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-9 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${isActive ? 'bg-accent-soft font-medium text-accent' : 'text-ink-muted hover:bg-accent-soft/50 hover:text-ink'}`

const subLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative block rounded-md py-1.5 pl-7 pr-2 text-xs leading-5 transition-colors before:absolute before:left-2.5 before:top-1/2 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full ${isActive ? 'bg-accent-soft/70 font-medium text-accent before:bg-accent' : 'text-ink-muted before:bg-border hover:bg-accent-soft/40 hover:text-ink'}`

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { pathname } = useLocation()
  const [openTopics, setOpenTopics] = useState<string[]>(loadOpenTopics)

  useEffect(() => {
    try {
      localStorage.setItem(OPEN_TOPICS_KEY, JSON.stringify(openTopics))
    } catch {
      // Sidebar preferences are optional.
    }
  }, [openTopics])

  const toggleTopic = (id: string) => {
    setOpenTopics((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const openTopic = (id: string) => {
    setOpenTopics((current) => (current.includes(id) ? current : [...current, id]))
  }

  const compactLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${isActive ? 'bg-accent-soft text-accent' : 'text-ink-muted hover:bg-accent-soft/50 hover:text-ink'}`

  return (
    <aside className={`hidden h-screen shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 lg:flex ${collapsed ? 'w-16' : 'w-72'}`}>
      <div className={`flex h-[57px] shrink-0 items-center border-b border-border/60 ${collapsed ? 'justify-center' : 'justify-between px-4'}`}>
        {!collapsed && <span className="font-mono text-sm font-semibold tracking-tight text-ink">interview-prep</span>}
        <button type="button" onClick={onToggle} className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-accent-soft/60 hover:text-ink" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {collapsed ? (
        <nav className="flex flex-1 flex-col items-center gap-1 overflow-y-auto py-3" aria-label="Primary navigation">
          <NavLink to="/" end className={compactLinkClass} aria-label="Home" title="Home"><Home size={18} /></NavLink>
          <NavLink to="/search" className={compactLinkClass} aria-label="Search" title="Search"><Search size={18} /></NavLink>
          <NavLink to="/review" className={compactLinkClass} aria-label="Review" title="Review"><Bookmark size={18} /></NavLink>
          <div className="my-2 h-px w-8 bg-border" />
          {TOPICS.map((topic) => (
            <NavLink key={topic.id} to={`/topic/${topic.id}`} className={() => `flex h-10 w-10 items-center justify-center rounded-lg font-mono text-xs font-semibold transition-colors ${pathname.startsWith(`/topic/${topic.id}`) ? 'bg-accent-soft text-accent' : 'text-ink-muted hover:bg-accent-soft/50 hover:text-ink'}`} aria-label={topic.label} title={topic.label}>
              {topic.label.slice(0, 2).toUpperCase()}
            </NavLink>
          ))}
          <div className="mt-auto pt-2">
            <NavLink to="/settings" className={compactLinkClass} aria-label="Settings" title="Settings"><Settings size={18} /></NavLink>
          </div>
        </nav>
      ) : (
        <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Primary navigation">
          <div className="space-y-1">
            <NavLink to="/" end className={navLinkClass}><Home size={17} />Home</NavLink>
            <NavLink to="/search" className={navLinkClass}><Search size={17} />Search</NavLink>
            <NavLink to="/review" className={navLinkClass}><Bookmark size={17} />Review</NavLink>
          </div>

          <div className="mt-5">
            <p className="px-3 pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">Topics</p>
            <div className="space-y-1">
              {TOPICS.map((topic) => {
                const groups = getSubtopicsByCategory(topic.id)
                const isActiveTopic = pathname.startsWith(`/topic/${topic.id}`)
                const isOpen = openTopics.includes(topic.id)
                return (
                  <div key={topic.id} className={`rounded-lg ${isActiveTopic ? 'bg-bg/70' : ''}`}>
                    <div className="flex items-center">
                      <NavLink to={`/topic/${topic.id}`} onClick={() => openTopic(topic.id)} className={() => `flex min-w-0 flex-1 items-center gap-3 rounded-l-lg px-3 py-2 text-sm transition-colors ${isActiveTopic ? 'font-medium text-accent' : 'text-ink-muted hover:text-ink'}`}>
                        <BookOpen size={16} className="shrink-0" /><span className="truncate">{topic.label}</span>
                      </NavLink>
                      <button type="button" onClick={() => toggleTopic(topic.id)} className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-accent-soft hover:text-ink" aria-expanded={isOpen} aria-controls={`sidebar-topic-${topic.id}`} aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${topic.label} subtopics`}>
                        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                    </div>
                    {isOpen && (
                      <div id={`sidebar-topic-${topic.id}`} className="pb-2 pl-5 pr-1">
                        {groups.map(({ category, items }) => (
                          <div key={category} className="mt-2">
                            <p className="mb-1 px-2 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-ink-muted/80">{category}</p>
                            <div className="space-y-0.5">
                              {items.map((subtopic) => <NavLink key={subtopic.id} to={`/topic/${topic.id}/subtopic/${subtopic.id}`} className={subLinkClass}>{subtopic.label}</NavLink>)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-3"><NavLink to="/settings" className={navLinkClass}><Settings size={17} />Settings</NavLink></div>
        </nav>
      )}
    </aside>
  )
}
