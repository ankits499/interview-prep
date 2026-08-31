import { useCallback, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { databaseReady, db } from '../lib/db'

export function useConceptProgress() {
  const records = useLiveQuery(() => db.conceptProgress.toArray(), [], [])
  const map = useMemo<Record<string, true>>(
    () => Object.fromEntries(records.map(({ conceptId }) => [conceptId, true])),
    [records],
  )

  const isReviewed = useCallback((id: string) => Boolean(map[id]), [map])

  const toggleReviewed = useCallback(async (conceptId: string) => {
    await databaseReady
    await db.transaction('rw', db.conceptProgress, async () => {
      if (await db.conceptProgress.get(conceptId)) {
        await db.conceptProgress.delete(conceptId)
      } else {
        await db.conceptProgress.put({ conceptId, reviewedAt: new Date().toISOString() })
      }
    })
  }, [])

  return { reviewedMap: map, isReviewed, toggleReviewed }
}
