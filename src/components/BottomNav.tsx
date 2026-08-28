import { NavLink } from 'react-router-dom'
import { Home, Search, Bookmark, Settings } from 'lucide-react'

const itemClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[1.5rem] px-2 py-1.5 text-[10px] font-medium transition-all duration-200 ${
    isActive
      ? 'bg-white/35 text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_2px_10px_rgba(0,0,0,0.04)] dark:bg-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
      : 'text-ink-muted hover:bg-white/20 hover:text-ink dark:hover:bg-white/[0.06]'
  }`

export function BottomNav() {
  return (
    <nav
      className="fixed left-1/2 z-20 flex w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 items-center gap-1 rounded-[2rem] border border-white/40 bg-white/20 p-1.5 shadow-[0_16px_44px_rgba(22,28,26,0.14),inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(255,255,255,0.18)] ring-1 ring-black/[0.025] backdrop-blur-3xl backdrop-saturate-[1.8] before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/90 before:to-transparent dark:border-white/15 dark:bg-black/15 dark:shadow-[0_16px_48px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(255,255,255,0.04)] dark:ring-white/[0.03] dark:before:via-white/30 lg:hidden"
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
