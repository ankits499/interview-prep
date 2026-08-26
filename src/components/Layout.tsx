import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { CommandPaletteOverlay } from './CommandPaletteOverlay'

export function Layout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-ink">
      <Sidebar />
      <div className="flex h-screen min-w-0 flex-1 flex-col">
        <Header />
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-20 pt-6 md:px-8 md:pb-10">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <CommandPaletteOverlay />
    </div>
  )
}
