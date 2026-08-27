import type { ConceptCard, ConceptSection } from '../../types'

const sdFundamentalsConcepts: ConceptCard[] = [
// Group: Scaling Fundamentals
  {
    id: 'horizontal-vs-vertical-scaling',
    title: 'Horizontal vs Vertical Scaling',
    group: 'Scaling Fundamentals',
    definition: 'Vertical scaling adds more resources (CPU, RAM) to a single machine, while horizontal scaling adds more machines and distributes load across them.',
    whyItMatters: [
      'Vertical scaling has a hard ceiling (largest available instance) and a single point of failure; horizontal scaling has near-linear headroom but forces you to confront statelessness, data partitioning, and coordination',
      'Vertical scaling is often the right first move — it is operationally simpler and avoids distributed-systems complexity until you actually need it',
    ],
    remember: [
      'Vertical scaling: simpler, no code changes, but downtime to resize and a ceiling set by hardware',
      'Horizontal scaling: requires the service to be stateless (or state to be externalized) before it pays off',
    ],
    interviewAngle: { q: 'Why not just always scale horizontally from day one?', a: 'It adds real complexity — load balancing, session/state externalization, data consistency across nodes — that is wasted cost if a single bigger box would have handled the load for years.' },
    readMinutes: 2,
    related: ['stateless-vs-stateful'],
  },
  {
    id: 'stateless-vs-stateful',
    title: 'Stateless vs Stateful Services',
    group: 'Scaling Fundamentals',
    definition: 'A stateless service keeps no client-specific data between requests (or externalizes it), so any instance can handle any request; a stateful service pins request handling to instances that hold relevant in-memory or on-disk state.',
    whyItMatters: [
      'Statelessness is the precondition for horizontal scaling and simple load balancing — instances become interchangeable and can be added, removed, or restarted without losing anything',
      'Moving state out of the app tier (session store, shared cache, database) trades a small latency/hop cost for elastic scalability and simpler failover',
    ],
    remember: [
      'Sticky sessions are a workaround for stateful app servers, not a solution — they reintroduce a single point of failure per user and complicate rebalancing',
      'Statelessness applies to the compute tier; the state has to live somewhere — it just moves to a dedicated, purpose-built store',
    ],
    readMinutes: 2,
    related: ['horizontal-vs-vertical-scaling', 'spof-redundancy'],
  },
  {
    id: 'throughput-vs-latency',
    title: 'Throughput vs Latency',
    group: 'Scaling Fundamentals',
    definition: 'Latency is the time to complete one request; throughput is the number of requests a system completes per unit time — optimizing one can degrade the other.',
    whyItMatters: [
      'Batching, buffering, and larger queue depths raise throughput but add queueing delay to each individual request — a classic mechanism behind Little\'s Law (avg items in system = arrival rate x avg time per item)',
      'Interviewers probe whether a candidate can state which metric actually matters for the use case (a payment API cares about p99 latency; a log ingestion pipeline cares about sustained throughput)',
    ],
    remember: [
      'p50/p99/p999 latency percentiles matter more than averages — averages hide the tail that angry users actually experience',
      'Pushing utilization toward 100% capacity increases queueing latency non-linearly, even though throughput looks fine on average',
    ],
    readMinutes: 2,
  },

  // Group: Reliability Concepts
  {
    id: 'spof-redundancy',
    title: 'Single Point of Failure & Redundancy',
    group: 'Reliability Concepts',
    definition: 'A single point of failure (SPOF) is any component whose failure takes down the whole system; redundancy eliminates it by running multiple independent instances so no single failure is fatal.',
    whyItMatters: [
      'Redundancy alone is not enough — replicas must be independent (different racks, AZs, or regions) or a correlated failure (power outage, bad deploy) takes all of them out together',
      'Every "add a component" decision in a design interview should be paired with "what happens when this one dies," even if the answer is deferred to a later deep-dive',
    ],
    remember: [
      'N+1 redundancy tolerates one failure; N+2 tolerates one failure during maintenance on another node',
      'Redundancy trades cost (running idle/duplicate capacity) for availability — always frame it as a tradeoff, not a free win',
    ],
    readMinutes: 2,
  },
  {
    id: 'availability-nines-sla-slo-sli',
    title: 'Availability, Nines, and SLA vs SLO vs SLI',
    group: 'Reliability Concepts',
    definition: 'Availability is usually expressed in "nines" (99.9%, 99.99%...), and is formalized through an SLI (the measured metric), an SLO (the internal target for that metric), and an SLA (the external, often contractual, commitment with consequences for missing it).',
    whyItMatters: [
      'Each additional nine roughly cuts allowed downtime by 10x (99.9% ~ 8.8 hrs/year, 99.99% ~ 52 min/year) — and each additional nine costs disproportionately more engineering effort, not linearly more',
      'SLOs are set stricter than SLAs on purpose, giving an internal error budget/buffer before an SLA breach — teams should act on SLO burn, not wait for the SLA to be violated',
    ],
    remember: [
      'SLI = the raw measurement (e.g. request success rate); SLO = the internal target on that SLI; SLA = the customer-facing promise with a penalty',
      'Availability targets should be set per-dependency — a system cannot be more available than the least available component in its critical path unless redundancy compensates',
    ],
    interviewAngle: { q: 'Your service depends on three external APIs, each with 99.9% availability. What is your effective availability if all three are on the critical path?', a: 'Roughly 99.9%^3 ≈ 99.7% if failures are independent — worse than any single dependency, which is why critical-path dependencies compound and should be minimized or made non-blocking.' },
    readMinutes: 2,
    related: ['spof-redundancy'],
  },
  {
    id: 'cap-tradeoff-overview',
    title: 'The Consistency/Availability Tradeoff (High Level)',
    group: 'Reliability Concepts',
    definition: 'In a distributed system, a network partition forces a choice between serving requests with potentially stale data (favoring availability) or refusing requests until consistency can be guaranteed (favoring consistency) — the deep mechanics of this tradeoff are formalized as the CAP theorem.',
    whyItMatters: [
      'Recognizing that this tradeoff exists — and naming it explicitly early in a design — signals seniority even before diving into specific consistency models or consensus protocols',
      'The right choice is domain-dependent: an inventory count leans consistent, a social media like-counter leans available',
    ],
    remember: [
      'This card intentionally stays at the "this tradeoff exists and you must pick a lean" level — the specific consistency models, quorum math, and consensus algorithms are a separate deep-dive topic',
    ],
    readMinutes: 1,
  },

  // Group: The Interview Framework
  {
    id: 'sd-interview-framework',
    title: 'The System Design Interview Framework',
    group: 'The Interview Framework',
    definition: 'A repeatable structure for a design interview: clarify requirements and constraints, estimate scale, sketch a high-level design, deep-dive into 1-2 components the interviewer probes, then identify bottlenecks and failure modes.',
    whyItMatters: [
      'Jumping straight to a detailed architecture without clarifying scope is the single most common way senior candidates lose points — the interviewer is evaluating judgment about ambiguity, not just technical knowledge',
      'Time-boxing each phase (roughly 5-10 min clarify/estimate, 15-20 min high-level, remaining time on deep dives) keeps the conversation from stalling on one component',
    ],
    remember: [
      'Always separate functional requirements (what it does) from non-functional ones (scale, latency, availability targets) before designing anything',
      'State assumptions out loud and ask which of them the interviewer wants to relax — that is the signal they use to steer the deep dive',
    ],
    readMinutes: 2,
    diagram: 'flowchart LR\n  a[Clarify requirements] --> b[Estimate scale]\n  b --> c[High level design]\n  c --> d[Deep dive]\n  d --> e[Identify bottlenecks]',
  },
  {
    id: 'requirements-clarification',
    title: 'Clarifying Requirements: Functional vs Non-Functional',
    group: 'The Interview Framework',
    definition: 'Functional requirements define what the system must do (features, APIs, user flows); non-functional requirements define the qualities it must have (scale, latency targets, availability, consistency needs) and usually drive the harder design decisions.',
    whyItMatters: [
      'Two systems with identical functional requirements can have completely different architectures depending on non-functional constraints (100 users vs 100 million changes everything)',
      'Interviewers often deliberately leave requirements vague to see whether the candidate asks — silence here reads as inexperience regardless of downstream design quality',
    ],
    remember: [
      'Always ask about read/write ratio, expected scale (users, QPS, data volume), latency expectations, and consistency requirements before whiteboarding components',
      'Explicitly cut scope out-of-bounds ("I will assume auth is handled elsewhere") to keep the session focused',
    ],
    readMinutes: 2,
  },
  {
    id: 'bottleneck-identification',
    title: 'Identifying Bottlenecks',
    group: 'The Interview Framework',
    definition: 'A bottleneck is the single component whose capacity limit caps the throughput or latency of the entire system, regardless of how much other components are scaled.',
    whyItMatters: [
      'Scaling a non-bottleneck component wastes effort and cost — the correct move is always to find and relieve the tightest constraint first, then find the next one (bottlenecks migrate)',
      'A strong deep-dive answer names a concrete bottleneck (e.g. a single database write path, a synchronous downstream call) and proposes a specific relief mechanism, not a vague "add more servers"',
    ],
    remember: [
      'Common bottleneck sources: a single database instance under write load, a synchronous call to a slow downstream service, disk I/O, or a hot shard/partition key',
      'Load testing and monitoring (queue depth, saturation, error rate under load) are how bottlenecks are found in practice, not guessed at',
    ],
    readMinutes: 2,
    related: ['back-pressure'],
  },

  // Group: Design Tradeoffs
  {
    id: 'read-heavy-vs-write-heavy',
    title: 'Read-Heavy vs Write-Heavy Design Implications',
    group: 'Design Tradeoffs',
    definition: 'A system\'s read-to-write ratio should drive core architectural choices — read-heavy systems optimize for fan-out and staleness tolerance (caching, replicas), while write-heavy systems optimize for ingestion throughput and durability (partitioning, write buffering, async processing).',
    whyItMatters: [
      'Stating "this is read-heavy, roughly 100:1" early in an interview justifies later decisions (adding a cache layer, read replicas) instead of those decisions appearing arbitrary',
      'Misjudging the ratio is a common trap: a system that looks read-heavy in steady state can have write-heavy bursts (e.g. a flash sale) that need separate handling',
    ],
    remember: [
      'Read-heavy levers: caching, read replicas, CDN/edge caching, denormalization for read speed',
      'Write-heavy levers: partitioning/sharding by write key, write-ahead buffering or queues, batching writes, relaxing durability where acceptable',
    ],
    readMinutes: 2,
  },
  {
    id: 'sync-vs-async-communication',
    title: 'Synchronous vs Asynchronous Communication',
    group: 'Design Tradeoffs',
    definition: 'Synchronous communication has the caller block waiting for a response, coupling the caller\'s latency and availability to the callee\'s; asynchronous communication decouples them by handing off work (via a queue or event) and continuing without waiting.',
    whyItMatters: [
      'Synchronous chains compound latency and availability risk — if any hop in a synchronous call chain is slow or down, the whole chain feels it, and failures cascade upstream',
      'Async communication improves resilience and lets producers and consumers scale independently, at the cost of added complexity: eventual consistency, harder debugging/tracing, and the need for idempotent consumers',
    ],
    remember: [
      'Use synchronous when the caller genuinely needs the result before proceeding (e.g. an auth check); use async when the work can be decoupled from the request path (e.g. sending a notification, updating a search index)',
      'Async does not eliminate coupling — it trades temporal coupling for a dependency on message durability and delivery guarantees',
    ],
    readMinutes: 2,
    related: ['back-pressure'],
  },
  {
    id: 'back-pressure',
    title: 'Back-Pressure',
    group: 'Design Tradeoffs',
    definition: 'Back-pressure is a system\'s mechanism for signaling to upstream producers that it cannot keep up, so producers slow down, buffer, or shed load instead of overwhelming the downstream component.',
    whyItMatters: [
      'Without back-pressure, a slow consumer under load either grows an unbounded queue (memory exhaustion) or silently drops work — back-pressure makes the overload explicit and controllable',
      'It is a general systems concept that shows up everywhere: bounded queues between service tiers, flow control at the network layer, and rate limiting at an API boundary are all applications of the same idea',
    ],
    remember: [
      'Bounded queues + explicit rejection (fail fast) beat unbounded queues + eventual crash — a full queue is a signal, not just a limit',
      'Back-pressure can propagate: a downstream service applying back-pressure should cause the upstream caller to also slow its own producers, not just queue more locally',
    ],
    readMinutes: 2,
    related: ['sync-vs-async-communication', 'bottleneck-identification'],
  },
]

