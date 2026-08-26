import { useMemo } from 'react'
import type { Question, TopicMeta } from '../types'
import { SUBTOPICS_BY_TOPIC, type SubtopicMeta } from '../content/subtopics'
import { TOPICS, ALL_QUESTIONS } from '../content'

interface Indexed<T> {
  item: T
  primary: string
  secondary: string
}

const TOPIC_INDEX: Indexed<TopicMeta>[] = TOPICS.map((t) => ({
  item: t,
  primary: t.label.toLowerCase(),
  secondary: t.description.toLowerCase(),
}))

export type SubtopicResult = SubtopicMeta & { topicId: string }

const SUBTOPIC_INDEX: Indexed<SubtopicResult>[] = Object.entries(SUBTOPICS_BY_TOPIC).flatMap(([topicId, subtopics]) =>
  subtopics.map((s) => ({
    item: { ...s, topicId },
    primary: s.label.toLowerCase(),
    secondary: s.category.toLowerCase(),
  })),
)

const QUESTION_INDEX: Indexed<Question>[] = ALL_QUESTIONS.map((q) => ({
  item: q,
  primary: q.question.toLowerCase(),
  secondary: [q.topic, q.subtopic ?? '', ...q.tags].join(' ').toLowerCase(),
}))

/** Field-weighted match: every token must appear in primary or secondary; a secondary-only hit
 * ranks behind an all-primary match, ties broken by earliest match position. */
function score(entry: Indexed<unknown>, tokens: string[]): number | null {
  let usedSecondary = false
  let worstIdx = -1
  for (const token of tokens) {
    const p = entry.primary.indexOf(token)
    if (p !== -1) {
      worstIdx = Math.max(worstIdx, p)
      continue
    }
    const s = entry.secondary.indexOf(token)
    if (s === -1) return null // token missing from both fields — not a match
    usedSecondary = true
    worstIdx = Math.max(worstIdx, s)
  }
  return (usedSecondary ? 100000 : 0) + worstIdx
}

function search<T>(index: Indexed<T>[], tokens: string[]): T[] {
  return index
    .map((entry) => ({ entry, s: score(entry, tokens) }))
    .filter((r): r is { entry: Indexed<T>; s: number } => r.s !== null)
    .sort((a, b) => a.s - b.s)
    .map((r) => r.entry.item)
}

export interface SiteSearchResults {
  topics: TopicMeta[]
  subtopics: SubtopicResult[]
  questions: Question[]
}

function tokenize(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean)
}

export function useSiteSearch(query: string): SiteSearchResults {
  return useMemo(() => {
    const tokens = tokenize(query)
    if (tokens.length === 0) return { topics: [], subtopics: [], questions: [] }
    return {
      topics: search(TOPIC_INDEX, tokens),
      subtopics: search(SUBTOPIC_INDEX, tokens),
      questions: search(QUESTION_INDEX, tokens),
    }
  }, [query])
}
