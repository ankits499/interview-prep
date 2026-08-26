import { groupBy } from '../lib/groupBy'

export interface SubtopicMeta {
  id: string
  label: string
  /** Interview weight for this subtopic, independent of individual question difficulty. */
  priority: 'high' | 'medium' | 'low'
  /** Groups subtopics for navigation (e.g. sidebar/subtopic-index sections). */
  category: string
}

// Order here is the default reading/scan order for a topic's subtopics — roughly
// "what a senior backend interview actually probes," not alphabetical. Curated for
// 8+ year senior engineers — fresher/screening-level basics (syntax, control flow,
// arrays, methods) are deliberately excluded.
export const SUBTOPICS_BY_TOPIC: Record<string, SubtopicMeta[]> = {
  java: [
    // Core Java
    { id: 'fundamentals', label: 'Class, Object & OOP', priority: 'medium', category: 'Core Java' },
    { id: 'strings', label: 'Strings', priority: 'medium', category: 'Core Java' },
    { id: 'java8', label: 'Java 8+ Features', priority: 'high', category: 'Core Java' },

    // Collections & Generics
    { id: 'collections', label: 'Collections', priority: 'high', category: 'Collections & Generics' },
    { id: 'generics', label: 'Generics', priority: 'medium', category: 'Collections & Generics' },

    // Modern Java
    { id: 'modern-java', label: 'Modern Java (Records, Sealed, Virtual Threads)', priority: 'medium', category: 'Modern Java' },

    // Error Handling
    { id: 'exceptions', label: 'Exception Handling', priority: 'medium', category: 'Error Handling' },

    // Concurrency
    { id: 'concurrency', label: 'Concurrency & Multithreading', priority: 'high', category: 'Concurrency' },
    { id: 'jmm', label: 'Java Memory Model', priority: 'high', category: 'Concurrency' },
    { id: 'locks', label: 'Locks & Synchronization', priority: 'high', category: 'Concurrency' },
    { id: 'concurrent-collections', label: 'Concurrent Collections', priority: 'high', category: 'Concurrency' },
    { id: 'async', label: 'Async Programming', priority: 'high', category: 'Concurrency' },

    // JVM & Performance
    { id: 'jvm-internals', label: 'JVM Internals', priority: 'high', category: 'JVM & Performance' },
    { id: 'gc', label: 'Garbage Collection', priority: 'high', category: 'JVM & Performance' },
    { id: 'performance', label: 'Java Performance', priority: 'high', category: 'JVM & Performance' },

    // I/O & Serialization
    { id: 'io-nio', label: 'I/O & NIO', priority: 'low', category: 'I/O & Serialization' },
    { id: 'serialization', label: 'Serialization', priority: 'low', category: 'I/O & Serialization' },

    // Reflection & Design
    { id: 'reflection', label: 'Reflection & Annotations', priority: 'medium', category: 'Reflection & Design' },
    { id: 'design-patterns', label: 'Design Patterns', priority: 'medium', category: 'Reflection & Design' },
    { id: 'advanced-internals', label: 'Java Internals — Advanced', priority: 'medium', category: 'Reflection & Design' },

    // Production
    { id: 'production', label: 'Production Java', priority: 'high', category: 'Production' },
  ],
}

export function getSubtopicsForTopic(topicId: string): SubtopicMeta[] {
  return SUBTOPICS_BY_TOPIC[topicId] ?? []
}

export function getSubtopicOrder(topicId: string): string[] {
  return getSubtopicsForTopic(topicId).map((s) => s.id)
}

export function getSubtopicMeta(topicId: string, subtopicId: string): SubtopicMeta | undefined {
  return getSubtopicsForTopic(topicId).find((s) => s.id === subtopicId)
}

/** Subtopics for a topic, grouped by category, preserving definition order. */
export function getSubtopicsByCategory(topicId: string): { category: string; items: SubtopicMeta[] }[] {
  return groupBy(getSubtopicsForTopic(topicId), (s) => s.category).map(({ key, items }) => ({ category: key, items }))
}
