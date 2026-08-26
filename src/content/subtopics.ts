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

  'system-design': [
    // Foundations
    { id: 'sd-fundamentals', label: 'Scalability & Design Fundamentals', priority: 'high', category: 'Foundations' },
    { id: 'sd-cap-consistency', label: 'CAP Theorem & Consistency Models', priority: 'high', category: 'Foundations' },
    { id: 'sd-estimation', label: 'Capacity Estimation & Back-of-Envelope Math', priority: 'medium', category: 'Foundations' },

    // Networking & APIs
    { id: 'sd-api-design', label: 'API Design (REST, gRPC, GraphQL)', priority: 'high', category: 'Networking & APIs' },
    { id: 'sd-load-balancing', label: 'Load Balancing & API Gateways', priority: 'high', category: 'Networking & APIs' },

    // Data Storage
    { id: 'sd-sql-vs-nosql', label: 'SQL vs NoSQL & Data Modeling', priority: 'high', category: 'Data Storage' },
    { id: 'sd-indexing', label: 'Indexing & Query Performance', priority: 'medium', category: 'Data Storage' },
    { id: 'sd-replication', label: 'Replication & Partitioning (Sharding)', priority: 'high', category: 'Data Storage' },
    { id: 'sd-transactions', label: 'Distributed Transactions & Consensus', priority: 'medium', category: 'Data Storage' },

    // Caching
    { id: 'sd-caching', label: 'Caching Strategies & CDNs', priority: 'high', category: 'Caching' },

    // Messaging & Streaming
    { id: 'sd-messaging', label: 'Message Queues & Pub/Sub', priority: 'high', category: 'Messaging & Streaming' },
    { id: 'sd-event-driven', label: 'Event-Driven Architecture & Streaming', priority: 'medium', category: 'Messaging & Streaming' },

    // Scalability & Reliability Patterns
    { id: 'sd-rate-limiting', label: 'Rate Limiting & Load Shedding', priority: 'medium', category: 'Scalability & Reliability' },
    { id: 'sd-resilience-patterns', label: 'Resilience Patterns (Circuit Breaker, Bulkhead, Retry)', priority: 'high', category: 'Scalability & Reliability' },
    { id: 'sd-fault-tolerance', label: 'Fault Tolerance & Disaster Recovery', priority: 'medium', category: 'Scalability & Reliability' },

    // Architecture Patterns
    { id: 'sd-microservices', label: 'Microservices vs Monolith', priority: 'high', category: 'Architecture Patterns' },
    { id: 'sd-service-communication', label: 'Service-to-Service Communication Patterns', priority: 'medium', category: 'Architecture Patterns' },

    // Observability & Security
    { id: 'sd-observability', label: 'Monitoring, Logging & Distributed Tracing', priority: 'medium', category: 'Observability & Security' },
    { id: 'sd-security', label: 'Authentication, Authorization & Security', priority: 'medium', category: 'Observability & Security' },

    // Case Studies
    { id: 'sd-case-studies', label: 'Common Design Problems (URL Shortener, Feed, Chat, etc.)', priority: 'high', category: 'Case Studies' },
  ],

  'spring-boot': [
    // Core Spring
    { id: 'sb-ioc-di', label: 'IoC Container & Dependency Injection', priority: 'high', category: 'Core Spring' },
    { id: 'sb-bean-lifecycle', label: 'Bean Lifecycle & Scopes', priority: 'high', category: 'Core Spring' },
    { id: 'sb-aop', label: 'Aspect-Oriented Programming (AOP)', priority: 'medium', category: 'Core Spring' },

    // Spring Boot Essentials
    { id: 'sb-autoconfiguration', label: 'Auto-Configuration & Starters', priority: 'high', category: 'Spring Boot Essentials' },
    { id: 'sb-properties-profiles', label: 'Configuration Properties & Profiles', priority: 'medium', category: 'Spring Boot Essentials' },
    { id: 'sb-actuator', label: 'Spring Boot Actuator & Observability', priority: 'medium', category: 'Spring Boot Essentials' },

    // Web Layer
    { id: 'sb-mvc', label: 'Spring MVC & REST Controllers', priority: 'high', category: 'Web Layer' },
    { id: 'sb-validation-exceptions', label: 'Validation & Exception Handling', priority: 'high', category: 'Web Layer' },
    { id: 'sb-webflux', label: 'Reactive Programming with WebFlux', priority: 'medium', category: 'Web Layer' },

    // Data Access
    { id: 'sb-data-jpa', label: 'Spring Data JPA & Repositories', priority: 'high', category: 'Data Access' },
    { id: 'sb-transactions', label: 'Transaction Management', priority: 'high', category: 'Data Access' },
    { id: 'sb-jpa-performance', label: 'JPA Performance & Pitfalls (N+1, Lazy Loading)', priority: 'high', category: 'Data Access' },

    // Security
    { id: 'sb-security-core', label: 'Spring Security Fundamentals', priority: 'high', category: 'Security' },
    { id: 'sb-oauth-jwt', label: 'OAuth2 & JWT', priority: 'medium', category: 'Security' },

    // Testing
    { id: 'sb-testing', label: 'Testing Spring Boot Applications', priority: 'medium', category: 'Testing' },

    // Microservices & Cloud
    { id: 'sb-spring-cloud', label: 'Spring Cloud (Config, Discovery, Gateway)', priority: 'medium', category: 'Microservices & Cloud' },
    { id: 'sb-resilience', label: 'Resilience4j & Circuit Breakers', priority: 'medium', category: 'Microservices & Cloud' },

    // Messaging & Async
    { id: 'sb-async-scheduling', label: 'Async & Scheduling in Spring', priority: 'medium', category: 'Messaging & Async' },
    { id: 'sb-messaging', label: 'Messaging Integration (Kafka, RabbitMQ)', priority: 'low', category: 'Messaging & Async' },

    // Production
    { id: 'sb-production', label: 'Production Spring Boot (Deployment, Monitoring, Tuning)', priority: 'medium', category: 'Production' },
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
