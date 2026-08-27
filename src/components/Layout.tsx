import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { CommandPaletteOverlay } from './CommandPaletteOverlay'
import { ScrollToTopButton } from './ScrollToTopButton'

export function Layout() {
  const mainRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-ink">
      <Sidebar />
      <div className="flex h-screen min-w-0 flex-1 flex-col">
        <Header />
        <main ref={mainRef} className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-24 pt-6 md:px-8 md:pb-10">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <ScrollToTopButton targetRef={mainRef} />
      <CommandPaletteOverlay />
    </div>
  )
}
