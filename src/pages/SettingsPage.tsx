import { Sun, Moon } from 'lucide-react'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { useTheme } from '../hooks/useTheme'

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div>
      <Breadcrumbs crumbs={[{ label: 'Home', to: '/' }, { label: 'Settings' }]} />
      <h1 className="mb-5 text-lg font-semibold text-ink">Settings</h1>

      <div className="flex items-center justify-between rounded-md border border-border bg-surface px-4 py-3">
        <div>
          <p className="text-sm font-medium text-ink">Theme</p>
          <p className="text-xs text-ink-muted">Switch between light and dark mode.</p>
        </div>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-ink hover:border-accent"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </div>
  )
}