const sdCapConsistencyConcepts: ConceptCard[] = [
// Group: CAP Theorem
  {
    id: 'cap-theorem-precise',
    title: 'CAP Theorem, Precisely Defined',
    group: 'CAP Theorem',
    definition: 'In a distributed system, Consistency means every read sees the most recent write (or an error), Availability means every request to a non-failed node gets a response, and Partition tolerance means the system keeps operating despite dropped or delayed messages between nodes — you can only guarantee two of the three when a partition actually occurs.',
    whyItMatters: [
      'The common "pick 2 of 3" phrasing misleads people into designing around C-vs-A permanently, when the real constraint only bites during an actual network partition',
      'Partition tolerance is not optional for any system spanning more than one node over an unreliable network — so in practice CAP is really a CP-vs-AP choice',
    ],
    remember: ['Consistency here means linearizability, not the C in ACID', 'The theorem is about worst-case behavior during a partition, not normal operation'],
    diagram: 'flowchart LR\n  C[Consistency] --- A[Availability]\n  A --- P[Partition Tolerance]\n  P --- C\n  N[Network Partition Occurs] --> C\n  N --> A',
    readMinutes: 2,
  },
  {
    id: 'cap-partition-only-tradeoff',
    title: 'The Tradeoff Only Applies During a Partition',
    group: 'CAP Theorem',
    definition: 'A system runs with full consistency and availability during normal operation — CAP only forces a choice between the two while a partition is actually in progress, and the choice can be made per-operation rather than as a fixed system-wide label.',
    whyItMatters: [
      'Calling a system "CP" or "AP" as a blanket label oversimplifies — many real systems (e.g. Cassandra, DynamoDB) let you tune consistency per-request via quorum settings, behaving differently operation to operation',
      'Interviewers probe whether you understand this nuance versus reciting "we chose AP" as a memorized answer',
    ],
    remember: ['During normal operation there is no CAP tradeoff at all — both C and A hold', 'The interesting design question is: what does this node do when it cannot reach the others right now?'],
    interviewAngle: {
      q: 'Is a system either CP or AP all the time?',
      a: 'No — that label only describes behavior during a partition. Many systems tune the choice per request (e.g. quorum reads/writes), and outside of a partition they are both consistent and available.',
    },
    readMinutes: 2,
    related: ['cap-theorem-precise', 'pacelc-extension'],
  },
  {
    id: 'pacelc-extension',
    title: 'PACELC: The Tradeoff That Exists Even Without a Partition',
    group: 'CAP Theorem',
    definition: 'PACELC extends CAP by pointing out that even when there is no Partition, a system must still choose between Latency and Consistency (E-lse, L-atency, C-onsistency) — synchronously replicating a write to be consistent costs latency, and cutting that latency means serving reads that might be stale.',
    whyItMatters: [
      'CAP alone says nothing about the vastly more common case: normal, partition-free operation, where every system still trades latency against consistency on every write',
      'Explains why systems that are technically "CP" still offer tunable read/write latency knobs — that knob is the ELC half of PACELC, not the PAC half',
    ],
    remember: ['PA/EL example: DynamoDB, Cassandra — favor availability during a partition, and low latency otherwise', 'PC/EC example: a system doing synchronous multi-region replication for every write, always favoring consistency'],
    readMinutes: 2,
    related: ['cap-partition-only-tradeoff'],
  },

  // Group: Consistency Models
  {
    id: 'strong-consistency',
    title: 'Strong Consistency',
    group: 'Consistency Models',
    definition: 'Every read reflects the most recent completed write, as if there were only a single copy of the data, regardless of which replica serves the request.',
    whyItMatters: [
      'Required whenever stale reads cause a correctness bug, not just a UX blemish — e.g. an account balance check before allowing a withdrawal',
      'Costs the most: writes typically cannot be acknowledged until enough replicas confirm, which raises latency and reduces availability under partition',
    ],
    remember: ['Strong consistency is what most engineers mean colloquially by "consistency," but it is one point on a spectrum, not the only correct answer'],
    readMinutes: 1,
    related: ['linearizability-vs-serializability'],
  },
  {
    id: 'eventual-consistency',
    title: 'Eventual Consistency',
    group: 'Consistency Models',
    definition: 'If no new writes occur, all replicas will converge to the same value eventually, but a read at any given moment may return a stale or out-of-order value with no bound on when convergence happens.',
    whyItMatters: [
      'Acceptable when staleness is cosmetic and self-correcting, like a social media like count or view count that a user won\'t notice lagging by a second',
      'Cheapest model in terms of latency and availability, which is why it is the default in most highly-available NoSQL stores',
    ],
    remember: ['"Eventually" has no SLA by default — some systems bound it (e.g. bounded staleness), most do not'],
    readMinutes: 1,
    related: ['causal-consistency', 'quorum-consistency-nwr'],
  },
  {
    id: 'causal-consistency',
    title: 'Causal Consistency',
    group: 'Consistency Models',
    definition: 'Operations that are causally related (e.g. a reply to a comment) are seen by every observer in the same order, while causally unrelated operations can be seen in different orders by different observers.',
    whyItMatters: [
      'Fixes the classic eventual-consistency bug where a reply appears before the comment it responds to — a real UX defect, not just staleness',
      'Sits in the useful middle ground: stronger guarantees than plain eventual consistency without paying for full strong consistency\'s coordination cost',
    ],
    remember: ['Implemented via tracking "happens-before" relationships (e.g. vector clocks), not by touching every replica synchronously'],
    readMinutes: 2,
    related: ['vector-clocks-ordering'],
  },
  {
    id: 'read-your-writes-consistency',
    title: 'Read-Your-Writes Consistency',
    group: 'Consistency Models',
    definition: 'A single client is guaranteed to always see its own prior writes on subsequent reads, even though other clients may still see stale data from a lagging replica.',
    whyItMatters: [
      'Solves the common "I edited my profile and it reverted" complaint — usually fixed cheaply by routing that client\'s next few reads to the primary or to the replica it just wrote to, not by making the whole system strongly consistent',
    ],
    remember: ['A weaker, cheaper guarantee than session consistency\'s full session-level ordering — it only covers writes-then-reads by the same client'],
    readMinutes: 1,
    related: ['session-consistency'],
  },
  {
    id: 'session-consistency',
    title: 'Session Consistency',
    group: 'Consistency Models',
    definition: 'Within a single client session, reads and writes are monotonic and consistent with each other — read-your-writes plus monotonic reads scoped to that session — but guarantees reset once the session ends.',
    whyItMatters: [
      'A pragmatic default for most consumer-facing apps: sticky session routing (same user, same replica, or a session token carrying a version watermark) delivers this cheaply without global coordination',
    ],
    remember: ['Sticky sessions are the common implementation, but they break the guarantee the moment a session fails over to a different server without carrying its watermark'],
    readMinutes: 1,
    related: ['read-your-writes-consistency'],
  },
  {
    id: 'linearizability-vs-serializability',
    title: 'Linearizability vs. Serializability',
    group: 'Consistency Models',
    definition: 'Linearizability is a single-object, real-time guarantee — every operation appears to take effect instantaneously at some point between its start and end — while serializability is a multi-object, transactional guarantee that a set of transactions produces some result equivalent to running them one at a time in *some* order, not necessarily real-time order.',
    whyItMatters: [
      'These are frequently confused because both use the word "order" — but linearizability is about wall-clock recency of a single value, serializability is about transactions not corrupting each other\'s view of multiple values',
      'A system can be serializable without being linearizable (transactions are internally ordered correctly but a read can still return stale data relative to wall-clock time) and vice versa',
      'Strict serializability is the combination of both — the strongest practical guarantee, offered by systems like Spanner',
    ],
    remember: ['Linearizability = "did I get the latest single value"', 'Serializability = "did my multi-step transaction behave as if it ran alone"'],
    interviewAngle: {
      q: 'Can a system be serializable but not linearizable?',
      a: 'Yes — serializability only requires transactions behave as if run in some sequential order; it says nothing about that order matching real wall-clock time, which is what linearizability additionally demands.',
    },
    readMinutes: 3,
    related: ['strong-consistency'],
  },

  // Group: Quorum Systems
  {
    id: 'quorum-consistency-nwr',
    title: 'Quorum Consistency (N/W/R)',
    group: 'Quorum Systems',
    definition: 'With N replicas, a write is acknowledged after W of them confirm it and a read queries R of them and returns the most recent version among those responses — the system is tunable per-operation by choosing W and R independently.',
    whyItMatters: [
      'Lets a single system offer both strongly-consistent and eventually-consistent operations depending on the caller\'s W/R choice, rather than being locked into one model globally',
      'The classic knob interviewers probe: raising W improves durability but hurts write latency/availability; raising R improves read freshness but hurts read latency',
    ],
    remember: ['W + R > N guarantees the read set and write set overlap by at least one replica, so a read always sees the latest write — this is the "quorum" guarantee', 'W + R <= N trades that guarantee away for lower latency (Cassandra\'s default ONE/ONE is an extreme example)'],
    diagram: 'flowchart LR\n  W[Write Quorum W] --> O[Overlap Node]\n  R[Read Quorum R] --> O\n  O --> G[Guaranteed Latest Value]',
    readMinutes: 2,
    related: ['eventual-consistency'],
  },
  {
    id: 'quorum-does-not-guarantee-linearizability',
    title: 'Quorum Overlap Is Not Automatically Linearizable',
    group: 'Quorum Systems',
    definition: 'Satisfying W + R > N guarantees a read will see the latest acknowledged write in terms of version, but without additional coordination (e.g. read-repair ordering, strict timestamps, or a coordinator) concurrent writes can still race and produce anomalies a strict linearizability guarantee would forbid.',
    whyItMatters: [
      'A common interview trap: candidates assume W+R>N alone is "as good as strong consistency" — it is a necessary condition for freshness, not a sufficient one for full linearizability under concurrent writes',
    ],
    remember: ['Real systems (e.g. Dynamo-style) pair quorums with vector clocks or last-write-wins timestamps to resolve concurrent write conflicts, and that conflict-resolution policy is where the real behavior lives'],
    readMinutes: 2,
    related: ['quorum-consistency-nwr', 'vector-clocks-ordering'],
  },

  // Group: Ordering Events
  {
    id: 'vector-clocks-ordering',
    title: 'Vector Clocks / Logical Clocks',
    group: 'Ordering Events',
    definition: 'A logical clock (e.g. a per-node counter in a vector clock) tags each event so that, without relying on synchronized wall-clock time, nodes can determine whether one event causally happened-before another or whether the two are concurrent.',
    whyItMatters: [
      'Wall-clock timestamps across machines are unreliable for ordering (clock skew, NTP drift) — logical clocks give a correct causal order using only message-passing, no synchronized clocks required',
      'When a vector clock comparison shows two writes are concurrent (neither happened-before the other), that is a genuine conflict the system must resolve — merge, last-write-wins, or surface it to the application',
    ],
    remember: ['A vector clock is one counter per replica/node; comparing two vectors tells you happened-before, happened-after, or concurrent — never a false ordering', 'This is conceptual machinery for causal consistency and conflict detection, not a replication protocol on its own'],
    readMinutes: 2,
    related: ['causal-consistency'],
  },

  // Group: Choosing a Consistency Model
  {
    id: 'consistency-model-selection',
    title: 'Choosing a Consistency Model Per Feature',
    group: 'Choosing a Consistency Model',
    definition: 'The right consistency model is a per-feature decision driven by the cost of showing a stale or wrong value versus the cost of the latency/availability paid to prevent it — not a single system-wide setting.',
    whyItMatters: [
      'A bank balance before a withdrawal needs strong consistency (showing money that isn\'t there causes real harm); a social media like count is fine eventually consistent (staleness is invisible and self-heals)',
      'Senior-level judgment is knowing that most systems mix models feature-by-feature — e.g. an e-commerce site uses strong consistency for inventory decrement at checkout but eventual consistency for the product recommendation carousel',
    ],
    remember: ['Ask: what breaks if this read is 2 seconds stale — a support ticket, or a compliance violation?', 'Default to the weakest model that avoids real harm — stronger consistency is not free, it costs latency and availability everywhere it\'s applied'],
    interviewAngle: {
      q: 'Would you use the same consistency model for a bank balance and a like counter?',
      a: 'No — the balance needs strong consistency because staleness causes real financial harm (e.g. overdraft), while the like counter can be eventually consistent because a momentarily stale count has no real cost and self-corrects.',
    },
    readMinutes: 2,
    related: ['strong-consistency', 'eventual-consistency'],
  },
]

const sdApiDesignConcepts: ConceptCard[] = [
// Group: REST Design Principles
  {
    id: 'rest-resource-orientation',
    title: 'Resource-Oriented Design (Nouns, Not Verbs)',
    group: 'REST Design Principles',
    definition: 'REST URLs identify resources (nouns like /orders/42) while HTTP verbs express the action, so /createOrder or /getUserById signals the API is really RPC wearing REST clothing.',
    whyItMatters: [
      'Consistent noun-based URLs let clients predict endpoints for new resources without reading docs',
      'Verb-in-URL APIs tend to grow one-off endpoints per action, defeating cacheability and uniform tooling',
    ],
    remember: [
      'Collection: /orders (plural noun); item: /orders/42; nested: /orders/42/items',
      'Actions that do not map to CRUD (e.g. "cancel an order") are modeled as a sub-resource or state change (POST /orders/42/cancellation) rather than a verb in the path',
    ],
    readMinutes: 2,
  },
  {
    id: 'http-verb-status-semantics',
    title: 'HTTP Verb and Status Code Semantics',
    group: 'REST Design Principles',
    definition: 'GET/PUT/DELETE are idempotent and safe-or-not by definition, and status codes should communicate precise outcomes (201 vs 200, 409 vs 422) rather than always returning 200 with an error field in the body.',
    whyItMatters: [
      'Clients, proxies, and retry logic key off verb semantics and status codes automatically — misusing them breaks caching, retries, and generic tooling',
      'A 200-with-error-body API forces every client to parse the body just to know if a call succeeded',
    ],
    remember: [
      '201 Created (with Location header) for successful POST that creates a resource, 204 No Content for successful action with no body',
      '409 Conflict = state conflict (e.g. version mismatch), 422 Unprocessable Entity = semantically invalid payload, 400 = malformed request',
    ],
    interviewAngle: {
      q: 'Why is PUT idempotent but POST is not?',
      a: 'PUT is defined as a full replace of a resource at a known URL — sending it twice yields the same end state. POST typically means "create a new subordinate resource," so sending it twice creates two resources unless the server explicitly de-duplicates.',
    },
    readMinutes: 2,
  },
  {
    id: 'api-error-shape-design',
    title: 'Consistent Error Response Design',
    group: 'REST Design Principles',
    definition: 'A well-designed API returns a uniform error envelope (machine-readable error code, human message, and a retry-safety signal) across every endpoint instead of ad-hoc shapes per service.',
    whyItMatters: [
      'Clients build one error-handling path instead of per-endpoint special cases, which matters most at organizational scale with many teams calling many services',
      'A retryable flag or explicit status-code convention (5xx vs 4xx) lets generic client libraries decide whether to retry without guessing',
    ],
    remember: [
      'Separate "client should not retry" (4xx, bad input) from "client may retry" (503, 429, timeout) at the status-code level, not just in prose docs',
      'Include a stable machine-readable error code (ORDER_ALREADY_CANCELLED) alongside the human message — messages change wording, codes should not',
    ],
    readMinutes: 2,
    related: ['idempotency-keys'],
  },

  // Group: Versioning & Compatibility
  {
    id: 'api-versioning-strategies',
    title: 'API Versioning Strategies',
    group: 'Versioning & Compatibility',
    definition: 'The three common approaches are versioning in the URL path (/v2/orders), in a custom header, or via content negotiation (Accept: application/vnd.api+json;version=2) — each trades discoverability for purity differently.',
    whyItMatters: [
      'URL versioning is the most operationally simple (cacheable, visible in logs, easy to route) but "pollutes" the URL and implies the resource itself changed identity',
      'Header/content-negotiation versioning keeps URLs stable but is harder to test in a browser, harder to cache correctly, and easy for clients to forget to set',
    ],
    remember: [
      'Most large public APIs (Stripe, GitHub) use header or media-type versioning for fine-grained control; most internal/microservice APIs default to URL versioning for operational simplicity',
      'Whatever the mechanism, version at the API-contract level, not per-field — mixing field-level flags into a stable version is a common design smell',
    ],
    readMinutes: 2,
  },
  {
    id: 'breaking-vs-nonbreaking-changes',
    title: 'Breaking vs Non-Breaking Changes',
    group: 'Versioning & Compatibility',
    definition: 'Adding an optional field or a new endpoint is non-breaking; removing/renaming a field, changing a field\'s type, tightening validation, or changing default behavior is breaking and requires a new version or a deprecation window.',
    whyItMatters: [
      'Most production incidents from "just a small API change" come from changes that look additive but break clients doing strict parsing or relying on a previously-loose contract',
      'Codifying this list lets teams self-serve the decision instead of escalating every change to a versioning debate',
    ],
    remember: [
      'Making a previously-optional field required is breaking even though the field already existed',
      'Reordering enum values or adding new enum values can break clients with exhaustive switch statements — treat enum growth as a compatibility risk, document as append-only',
    ],
    interviewAngle: {
      q: 'You need to rename a field in a widely-consumed API response. How do you do it without breaking clients?',
      a: 'Add the new field alongside the old one, dual-write both for a deprecation window, mark the old one deprecated in docs/response metadata, monitor usage, then remove it only once usage drops to zero or the version is retired — never a same-version rename.',
    },
    readMinutes: 2,
  },
  {
    id: 'api-deprecation-lifecycle',
    title: 'Deprecation Lifecycle Management',
    group: 'Versioning & Compatibility',
    definition: 'Retiring an API version safely means announcing deprecation, signaling it programmatically (Deprecation/Sunset headers), measuring real consumer traffic, and only removing the version after usage is verified near zero.',
    whyItMatters: [
      'Internal teams routinely keep calling a "deprecated" endpoint for years if deprecation is only a docs note — usage telemetry, not a calendar date, should gate removal',
      'Sunset headers let automated tooling and monitoring flag callers before a human notices a changelog entry',
    ],
    remember: [
      'Deprecation header signals "this will go away"; Sunset header gives the actual date — both are advisory, not enforcement',
      'A hard cutover date should be enforced by returning 410 Gone after sunset, not by silently changing behavior',
    ],
    readMinutes: 1,
  },

  // Group: Pagination & Idempotency
  {
    id: 'cursor-vs-offset-pagination',
    title: 'Cursor-Based vs Offset-Based Pagination',
    group: 'Pagination & Idempotency',
    definition: 'Offset pagination (LIMIT/OFFSET, page=3) re-runs the full scan-and-skip on every request and shifts results when rows are inserted or deleted mid-pagination; cursor pagination (WHERE id > last_seen_id) anchors to a stable position and scales to large, actively-written datasets.',
    whyItMatters: [
      'Offset pagination on a large table gets slower as the offset grows (the DB still scans and discards all skipped rows) and produces duplicate or skipped items if rows are inserted/deleted between page requests',
      'Cursor pagination requires a stable, unique, sortable key (or composite key) and cannot jump to an arbitrary page number, which is a real UX tradeoff worth calling out',
    ],
    remember: [
      'Offset is fine for small, mostly-static datasets or admin UIs that need "jump to page N"',
      'Cursor is the default for infinite-scroll feeds, activity logs, or any dataset with concurrent writes',
    ],
    example: {
      code: {
        language: 'http',
        code: 'GET /orders?limit=50&cursor=eyJpZCI6MTIzNDV9\n\n{\n  "items": [...],\n  "nextCursor": "eyJpZCI6MTIzOTV9"\n}',
      },
      note: 'Cursor is typically an opaque, base64-encoded pointer so clients cannot construct or depend on its internal structure.',
    },
    readMinutes: 2,
  },
  {
    id: 'idempotency-keys',
    title: 'Idempotency Keys for Non-Idempotent Operations',
    group: 'Pagination & Idempotency',
    definition: 'POST is not idempotent by default, so clients that need safe retries (e.g. after a timeout) send a client-generated Idempotency-Key header; the server caches the first response for that key and replays it on duplicate requests instead of re-executing the side effect.',
    whyItMatters: [
      'Network timeouts are ambiguous — the client cannot tell if the request failed before or after the server-side effect happened, so blind retry without idempotency risks double-charging, double-shipping, etc.',
      'This is the standard pattern for payment APIs (Stripe) and any POST that has an irreversible side effect',
    ],
    remember: [
      'The key must be generated client-side (a UUID) before the first attempt so retries reuse the same key',
      'The server needs to store key->response mappings with a TTL, and must handle the case of a duplicate request arriving while the original is still in flight (return 409 or block)',
    ],
    readMinutes: 2,
    related: ['api-error-shape-design'],
  },
  {
    id: 'api-rate-limit-contract',
    title: 'Rate Limiting as an API Contract',
    group: 'Pagination & Idempotency',
    definition: 'From the API-contract side, rate limiting means returning 429 Too Many Requests with standard headers (RateLimit-Limit, RateLimit-Remaining, Retry-After) so clients can back off correctly, regardless of which limiting algorithm the server uses internally.',
    whyItMatters: [
      'A well-designed 429 response lets client SDKs implement generic backoff without per-API special-casing; an API that just returns a bare 429 with no headers forces guesswork',
      'Retry-After matters more than the exact algorithm to a consumer — the contract, not the implementation, is this subtopic\'s concern (algorithm internals like token bucket belong to rate-limiting infrastructure)',
    ],
    remember: [
      'Always pair 429 with a Retry-After (seconds or HTTP-date) so well-behaved clients don\'t hammer the endpoint immediately after being throttled',
      'Distinguish per-user/per-key limits from global limits in the response so clients can tell which quota they hit',
    ],
    readMinutes: 1,
  },
  {
    id: 'webhooks-vs-polling',
    title: 'Webhooks vs Polling',
    group: 'Pagination & Idempotency',
    definition: 'Polling has the client repeatedly ask "anything new?" (simple, client-controlled, wasteful at scale); webhooks have the server push an HTTP callback to the client when an event happens (efficient, but requires the client to run a reachable endpoint and the provider to handle retries/verification).',
    whyItMatters: [
      'Webhooks push the reliability problem onto the sender: the receiver may be down, so the API design must define retry/backoff, delivery-order guarantees (usually none), and signature verification (HMAC) to prove authenticity',
      'Consumers of webhooks must treat delivery as at-least-once and design handlers to be idempotent — the same idempotency-key thinking applies in reverse',
    ],
    remember: [
      'Webhook payloads are commonly kept thin (event type + resource id) with the receiver calling back into the API for full data — this avoids stale/oversized payloads and permission-leak risk',
      'Always sign webhook payloads (HMAC secret) so receivers can verify the request actually came from the claimed sender',
    ],
    readMinutes: 2,
  },

  // Group: REST vs gRPC vs GraphQL
  {
    id: 'rest-grpc-graphql-tradeoffs',
    title: 'REST vs gRPC vs GraphQL: Choosing the Right Style',
    group: 'REST vs gRPC vs GraphQL',
    definition: 'REST suits public, cacheable, resource-centric APIs; gRPC suits low-latency internal service-to-service calls with strict typed contracts; GraphQL suits client-driven UIs that need flexible, aggregated data from multiple sources in one round trip.',
    whyItMatters: [
      'The real tradeoff isn\'t raw speed — it\'s who controls the contract and how much flexibility clients need: REST/gRPC put the server in control of response shape, GraphQL hands that control to the client',
      'Picking gRPC for a public API loses HTTP cacheability and browser-native tooling; picking GraphQL for simple internal CRUD adds resolver complexity with no real benefit',
    ],
    remember: [
      'REST: ubiquitous tooling, HTTP caching works out of the box, human-readable, but over/under-fetching is common',
      'gRPC: binary (protobuf), HTTP/2 multiplexing and streaming, strongly typed contract, but not browser-native without a proxy (grpc-web) and payloads aren\'t human-readable on the wire',
      'GraphQL: single endpoint, client picks exact fields, great for varied client needs (mobile vs web), but shifts query cost and N+1 risk onto the server',
    ],
    diagram: 'flowchart LR\n  client[Client] -->|REST resource calls| rest[REST API]\n  client -->|typed RPC calls| grpc[gRPC Service]\n  client -->|single flexible query| graphql[GraphQL Gateway]\n  graphql --> svcA[Service A]\n  graphql --> svcB[Service B]',
    readMinutes: 3,
  },
  {
    id: 'grpc-protobuf-http2',
    title: 'gRPC: Protobuf and HTTP/2 Streaming',
    group: 'REST vs gRPC vs GraphQL',
    definition: 'gRPC defines service contracts in .proto files compiled to strongly-typed client/server stubs, serializes with compact binary Protocol Buffers, and runs over HTTP/2, enabling bidirectional streaming and connection multiplexing that plain REST/JSON-over-HTTP/1.1 doesn\'t offer.',
    whyItMatters: [
      'The typed contract (.proto) catches shape mismatches at compile time rather than at runtime JSON parsing, which matters a lot across many internal services owned by different teams',
      'Streaming RPCs (client-streaming, server-streaming, bidirectional) fit use cases REST models awkwardly, like live telemetry or chunked uploads',
    ],
    remember: [
      'Binary protobuf is smaller and faster to (de)serialize than JSON, but the tradeoff is losing human-readability for debugging — you need tooling (grpcurl) instead of curl',
      'Schema evolution in protobuf uses numbered fields; never reuse or renumber a field tag, or old binary data decodes incorrectly',
    ],
    readMinutes: 2,
  },
  {
    id: 'graphql-nplus1-overfetching',
    title: 'GraphQL: Over/Under-Fetching Fix and the N+1 Problem',
    group: 'REST vs gRPC vs GraphQL',
    definition: 'GraphQL solves REST\'s over-fetching (getting fields you don\'t need) and under-fetching (needing multiple round trips to assemble a view) by letting the client specify exactly the fields and nested relations it wants in one query — but naive resolver implementations then issue one database query per item in a list, the classic N+1 problem.',
    whyItMatters: [
      'The N+1 problem is the single most common GraphQL production performance bug: a query for 50 orders, each resolving its own customer field, can silently trigger 51 database round trips',
      'Fixing it (DataLoader-style batching, which coalesces per-field resolver calls within one request tick into a single batched fetch) is table-stakes GraphQL server engineering, not an edge case',
    ],
    remember: [
      'Batch + cache resolvers per request (DataLoader pattern) to collapse N+1 into 1 batched query',
      'A flexible query language also means the server must guard against expensive/deeply-nested queries — query cost analysis or max depth limits are part of the design, not optional',
    ],
    interviewAngle: {
      q: 'A GraphQL endpoint that lists 100 orders with their line items is timing out under load. What\'s the likely cause and fix?',
      a: 'Likely N+1: the resolver for line items is running one query per order instead of batching. Fix by introducing a batched loader (e.g. DataLoader) keyed on order id so all 100 orders\' line-item lookups collapse into a single IN-clause query per request.',
    },
    readMinutes: 2,
    related: ['rest-grpc-graphql-tradeoffs'],
  },
  {
    id: 'graphql-schema-design-cost',
    title: 'GraphQL Schema Design and Query-Cost Tradeoffs',
    group: 'REST vs gRPC vs GraphQL',
    definition: 'A GraphQL schema is a shared contract across every client using the API, so schema design decisions (nullable vs required fields, connection/edge pagination conventions, deprecation via @deprecated) have outsized blast radius, and the server must bound query flexibility to avoid unbounded cost.',
    whyItMatters: [
      'Unlike REST where each endpoint has a bounded, known cost, GraphQL clients can construct arbitrarily deep/wide queries — the server needs cost analysis, depth limiting, or persisted queries to keep this bounded in production',
      'Because one schema serves every client, breaking schema changes affect all consumers simultaneously — GraphQL APIs lean heavily on additive evolution (@deprecated fields left in place) rather than versioning the whole API',
    ],
    remember: [
      'Persisted queries (client sends a query hash, not full query text) are a common production technique to eliminate arbitrary ad-hoc queries against a public GraphQL endpoint',
      'GraphQL doesn\'t get HTTP-level caching for free (single POST endpoint) — caching has to happen at the field/resolver or client-cache-normalization level instead',
    ],
    readMinutes: 2,
  },
]

