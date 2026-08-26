import { NavLink } from 'react-router-dom'
import { Home, Search, Bookmark, Settings } from 'lucide-react'

const itemClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors ${
    isActive ? 'text-accent' : 'text-ink-muted'
  }`

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-border bg-surface md:hidden">
      <NavLink to="/" end className={itemClass}>
        <Home size={20} strokeWidth={2} />
        Home
      </NavLink>
      <NavLink to="/search" className={itemClass}>
        <Search size={20} strokeWidth={2} />
        Search
      </NavLink>
      <NavLink to="/review" className={itemClass}>
        <Bookmark size={20} strokeWidth={2} />
        Review
      </NavLink>
      <NavLink to="/settings" className={itemClass}>
        <Settings size={20} strokeWidth={2} />
        Settings
      </NavLink>
    </nav>
  )
}
