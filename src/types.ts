export type Difficulty = 'Basic' | 'Intermediate' | 'Advanced' | 'Expert'
export type Seniority = 'Mid' | 'Senior' | 'Lead' | 'Staff'
export type ProgressStatus = 'none' | 'mastered' | 'needs-review' | 'bookmarked'

export interface QuestionSource {
  name: string
  url: string
}

export interface Question {
  id: string
  question: string
  shortAnswer: string
  detailedAnswer?: string
  keyPoints?: string[]
  seniorFollowUps?: string[]
  example?: string
  topic: string
  subtopic?: string
  difficulty: Difficulty
  seniority: Seniority
  tags: string[]
  source?: QuestionSource
}

export interface CodeSnippet {
  language: string
  code: string
}

/** A short, focused code example for one concept — with an optional one-line callout on what actually matters. */
export interface ConceptExample {
  code: CodeSnippet
  /** The "here's the actual point" callout shown under the code — e.g. "The important point isn't private." */
  note?: string
}

export interface ConceptInterviewAngle {
  q: string
  a: string
}

export type ConceptImportance = 'must-know' | 'useful' | 'deep-dive'

export interface ConceptComparison {
  columns: string[]
  rows: string[][]
  takeaway?: string
}

/**
 * One atomic, scannable unit of study material — "understand in 1-3 minutes, remember the key
 * idea, see a small example, move on." A subtopic is 15-30 of these, not a handful of long essays.
 */
export interface ConceptCard {
  id: string
  title: string
  /** Groups cards into a learning progression within the subtopic (e.g. "Foundations", "OOP Pillars") — order of first appearance in the array sets the group order shown. */
  group: string
  /** Interview relevance within a subtopic. Cards without a value default to useful. */
  importance?: ConceptImportance
  /** One sentence: what it is and why it exists. Not a paragraph. */
  definition: string
  /** 1-3 short bullets: the practical reason this matters, not a restatement of the definition. */
  whyItMatters?: string[]
  example?: ConceptExample
  /** 2-4 critical points to retain — the thing you'd want on a flashcard. */
  remember?: string[]
  /** One short Q/A teasing what a senior interviewer actually tests — not a full Q&A bank entry. */
  interviewAngle?: ConceptInterviewAngle
  /** ids of other ConceptCards (same subtopic) worth reading alongside this one. */
  related?: string[]
  /** Mermaid diagram syntax — rare; only when a picture genuinely beats prose. Keep it small. */
  diagram?: string
  /** Structured comparison rendered as an accessible, responsive table. */
  comparison?: ConceptComparison
  /** Rough reading time in minutes, shown in the scan index (e.g. 2 or 3). */
  readMinutes?: number
}

/** The study material for one subtopic — an ordered set of concept cards, not a long-form article. */
export interface ConceptSection {
  id: string
  title: string
  /** Links this to a SubtopicMeta id (src/content/subtopics.ts) — required for per-subtopic navigation. */
  subtopic: string
  /** One or two sentences framing the subtopic — shown above the concept index. Keep it short. */
  intro?: string
  concepts: ConceptCard[]
}

export interface TopicMeta {
  id: string
  label: string
  description: string
}