const sdLoadBalancingConcepts: ConceptCard[] = [
// Group: Load Balancing Fundamentals
  {
    id: 'reverse-proxy-pattern',
    title: 'Reverse Proxy Pattern',
    group: 'Load Balancing Fundamentals',
    definition: 'A server-side intermediary that accepts client requests on behalf of backend servers, forwards them, and returns the response — the client only ever talks to the proxy, never to a specific backend.',
    whyItMatters: [
      'Decouples clients from backend topology, so instances can be added, removed, or replaced without any client-side change',
      'The single place to terminate TLS, compress responses, or cache — a load balancer is a reverse proxy with routing logic layered on top',
    ],
    remember: ['Forward proxy hides the client from the server; reverse proxy hides the server from the client'],
    readMinutes: 1,
  },
  {
    id: 'dns-vs-dedicated-lb',
    title: 'DNS-Based Load Balancing vs Dedicated LB',
    group: 'Load Balancing Fundamentals',
    definition: 'DNS load balancing returns different backend IPs to different clients on lookup, while a dedicated load balancer sits in the request path and makes a routing decision on every request.',
    whyItMatters: [
      'DNS balancing is coarse: it can\'t react to a backend dying mid-TTL because resolvers and OS-level DNS caches ignore or outlive the TTL, so traffic keeps flowing to a dead IP',
      'A dedicated LB sees every request and can pull an unhealthy instance out instantly, but it becomes a hop, a cost, and a potential bottleneck/SPOF in the path',
    ],
    remember: ['DNS balancing is often the first layer (routing to a region), with a dedicated LB or gateway doing the fine-grained per-request work within that region'],
    interviewAngle: { q: 'Why doesn\'t lowering the DNS TTL fully fix DNS load balancing\'s reaction time to an outage?', a: 'Many resolvers and client OS caches don\'t honor low TTLs strictly, and clients that already resolved and cached the IP keep using it until their own cache expires — DNS balancing is fundamentally a suggestion, not an enforced route.' },
    readMinutes: 2,
  },
  {
    id: 'global-vs-regional-lb',
    title: 'Global vs Regional Load Balancing',
    group: 'Load Balancing Fundamentals',
    definition: 'Global load balancing routes a client to the best region or data center (typically via geo/latency-aware DNS or anycast), while regional load balancing then distributes that traffic across instances within the chosen region.',
    whyItMatters: [
      'Latency-based global routing sends users to the nearest healthy region, which is both a performance win and a disaster-recovery mechanism if a whole region fails',
      'The two layers solve different problems — global routing is coarse and infrequent (per-connection or DNS-TTL granularity), regional routing is fine-grained and per-request',
    ],
    remember: ['Anycast lets multiple data centers advertise the same IP, letting network routing itself pick the nearest one — no DNS layer needed'],
    readMinutes: 2,
  },

  // Group: Algorithms
  {
    id: 'lb-algorithm-round-robin',
    title: 'Round Robin & Weighted Round Robin',
    group: 'Load Balancing Algorithms',
    definition: 'Round robin cycles through backend instances in order for each new request; weighted round robin assigns each instance a weight so more-capable instances receive proportionally more traffic.',
    whyItMatters: [
      'Simple and stateless, but blind to actual instance load — a slow request on one instance doesn\'t stop new requests from being routed to it next in line',
      'Weighting is essential during a rolling deploy or in a heterogeneous fleet (mixed instance sizes) where equal shares would overload the smaller instances',
    ],
    remember: ['Plain round robin assumes uniform request cost and uniform instance capacity — neither holds in most real services'],
    readMinutes: 2,
  },
  {
    id: 'lb-algorithm-least-connections',
    title: 'Least Connections',
    group: 'Load Balancing Algorithms',
    definition: 'Routes each new request to whichever backend currently has the fewest active connections, adapting to real-time load rather than assuming uniform request cost.',
    whyItMatters: [
      'Handles uneven request duration well (some requests are cheap, some expensive) — round robin would keep piling requests onto an already-overloaded instance',
      'Requires the LB to track live connection counts per backend, which is cheap for L4 (TCP connections) but needs care at L7 with persistent/multiplexed connections (e.g. HTTP/2) where connection count no longer tracks request load',
    ],
    remember: ['Weighted least connections combines both: divide active connections by instance weight/capacity before comparing'],
    readMinutes: 2,
  },
  {
    id: 'lb-algorithm-ip-hash',
    title: 'IP Hash / Hash-Based Routing',
    group: 'Load Balancing Algorithms',
    definition: 'Deterministically maps a request to a backend by hashing a request attribute (typically client IP), so the same client consistently lands on the same instance.',
    whyItMatters: [
      'Gives session affinity without a session store, since the same client always reaches the same backend — but a naive modulo-hash reshuffles almost all mappings whenever the instance count changes',
      'Client IP is an imperfect key: NATed clients (corporate networks, mobile carriers) collapse many users onto one hash, causing skewed load',
    ],
    remember: ['A plain hash % N scheme is why consistent hashing exists — it fixes the reshuffling problem on scale-up/down'],
    related: ['consistent-hashing-ring'],
    readMinutes: 2,
  },
  {
    id: 'lb-algorithm-choice',
    title: 'Choosing an Algorithm',
    group: 'Load Balancing Algorithms',
    definition: 'The right algorithm depends on whether requests are uniform-cost, whether backends are homogeneous, and whether the workload needs affinity or cache locality.',
    whyItMatters: [
      'Round robin/weighted round robin fits uniform, stateless, homogeneous-ish fleets; least connections fits variable request duration; consistent hashing fits caching/affinity workloads where the destination itself matters, not just balance',
      'Picking least connections for a workload with mostly-uniform, short requests just adds bookkeeping overhead for no real benefit over round robin',
    ],
    remember: ['There is no universally "best" algorithm — it\'s a match between traffic shape and algorithm assumption'],
    readMinutes: 1,
  },

  // Group: Layer 4 vs Layer 7
  {
    id: 'layer4-vs-layer7-lb',
    title: 'Layer 4 vs Layer 7 Load Balancing',
    group: 'Layer 4 vs Layer 7',
    definition: 'A Layer 4 load balancer routes based on transport-level info (IP, TCP/UDP port) without inspecting the payload, while a Layer 7 load balancer terminates the connection and reads application content (HTTP method, headers, path, cookies) to decide where to send it.',
    whyItMatters: [
      'L4 is faster and cheaper — it just forwards packets/streams — but it can\'t make content-aware decisions like routing /api/payments differently from /api/search',
      'L7 enables path-based and header-based routing, request rewriting, and per-route policies, at the cost of terminating TLS and parsing the application protocol on the LB itself (more CPU, more latency, one more place to be a bottleneck)',
    ],
    remember: ['L4 forwards connections; L7 terminates one connection and often opens a new one to the backend, meaning it can multiplex/reuse backend connections independently of client connections'],
    diagram: `flowchart LR
  client[Client] --> l4[L4 Load Balancer]
  l4 -->|tcp forward| backend1[Backend A]
  client2[Client] --> l7[L7 Load Balancer]
  l7 -->|reads path and headers| backend2[Backend B]
  l7 -->|reads path and headers| backend3[Backend C]`,
    interviewAngle: { q: 'Why can an L7 load balancer do content-based routing but an L4 one can\'t?', a: 'L4 only sees transport-layer info (IP/port) and forwards the stream without decrypting or parsing it, so it has no visibility into the HTTP request. L7 terminates the connection (including TLS) and parses the application protocol, so it can read the path, headers, or cookies before deciding where to send the request.' },
    readMinutes: 3,
  },

  // Group: Health Checks
  {
    id: 'health-checks-active-passive',
    title: 'Active vs Passive Health Checks',
    group: 'Health Checks',
    definition: 'Active health checks are periodic synthetic probes the load balancer sends to each backend independent of real traffic; passive health checks infer health by observing real request outcomes (errors, timeouts) as they happen.',
    whyItMatters: [
      'Active checks catch a dead instance even during a traffic lull, but add constant background load and detection is only as fast as the probe interval',
      'Passive checks react instantly to real failures with zero extra load, but need actual traffic to notice a problem, and a burst of legitimate errors can trigger a false ejection',
    ],
    remember: ['Production systems typically run both: active for baseline readiness/liveness, passive for fast reaction (outlier detection / ejection) during live traffic'],
    readMinutes: 2,
  },
  {
    id: 'unhealthy-instance-ejection',
    title: 'Detecting and Routing Around Unhealthy Instances',
    group: 'Health Checks',
    definition: 'When health checks fail past a configured threshold, the load balancer removes the instance from its routing pool and periodically re-probes it before adding it back.',
    whyItMatters: [
      'A single failed check shouldn\'t eject an instance (network blips happen) — thresholds (e.g. 3 consecutive failures) and re-inclusion criteria trade off false-positive ejections against slow reaction to real failures',
      'Re-adding an instance too eagerly right after it recovers can send it a thundering herd of routed traffic before it\'s actually warmed up, causing it to fail again',
    ],
    remember: ['Slow-start / ramp-up after re-inclusion (gradually increasing traffic share) avoids re-crashing a just-recovered instance'],
    readMinutes: 2,
  },

  // Group: Consistent Hashing
  {
    id: 'consistent-hashing-ring',
    title: 'Consistent Hashing Ring',
    group: 'Consistent Hashing',
    definition: 'Both backend nodes and request keys are hashed onto the same circular hash space (a ring), and each key is routed to the first node found walking clockwise from its position.',
    whyItMatters: [
      'Adding or removing a node only remaps the keys between it and its predecessor on the ring — roughly 1/N of all keys — instead of the near-total reshuffle a plain hash % N causes',
      'This is what makes it viable for routing to a fleet that resizes: caching layers, sharded stores, and consistent-hash load balancers all lean on this property to avoid mass cache invalidation or mass connection churn on scale events',
    ],
    remember: ['Without virtual nodes a small ring can distribute load very unevenly, since node positions are essentially random points on the circle'],
    diagram: `flowchart LR
  keyA[Key A] --> node1[Node 1]
  keyB[Key B] --> node2[Node 2]
  keyC[Key C] --> node2
  keyD[Key D] --> node3[Node 3]`,
    related: ['virtual-nodes', 'lb-algorithm-ip-hash'],
    readMinutes: 3,
  },
  {
    id: 'virtual-nodes',
    title: 'Virtual Nodes (Ring Replication)',
    group: 'Consistent Hashing',
    definition: 'Each physical node is hashed onto the ring at many points (virtual nodes) instead of one, so its share of the key space is an average over many small arcs rather than one large, luck-of-the-draw arc.',
    whyItMatters: [
      'Without virtual nodes, load distribution depends entirely on where each node happens to land on the ring — one node can end up owning a much larger arc than another purely by hash chance',
      'More virtual nodes per physical node smooths distribution further but increases the metadata/lookup overhead the LB or client must maintain — it\'s a tunable tradeoff, not free',
    ],
    remember: ['A node leaving now only affects the (now more numerous, smaller) arcs it owned, spreading its lost load across many other nodes instead of dumping it all on one neighbor'],
    readMinutes: 2,
  },

  // Group: Session Affinity
  {
    id: 'sticky-sessions',
    title: 'Sticky Sessions (Session Affinity)',
    group: 'Session Affinity',
    definition: 'The load balancer pins a client to the same backend instance for the duration of a session, typically via a cookie or IP/hash-based routing.',
    whyItMatters: [
      'Needed when session state (e.g. an in-memory shopping cart or WebSocket connection) lives only on one instance — without affinity, the next request could hit an instance that has never seen that client',
      'Fights horizontal scaling directly: it prevents even load redistribution, makes scale-down/instance-replacement disruptive (that instance\'s sessions are stranded), and turns a should-be-stateless fleet into a set of pets rather than cattle',
    ],
    remember: ['The scalable fix is externalizing session state (shared cache/store) so any instance can serve any request — affinity is a workaround, not the target architecture', 'Sticky sessions also complicate rolling deploys: draining a sticky instance means either waiting out its sessions or forcibly breaking them'],
    interviewAngle: { q: 'Why is a sticky-session design considered a smell in a horizontally-scaled system?', a: 'It couples a client to a specific instance, which undermines the two things horizontal scaling depends on: even load distribution across instances, and the ability to freely add/remove/replace instances. The scalable alternative is making instances stateless and externalizing session state to a shared store.' },
    readMinutes: 2,
  },

  // Group: API Gateway Patterns
  {
    id: 'api-gateway-responsibilities',
    title: 'API Gateway Responsibilities',
    group: 'API Gateway Patterns',
    definition: 'A single entry point in front of a service fleet that centralizes cross-cutting concerns — authentication, routing to the right backend/service, rate-limit enforcement, request/response transformation, and response aggregation — so individual services don\'t each reimplement them.',
    whyItMatters: [
      'Centralizing auth and routing means individual services can trust that a request reaching them already passed the gateway\'s checks, simplifying every downstream service',
      'Aggregation (the gateway fanning one client request out to several backend calls and combining the results) reduces client-side chattiness, especially valuable for mobile clients over higher-latency networks',
    ],
    remember: ['A gateway enforces rate limits (rejecting over-quota requests); it doesn\'t implement the limiting algorithm itself — that\'s a separate concern (token bucket, sliding window, etc.)'],
    related: ['gateway-bottleneck-tradeoff'],
    readMinutes: 2,
  },
  {
    id: 'gateway-bottleneck-tradeoff',
    title: 'API Gateway as Bottleneck / SPOF',
    group: 'API Gateway Patterns',
    definition: 'Because every request funnels through the gateway, it becomes both a latency-adding hop on every call and a single point of failure if it isn\'t itself deployed as a redundant, horizontally-scaled fleet.',
    whyItMatters: [
      'Centralizing cross-cutting logic in one gateway is a tradeoff, not a free win — it adds a network hop and a shared-fate component in exchange for not duplicating that logic across every service',
      'Gateway outages are total outages for everything behind them, so the gateway itself needs the same rigor (redundancy, health checks, no single-instance deploys) as the load balancer sitting in front of any other critical service',
    ],
    remember: ['A common mitigation is deploying multiple gateway instances behind their own load balancer, and keeping the gateway\'s per-request logic lightweight so it doesn\'t become a latency tax'],
    readMinutes: 2,
  },
]


