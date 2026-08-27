import type { ConceptSection, ProgressStatus, Question } from '../types'

export interface ProgressStats {
  completed: number
  total: number
  percent: number
}

/**
 * Rolls up "how much of this have I reviewed" across both progress stores —
 * reviewed concept cards (useConceptProgress) and mastered questions
 * (useProgress) — into one combined stat. Used anywhere a topic/subtopic
 * card wants to show a single completion ring.
 */
export function getProgressStats(
  sections: ConceptSection[],
  questions: Question[],
  isReviewed: (id: string) => boolean,
  progress: Record<string, ProgressStatus>,
): ProgressStats {
  const concepts = sections.flatMap((s) => s.concepts)
  const reviewedConcepts = concepts.filter((c) => isReviewed(c.id)).length
  const masteredQuestions = questions.filter((q) => progress[q.id] === 'mastered').length

  const total = concepts.length + questions.length
  const completed = reviewedConcepts + masteredQuestions
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return { completed, total, percent }
}
