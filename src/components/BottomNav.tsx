import { NavLink } from 'react-router-dom'
import { Home, Search, Bookmark, Settings } from 'lucide-react'

const itemClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[1.1rem] px-2 py-1.5 text-[10px] font-medium transition-all duration-200 ${
    isActive
      ? 'bg-accent-soft/85 text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]'
      : 'text-ink-muted hover:bg-surface/50 hover:text-ink'
  }`

export function BottomNav() {
  return (
    <nav
      className="fixed left-1/2 z-20 flex w-[calc(100%-1rem)] max-w-xl -translate-x-1/2 items-center gap-1 rounded-[1.65rem] border border-white/50 bg-surface/65 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-2xl backdrop-saturate-150 before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent dark:border-white/10 dark:bg-surface/70 dark:shadow-[0_12px_40px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.08)] dark:before:via-white/20 lg:hidden"
      style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
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
