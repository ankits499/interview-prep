import { useEffect, useState } from 'react'
import { SearchPalette } from './SearchPalette'

export function CommandPaletteOverlay() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
      const isSlash = e.key === '/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)
      if (isCmdK || isSlash) {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-30 flex items-start justify-center bg-black/30 px-4 pt-24" onClick={() => setOpen(false)}>
      <div onClick={(e) => e.stopPropagation()} className="w-full">
        <SearchPalette onClose={() => setOpen(false)} />
      </div>
    </div>
  )
}
