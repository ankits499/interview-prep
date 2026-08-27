import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { CommandPaletteOverlay } from './CommandPaletteOverlay'
import { ScrollToTopButton } from './ScrollToTopButton'

export function Layout() {
  const mainRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('interview-prep-sidebar-collapsed') === 'true'
    } catch {
      return false
    }
  })
  const toggleSidebar = () => setSidebarCollapsed((value) => !value)

  useEffect(() => {
    try {
      localStorage.setItem('interview-prep-sidebar-collapsed', String(sidebarCollapsed))
    } catch {
      // Sidebar preferences are optional.
    }
  }, [sidebarCollapsed])

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-ink">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div className="flex h-screen min-w-0 flex-1 flex-col">
        <Header sidebarCollapsed={sidebarCollapsed} onToggleSidebar={toggleSidebar} />
        <main ref={mainRef} className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-24 pt-6 md:px-8 lg:pb-10">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <ScrollToTopButton targetRef={mainRef} />
      <CommandPaletteOverlay />
    </div>
  )
}
