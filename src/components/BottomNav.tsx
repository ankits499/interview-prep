import { NavLink } from 'react-router-dom'
import { Home, Search, Bookmark, Settings } from 'lucide-react'

const itemClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[1.5rem] px-2 py-1.5 text-[10px] font-medium transition-all duration-200 ${
    isActive
      ? 'bottom-nav-item-active text-accent'
      : 'text-ink-muted hover:bg-white/15 hover:text-ink dark:hover:bg-white/[0.05]'
  }`

export function BottomNav() {
  return (
    <nav
      className="bottom-nav-glass fixed left-1/2 z-20 flex w-[calc(100%-2rem)] max-w-[21rem] -translate-x-1/2 items-center gap-1 rounded-[2rem] p-1.5 lg:hidden"
      style={{ bottom: 'max(1.25rem, calc(env(safe-area-inset-bottom) + 0.75rem))' }}
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
