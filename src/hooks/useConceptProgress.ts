import { useCallback, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'interview-prep-concepts-reviewed'

function load(): Record<string, true> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, true>) : {}
  } catch {
    return {}
  }
}

let reviewed: Record<string, true> = load()
const listeners = new Set<() => void>()

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewed))
  } catch {
    // ignore
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return reviewed
}

export function useConceptProgress() {
  const map = useSyncExternalStore(subscribe, getSnapshot)

  const isReviewed = useCallback((id: string) => Boolean(map[id]), [map])

  const toggleReviewed = useCallback((id: string) => {
    reviewed = { ...reviewed }
    if (reviewed[id]) {
      delete reviewed[id]
    } else {
      reviewed[id] = true
    }
    save()
    listeners.forEach((l) => l())
  }, [])

  return { reviewedMap: map, isReviewed, toggleReviewed }
}
