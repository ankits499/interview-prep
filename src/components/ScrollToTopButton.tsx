import { useEffect, useState, type RefObject } from 'react'
import { ArrowUp } from 'lucide-react'

const SHOW_THRESHOLD = 400

export function ScrollToTopButton({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = targetRef.current
    if (!el) return

    const onScroll = () => setVisible(el.scrollTop > SHOW_THRESHOLD)
    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [targetRef])

  return (
    <button
      onClick={() => targetRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-24 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/90 text-ink-muted shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-300 hover:border-accent hover:text-accent md:bottom-8 md:right-8 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
      }`}
    >
      <ArrowUp size={18} strokeWidth={2.25} />
    </button>
  )
}