const sdSqlVsNosqlConcepts: ConceptCard[] = [
// Group: Relational Fundamentals
  {
    id: 'acid-properties',
    title: 'ACID Properties',
    group: 'Relational Fundamentals',
    definition: 'Atomicity, Consistency, Isolation, and Durability are the guarantees a relational transaction makes: all-or-nothing execution, valid state transitions, isolated concurrent execution, and survival of a crash once committed.',
    whyItMatters: [
      'Each letter is a separable guarantee you can partially relax — isolation level is the most commonly tuned for throughput, while atomicity and durability are rarely negotiable',
      'Interviewers use this to check you know isolation is about concurrent transactions, not about data being "correct" in some vague sense',
    ],
    remember: [
      'Consistency here means application-defined invariants (constraints, foreign keys) hold after every transaction — not the same "consistency" as in CAP',
      'Isolation is a spectrum (read uncommitted -> serializable); most databases default to something weaker than serializable for performance',
    ],
    readMinutes: 2,
    related: ['normalization-tradeoffs', 'base-vs-acid'],
  },
  {
    id: 'normalization-tradeoffs',
    title: 'Normalization vs Denormalization',
    group: 'Relational Fundamentals',
    definition: 'Normalization eliminates redundant data by splitting it across related tables to guarantee a single source of truth; denormalization deliberately duplicates data to avoid joins at read time.',
    whyItMatters: [
      'Normalized schemas make writes cheap and consistent but push cost onto reads via joins; denormalized schemas make reads cheap but push cost onto writes, which must update every copy',
      'The right level of normalization depends on read:write ratio, not on textbook purity — a write-heavy ledger table wants more normalization than a read-heavy product catalog',
    ],
    remember: [
      '3NF is the common target for OLTP schemas; deliberate denormalization (or a read-optimized materialized view) is common for reporting or high-QPS read paths',
      'This is the same tradeoff NoSQL modeling makes by default, just applied selectively in SQL',
    ],
    interviewAngle: {
      q: 'When would you denormalize a relational schema rather than switch to NoSQL?',
      a: 'When you still need transactional guarantees and ad-hoc query flexibility but one specific hot read path is join-bound — denormalize just that path (a summary table, a materialized view) while keeping the normalized source of truth underneath.',
    },
    readMinutes: 2,
    related: ['modeling-for-access-patterns'],
  },
  {
    id: 'when-relational-fits',
    title: 'When a Relational Model Is the Right Choice',
    group: 'Relational Fundamentals',
    definition: 'Relational databases fit when data has many-to-many relationships that need to be queried flexibly, when transactional integrity across multiple entities matters, or when the query patterns are not fully known upfront.',
    whyItMatters: [
      'The relational model\'s real strength is that you don\'t need to predict every query at schema design time — ad-hoc joins and filters work on any column',
      'Financial systems, inventory, and anything with strict invariants across multiple related records (e.g. an order and its line items) usually want ACID transactions, not eventual consistency',
    ],
    remember: [
      'Relational is not "the safe legacy default" — it is a deliberate choice when query flexibility and cross-entity consistency outweigh raw write throughput',
    ],
    readMinutes: 1,
    related: ['acid-properties', 'polyglot-persistence'],
  },

  // Group: NoSQL Categories
  {
    id: 'nosql-categories-overview',
    title: 'The Four Main NoSQL Categories',
    group: 'NoSQL Categories',
    definition: 'Key-value, document, wide-column, and graph stores each optimize for a different access shape rather than being interchangeable "NoSQL" alternatives to SQL.',
    whyItMatters: [
      'Treating "NoSQL" as one category is a common junior mistake — a graph database and a key-value store solve almost opposite problems',
      'Picking the category should be driven by the shape of your queries (point lookup vs traversal vs range scan), not by scale requirements alone',
    ],
    diagram: 'flowchart LR\n  A[Access shape] -->|point lookup| B[Key value]\n  A -->|nested by id| C[Document]\n  A -->|sequential writes| D[Wide column]\n  A -->|traversal| E[Graph]',
    readMinutes: 2,
    related: ['key-value-stores', 'document-stores', 'wide-column-stores', 'graph-databases'],
  },
  {
    id: 'key-value-stores',
    title: 'Key-Value Stores',
    group: 'NoSQL Categories',
    definition: 'A schemaless map from a key to an opaque value, optimized for simple, extremely fast lookups by key with no query language over the value\'s contents.',
    whyItMatters: [
      'Fit: session storage, caches, feature flags, shopping carts — anything where you always fetch by a known key and never need to filter on the value',
      'Redis and DynamoDB both sit here conceptually, but Redis trades durability for in-memory speed while DynamoDB is a managed, disk-backed, horizontally-partitioned service — "key-value" describes the access pattern, not the durability model',
    ],
    remember: ['No secondary indexes by default — if you need to query by a field inside the value, you\'re modeling against the grain of this category'],
    readMinutes: 1,
    related: ['nosql-categories-overview'],
  },
  {
    id: 'document-stores',
    title: 'Document Stores',
    group: 'NoSQL Categories',
    definition: 'Stores that persist semi-structured, typically JSON-like documents and allow querying and indexing on nested fields within them, without requiring a fixed schema across documents.',
    whyItMatters: [
      'Fit: content that naturally nests (a product with variable attributes, a user profile with optional fields) where forcing a rigid table shape would mean sparse columns or extra join tables',
      'MongoDB is the canonical example — flexible schema, secondary indexes on nested fields, but weaker cross-document transactional guarantees than a relational join',
    ],
    remember: ['Schema flexibility means the application, not the database, enforces structure — a real cost when many services write the same collection'],
    readMinutes: 1,
    related: ['nosql-categories-overview', 'schema-flexibility-tradeoff'],
  },
  {
    id: 'wide-column-stores',
    title: 'Wide-Column Stores',
    group: 'NoSQL Categories',
    definition: 'Stores that organize data into rows with a flexible set of columns grouped into column families, laid out on disk to optimize for very high write throughput and tunable consistency per query.',
    whyItMatters: [
      'Fit: time-series and write-heavy event data (metrics, sensor data, activity feeds) where you mostly append and read by a known partition/row key rather than run ad-hoc filters',
      'Cassandra is the canonical example — leaderless replication with per-query tunable consistency (e.g. quorum reads/writes) lets you trade latency for consistency on a per-request basis rather than a fixed database-wide setting',
    ],
    remember: ['"Wide-column" is not the same as a SQL table with many columns — rows can each have a different set of columns, and the physical layout is column-family-oriented for write locality'],
    readMinutes: 2,
    related: ['nosql-categories-overview', 'base-vs-acid'],
  },
  {
    id: 'graph-databases',
    title: 'Graph Databases',
    group: 'NoSQL Categories',
    definition: 'Stores that model data as nodes and edges with first-class relationships, optimized for traversing many-hop connections in constant time per hop rather than via expensive joins.',
    whyItMatters: [
      'Fit: social graphs, fraud/recommendation networks, permission hierarchies — anywhere the query is "find things N hops away" which degrades badly as repeated joins in a relational schema',
      'A relational join re-scans indexes at every hop; a graph database follows a stored pointer, so traversal cost stays roughly flat as relationship depth grows',
    ],
    remember: ['Wrong fit for high-volume simple lookups or aggregate analytics — that\'s paying traversal-optimization cost for a query pattern that doesn\'t need it'],
    readMinutes: 1,
    related: ['nosql-categories-overview'],
  },

  // Group: Data Modeling Judgment
  {
    id: 'modeling-for-access-patterns',
    title: 'Model for Access Patterns, Not Entities',
    group: 'Data Modeling Judgment',
    definition: 'NoSQL schema design starts from "what queries will I run" and shapes the data to answer them directly, in contrast to relational modeling which starts from the entities and their relationships.',
    whyItMatters: [
      'This is the core mental shift moving from SQL to NoSQL modeling — designing entity-first tables and then trying to query them flexibly is the single most common source of production pain in document/wide-column systems',
      'In practice this means duplicating data across multiple documents or row keys, one shaped per query, rather than normalizing and joining at read time',
    ],
    remember: [
      'A common technique: store the same logical entity multiple times, denormalized differently per access pattern (e.g. an order embedded in a customer document AND indexed by order id)',
      'Changing a rarely-changing field once you\'ve denormalized it means updating every copy — this is the tradeoff you\'re accepting, not a bug',
    ],
    interviewAngle: {
      q: 'You\'re modeling a document store schema and don\'t yet know all the future query patterns. What do you do?',
      a: 'Model for the queries you know today and accept that new access patterns may require a new denormalized view, a migration, or a secondary index — unlike relational schemas, you can\'t assume arbitrary future queries will be cheap.',
    },
    readMinutes: 2,
    related: ['normalization-tradeoffs', 'schema-flexibility-tradeoff'],
  },
  {
    id: 'schema-flexibility-tradeoff',
    title: 'Schema Flexibility vs Enforced Structure',
    group: 'Data Modeling Judgment',
    definition: 'A NoSQL document store lets differently-shaped records coexist in the same collection with no schema validation by default, while a relational database rejects any row that violates its declared schema at write time.',
    whyItMatters: [
      'Flexibility is a double-edged sword: it speeds up iteration early on, but without discipline (or added schema validation) it produces "schema drift" where old and new document shapes coexist and every reader must handle both',
      'Enforced structure catches bad writes at the database layer; with a flexible schema, that responsibility moves into application code and code review, which is easy to skip under deadline pressure',
    ],
    remember: ['Document stores increasingly offer optional schema validation (e.g. JSON schema enforcement) as a middle ground — flexibility is a choice, not an inherent limitation'],
    readMinutes: 1,
    related: ['document-stores'],
  },
  {
    id: 'join-support-tradeoff',
    title: 'Join Support and Its Absence',
    group: 'Data Modeling Judgment',
    definition: 'Relational databases support arbitrary multi-table joins at query time; most NoSQL stores support no server-side joins at all, pushing the work of combining related data into the application or into denormalization at write time.',
    whyItMatters: [
      'This is the concrete mechanism behind "NoSQL requires denormalization" — without joins, the only way to answer a query that spans two entities cheaply is to have already combined them when you wrote the data',
      'A design that needs frequent ad-hoc joins across many entities is a strong signal to stay relational, or to keep that piece of the domain in a relational store even in an otherwise polyglot system',
    ],
    remember: ['Some NoSQL systems offer limited join-like features (e.g. lookup/reference operators) but these are typically slower and less flexible than a relational join — not a full substitute'],
    readMinutes: 1,
    related: ['modeling-for-access-patterns', 'when-relational-fits'],
  },

  // Group: Choosing the Right Store
  {
    id: 'base-vs-acid',
    title: 'BASE vs ACID',
    group: 'Choosing the Right Store',
    definition: 'BASE (Basically Available, Soft state, Eventually consistent) describes the looser guarantees many NoSQL systems favor over strict ACID transactions in exchange for higher availability and throughput.',
    whyItMatters: [
      'BASE is not "no guarantees" — it\'s a deliberate tradeoff (related to CAP) that accepts a window of staleness in exchange for the system staying available and fast under partition or heavy load',
      'The real interview signal is knowing which parts of a system can tolerate "soft state" (a like count, a view count) versus which cannot (an account balance) — this drives per-component database choice, not a single system-wide decision',
    ],
    remember: ['Some NoSQL stores let you opt back into stronger consistency per-operation (e.g. quorum reads) — BASE is often a tunable default, not an absolute'],
    readMinutes: 2,
    related: ['acid-properties', 'wide-column-stores'],
  },
  {
    id: 'nosql-scaling-story',
    title: 'The Actual Scaling Story: SQL vs NoSQL',
    group: 'Choosing the Right Store',
    definition: '"NoSQL scales better" oversimplifies a real but narrower fact: many NoSQL systems were designed from the start for horizontal, leaderless, multi-node writes, while relational databases historically scaled by scaling up a single writer, though modern distributed SQL systems have closed much of this gap.',
    whyItMatters: [
      'The honest tradeoff isn\'t "SQL doesn\'t scale" — it\'s that horizontal write scaling in a relational system requires giving up some of what makes it relational (cross-shard joins, cross-shard transactions), converging toward NoSQL-style tradeoffs anyway',
      'Read-heavy relational workloads scale well with read replicas and caching without touching this tradeoff at all — the scaling problem is specifically about write throughput and dataset size beyond one node',
    ],
    remember: ['Newer distributed SQL systems (e.g. Spanner-style designs) exist precisely to blur this line — know this exists so you don\'t present the SQL/NoSQL scaling divide as absolute'],
    readMinutes: 2,
    related: ['when-relational-fits'],
  },
  {
    id: 'polyglot-persistence',
    title: 'Polyglot Persistence',
    group: 'Choosing the Right Store',
    definition: 'Using multiple different database types within one system, each chosen to fit a specific service or workload\'s access pattern, rather than forcing every workload onto a single database technology.',
    whyItMatters: [
      'This is usually the realistic senior-level answer to "SQL or NoSQL" — most real systems of any size are polyglot (e.g. relational for orders, key-value for sessions, document store for a catalog, search index for text search)',
      'The cost is real and often underweighted in interviews: more operational surface area, more failure modes, more expertise required across the team, and harder cross-store consistency when a workflow spans multiple databases',
    ],
    remember: ['A good answer names the specific workload-to-store mapping and explicitly acknowledges the operational cost, rather than treating polyglot persistence as a free win'],
    interviewAngle: {
      q: 'What is the hidden cost of polyglot persistence that people often gloss over?',
      a: 'Operational cost: every additional database type is another system to operate, monitor, back up, and staff for, and any workflow that touches two of them loses the single-database transactional guarantee, forcing you to handle partial failure between stores explicitly.',
    },
    readMinutes: 2,
    related: ['when-relational-fits'],
  },
]

