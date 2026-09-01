import { useCallback, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { databaseReady, db } from '../lib/db'

export function useConceptProgress() {
  const records = useLiveQuery(() => db.conceptProgress.toArray(), [], [])
  const reviewedIds = useMemo(
    () => new Set(records.map(({ conceptId }) => conceptId)),
    [records],
  )

  const isReviewed = useCallback((id: string) => reviewedIds.has(id), [reviewedIds])

  const setReviewed = useCallback(async (conceptId: string, reviewed: boolean) => {
    await databaseReady
    if (reviewed) {
      await db.conceptProgress.put({ conceptId, reviewedAt: new Date().toISOString() })
    } else {
      await db.conceptProgress.delete(conceptId)
    }
  }, [])

  return { reviewedIds, isReviewed, setReviewed }
}
