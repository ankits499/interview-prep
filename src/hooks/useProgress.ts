import { useCallback, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { databaseReady, db } from '../lib/db'
import type { ProgressStatus } from '../types'

type ProgressMap = Record<string, ProgressStatus>

export function useProgress() {
  const records = useLiveQuery(() => db.questionProgress.toArray(), [], [])
  const progress = useMemo<ProgressMap>(
    () => Object.fromEntries(records.map(({ questionId, status }) => [questionId, status])),
    [records],
  )

  const getStatus = useCallback((questionId: string): ProgressStatus => progress[questionId] ?? 'none', [progress])

  const setStatus = useCallback(async (questionId: string, status: ProgressStatus) => {
    await databaseReady
    if (status === 'none') {
      await db.questionProgress.delete(questionId)
      return
    }
    await db.questionProgress.put({ questionId, status, updatedAt: new Date().toISOString() })
  }, [])

  const toggleStatus = useCallback(async (questionId: string, status: ProgressStatus) => {
    await databaseReady
    await db.transaction('rw', db.questionProgress, async () => {
      const current = await db.questionProgress.get(questionId)
      if (current?.status === status || status === 'none') {
        await db.questionProgress.delete(questionId)
      } else {
        await db.questionProgress.put({ questionId, status, updatedAt: new Date().toISOString() })
      }
    })
  }, [])

  return { progress, getStatus, setStatus, toggleStatus }
}