const sdReplicationConcepts: ConceptCard[] = [
// Group: Replication Strategies
  {
    id: 'leader-follower-replication',
    title: 'Single-Leader (Leader-Follower) Replication',
    group: 'Replication Strategies',
    definition: 'All writes go through one designated leader node, which streams the change log to one or more follower replicas that apply it in order and serve reads.',
    whyItMatters: [
      'Writes are trivially serializable — there is exactly one place ordering decisions get made, avoiding write-write conflicts entirely',
      'Read throughput scales by adding followers, but write throughput is capped by a single leader\'s capacity',
    ],
    remember: ['The dominant default for relational databases (Postgres, MySQL) and many NoSQL stores', 'Leader is a single point of failure for writes until a failover completes'],
    diagram: `flowchart LR
  client[Client] --> leader[Leader]
  leader --> f1[Follower One]
  leader --> f2[Follower Two]
  f1 --> reads[Read Traffic]
  f2 --> reads`,
    readMinutes: 2,
    related: ['sync-vs-async-replication', 'leader-failover'],
  },
  {
    id: 'multi-leader-replication',
    title: 'Multi-Leader Replication',
    group: 'Replication Strategies',
    definition: 'Multiple nodes each accept writes independently and replicate their changes to one another, requiring conflict detection or resolution when the same data is modified concurrently on different leaders.',
    whyItMatters: [
      'Useful when write locality matters — e.g. one leader per data center or per region so local writes never cross a WAN before being acknowledged',
      'Trades single-leader\'s simple ordering for the operational burden of conflict resolution (last-write-wins, merge functions, or CRDTs)',
    ],
    remember: ['Common in multi-datacenter deployments and offline-first clients (each device is effectively a leader)', 'Silent last-write-wins conflict resolution quietly discards concurrent updates — a real data-loss risk if adopted without thought'],
    readMinutes: 2,
  },
  {
    id: 'leaderless-replication',
    title: 'Leaderless Replication',
    group: 'Replication Strategies',
    definition: 'Any replica can accept a write directly from the client, which sends the write (and reads) to multiple replicas in parallel and relies on quorum overlap and read repair to converge.',
    whyItMatters: [
      'No leader means no failover pause — the system tolerates individual node failure without an election, favoring availability during partitions',
      'Pushes conflict handling to read time (read repair, version vectors) rather than write time, which this subtopic\'s sibling on CAP/quorums covers mechanically',
    ],
    remember: ['Used by Dynamo-style stores (Cassandra, Riak, DynamoDB)', 'Requires anti-entropy background processes to fix replicas that missed writes entirely, not just ones caught by read repair'],
    readMinutes: 2,
    related: ['leader-follower-replication'],
  },

  // Group: Replication Tradeoffs
  {
    id: 'sync-vs-async-replication',
    title: 'Synchronous vs Asynchronous Replication',
    group: 'Replication Tradeoffs',
    definition: 'Synchronous replication waits for a follower (or quorum of followers) to confirm the write before acknowledging the client, while asynchronous replication acknowledges immediately and streams the change afterward.',
    whyItMatters: [
      'Synchronous gives a durability guarantee (data survives leader loss) at the cost of write latency and availability — if the synchronous follower is unreachable, writes stall',
      'Asynchronous keeps write latency low and the leader available even if followers lag, but an unacknowledged write is lost outright if the leader crashes before shipping it',
    ],
    remember: ['A common middle ground is "semi-synchronous": one follower is synchronous (for durability), the rest are async (for throughput)', 'Fully synchronous to all followers is rare in practice — one slow or dead replica would block every write'],
    interviewAngle: { q: 'Why would a team deliberately choose async replication when it can lose acknowledged writes?', a: 'Because synchronous replication ties write latency and availability to the slowest/least-reachable replica; for many workloads bounded data loss on a rare leader crash is a better tradeoff than elevated p99 latency or write unavailability on every replica hiccup.' },
    readMinutes: 2,
  },
  {
    id: 'replication-lag-consequences',
    title: 'Replication Lag and Read Consistency Issues',
    group: 'Replication Tradeoffs',
    definition: 'The delay between a write landing on the leader and that write becoming visible on a follower, which surfaces as user-visible anomalies when reads are routed to lagging followers.',
    whyItMatters: [
      'Read-your-writes violations: a user who just wrote data reads from a follower that hasn\'t caught up and sees their own change vanish',
      'Monotonic-read violations: a user can see a follower rewind — one read shows a comment, a later read from a different (less caught-up) follower does not',
    ],
    remember: ['Fix patterns: route a user\'s own post-write reads to the leader (or a replica known caught-up) for some time window; pin a user to the same replica per session (sticky routing) for monotonic reads', 'Lag spikes are usually caused by a burst of writes, a slow network link, or a follower catching up after being offline'],
    readMinutes: 2,
  },
  {
    id: 'leader-failover',
    title: 'Leader Failover and Split-Brain Risk',
    group: 'Replication Tradeoffs',
    definition: 'When a leader becomes unreachable, the system must detect the failure, promote a follower to leader, and redirect clients — a process that is inherently error-prone if two nodes both believe they are leader.',
    whyItMatters: [
      'Detecting failure is itself a judgment call: too short a timeout triggers unnecessary failovers on transient blips, too long extends the write-unavailable window',
      'Split-brain (two leaders accepting writes simultaneously) causes silent divergence and is one of the hardest failure modes to clean up after — data written to the wrong leader may need to be discarded',
    ],
    remember: ['A newly promoted leader may be missing the most recent writes if replication was asynchronous, forcing a choice between discarding those writes or reconciling them', 'Consensus protocols (Raft, Paxos-based systems) exist specifically to make leader election safe against split-brain, at the cost of requiring a quorum to make progress'],
    readMinutes: 2,
  },

  // Group: Partitioning Strategies
  {
    id: 'range-based-partitioning',
    title: 'Range-Based Partitioning',
    group: 'Partitioning Strategies',
    definition: 'Data is split into shards by contiguous ranges of the key (e.g. A-M, N-Z, or time windows), keeping each shard\'s keys sorted.',
    whyItMatters: [
      'Preserves efficient range queries and ordered scans since adjacent keys stay on the same shard',
      'Prone to hotspots when writes cluster at one end of the range — e.g. a monotonically increasing key like a timestamp or auto-increment ID sends all current writes to the same shard',
    ],
    remember: ['Boundaries are typically rebalanced dynamically as shards grow (e.g. HBase region splits, Bigtable tablets) rather than fixed at creation'],
    readMinutes: 2,
    related: ['shard-key-hotspot-risk'],
  },
  {
    id: 'hash-based-partitioning',
    title: 'Hash-Based Partitioning',
    group: 'Partitioning Strategies',
    definition: 'A hash function is applied to the shard key and the result determines the target shard, spreading keys pseudo-randomly across all shards.',
    whyItMatters: [
      'Distributes write load evenly regardless of key access patterns, eliminating the sequential-write hotspot that plain range partitioning suffers from',
      'Destroys key ordering, so range scans (e.g. "all events between two timestamps") now have to fan out to every shard instead of hitting a contiguous chunk',
    ],
    remember: ['Some systems hash-partition by a prefix and range-partition within it (compound keys) to get even distribution for one dimension and efficient range scans for another'],
    readMinutes: 2,
  },
  {
    id: 'consistent-hashing-sharding',
    title: 'Consistent Hashing for Shard Placement',
    group: 'Partitioning Strategies',
    definition: 'Shards (and keys) are placed on a hash ring so that adding or removing a shard only remaps the keys adjacent to it on the ring, not the entire keyspace.',
    whyItMatters: [
      'With naive modulo hashing (hash(key) % N), changing N reshuffles nearly every key\'s owning shard; consistent hashing bounds the remapped fraction to roughly 1/N',
      'Virtual nodes (many ring points per physical shard) are used to keep the load distribution even, since a small number of real nodes on a ring can otherwise land unevenly',
    ],
    remember: ['This is the same ring idea used for load-balancer request routing, but applied here to decide which shard owns which data — the goal is minimizing data movement during resharding, not spreading request load'],
    diagram: `flowchart LR
  key[Key Hash] --> ring[Hash Ring]
  ring --> shardA[Shard A]
  ring --> shardB[Shard B]
  ring --> shardC[Shard C]
  newshard[New Shard D] -.inserted into.-> ring`,
    readMinutes: 2,
    related: ['resharding-rebalancing'],
  },

  // Group: Shard Key Design & Resharding
  {
    id: 'shard-key-hotspot-risk',
    title: 'Shard Key Choice and Hotspot Risk',
    group: 'Shard Key Design & Resharding',
    definition: 'The shard key determines how data and traffic distribute across shards, and a poorly chosen one concentrates load on a single shard regardless of how many shards exist.',
    whyItMatters: [
      'Sharding by a low-cardinality or temporally-clustered field (e.g. date, a small enum, a single dominant tenant ID) sends a disproportionate share of writes or reads to one shard, defeating the purpose of sharding',
      'The right key balances even distribution against query patterns — a key that distributes writes perfectly but forces every read to fan out across all shards just moves the cost elsewhere',
    ],
    remember: ['A classic failure case: sharding an events table by event date means all of today\'s writes hit one shard while yesterday\'s shards sit idle', 'Composite keys (e.g. tenant_id + hash) or salting a naturally hot key are common mitigations'],
    interviewAngle: { q: 'You inherit a system sharded by signup date and one shard is consistently overloaded. What\'s happening and how do you fix it without a full resharding?', a: 'New signups all land on the current date range, so the newest shard absorbs all write traffic while older shards go cold — the classic monotonic-key hotspot. Short of a full re-shard, mitigations include hashing/salting the key going forward, splitting the hot shard\'s range further, or adding a secondary dimension (e.g. tenant) to the key so load spreads within the same time window.' },
    readMinutes: 2,
  },
  {
    id: 'resharding-rebalancing',
    title: 'Resharding and Rebalancing Operations',
    group: 'Shard Key Design & Resharding',
    definition: 'The process of changing the number of shards or moving data between them as load grows or skews, which requires migrating live data without downtime or losing writes in flight.',
    whyItMatters: [
      'Naive fixed sharding (hash mod N) makes resharding catastrophic — nearly all keys need to move when N changes, which is why consistent hashing or dynamically-splittable ranges are preferred in practice',
      'Live resharding typically dual-writes or streams changes to the new shard layout while backfilling historical data, then cuts traffic over — getting this wrong risks writes landing on the old shard after cutover and being silently dropped',
    ],
    remember: ['Rebalancing should be automatic and gradual in a mature system (many small chunk moves) rather than a manual, all-at-once operation'],
    readMinutes: 2,
    related: ['consistent-hashing-sharding'],
  },
  {
    id: 'replication-plus-partitioning',
    title: 'Combining Replication and Partitioning',
    group: 'Shard Key Design & Resharding',
    definition: 'Production-scale systems shard data across many nodes for write/storage scale and independently replicate each shard for availability and read scale, so a single logical cluster is really N shards times M replicas.',
    whyItMatters: [
      'The two axes solve different problems and are usually configured independently — e.g. each shard might run as its own single-leader replica set, so a shard\'s leader failing only affects that shard\'s writes, not the whole cluster',
      'This is why "how many nodes do we need" is really two questions — how many shards for the data/write volume, and how many replicas per shard for the desired availability/read capacity',
    ],
    remember: ['A shard\'s leader election and a global resharding operation are separate concerns happening at different layers — conflating them is a common design-review mistake'],
    readMinutes: 1,
  },
]

const sdCachingConcepts: ConceptCard[] = [
// --- Group: Cache Topology ---
  {
    id: 'cache-topology-layers',
    title: 'Cache Placement Across the Request Path',
    group: 'Cache Topology',
    definition: 'A request can be served from a cache at the client, a CDN/edge node, a reverse-proxy/gateway, the application process itself, or a shared distributed store, each trading hit rate, latency, and staleness differently.',
    whyItMatters: [
      'Every layer added removes load from the one behind it, but also adds another place data can go stale independently',
      'Choosing the wrong layer is a common design-interview trap: caching per-user data at the CDN, or caching frequently-changing data in-process across many nodes with no invalidation path',
    ],
    remember: [
      'Client and CDN caches are outside your process boundary — you control them only via headers/TTLs, not direct eviction',
      'In-process (application-level) cache is fastest but not shared across instances, so it duplicates memory and can serve different values per node',
      'Distributed cache (Redis/Memcached) is shared and consistent across instances but adds a network hop versus in-process',
    ],
    readMinutes: 2,
  },
  {
    id: 'reverse-proxy-gateway-cache',
    title: 'Reverse-Proxy / Gateway Caching',
    group: 'Cache Topology',
    definition: 'A cache sitting in front of application servers (e.g. Nginx, Varnish, or an API gateway) that stores full HTTP responses keyed by URL and headers so identical requests never reach the backend.',
    whyItMatters: [
      'Offloads read-heavy, cacheable endpoints without any application code change',
      'Only safe for responses that are the same for all (or a cleanly partitionable set of) callers — mixing in per-user data breaks it or leaks data across users',
    ],
    remember: ['Cache key must include every input that varies the response (query params, Accept-Language, auth scope) or you serve wrong content to some users'],
    readMinutes: 1,
    related: ['cache-key-design'],
  },
  {
    id: 'in-process-vs-distributed-cache',
    title: 'In-Process Cache vs Distributed Cache',
    group: 'Cache Topology',
    definition: 'An in-process (local) cache lives in application memory with zero network latency but is per-instance and lost on restart; a distributed cache like Redis is shared, survives individual instance restarts, and gives every node the same view.',
    whyItMatters: [
      'Fan-out writes to invalidate N in-process caches don\'t scale past a handful of instances — a distributed cache centralizes invalidation to one place',
      'A hybrid two-tier cache (in-process L1 in front of distributed L2) can win on both latency and consistency, but adds real complexity: L1 entries can go stale relative to L2 until their own TTL expires',
    ],
    readMinutes: 2,
    related: ['cache-topology-layers'],
  },

  // --- Group: Caching Patterns ---
  {
    id: 'cache-aside-pattern',
    title: 'Cache-Aside (Lazy Loading)',
    group: 'Caching Patterns',
    definition: 'The application checks the cache first on a read; on a miss it loads from the database, populates the cache, and returns the value, while writes go to the database and the corresponding cache entry is invalidated (not updated).',
    whyItMatters: [
      'Only requested data ever gets cached, so memory isn\'t wasted on cold keys — but the first request after any write or eviction pays full database latency',
      'Invalidate-on-write (delete the key) rather than update-on-write is the safer default: it avoids races where a stale value gets written back into the cache after a concurrent update',
    ],
    remember: [
      'Classic race: read misses, starts loading old value from DB, a write happens and invalidates, then the slow read finishes and writes the now-stale value into the cache — mitigated with short TTLs or versioned writes',
    ],
    diagram: 'flowchart LR\n  App[Application] -->|1 check| Cache[Cache]\n  Cache -->|2 miss| DB[Database]\n  DB -->|3 populate| Cache\n  Cache -->|4 return| App',
    interviewAngle: { q: 'Why invalidate on write instead of updating the cache directly?', a: 'Updating in place risks a stale concurrent read overwriting the fresh value; deleting forces the next read to reload from the source of truth.' },
    readMinutes: 2,
  },
  {
    id: 'write-through-cache',
    title: 'Write-Through Caching',
    group: 'Caching Patterns',
    definition: 'Every write goes to the cache and the database synchronously as a single logical operation before the write is acknowledged to the caller.',
    whyItMatters: [
      'Cache and database never diverge, so reads are always fresh without extra invalidation logic',
      'Every write pays the latency of both the cache and database write, and a value can still be cached without ever being read again, wasting space',
    ],
    remember: ['Good fit when read-after-write consistency matters and write volume is moderate'],
    readMinutes: 1,
    related: ['write-behind-cache'],
  },
  {
    id: 'write-behind-cache',
    title: 'Write-Behind (Write-Back) Caching',
    group: 'Caching Patterns',
    definition: 'A write updates the cache immediately and is acknowledged right away, while the update to the database is buffered and flushed asynchronously, often batched.',
    whyItMatters: [
      'Lowest write latency and can batch/coalesce many writes into fewer database operations, reducing load',
      'A cache node crash before the flush loses acknowledged writes — durability is explicitly traded for latency and throughput',
    ],
    remember: ['Pair with a durable write-ahead log or replicated cache if losing recently-acknowledged writes is unacceptable'],
    readMinutes: 2,
    related: ['write-through-cache'],
  },

  // --- Group: Eviction & Invalidation ---
  {
    id: 'cache-eviction-policies',
    title: 'Eviction Policies: LRU, LFU, TTL',
    group: 'Eviction & Invalidation',
    definition: 'When a cache is full, LRU evicts the least-recently-accessed entry, LFU evicts the least-frequently-accessed entry, and TTL-based eviction removes entries after a fixed time regardless of access pattern.',
    whyItMatters: [
      'LRU fits recency-biased workloads (recent items likely to be requested again) but is vulnerable to a large sequential scan flushing out genuinely hot entries',
      'LFU protects consistently-hot keys against scan pollution but adapts slowly when access patterns shift, and needs decay to avoid keys that were hot once staying "hot" forever',
      'TTL bounds staleness independent of access pattern, and is often layered on top of LRU/LFU rather than used alone',
    ],
    remember: ['Redis defaults to an approximated LRU (sampling, not exact) for performance; exact LRU needs a full access-order structure'],
    readMinutes: 2,
  },
  {
    id: 'cache-invalidation-strategies',
    title: 'Cache Invalidation Strategies',
    group: 'Eviction & Invalidation',
    definition: 'Stale cache entries are cleared either passively via TTL expiry, actively via explicit delete/update calls from the writer, or reactively via events published when the source data changes.',
    whyItMatters: [
      'Phil Karlton\'s line that cache invalidation is one of the two hard problems in computer science holds because there is no free option: TTL alone tolerates staleness up to the TTL window, explicit invalidation requires every writer to remember to do it correctly, and event-driven invalidation adds a messaging dependency and its own lag',
      'Missed invalidation (a write path that forgets to clear the cache) is a top real-world source of "why is stale data showing up" bugs',
    ],
    remember: [
      'Event-driven invalidation (e.g. a change-data-capture stream triggering cache deletes) decouples writers from needing to know about every cache, at the cost of eventual rather than immediate consistency',
    ],
    readMinutes: 2,
    related: ['cache-aside-pattern'],
  },

  // --- Group: CDN & Edge Caching ---
  {
    id: 'cdn-edge-caching',
    title: 'CDN / Edge Caching Fundamentals',
    group: 'CDN & Edge Caching',
    definition: 'A CDN caches responses at geographically distributed edge nodes close to users, serving cache hits directly from the edge and only round-tripping to the origin on a miss or expiry.',
    whyItMatters: [
      'Cuts latency mainly by shortening network distance, not just by avoiding origin compute — a cache hit at an edge node 10ms away beats even an instant origin response 150ms away',
      'Static assets (images, JS bundles, versioned files) are trivially cacheable; dynamic, personalized, or frequently-mutating responses need careful cache-control design or bypass the CDN entirely',
    ],
    remember: ['Origin shielding (a single edge tier that always hits origin on miss, feeding other edges) prevents every edge node from independently stampeding the origin'],
    readMinutes: 2,
  },
  {
    id: 'cache-control-headers',
    title: 'Cache-Control Headers Drive CDN and Browser Behavior',
    group: 'CDN & Edge Caching',
    definition: 'HTTP response headers like Cache-Control, ETag, and Vary tell browsers, proxies, and CDNs how long a response is fresh, how to revalidate it, and which request dimensions make it a distinct cached variant.',
    whyItMatters: [
      'max-age controls browser/shared-cache freshness, s-maxage overrides it specifically for shared caches like a CDN, and no-store vs no-cache mean very different things (never cache at all, versus cache but always revalidate)',
      'A missing or wrong Vary header is a classic bug: a CDN caches one response and serves it to users who should have gotten a different variant (e.g. different language or compression)',
    ],
    remember: ['ETag/If-None-Match enables revalidation: a 304 Not Modified response reuses the cached body and only re-sends when content actually changed'],
    readMinutes: 2,
    related: ['cdn-edge-caching', 'cache-key-design'],
  },
  {
    id: 'cache-key-design',
    title: 'Cache Key Design',
    group: 'CDN & Edge Caching',
    definition: 'The cache key must encode every request dimension that changes the response — URL, relevant query params, headers like Accept-Language or auth scope — or the cache will serve the wrong content to some subset of requests.',
    whyItMatters: [
      'Too narrow a key (ignoring a dimension that matters) causes incorrect responses served from cache; too broad a key (including a dimension that doesn\'t matter, like a tracking query param) tanks the hit rate by fragmenting the cache',
      'Including sensitive per-user data in a key that a CDN shares publicly can leak private responses across users if the auth boundary isn\'t also part of the key',
    ],
    readMinutes: 1,
    related: ['reverse-proxy-gateway-cache', 'cache-control-headers'],
  },

  // --- Group: Failure Modes ---
  {
    id: 'cache-stampede-thundering-herd',
    title: 'Cache Stampede (Thundering Herd)',
    group: 'Failure Modes',
    definition: 'When a hot key expires or a cache is cold-started, many concurrent requests miss simultaneously and all hit the database at once, which can overload it even though the steady-state load is fine.',
    whyItMatters: [
      'This is a self-inflicted outage pattern: the cache that normally protects the database becomes the trigger for overwhelming it, exactly at the moment the database is least prepared',
      'Mitigations: request coalescing (only one caller actually queries the DB, others wait on that result), jittered/randomized TTLs so keys don\'t expire in lockstep, and a distributed lock or "recompute in background while serving stale" strategy',
    ],
    remember: ['Jittering TTLs (base TTL plus random offset) is the cheapest mitigation and requires no new infrastructure'],
    readMinutes: 2,
    related: ['cache-warming'],
  },
  {
    id: 'hot-key-problem',
    title: 'Hot Key Problem',
    group: 'Failure Modes',
    definition: 'A single cache key receives disproportionate traffic (a viral post, a celebrity profile) and overwhelms the one shard/node that owns it, even though the cluster overall has capacity.',
    whyItMatters: [
      'Standard hash-based sharding routes all traffic for that key to one node no matter how large the cluster is — adding more cache nodes doesn\'t help a hot key',
      'Mitigated by replicating the hot value to multiple nodes (or an in-process local cache layer) and load-balancing reads across replicas, or detecting hot keys and handling them specially',
    ],
    readMinutes: 2,
    related: ['in-process-vs-distributed-cache'],
  },
  {
    id: 'cache-warming',
    title: 'Cache Warming',
    group: 'Failure Modes',
    definition: 'Proactively populating a cache with expected-hot data before traffic arrives, rather than waiting for organic cache-aside misses, typically done before a deploy, a cold restart, or a known traffic spike.',
    whyItMatters: [
      'Avoids a burst of cold-cache misses hitting the database right when a new instance or cluster comes online',
      'Needs a source of truth for "what\'s hot" (recent access logs, a fixed known set) or it just pre-loads the wrong data',
    ],
    readMinutes: 1,
    related: ['cache-stampede-thundering-herd'],
  },
  {
    id: 'negative-caching',
    title: 'Negative Caching',
    group: 'Failure Modes',
    definition: 'Caching the fact that a lookup found nothing (a 404, a null result) with its own short TTL, so repeated requests for a known-missing key don\'t all re-hit the database.',
    whyItMatters: [
      'Without it, a client or attacker repeatedly requesting a nonexistent ID (or a bot scanning IDs) forces a full database lookup on every request, defeating the point of caching',
      'Needs a shorter TTL than positive caching, since the missing item may soon start existing (e.g. a resource created just after being checked)',
    ],
    readMinutes: 1,
  },
]

