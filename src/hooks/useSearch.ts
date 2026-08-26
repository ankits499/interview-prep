import { useMemo } from 'react'
import type { Question } from '../types'

function matchScore(haystack: string, needle: string): number {
  const idx = haystack.toLowerCase().indexOf(needle.toLowerCase())
  return idx === -1 ? -1 : idx
}

export function searchQuestions(questions: Question[], query: string): Question[] {
  const trimmed = query.trim()
  if (!trimmed) return []

  return questions
    .map((q) => {
      const fields = [q.question, q.topic, q.subtopic ?? '', ...q.tags]
      const scores = fields.map((f) => matchScore(f, trimmed)).filter((s) => s !== -1)
      if (scores.length === 0) return null
      return { question: q, score: Math.min(...scores) }
    })
    .filter((r): r is { question: Question; score: number } => r !== null)
    .sort((a, b) => a.score - b.score)
    .map((r) => r.question)
}

export function useSearch(questions: Question[], query: string) {
  return useMemo(() => searchQuestions(questions, query), [questions, query])
}
