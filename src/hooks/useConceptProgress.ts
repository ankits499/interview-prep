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

  const setReviewed = useCallback(async (conceptId: string, reviewed: boolean) => {
    await databaseReady
    if (reviewed) {
      await db.conceptProgress.put({ conceptId, reviewedAt: new Date().toISOString() })
    } else {
      await db.conceptProgress.delete(conceptId)
    }
  }, [])

  return { reviewedMap: map, isReviewed, setReviewed }
}