const sdMessagingConcepts: ConceptCard[] = [
// Group: Queue Fundamentals
  {
    id: 'queue-decoupling',
    title: 'Producer/Consumer Decoupling',
    group: 'Queue Fundamentals',
    definition: 'A message queue sits between producers and consumers so neither needs to know the other\'s identity, location, or availability — producers write and move on, consumers read whenever they\'re ready.',
    whyItMatters: [
      'Lets producers and consumers scale, deploy, and fail independently — a slow or down consumer doesn\'t block the producer',
      'Converts a synchronous call chain into an async one, trading immediate consistency for resilience and throughput',
    ],
    remember: ['Decoupling is in time (consumer can be offline) and in space (producer never addresses a consumer directly)'],
    readMinutes: 1,
    related: ['queue-buffering-bursts'],
  },
  {
    id: 'queue-buffering-bursts',
    title: 'Buffering Traffic Bursts',
    group: 'Queue Fundamentals',
    definition: 'A queue absorbs a burst of incoming work by holding it until consumers catch up, converting a spike in arrival rate into a steady processing rate.',
    whyItMatters: [
      'Protects downstream systems (databases, third-party APIs) from being overwhelmed by traffic spikes they weren\'t sized for',
      'Only works if the queue has bounded depth and someone is watching lag — an unbounded queue just delays the outage',
    ],
    readMinutes: 1,
    related: ['backpressure-bounded-queues'],
  },
  {
    id: 'point-to-point-queue-model',
    title: 'Point-to-Point Queue Model',
    group: 'Queue Fundamentals',
    definition: 'In the basic queue model, each message is delivered to and consumed by exactly one consumer, even when multiple consumers are listening — the queue load-balances work across them.',
    whyItMatters: [
      'This is the model for task/work distribution: you want each unit of work done once, by whichever worker is free',
    ],
    remember: ['Contrast with pub/sub: point-to-point is "one message, one consumer"; pub/sub is "one message, every subscriber"'],
    readMinutes: 1,
    related: ['pubsub-vs-point-to-point'],
  },

  // Group: Pub/Sub vs Point-to-Point
  {
    id: 'pubsub-vs-point-to-point',
    title: 'Pub/Sub vs Point-to-Point',
    group: 'Pub/Sub vs Point-to-Point',
    definition: 'Point-to-point delivers each message to exactly one of possibly many competing consumers; pub/sub broadcasts each message to every subscriber independently, each getting its own copy.',
    whyItMatters: [
      'Choosing wrong is a real design bug: point-to-point for a work queue that should fan out becomes a race where only one service reacts; pub/sub for a task queue means every consumer redundantly does the same work',
      'Pub/sub decouples the number and identity of interested parties from the producer — new subscribers can be added without touching the publisher',
    ],
    diagram: 'flowchart LR\n  Publisher --> Topic\n  Topic --> SubA[Subscriber A]\n  Topic --> SubB[Subscriber B]\n  Topic --> SubC[Subscriber C]',
    readMinutes: 2,
    related: ['point-to-point-queue-model', 'competing-consumers-pattern'],
  },
  {
    id: 'topic-vs-queue-terminology',
    title: 'Topics, Queues, and Hybrid Systems',
    group: 'Pub/Sub vs Point-to-Point',
    definition: 'Many real systems blur the line — a Kafka topic is pub/sub across consumer groups but point-to-point within a group, so the same platform supports both patterns depending on how consumers are grouped.',
    whyItMatters: [
      'Interviewers often probe whether you know a single platform (Kafka, SNS+SQS, RabbitMQ) can implement either pattern depending on configuration, not just which platform "is" pub/sub',
    ],
    remember: ['SQS is pure point-to-point; SNS is pure pub/sub; SNS fanning out to multiple SQS queues combines both'],
    readMinutes: 1,
    related: ['consumer-groups-partitioning'],
  },

  // Group: Delivery Guarantees
  {
    id: 'delivery-at-most-once',
    title: 'At-Most-Once Delivery',
    group: 'Delivery Guarantees',
    definition: 'The message is sent (or marked processed) without waiting for confirmation, so it is delivered zero or one times — never redelivered, even after a crash.',
    whyItMatters: [
      'Cheapest and fastest option, appropriate only when occasional silent message loss is acceptable (e.g. best-effort metrics)',
    ],
    remember: ['Fire-and-forget producers and consumers that ack before processing both produce at-most-once semantics'],
    readMinutes: 1,
    related: ['delivery-at-least-once', 'delivery-exactly-once-myth'],
  },
  {
    id: 'delivery-at-least-once',
    title: 'At-Least-Once Delivery',
    group: 'Delivery Guarantees',
    definition: 'The system redelivers a message until it receives a positive acknowledgment, guaranteeing every message is processed at least once but allowing duplicates if the ack is lost or delayed.',
    whyItMatters: [
      'The overwhelmingly common default for real messaging systems because it never silently loses data — the cost is pushed onto the consumer, which must tolerate duplicates',
      'A crash between "processing done" and "ack sent" always produces a duplicate redelivery — there is no way to fully close that window',
    ],
    remember: ['At-least-once + idempotent consumer is the standard production recipe for "effectively exactly-once"'],
    readMinutes: 2,
    interviewAngle: {
      q: 'Why can\'t you just ack right before processing to avoid duplicates?',
      a: 'That converts the guarantee to at-most-once — if the consumer crashes mid-processing after acking, the message is lost forever, not just duplicated.',
    },
    related: ['idempotent-consumers', 'ack-nack-visibility-timeout'],
  },
  {
    id: 'delivery-exactly-once-myth',
    title: 'Exactly-Once Is Mostly Marketing',
    group: 'Delivery Guarantees',
    definition: 'True exactly-once delivery across independent systems is provably very hard (it requires distributed consensus on every hop), so what vendors call "exactly-once" is almost always at-least-once delivery plus deduplication or idempotent processing.',
    whyItMatters: [
      'A senior engineer should be able to explain the mechanism behind a vendor\'s exactly-once claim, not just cite the marketing term',
      'Kafka\'s "exactly-once semantics" works by transactional writes and idempotent producers *within Kafka* — it does not extend the guarantee to an external side effect like calling a payment API',
    ],
    remember: ['If a consumer has any external side effect (HTTP call, write to a different store), exactly-once collapses back to at-least-once for that side effect unless you build idempotency yourself'],
    readMinutes: 2,
    related: ['idempotent-consumers'],
  },
  {
    id: 'idempotent-consumers',
    title: 'Idempotency as the Practical Answer',
    group: 'Delivery Guarantees',
    definition: 'Designing consumers so that processing the same message twice produces the same end state as processing it once turns at-least-once delivery into a safe, effectively-exactly-once system.',
    whyItMatters: [
      'Common techniques: dedupe by a unique message ID stored in the same transaction as the side effect, or design the operation itself to be naturally idempotent (e.g. "set balance to X" instead of "add X")',
    ],
    remember: ['A dedup table keyed on message ID only works if the check-and-write is atomic with the business write — otherwise you\'ve just moved the race condition'],
    readMinutes: 2,
    related: ['delivery-at-least-once', 'delivery-exactly-once-myth'],
  },

  // Group: Ordering & Partitioning
  {
    id: 'ordering-fifo-queues',
    title: 'FIFO Queue Ordering',
    group: 'Ordering & Partitioning',
    definition: 'A FIFO queue guarantees messages are delivered in the exact order they were sent, but this typically caps throughput because messages can\'t be processed out of order or in parallel within the queue.',
    whyItMatters: [
      'Strict global FIFO (e.g. SQS FIFO) trades throughput for ordering — it\'s a deliberate tradeoff, not a free upgrade over a standard queue',
    ],
    readMinutes: 1,
    related: ['ordering-partition-level', 'ordering-global-expensive'],
  },
  {
    id: 'ordering-partition-level',
    title: 'Partition-Level Ordering',
    group: 'Ordering & Partitioning',
    definition: 'Partitioned systems (like Kafka) guarantee order only within a single partition — messages with the same partition key are always processed in order, but there is no ordering guarantee across partitions.',
    whyItMatters: [
      'This is how these systems get both high throughput and ordering guarantees: pick a partition key that groups everything requiring order (e.g. user ID, order ID) onto the same partition',
      'A skewed partition key (e.g. one huge tenant) creates a hot partition that becomes the throughput ceiling for the whole topic',
    ],
    remember: ['Changing the number of partitions on an existing topic reshuffles key-to-partition mapping and breaks previously-guaranteed ordering for that key'],
    readMinutes: 2,
    related: ['consumer-groups-partitioning', 'ordering-global-expensive'],
  },
  {
    id: 'ordering-global-expensive',
    title: 'Why Global Ordering Is Rare',
    group: 'Ordering & Partitioning',
    definition: 'Guaranteeing a single total order across all messages in a system requires funneling everything through one serialization point, which caps throughput at whatever a single writer/partition can handle.',
    whyItMatters: [
      'Most systems don\'t need global order, only order within a logical entity — recognizing that distinction is what lets you pick partition-level ordering instead of over-engineering for a guarantee nobody needs',
    ],
    readMinutes: 1,
    related: ['ordering-partition-level'],
  },
  {
    id: 'consumer-groups-partitioning',
    title: 'Consumer Groups & Partition Assignment',
    group: 'Ordering & Partitioning',
    definition: 'A consumer group splits a topic\'s partitions across its member consumers so each partition is read by exactly one consumer in the group at a time, giving parallelism across partitions while preserving order within each.',
    whyItMatters: [
      'The number of partitions is a hard ceiling on parallelism — adding an 11th consumer to a 10-partition topic leaves it idle',
      'When group membership changes (consumer joins/leaves/crashes), a rebalance reassigns partitions, which briefly pauses consumption and can cause reprocessing near the rebalance boundary',
    ],
    remember: ['Two consumer groups reading the same topic each get their own full copy of every message — groups are how one topic serves both point-to-point (within a group) and pub/sub (across groups)'],
    diagram: 'flowchart LR\n  P0[Partition 0] --> C1[Consumer 1]\n  P1[Partition 1] --> C1\n  P2[Partition 2] --> C2[Consumer 2]\n  P3[Partition 3] --> C3[Consumer 3]',
    readMinutes: 2,
    related: ['ordering-partition-level', 'competing-consumers-pattern'],
  },

  // Group: Failure Handling
  {
    id: 'ack-nack-visibility-timeout',
    title: 'Ack/Nack and Visibility Timeout',
    group: 'Failure Handling',
    definition: 'A consumer must explicitly acknowledge a message after processing it; if no ack arrives within a visibility timeout, the queue assumes the consumer died and makes the message visible again for redelivery.',
    whyItMatters: [
      'A visibility timeout set shorter than actual processing time causes a live, still-working consumer to have its message redelivered to someone else — the classic cause of duplicate processing under load',
      'A nack (explicit negative ack) lets a consumer signal "I saw this and it failed" immediately instead of waiting out the full timeout',
    ],
    remember: ['Visibility timeout must be set relative to worst-case processing time, not average — undersizing it manufactures duplicates you didn\'t need to have'],
    readMinutes: 2,
    related: ['delivery-at-least-once', 'dead-letter-queues'],
  },
  {
    id: 'dead-letter-queues',
    title: 'Dead Letter Queues',
    group: 'Failure Handling',
    definition: 'After a message fails processing (or exceeds its visibility timeout) more than a configured number of times, it\'s routed to a separate dead letter queue instead of being retried forever, isolating poison messages from blocking the main queue.',
    whyItMatters: [
      'Without a DLQ, one malformed message that always throws can be redelivered indefinitely, consuming worker capacity and, in strict-ordering systems, blocking every message behind it',
      'A DLQ is only useful if something monitors and reprocesses it — otherwise it\'s just where failures go to be silently forgotten',
    ],
    remember: ['Max receive count before dead-lettering is a tuning knob: too low dead-letters transient failures, too high wastes capacity retrying a genuinely broken message'],
    readMinutes: 2,
    related: ['ack-nack-visibility-timeout'],
  },
  {
    id: 'backpressure-bounded-queues',
    title: 'Backpressure via Bounded Queues',
    group: 'Failure Handling',
    definition: 'When a queue has a maximum depth, a producer that outpaces consumers eventually gets blocked or rejected instead of the queue growing without limit, forcing the slowdown back onto the producer.',
    whyItMatters: [
      'An unbounded queue turns a slow-consumer problem into an unbounded-memory problem — the failure just moves and gets worse',
      'Consumer lag (how far behind the consumer is, e.g. in Kafka offset terms) is the metric to alert on before backpressure kicks in, since by the time producers are blocked users are already affected',
    ],
    remember: ['Backpressure strategies: block the producer, drop new messages, drop oldest messages, or shed load upstream — each has different data-loss implications'],
    readMinutes: 2,
    related: ['queue-buffering-bursts'],
  },
  {
    id: 'competing-consumers-pattern',
    title: 'Competing Consumers Pattern',
    group: 'Failure Handling',
    definition: 'Multiple identical consumer instances read from the same queue or partition set, each competing for messages, so processing throughput scales horizontally by adding more consumer instances.',
    whyItMatters: [
      'The scaling ceiling differs by system: a plain point-to-point queue scales consumers freely, but a partitioned topic caps useful consumers at the partition count',
      'Consumers must be stateless (or externalize their state) for this to work safely — any given message could land on any instance',
    ],
    readMinutes: 1,
    related: ['consumer-groups-partitioning', 'point-to-point-queue-model'],
  },
]


