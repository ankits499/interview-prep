/**
 * Scrolls a concept card into view by id, without touching location.hash — the app uses
 * HashRouter, so an <a href="#id"> anchor would be interpreted as a route change (404),
 * not an in-page jump. Scrolls the actual scroll container (<main>), not the window.
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
