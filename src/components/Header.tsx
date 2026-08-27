import { useNavigate } from 'react-router-dom'
import { Search, Sun, Moon, PanelLeftOpen } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

interface HeaderProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function Header({ sidebarCollapsed, onToggleSidebar }: HeaderProps) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-3 md:px-6">
      <span className="font-mono text-sm font-semibold text-ink lg:hidden">interview-prep</span>
      <div className="hidden lg:block">
        {sidebarCollapsed && (
          <button type="button" onClick={onToggleSidebar} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-ink-muted transition-colors hover:bg-accent-soft/60 hover:text-ink" aria-label="Expand sidebar" title="Expand sidebar">
            <PanelLeftOpen size={16} /><span>Show sidebar</span>
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/search')}
          className="flex min-h-11 items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
          aria-label="Open search"
        >
          <Search size={15} strokeWidth={2} />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline font-mono text-xs text-ink-muted">⌘K</kbd>
        </button>
        <button
          onClick={toggleTheme}
          className="hidden min-h-11 min-w-11 items-center justify-center rounded-md border border-border p-1.5 text-ink-muted transition-colors hover:text-ink lg:flex"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
        </button>
      </div>
    </header>
  )
}