const sdResiliencePatternsConcepts: ConceptCard[] = [
// Group: Timeout & Retry Fundamentals
  {
    id: 'explicit-timeouts',
    title: 'Explicit Timeouts on Every Network Call',
    group: 'Timeout & Retry Fundamentals',
    definition: 'Every outbound network call needs an explicit timeout, because the default (often "wait forever" or an OS-level TCP timeout measured in minutes) turns one hung dependency into an exhausted caller.',
    whyItMatters: [
      'Too short: healthy-but-slightly-slow calls get killed and retried, adding load exactly when the dependency is under pressure',
      'Too long: a caller thread or connection sits blocked on a dead dependency, and enough of those exhausts the caller\'s own resource pool',
      'A good starting point is a small multiple (p99 or p99.9) of the dependency\'s normal latency, not a round guess like 30s',
    ],
    remember: ['Set connect timeout and request/read timeout separately — a stuck connect and a stuck read are different failure modes', 'Timeout budget should shrink as you go deeper into a call chain, not stay constant at every hop'],
    readMinutes: 2,
  },
  {
    id: 'retry-exponential-backoff-jitter',
    title: 'Exponential Backoff with Jitter',
    group: 'Timeout & Retry Fundamentals',
    definition: 'A failed call is retried after a delay that grows exponentially (e.g. 100ms, 200ms, 400ms...), with randomized jitter added so many clients retrying the same failure don\'t all land on the dependency at the same instant.',
    whyItMatters: [
      'Fixed-delay retries from thousands of clients synchronize into repeated load spikes against an already-struggling dependency',
      'Jitter (full or decorrelated) spreads retries out in time, smoothing the load instead of concentrating it',
    ],
    remember: ['Always cap the max delay and the max number of attempts — unbounded backoff just delays giving up, it doesn\'t prevent it', 'Backoff alone doesn\'t fix a fully dead dependency — it needs to pair with a circuit breaker to stop retrying entirely'],
    readMinutes: 2,
    related: ['circuit-breaker-states', 'retry-storm-amplification'],
  },
  {
    id: 'idempotency-for-safe-retries',
    title: 'Idempotency as a Retry Precondition',
    group: 'Timeout & Retry Fundamentals',
    definition: 'A retry is only safe when the operation is idempotent — running it twice must produce the same end state as running it once, otherwise a retried write can duplicate an effect (double-charge, duplicate order).',
    whyItMatters: [
      'A timeout doesn\'t tell you whether the original request failed before or after the side effect happened server-side — retrying blindly risks double-applying it',
      'Client-generated idempotency keys let the server recognize and dedupe a retried request rather than trusting the client to only retry safe operations',
    ],
    remember: ['GET/PUT/DELETE are naturally idempotent by HTTP semantics; POST usually is not unless the API explicitly adds an idempotency key', 'Idempotency is a server-side contract — a client can\'t make an operation safe to retry just by deciding to retry it'],
    readMinutes: 2,
    interviewAngle: { q: 'Why is it dangerous to blindly retry a POST /charge-card call after a timeout?', a: 'The timeout doesn\'t reveal whether the charge succeeded before the response was lost, so a naive retry risks charging the card twice — safe retries require an idempotency key the server can dedupe on.' },
  },

  // Group: Circuit Breaker
  {
    id: 'circuit-breaker-states',
    title: 'Circuit Breaker State Machine',
    group: 'Circuit Breaker',
    definition: 'A circuit breaker wraps calls to a dependency and moves between Closed (calls pass through normally), Open (calls fail immediately without hitting the dependency), and Half-Open (a limited trial of calls to test recovery) based on observed failure rate.',
    whyItMatters: [
      'Once open, callers fail fast instead of piling up timeouts against a dependency that\'s already down — this protects the caller\'s own threads/connections from exhaustion',
      'It also protects the struggling dependency itself: continuing to hammer it with full traffic while it\'s failing delays its recovery',
      'Half-open lets the breaker test recovery with a trickle of traffic instead of an all-or-nothing switch back to full load',
    ],
    diagram: 'flowchart LR\n  Closed -->|failure rate exceeds threshold| Open\n  Open -->|reset timeout elapses| HalfOpen[Half Open]\n  HalfOpen -->|trial calls succeed| Closed\n  HalfOpen -->|trial calls fail| Open',
    remember: ['Trip threshold is usually a failure-rate window (e.g. 50% of last 20 calls), not a single failure', 'The reset timeout before trying half-open is itself a tuning knob — too short re-floods a still-recovering dependency'],
    readMinutes: 2,
    related: ['bulkhead-isolation', 'fallback-graceful-degradation'],
  },
  {
    id: 'circuit-breaker-vs-retry',
    title: 'Circuit Breaker vs Retry — Complementary, Not Redundant',
    group: 'Circuit Breaker',
    definition: 'Retries handle transient, isolated failures by trying again; circuit breakers handle sustained failure by stopping the trying altogether — they operate at different timescales and are typically layered together, breaker outermost.',
    whyItMatters: [
      'Retrying without a breaker means every caller keeps independently backing off and retrying forever against a dependency that\'s fully down, which is wasted load with zero chance of success',
      'A breaker without retries wastes recoverable transient blips by giving up on the first failure',
    ],
    remember: ['Order matters: retry logic should live inside/behind the breaker check, so an open breaker skips the retry loop entirely instead of retrying into a fast-fail'],
    readMinutes: 1,
  },

  // Group: Bulkhead & Isolation
  {
    id: 'bulkhead-isolation',
    title: 'Bulkhead Pattern (Resource Pool Isolation)',
    group: 'Bulkhead & Isolation',
    definition: 'Each downstream dependency gets its own dedicated pool of threads, connections, or other limited resources, so one slow or failing dependency can\'t exhaust a pool shared across all dependencies.',
    whyItMatters: [
      'Without isolation, a single slow dependency (e.g. a recommendation service) can consume every thread in a shared pool, starving calls to unrelated, healthy dependencies (e.g. checkout) — a form of noisy-neighbor failure inside one service',
      'Named after ship compartments: a hull breach in one compartment doesn\'t sink the whole ship',
    ],
    remember: ['Sizing each bulkhead too generously defeats the purpose — the pool size is the actual blast-radius cap', 'Bulkheads compose with circuit breakers: the breaker trips per-dependency, scoped to that dependency\'s own pool'],
    readMinutes: 2,
    interviewAngle: { q: 'Why did calls to a fast, healthy payment service start timing out when an unrelated recommendations service went slow?', a: 'They shared one thread pool — the slow recommendations calls held threads long enough to exhaust the shared pool, starving unrelated payment calls; per-dependency bulkheads would have contained it.' },
  },
  {
    id: 'load-shedding',
    title: 'Load Shedding',
    group: 'Bulkhead & Isolation',
    definition: 'Deliberately rejecting a portion of incoming requests when a service is near capacity, so the requests it does accept can still be served within acceptable latency instead of the whole service degrading for everyone.',
    whyItMatters: [
      'Trying to serve every request under overload often means serving all of them slowly or timing out — shedding some fast preserves good service for the rest',
      'Shedding decisions can be prioritized (drop low-priority background traffic before user-facing requests) rather than purely random',
    ],
    remember: ['Different tool than rate limiting: rate limiting enforces a per-client quota against abuse/fairness; load shedding is a system-wide self-protection decision based on current load, independent of who\'s asking', 'Shed as early as possible in the request path — rejecting at the edge is cheaper than accepting and then failing deep in the call stack'],
    readMinutes: 2,
  },

  // Group: Fallback & Degradation
  {
    id: 'fallback-graceful-degradation',
    title: 'Fallback Strategies (Graceful Degradation)',
    group: 'Fallback & Degradation',
    definition: 'When a dependency is unavailable, serve something useful instead of an outright error — stale cached data, a simplified/default response, or a reduced feature set — so the failure is felt as degraded quality rather than total outage.',
    whyItMatters: [
      'Users tolerate "recommendations are basic right now" far better than a broken page — degrading gracefully preserves the core experience while a non-critical dependency recovers',
      'Fallback logic needs its own limits: serving stale cache forever silently hides that a dependency is still down',
    ],
    remember: ['Not every dependency deserves a fallback — for a hard dependency (e.g. the payment authorization step of checkout) failing loudly and fast is more correct than faking success', 'Fallbacks pair naturally with an open circuit breaker: open state routes to the fallback path rather than returning a bare error'],
    readMinutes: 2,
    related: ['circuit-breaker-states'],
  },

  // Group: Systemic Failure Patterns
  {
    id: 'retry-storm-amplification',
    title: 'Retry Amplification Across a Call Chain',
    group: 'Systemic Failure Patterns',
    definition: 'When each hop in a multi-service call chain retries independently, a single failure at the bottom of the chain multiplies into far more actual requests against that failing service than the original request count.',
    whyItMatters: [
      'If service A retries 3x and calls B, which retries 3x and calls the failing C, one user request can become up to 9 requests hitting C — and that\'s just two hops',
      'This is a primary mechanism behind cascading outages: the retries meant to add resilience at each layer instead compound into a self-inflicted traffic spike on the weakest link',
    ],
    remember: ['Mitigations: retry budgets (cap total retries as a percentage of traffic, not per-request), only retry at one layer of the chain (usually the edge) and let inner layers fail fast, and circuit breakers at each hop to stop the amplification early'],
    readMinutes: 2,
    related: ['retry-exponential-backoff-jitter', 'circuit-breaker-states'],
    interviewAngle: { q: 'A 3-hop call chain each retries 3 times on failure. The bottom service degrades. Walk through what happens.', a: 'Each hop retrying independently multiplies load geometrically toward the bottom — up to 27 effective requests for 1 original across 3 hops — which can turn a partial degradation into a full outage of the bottom service; the fix is retry budgets and breakers per hop, not blanket retries everywhere.' },
  },
]

const sdMicroservicesConcepts: ConceptCard[] = [
// Group: The Core Tradeoff
  {
    id: 'monolith-vs-microservices-tradeoff',
    title: 'Monolith vs Microservices: The Real Tradeoff',
    group: 'The Core Tradeoff',
    definition: 'Splitting a system into independently deployable services trades in-process function calls, one deploy pipeline, and local transactions for independent deployability and scaling, at the cost of network calls, distributed debugging, and eventual consistency across former function boundaries.',
    whyItMatters: [
      'A function call that used to be a stack frame becomes a network hop with its own latency, timeout, and failure modes',
      'A single ACID transaction across two tables becomes a cross-service operation that can partially fail, forcing eventual consistency or a saga',
      'Independent deployability is the actual payoff — teams ship on their own schedule without coordinating a shared release train',
    ],
    remember: [
      'Microservices do not reduce total system complexity — they move it from the codebase into the network and operations',
      'The benefits (independent scaling, tech heterogeneity, team autonomy) are organizational; the costs (latency, partial failure, eventual consistency) are technical',
    ],
    interviewAngle: {
      q: 'Why would a team with high request volume but a single small team still be better off on a monolith?',
      a: 'Scale alone does not justify the split — the distributed-systems tax (debugging across services, network failure modes, deployment coordination) is paid regardless of team size, and a single team gets none of the team-autonomy benefit that justifies paying it.',
    },
    readMinutes: 2,
  },
  {
    id: 'monolith-first-argument',
    title: 'Monolith-First',
    group: 'The Core Tradeoff',
    definition: 'Start a new system as a well-modularized monolith and extract services later once domain boundaries have proven stable under real usage, rather than guessing service boundaries upfront.',
    whyItMatters: [
      'Wrong service boundaries drawn before the domain is understood are expensive to fix — you are refactoring across a network, not within a codebase',
      'A monolith with clean internal module boundaries (enforced by package structure, not just convention) can be split later with much less rework',
    ],
    remember: [
      'The counterargument is a genuinely new organization with multiple teams from day one, where Conway\'s Law pressure already exists and waiting just delays the inevitable',
      'Premature decomposition is a more common failure mode in practice than staying monolithic too long',
    ],
    related: ['strangler-fig-pattern', 'conways-law'],
    readMinutes: 2,
  },

  // Group: Decomposition Strategy
  {
    id: 'decompose-by-business-capability',
    title: 'Decompose by Business Capability, Not Technical Layer',
    group: 'Decomposition Strategy',
    definition: 'Service boundaries should follow business capabilities or domain-driven-design bounded contexts (Orders, Inventory, Billing), not technical layers (a UI service, a business-logic service, a data-access service).',
    whyItMatters: [
      'A layer-based split still requires touching multiple services for any single feature change — the coupling that made the monolith hard to change moves, it does not disappear',
      'A capability-based split lets one team own Orders end-to-end, including its own data, deploy independently of Billing, and change its internal implementation freely',
    ],
    remember: [
      'A useful boundary test: can this service be described by what the business does, not by what technical role it plays?',
      'Bounded contexts from DDD give you the vocabulary — each service owns a consistent model of its own domain, and translates at the edges when talking to others',
    ],
    interviewAngle: {
      q: 'A team splits a monolith into a controller-service, a business-logic-service, and a data-service. What is wrong with this decomposition?',
      a: 'It decomposed by technical layer, so any single feature still touches all three services — you get the network and deployment overhead of microservices with none of the independent-deployability benefit.',
    },
    readMinutes: 2,
  },
  {
    id: 'service-granularity-tradeoff',
    title: 'Service Granularity: Too Fine vs Too Coarse',
    group: 'Decomposition Strategy',
    definition: 'Services that are too fine-grained multiply network hops and operational overhead per feature; services that are too coarse-grained recreate a monolith split across deploy pipelines without the deployment coupling actually going away.',
    whyItMatters: [
      'Nanoservices (one service per CRUD table) turn every business operation into a chain of synchronous calls, which is both slow and fragile',
      'Right-sizing is a judgment call tied to team size — a service should be small enough that one team can own it fully, not smaller',
    ],
    remember: [
      'A common heuristic: if two "services" always deploy together and always change together, they are one service artificially split',
    ],
    readMinutes: 1,
  },

  // Group: Data Ownership
  {
    id: 'database-per-service',
    title: 'Database-per-Service',
    group: 'Data Ownership',
    definition: 'Each microservice owns its own database, accessed only through that service\'s API — no other service is allowed to query it directly.',
    whyItMatters: [
      'A private database is what makes independent deployability real — a service can change its schema without coordinating a migration across teams',
      'Without it, services share the same failure domain: one team\'s slow query or lock contention degrades every service touching that database',
    ],
    remember: [
      'Database-per-service is what forces cross-service reads to go through APIs (or async replication) instead of joins, which is the real cost of the pattern',
      'Sibling subtopic sd-sql-vs-nosql covers polyglot persistence mechanics — the point here is ownership, not which database technology each service picks',
    ],
    related: ['shared-database-antipattern', 'distributed-monolith-antipattern'],
    readMinutes: 2,
  },
  {
    id: 'shared-database-antipattern',
    title: 'Shared Database Anti-Pattern',
    group: 'Data Ownership',
    definition: 'Two or more microservices reading and writing the same database tables directly is an anti-pattern — it re-couples services at the schema level even though they deploy separately.',
    whyItMatters: [
      'Any schema change now requires coordinating every service touching that table, defeating independent deployability',
      'It hides the coupling — the services look independent in the deployment topology, but a query plan or table lock links them at runtime',
    ],
    remember: [
      'A shared database is the single most common way teams accidentally build a distributed monolith',
      'The fix is not always full duplication — an owning service can expose a read API or publish change events, and consumers keep their own local copy',
    ],
    related: ['distributed-monolith-antipattern'],
    readMinutes: 2,
  },

  // Group: Anti-Patterns
  {
    id: 'distributed-monolith-antipattern',
    title: 'The Distributed Monolith',
    group: 'Anti-Patterns',
    definition: 'A system split into separately deployed services that are still tightly coupled — via synchronous call chains that must all succeed together or a shared database — so it inherits network latency and partial-failure risk without gaining independent deployability.',
    whyItMatters: [
      'The tell is a deploy order dependency: if service A must ship before service B or a feature breaks, they are not actually independently deployable',
      'It is strictly worse than a monolith on some axes — the same tight coupling, plus network calls and distributed debugging on top',
    ],
    remember: [
      'Root causes are usually one of: synchronous chains where every hop is a hard dependency, a shared database, or a shared library that all services must upgrade in lockstep',
      'Fixing it usually means introducing async decoupling at the coupling points, or admitting the boundary was wrong and merging services back',
    ],
    interviewAngle: {
      q: 'A team has 12 microservices, but every deploy still requires a synchronized release of 6 of them. What would you call this and what does it tell you about the boundaries?',
      a: 'This is a distributed monolith — the deploy coordination proves the services are not actually independent, meaning the boundaries were drawn along technical or convenience lines rather than around real seams in the domain.',
    },
    related: ['shared-database-antipattern'],
    diagram: 'flowchart LR\n  gateway[Request] --> A[Service A]\n  A --> B[Service B]\n  B --> C[Service C]\n  C --> D[Service D]\n  D -.must all succeed.-> gateway',
    readMinutes: 2,
  },

  // Group: Migration & Org Design
  {
    id: 'strangler-fig-pattern',
    title: 'Strangler Fig Pattern',
    group: 'Migration & Org Design',
    definition: 'Incrementally migrate a monolith to services by routing individual capabilities to new services one at a time behind a facade, while the monolith keeps serving everything not yet migrated, until the monolith is fully replaced or reduced to a small core.',
    whyItMatters: [
      'It avoids a big-bang rewrite, which is high-risk and historically fails often on systems large enough to need decomposition in the first place',
      'Each extracted capability can be validated in production before the next one starts, limiting blast radius',
    ],
    remember: [
      'The facade (often an API gateway or reverse proxy) is what makes the migration invisible to callers — it routes each request to old or new code by capability',
      'Progress is incremental and reversible: a poorly-drawn boundary can be routed back to the monolith without a rollback of the whole system',
    ],
    related: ['monolith-first-argument'],
    readMinutes: 2,
  },
  {
    id: 'conways-law',
    title: "Conway's Law and Service Boundaries",
    group: 'Migration & Org Design',
    definition: 'A system\'s architecture tends to mirror the communication structure of the organization that built it, so microservice boundaries that ignore team boundaries create constant cross-team coordination regardless of how clean the technical design is.',
    whyItMatters: [
      'A service boundary that splits a single team\'s work in half forces that team to coordinate with itself across a network for every feature — the split adds overhead with no autonomy gained',
      'Used deliberately (the inverse Conway maneuver), you restructure teams first, or design service boundaries to match desired team boundaries, and let the architecture follow',
    ],
    remember: [
      'This is why microservices are as much an org-design decision as a technical one — the question "should we split this" is inseparable from "do we have a team that can own the result end-to-end"',
      'A single team fully owning a service (including its on-call) is the practical test of whether the boundary is real',
    ],
    interviewAngle: {
      q: 'Why does handing a single team two microservices with a hard dependency between them often produce worse outcomes than one shared service?',
      a: "Because the team pays the full distributed-systems tax (network calls, separate deploys, separate on-call) without gaining team autonomy, since the same people own both sides — Conway's Law predicts the split does not reduce coordination cost when there is no organizational seam to align to.",
    },
    related: ['monolith-vs-microservices-tradeoff'],
    readMinutes: 2,
  },
  {
    id: 'bff-pattern',
    title: 'Backend-for-Frontend (BFF)',
    group: 'Migration & Org Design',
    definition: 'A thin aggregation layer, often one per client type (web, mobile), that composes calls to multiple microservices into the shape a specific frontend needs, so clients do not have to orchestrate many service calls themselves.',
    whyItMatters: [
      'Without it, every client independently reimplements the same fan-out and response-shaping logic against a dozen services, and every service change risks breaking every client',
      'Different clients often need genuinely different aggregations (mobile wants a trimmed payload, web wants more detail) — one generic API layer forces an awkward compromise',
    ],
    remember: [
      'BFF is about response aggregation and shaping for a specific consumer, not routing or load balancing — sd-load-balancing owns the gateway\'s routing mechanics',
      'A BFF is itself a service with its own deploy lifecycle, usually owned by the frontend team it serves, which is part of why it fits a microservices org model',
    ],
    readMinutes: 1,
  },
]

