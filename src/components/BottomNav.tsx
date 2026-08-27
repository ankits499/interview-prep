import { NavLink } from 'react-router-dom'
import { Home, Search, Bookmark, Settings } from 'lucide-react'

const itemClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-1 flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[10px] font-medium transition-colors ${
    isActive ? 'bg-accent-soft/70 text-accent' : 'text-ink-muted'
  }`

export function BottomNav() {
  return (
    <nav
      className="fixed left-1/2 z-20 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-border/40 bg-surface/45 px-1.5 py-1.5 shadow-lg shadow-black/10 backdrop-blur-xl backdrop-saturate-150 md:hidden"
      style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <NavLink to="/" end className={itemClass}>
        <Home size={19} strokeWidth={2} />
        Home
      </NavLink>
      <NavLink to="/search" className={itemClass}>
        <Search size={19} strokeWidth={2} />
        Search
      </NavLink>
      <NavLink to="/review" className={itemClass}>
        <Bookmark size={19} strokeWidth={2} />
        Review
      </NavLink>
      <NavLink to="/settings" className={itemClass}>
        <Settings size={19} strokeWidth={2} />
        Settings
      </NavLink>
    </nav>
  )
}
