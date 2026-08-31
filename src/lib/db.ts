import Dexie, { type EntityTable } from 'dexie'
import type { ProgressStatus } from '../types'

export interface QuestionProgressRecord {
  questionId: string
  status: Exclude<ProgressStatus, 'none'>
  updatedAt: string
}

export interface ConceptProgressRecord {
  conceptId: string
  reviewedAt: string
}

interface MetadataRecord {
  key: string
  value: string
}

const QUESTION_STORAGE_KEY = 'interview-prep-progress'
const CONCEPT_STORAGE_KEY = 'interview-prep-concepts-reviewed'
const MIGRATION_KEY = 'local-storage-progress-migrated'

class StudyGuideDatabase extends Dexie {
  questionProgress!: EntityTable<QuestionProgressRecord, 'questionId'>
  conceptProgress!: EntityTable<ConceptProgressRecord, 'conceptId'>
  metadata!: EntityTable<MetadataRecord, 'key'>

  constructor() {
    super('interview-prep')
    this.version(1).stores({
      questionProgress: 'questionId, status, updatedAt',
      conceptProgress: 'conceptId, reviewedAt',
      metadata: 'key',
    })
  }
}

export const db = new StudyGuideDatabase()

function readLegacyQuestionProgress(): QuestionProgressRecord[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(QUESTION_STORAGE_KEY) ?? '{}') as Record<string, unknown>
    const validStatuses = new Set(['mastered', 'needs-review', 'bookmarked'])
    const updatedAt = new Date().toISOString()

    return Object.entries(parsed)
      .filter((entry): entry is [string, QuestionProgressRecord['status']] => validStatuses.has(String(entry[1])))
      .map(([questionId, status]) => ({ questionId, status, updatedAt }))
  } catch {
    return []
  }
}

function readLegacyConceptProgress(): ConceptProgressRecord[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(CONCEPT_STORAGE_KEY) ?? '{}') as Record<string, unknown>
    const reviewedAt = new Date().toISOString()

    return Object.entries(parsed)
      .filter(([, reviewed]) => reviewed === true)
      .map(([conceptId]) => ({ conceptId, reviewedAt }))
  } catch {
    return []
  }
}

async function migrateLocalStorageProgress() {
  if (await db.metadata.get(MIGRATION_KEY)) return

  const questions = readLegacyQuestionProgress()
  const concepts = readLegacyConceptProgress()

  await db.transaction('rw', db.questionProgress, db.conceptProgress, db.metadata, async () => {
    if (questions.length > 0) await db.questionProgress.bulkPut(questions)
    if (concepts.length > 0) await db.conceptProgress.bulkPut(concepts)
    await db.metadata.put({ key: MIGRATION_KEY, value: new Date().toISOString() })
  })

  localStorage.removeItem(QUESTION_STORAGE_KEY)
  localStorage.removeItem(CONCEPT_STORAGE_KEY)
}

async function initializeDatabase() {
  await migrateLocalStorageProgress()

  if (navigator.storage?.persist) {
    await navigator.storage.persist().catch(() => false)
  }
}

export const databaseReady = initializeDatabase()