const sdCaseStudiesConcepts: ConceptCard[] = [
// ---------- URL Shortener ----------
  {
    id: 'url-shortener-id-generation',
    title: 'URL Shortener: ID Generation Strategy',
    group: 'URL Shortener',
    definition: 'The core decision in a URL shortener is not storage or caching but how short codes get minted without collisions across many write servers: a hash of the URL, a centralized counter, or pre-allocated ranges handed out per node.',
    whyItMatters: [
      'MD5/SHA hash-and-truncate is stateless and infinitely scalable but needs a collision check (extra read) and can produce different codes for the same URL on retries',
      'A single auto-increment counter converted to base62 guarantees no collisions and short codes, but the counter itself becomes a write bottleneck and single point of failure unless sharded',
      'Range-based allocation (each app server checkpoints a block of e.g. 1M IDs from a coordinator, then hands them out locally) removes the per-write coordination cost at the price of gaps if a server crashes mid-block',
    ],
    remember: [
      'Base62 (a-zA-Z0-9) of a 64-bit counter gives ~7 chars for billions of URLs — this is why interviewers expect a specific alphabet/length calculation, not just "hash it"',
      'Hash-based approaches must handle collisions explicitly (append a salt/counter and rehash) — glossing over this is the #1 mediocre-answer tell',
      'Custom aliases (user-chosen slugs) force a uniqueness check against the same keyspace, usually via a unique index on the short-code column',
    ],
    interviewAngle: {
      q: 'Why is range-based ID allocation usually the strongest answer for a URL shortener at scale?',
      a: 'It bounds coordinator traffic to one round trip per block (e.g. per 1M codes) instead of per write, so it scales horizontally like Snowflake-style generation while still producing short, dense, collision-free codes — the tradeoff being some codes are wasted if a server dies with an unused block.',
    },
    readMinutes: 2,
  },
  {
    id: 'url-shortener-read-path',
    title: 'URL Shortener: Read-Heavy Caching & Redirects',
    group: 'URL Shortener',
    definition: 'A URL shortener is read-dominated (100:1 or higher read:write) and latency-sensitive on the redirect path, so the design centers on a cache-aside hot layer in front of the mapping store and the choice between 301 and 302 redirects.',
    whyItMatters: [
      'A 301 (permanent) redirect lets browsers cache the mapping client-side, cutting server load further but making click analytics impossible to recapture and complicating future remapping',
      '302 (temporary) keeps every click hitting your server — the right choice when click-through analytics or A/B rerouting is a stated requirement',
      'Cache-aside with an LRU eviction policy over the long tail works well because URL popularity is heavily skewed (a small set of links account for most traffic)',
    ],
    remember: [
      'Apply consistent hashing across cache shards, not modulo hashing, so adding/removing a cache node does not evict most of the keyspace',
      'The mapping table itself is a simple key-value shape — this is the textbook case for a NoSQL store or a plain SQL table with an index on short_code, not a reason to over-engineer schema',
    ],
    readMinutes: 1,
    related: ['url-shortener-id-generation'],
  },

  // ---------- News Feed ----------
  {
    id: 'feed-fanout-write-vs-read',
    title: 'News Feed: Fan-out-on-Write vs Fan-out-on-Read',
    group: 'News Feed',
    definition: 'A feed system must decide whether to precompute each follower\'s timeline when a post is created (fan-out-on-write, push) or assemble the timeline at read time by merging the posts of everyone a user follows (fan-out-on-read, pull).',
    whyItMatters: [
      'Fan-out-on-write makes reads O(1) (just fetch the precomputed timeline) at the cost of a write amplifying into millions of feed-inbox writes for a user with millions of followers',
      'Fan-out-on-read keeps writes O(1) but makes every timeline load an expensive fan-in merge across all followees, which does not scale for users who follow thousands of accounts',
      'Neither pure strategy survives contact with real usage patterns — the actual system design is the hybrid described in the celebrity-problem card',
    ],
    remember: [
      'Push (fan-out-on-write) trades write cost for read latency; pull (fan-out-on-read) trades read cost for write latency — state this tradeoff explicitly, it is the crux of the card',
      'Precomputed feed-inboxes are typically stored per-user as a bounded, ordered list (e.g. a capped Redis list or wide-column row), not a full history',
    ],
    diagram: 'flowchart LR\n  post[New Post] --> fanout[Fanout Service]\n  fanout --> inboxA[Follower Inbox A]\n  fanout --> inboxB[Follower Inbox B]\n  fanout --> inboxC[Follower Inbox C]',
    readMinutes: 2,
  },
  {
    id: 'feed-celebrity-problem',
    title: 'News Feed: The Celebrity / Hot-User Problem',
    group: 'News Feed',
    definition: 'Naive fan-out-on-write collapses when a single account has tens of millions of followers, because one post would trigger tens of millions of writes — the standard fix is a hybrid: push for normal users, pull for celebrity followees, merged at read time.',
    whyItMatters: [
      'A celebrity post is delivered by writing it once to a small "celebrity posts" store; on read, a follower\'s precomputed inbox (from normal followees) is merged on the fly with pulled posts from any celebrities they follow',
      'The threshold for "celebrity" (e.g. follower count above some N) is itself a tunable, and identifying it requires tracking follower counts as a first-class signal, not an afterthought',
      'This is the single most-tested judgment call in feed design interviews — an answer that only describes pure push or pure pull is a mediocre answer',
    ],
    remember: [
      'Twitter\'s well-known real solution is exactly this hybrid: push fan-out for the graph, pull-and-merge at read for accounts above a follower threshold',
      'Merging pulled + pushed content at read time also naturally solves feed ranking, since both sources can be scored and interleaved by the same ranking step',
    ],
    interviewAngle: {
      q: 'A user follows both 3 friends and 1 celebrity with 50M followers. How is their feed assembled?',
      a: 'Their precomputed inbox already contains the 3 friends\' posts (pushed at write time); the celebrity\'s recent posts are fetched separately from a celebrity-post store and merged/ranked into the feed at read time, avoiding a 50M-write fan-out for that single post.',
    },
    readMinutes: 2,
    related: ['feed-fanout-write-vs-read'],
  },

  // ---------- Distributed Rate Limiter ----------
  {
    id: 'rate-limiter-distributed-coordination',
    title: 'Rate Limiter as a Distributed System',
    group: 'Distributed Rate Limiter',
    definition: 'Enforcing a global rate limit across many stateless API servers requires shared counter state, not per-server counting, because a per-server-only limiter lets a client exceed the intended limit by a factor of however many servers a load balancer spreads its requests across.',
    whyItMatters: [
      'A centralized store (typically Redis) holding per-client counters with atomic INCR + TTL is the standard answer — the algorithm (token bucket, sliding window) from sd-rate-limiting still applies, but now it must execute atomically against shared state under concurrent access',
      'The shared store becomes a new single point of failure and latency hop on every request, so the design must address its own availability (replication) and the extra round-trip cost',
      'At very high QPS, even a fast shared store bottlenecks — the fix is local server-side counting with periodic async sync to the central store, trading strict accuracy for throughput',
    ],
    remember: [
      'Race conditions in check-then-increment must be closed with an atomic operation (Redis INCR+EXPIRE in one script, or a Lua script) — a plain read-then-write is a classic broken answer here',
      'Fail-open vs fail-closed is a real decision: if the Redis cluster is unreachable, do you let traffic through (protect availability) or block it (protect the backend)? State which and why',
    ],
    interviewAngle: {
      q: 'Why does a rate limiter need a distributed-systems answer instead of just "use a token bucket"?',
      a: 'Token bucket/sliding window are algorithms for counting inside one process; the hard part in a multi-server deployment is making that count consistent and atomic across servers without the shared counter store itself becoming the bottleneck or single point of failure — that coordination problem, not the algorithm, is what differentiates a strong answer.',
    },
    readMinutes: 2,
  },

  // ---------- Chat / Messaging ----------
  {
    id: 'chat-message-ordering-delivery',
    title: 'Chat System: Message Ordering & Delivery Guarantees',
    group: 'Chat / Messaging System',
    definition: 'A chat system must guarantee messages within one conversation appear in a consistent order to all participants and specify a delivery guarantee (at-least-once with client-side dedup is standard, since exactly-once is impractical over unreliable networks).',
    whyItMatters: [
      'Ordering is usually enforced with a per-conversation monotonic sequence number assigned server-side at write time, not client timestamps, because client clocks are unsynchronized and messages can arrive out of send-order',
      'At-least-once delivery (from sd-messaging) plus an idempotent client-generated message ID lets the client de-duplicate a message it may receive twice after a retry or reconnect',
      'Read receipts and delivery status (sent, delivered, read) are separate state machines from message storage and are usually propagated as lightweight events, not stored inline on the message',
    ],
    remember: [
      'A single connection dropping mid-send is the standard failure to reason about out loud: client retries with the same message ID, server dedups on that ID before assigning a sequence number',
      'Group chat ordering is harder than 1:1 — a server-assigned per-conversation sequence counter (not per-user) is what keeps all participants seeing the same order',
    ],
    readMinutes: 2,
  },
  {
    id: 'chat-storage-per-conversation-vs-per-user',
    title: 'Chat System: Storage Layout — Per-Conversation vs Per-User',
    group: 'Chat / Messaging System',
    definition: 'Messages can be sharded/stored keyed by conversation_id (all messages of a chat colocated) or by user_id (each user\'s inbox colocated) — the choice determines whether "load a conversation" or "load a user\'s unread across all chats" is the cheap query.',
    whyItMatters: [
      'Per-conversation storage (shard key = conversation_id) makes scrolling a single chat\'s history a single-shard range scan, which matches the dominant read pattern (opening one conversation) — most production chat systems (WhatsApp, Messenger-style) use this',
      'Per-user fan-out (writing a copy of each message into every participant\'s own timeline, like a mini feed fan-out) makes "unread count across all chats" cheap but multiplies writes by group size and duplicates storage',
      'Group chats push this further: a conversation_id-sharded design keeps a group\'s messages together regardless of group size, avoiding the celebrity-style fan-out blowup that per-user storage would hit for large groups',
    ],
    remember: [
      'This is the same write-vs-read tradeoff shape as feed fan-out (feed-fanout-write-vs-read), applied to a different access pattern — name that parallel explicitly in an interview to show pattern reuse',
      'Presence (online/offline) is typically a separate, ephemeral, high-write system (e.g. a heartbeat in an in-memory store with short TTL) decoupled entirely from durable message storage',
    ],
    readMinutes: 2,
    related: ['chat-message-ordering-delivery', 'feed-fanout-write-vs-read'],
  },

  // ---------- Notification System ----------
  {
    id: 'notification-fanout-dedup',
    title: 'Notification System: Multi-Device Fan-out & Dedup',
    group: 'Notification System',
    definition: 'A notification system fans a single event out to potentially millions of devices across heterogeneous channels (push, email, SMS) using at-least-once delivery through a queue, requiring explicit deduplication and per-channel/per-user throttling at the consumer side.',
    whyItMatters: [
      'Producers publish one event; a pool of consumers (one per channel type) pull from a queue and call the relevant third-party gateway (APNs, FCM, SMTP) — this decouples the triggering service from slow, unreliable external providers and lets each channel scale independently',
      'At-least-once delivery from the queue means the same notification can be dequeued twice after a consumer crash/retry — a dedup key (event_id + user_id + channel) checked against a short-TTL store before sending prevents duplicate pushes',
      'User notification preferences and quiet hours must be checked before fan-out, not baked into the event, so a single event can respect different opt-in states per user without republishing',
    ],
    remember: [
      'Batching sends to the same third-party gateway (e.g. one FCM multicast call for 500 device tokens) is a real throughput lever interviewers expect you to raise, not just "call the API per device"',
      'A dead-letter queue for permanently-failing sends (bad token, unsubscribed) prevents poison messages from blocking the queue — straight out of sd-resilience-patterns, applied here',
    ],
    diagram: 'flowchart LR\n  event[Trigger Event] --> queue[Notification Queue]\n  queue --> push[Push Consumer]\n  queue --> email[Email Consumer]\n  queue --> sms[SMS Consumer]',
    readMinutes: 2,
  },

  // ---------- Distributed Unique ID Generator ----------
  {
    id: 'snowflake-id-generation',
    title: 'Distributed Unique ID Generator (Snowflake-Style)',
    group: 'Distributed ID Generator',
    definition: 'Once data is sharded, a database auto-increment can no longer produce globally unique, roughly time-ordered IDs, so distributed systems generate IDs locally by packing a timestamp, a machine/worker ID, and a per-millisecond sequence number into one integer.',
    whyItMatters: [
      'Auto-increment breaks under sharding because two shards would independently generate the same next integer — you would need a single global sequence, recreating the exact bottleneck sharding was meant to remove',
      'A Snowflake-style 64-bit ID (e.g. 41 bits timestamp, 10 bits worker ID, 12 bits sequence) is generated locally with no coordination per ID, only a one-time worker-ID assignment, so throughput scales linearly with the number of generator nodes',
      'The timestamp-leading bit layout keeps IDs roughly sortable by creation time, which matters when the ID doubles as a natural sort/pagination key (this is why UUIDv4 is usually the wrong choice — it is unique but not sortable and hurts index locality)',
    ],
    remember: [
      'Clock skew/rollback on a node is the classic gotcha — a node whose clock jumps backward can emit a duplicate or out-of-order ID; production systems detect this and refuse to generate IDs until the clock catches up',
      'Worker ID assignment itself needs a coordination mechanism at startup (e.g. Zookeeper/etcd lease or a config value), even though steady-state generation needs none',
    ],
    interviewAngle: {
      q: 'Why not just use a UUID for distributed unique IDs?',
      a: 'UUIDv4 is unique with no coordination, but it is random, not time-ordered, which causes poor B-tree index locality (random insert points) and cannot be used for natural chronological sorting — Snowflake-style IDs sacrifice a little uniqueness margin for coordination-free generation while staying roughly time-sortable.',
    },
    readMinutes: 2,
  },

  // ---------- Typeahead / Autocomplete ----------
  {
    id: 'typeahead-trie-hot-prefix-caching',
    title: 'Typeahead: Trie Construction & Hot-Prefix Caching',
    group: 'Typeahead / Autocomplete',
    definition: 'Autocomplete at scale is served from an in-memory trie precomputed offline from query logs (each node caching its top-k most frequent completions), rebuilt periodically rather than updated per-query, because per-keystroke writes to a live trie under read concurrency do not scale.',
    whyItMatters: [
      'Precomputing and caching the top-k results at every trie node avoids re-ranking children on every request — the read path becomes a fixed-depth traversal plus a cached lookup, not a live aggregation',
      'The trie is rebuilt from an offline batch job (e.g. hourly/daily over query-frequency logs) and swapped in atomically; real-time popularity shifts (breaking news) are handled by a separate fast layer of cache overrides on top, not by mutating the trie live',
      'Sharding the trie by first character (or first N characters) distributes it across nodes when the full structure does not fit one machine\'s memory, at the cost of cross-shard merging for very short prefixes',
    ],
    remember: [
      'Trading write freshness (batch-rebuilt, minutes-to-hours stale) for read speed (O(prefix length) lookup) is the headline tradeoff — call it out explicitly rather than assuming real-time updates',
      'A simple client-side debounce plus request cancellation-in-flight is expected as part of the answer, not just the server design — cuts wasted QPS from users typing fast',
    ],
    readMinutes: 2,
  },

  // ---------- Web Crawler ----------
  {
    id: 'crawler-url-frontier-politeness',
    title: 'Web Crawler: URL Frontier & Politeness',
    group: 'Web Crawler',
    definition: 'A large-scale crawler\'s hard problem is not fetching pages but managing the URL frontier — a priority queue of URLs to visit — while enforcing per-domain politeness (rate limits and crawl-delay) so no single domain is hammered by parallel crawler workers.',
    whyItMatters: [
      'Politeness is implemented by partitioning the frontier into per-domain queues, each drained by at most one worker at a time with an enforced delay between requests to that domain — otherwise naive parallelism DoSes small sites',
      'Prioritization (freshness of important/high-PageRank pages vs breadth-first discovery of new ones) requires the frontier to be a priority structure, not a plain FIFO queue, with priority recomputed from signals like update frequency and link importance',
      'A crawler is inherently a producer-consumer pipeline (frontier -> fetch -> parse -> extract links -> back to frontier), so backpressure and the resilience patterns from sd-resilience-patterns (timeouts, retries with backoff on fetch failures) apply directly',
    ],
    remember: [
      'URL dedup at scale is done with a Bloom filter over seen URLs rather than a set/index lookup, trading a small false-positive rate (occasionally skip a genuinely new URL) for massive memory savings versus storing every seen URL exactly',
      'robots.txt must be fetched and respected per domain, cached with its own TTL, and checked before enqueueing any URL from that domain',
    ],
    diagram: 'flowchart LR\n  frontier[URL Frontier] --> fetch[Fetcher]\n  fetch --> parse[Parser]\n  parse --> dedup[Bloom Filter Dedup]\n  dedup --> frontier',
    readMinutes: 2,
  },
]

export const systemDesignConcepts: ConceptSection[] = [
  {
    id: 'sd-concept-fundamentals',
    subtopic: 'sd-fundamentals',
    title: 'Scalability & Design Fundamentals',
    intro: 'Before diving into any specific system component, a senior candidate needs the shared vocabulary and mental models that frame every design conversation — how systems scale, how reliability is actually measured, and the structured approach interviewers expect you to follow.',
    concepts: sdFundamentalsConcepts,
  },
  {
    id: 'sd-concept-cap-consistency',
    subtopic: 'sd-cap-consistency',
    title: 'CAP Theorem & Consistency Models',
    intro: 'The CAP theorem and the family of consistency models it implies are the theoretical backbone behind nearly every distributed-systems tradeoff discussion in a system design interview.',
    concepts: sdCapConsistencyConcepts,
  },
  {
    id: 'sd-concept-api-design',
    subtopic: 'sd-api-design',
    title: 'API Design (REST, gRPC, GraphQL)',
    intro: 'API design is where system boundaries become concrete contracts — resource modeling, versioning, pagination, and the real tradeoffs between REST, gRPC, and GraphQL.',
    concepts: sdApiDesignConcepts,
  },
  {
    id: 'sd-concept-load-balancing',
    subtopic: 'sd-load-balancing',
    title: 'Load Balancing & API Gateways',
    intro: 'How traffic actually gets distributed across a fleet of servers — algorithms, health checks, consistent hashing, and the gateway patterns that sit at the edge of a system.',
    concepts: sdLoadBalancingConcepts,
  },
  {
    id: 'sd-concept-sql-vs-nosql',
    subtopic: 'sd-sql-vs-nosql',
    title: 'SQL vs NoSQL & Data Modeling',
    intro: 'The relational vs NoSQL decision is one of the most consequential early choices in a system design — this covers ACID guarantees, the real NoSQL categories, and how to model data around access patterns instead of entities.',
    concepts: sdSqlVsNosqlConcepts,
  },
  {
    id: 'sd-concept-replication',
    subtopic: 'sd-replication',
    title: 'Replication & Partitioning (Sharding)',
    intro: 'How data actually gets distributed and duplicated across machines — replication strategies, the sync/async durability tradeoff, and the partitioning decisions (especially shard key choice) that determine whether a sharded system scales gracefully or develops hotspots.',
    concepts: sdReplicationConcepts,
  },
  {
    id: 'sd-concept-caching',
    subtopic: 'sd-caching',
    title: 'Caching Strategies & CDNs',
    intro: 'Caching is one of the cheapest wins in system design and one of the easiest to get wrong — cache placement, invalidation strategy, eviction policy, and the failure modes (stampede, hot key) that show up under real load.',
    concepts: sdCachingConcepts,
  },
  {
    id: 'sd-concept-messaging',
    subtopic: 'sd-messaging',
    title: 'Message Queues & Pub/Sub',
    intro: 'Asynchronous messaging decouples producers from consumers and absorbs bursts — this covers queue vs pub/sub semantics, delivery guarantees, ordering, and the failure-handling patterns (dead letter queues, backpressure) that keep a messaging system reliable.',
    concepts: sdMessagingConcepts,
  },
  {
    id: 'sd-concept-resilience-patterns',
    subtopic: 'sd-resilience-patterns',
    title: 'Resilience Patterns (Circuit Breaker, Bulkhead, Retry)',
    intro: 'How a single service protects itself and its callers when a dependency starts failing — timeouts, retries with backoff, circuit breakers, bulkhead isolation, and graceful degradation.',
    concepts: sdResiliencePatternsConcepts,
  },
  {
    id: 'sd-concept-microservices',
    subtopic: 'sd-microservices',
    title: 'Microservices vs Monolith',
    intro: 'The monolith-vs-microservices decision is as much an organizational choice as a technical one — decomposition strategy, data ownership, and the anti-patterns that leave you with the costs of distribution and none of the benefits.',
    concepts: sdMicroservicesConcepts,
  },
  {
    id: 'sd-concept-case-studies',
    subtopic: 'sd-case-studies',
    title: 'Common Design Problems (URL Shortener, Feed, Chat, etc.)',
    intro: 'Where every other subtopic\'s patterns get applied together end-to-end — the specific judgment calls that separate a strong answer from a mediocre one on the classic system design interview problems.',
    concepts: sdCaseStudiesConcepts,
  },
]
