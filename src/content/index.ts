import type { ConceptSection, Question, TopicMeta } from '../types'
import { javaConcepts } from './concepts/java'
import { springBootConcepts } from './concepts/spring-boot'
import { systemDesignConcepts } from './concepts/system-design'
import { javaQuestions } from './questions/java'
import { springBootQuestions } from './questions/spring-boot'
import { systemDesignQuestions } from './questions/system-design'

const TOPIC_INFO: TopicMeta[] = [
  { id: 'java', label: 'Java', description: 'JVM internals, concurrency, collections, streams.' },
  { id: 'system-design', label: 'System Design', description: 'Scalability, distributed systems, data storage, caching, and architecture patterns.' },
  { id: 'spring-boot', label: 'Spring Boot', description: 'IoC/DI, Spring MVC, Spring Data JPA, Spring Security, and production Spring Boot.' },
]

const CONCEPTS_BY_TOPIC: Record<string, ConceptSection[]> = {
  java: javaConcepts,
  'system-design': systemDesignConcepts,
  'spring-boot': springBootConcepts,
}

const QUESTIONS_BY_TOPIC: Record<string, Question[]> = {
  java: javaQuestions,
  'system-design': systemDesignQuestions,
  'spring-boot': springBootQuestions,
}

export const ALL_QUESTIONS: Question[] = Object.values(QUESTIONS_BY_TOPIC).flat()
export const ALL_CONCEPTS: ConceptSection[] = Object.values(CONCEPTS_BY_TOPIC).flat()

export const TOPICS = TOPIC_INFO.map((meta) => ({
  ...meta,
  questionCount: (QUESTIONS_BY_TOPIC[meta.id] ?? []).length,
  conceptCount: (CONCEPTS_BY_TOPIC[meta.id] ?? []).length,
}))

export function getTopicMeta(topicId: string): TopicMeta | undefined {
  return TOPIC_INFO.find((t) => t.id === topicId)
}

export function getQuestionsForTopic(topicId: string): Question[] {
  return QUESTIONS_BY_TOPIC[topicId] ?? []
}

export function getConceptsForTopic(topicId: string): ConceptSection[] {
  return CONCEPTS_BY_TOPIC[topicId] ?? []
}

export function getQuestionById(questionId: string): Question | undefined {
  return ALL_QUESTIONS.find((q) => q.id === questionId)
}

export function getConceptsForSubtopic(topicId: string, subtopicId: string): ConceptSection[] {
  return getConceptsForTopic(topicId).filter((c) => c.subtopic === subtopicId)
}

export function getQuestionsForSubtopic(topicId: string, subtopicId: string): Question[] {
  return getQuestionsForTopic(topicId).filter((q) => q.subtopic === subtopicId)
}
