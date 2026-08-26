import { useCallback, useEffect, useState } from 'react'
import type { ProgressStatus } from '../types'

const STORAGE_KEY = 'interview-prep-progress'

type ProgressMap = Record<string, ProgressStatus>

function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ProgressMap) : {}
  } catch {
    return {}
  }
}

function saveProgress(map: ProgressMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // ignore write failures (e.g. private browsing storage limits)
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress())

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const getStatus = useCallback((questionId: string): ProgressStatus => progress[questionId] ?? 'none', [progress])

  const setStatus = useCallback((questionId: string, status: ProgressStatus) => {
    setProgress((prev) => ({ ...prev, [questionId]: status }))
  }, [])

  const toggleStatus = useCallback(
    (questionId: string, status: ProgressStatus) => {
      setProgress((prev) => ({
        ...prev,
        [questionId]: prev[questionId] === status ? 'none' : status,
      }))
    },
    [],
  )

  return { progress, getStatus, setStatus, toggleStatus }
}
