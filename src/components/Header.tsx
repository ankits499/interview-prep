import { useNavigate } from 'react-router-dom'
import { Search, Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export function Header() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-3 md:px-6">
      <span className="font-mono text-sm font-semibold text-ink md:hidden">interview-prep</span>
      <div className="hidden md:block" />
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/search')}
          className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
          aria-label="Open search"
        >
          <Search size={15} strokeWidth={2} />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline font-mono text-xs text-ink-muted">⌘K</kbd>
        </button>
        <button
          onClick={toggleTheme}
          className="rounded-md border border-border p-1.5 text-ink-muted hover:text-ink transition-colors md:flex hidden"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
        </button>
      </div>
    </header>
  )
}
