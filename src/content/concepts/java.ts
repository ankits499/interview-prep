import type { ConceptCard, ConceptSection } from '../../types'

const fundamentalsConcepts: ConceptCard[] = [
  // ── Foundations ──────────────────────────────────────────────
  {
    id: 'class',
    title: 'Class',
    group: 'Foundations',
    definition: 'A blueprint that declares what fields and methods every instance will have — it holds no data itself.',
    example: {
      code: { language: 'java', code: `class Car {\n    String model;\n    void start() { System.out.println(model + " started"); }\n}` },
    },
    remember: ['A class is a template, not a value', 'No memory for fields is allocated until you instantiate it'],
    readMinutes: 1,
    related: ['object'],
  },
  {
    id: 'object',
    title: 'Object',
    group: 'Foundations',
    definition: 'A concrete instance of a class, created with new, holding its own copy of the instance fields.',
    example: {
      code: { language: 'java', code: `Car myCar = new Car();\nmyCar.model = "Civic";\nmyCar.start(); // "Civic started"` },
    },
    remember: ['Each object has its own field values, independent of every other instance'],
    interviewAngle: { q: 'How many objects does `Car a, b;` create?', a: 'Zero — those are two reference variables, both currently null.' },
    readMinutes: 1,
    related: ['class', 'object-vs-reference'],
  },
  {
    id: 'object-vs-reference',
    title: 'Object vs Reference',
    group: 'Foundations',
    definition: 'The variable you hold is a reference (a pointer to an object on the heap) — never the object itself.',
    example: {
      code: { language: 'java', code: `Car a = new Car();\nCar b = a;   // b points to the SAME object\nb.model = "Civic";\nSystem.out.println(a.model); // "Civic" — a sees it too` },
      note: 'Two references, one object. Mutating through either one is visible through both.',
    },
    whyItMatters: [
      'Explains why Java is "pass-by-value" even for objects — the value passed is the reference, not the object',
      'The root of most aliasing bugs: two variables silently pointing at the same mutable object',
    ],
    remember: ['Assignment copies the reference, not the object', 'null is a reference pointing at nothing'],
    interviewAngle: { q: 'Is Java pass-by-reference for objects?', a: 'No — it\'s pass-by-value, where the value happens to be a reference. Reassigning the parameter never affects the caller\'s variable; mutating the object it points to does.' },
    readMinutes: 2,
    related: ['object'],
  },
  {
    id: 'constructor',
    title: 'Constructor',
    group: 'Foundations',
    definition: 'A special method that initializes a new object\'s fields, run automatically by new.',
    example: {
      code: { language: 'java', code: `class Car {\n    final String model;\n    Car(String model) { this.model = model; } // no return type, same name as class\n}` },
    },
    whyItMatters: [
      'The only place you can assign a final field',
      'A class with no constructor gets a free no-arg one from the compiler — but only if you define zero constructors yourself',
    ],
    remember: ['Defining any constructor removes the compiler-generated default one', 'Constructors can call another constructor via this(...) or the parent via super(...) — must be the first statement'],
    interviewAngle: { q: 'What\'s the risk of calling an overridable method from a constructor?', a: 'It can run on a subclass instance before the subclass\'s own fields are initialized — the override executes mid-construction against partially-built state. Call only final/private methods or plain field logic from a constructor.' },
    readMinutes: 2,
    related: ['this-keyword'],
  },
  {
    id: 'this-keyword',
    title: '`this`',
    group: 'Foundations',
    definition: 'A reference to the current object — mainly used to disambiguate a field from a same-named parameter.',
    example: {
      code: { language: 'java', code: `Car(String model) {\n    this.model = model; // this.model = field, model = parameter\n}` },
    },
    remember: ['this(...) as the first line of a constructor chains to another constructor in the same class'],
    readMinutes: 1,
    related: ['constructor'],
  },
  {
    id: 'static-keyword',
    title: '`static`',
    group: 'Foundations',
    definition: 'Belongs to the class itself, not to any instance — one copy shared across every object.',
    example: {
      code: { language: 'java', code: `class Car {\n    static int count = 0;   // shared by every Car\n    Car() { count++; }\n}` },
    },
    whyItMatters: [
      'A static field is effectively global mutable state — a common source of hidden coupling and hard-to-test code',
      'static methods cannot be overridden (they can be hidden, which is a different, easily-confused mechanism)',
    ],
    remember: ['static members exist before any instance is ever created', 'Overusing static state is a frequent code-smell in interview design questions'],
    interviewAngle: { q: 'Can a static method be overridden?', a: 'No — it can be hidden by a same-signature static method in a subclass, but that\'s resolved at compile time by the reference type, not polymorphic dispatch.' },
    readMinutes: 2,
  },

  // ── OOP Pillars ──────────────────────────────────────────────
  {
    id: 'encapsulation',
    title: 'Encapsulation',
    group: 'OOP Pillars',
    definition: 'Protect an object\'s state and control how that state changes.',
    whyItMatters: [
      'Prevents invalid object state',
      'Keeps business rules close to the data they protect',
      'Reduces coupling between callers and implementation',
    ],
    example: {
      code: {
        language: 'java',
        code: `public class BankAccount {\n    private long balance;\n\n    public void withdraw(long amount) {\n        if (amount <= 0 || amount > balance) {\n            throw new IllegalArgumentException();\n        }\n        balance -= amount;\n    }\n}`,
      },
      note: 'The important point isn\'t private. The important point is that outside code cannot bypass the withdrawal rules.',
    },
    remember: ['Encapsulation ≠ getters + setters', 'Good encapsulation protects invariants'],
    interviewAngle: {
      q: 'Is a class with private fields and public getters/setters properly encapsulated?',
      a: 'Not necessarily. Encapsulation is about controlling state and protecting invariants, not simply hiding fields.',
    },
    readMinutes: 2,
    related: ['abstraction'],
  },
  {
    id: 'abstraction',
    title: 'Abstraction',
    group: 'OOP Pillars',
    definition: 'Expose what an object does, hide how it does it.',
    whyItMatters: [
      'Lets callers depend on a stable contract while the implementation changes freely underneath',
      'Reduces the amount of detail a reader needs to hold in their head at once',
    ],
    example: {
      code: { language: 'java', code: `interface PaymentGateway { void charge(long cents); }\n// caller only knows charge() exists — not which provider, retries, or HTTP calls happen inside` },
    },
    remember: ['Abstraction is about the interface; encapsulation is about protecting state — related but distinct'],
    interviewAngle: { q: 'How is abstraction different from encapsulation?', a: 'Abstraction hides complexity behind a simpler contract (what); encapsulation protects internal state from being corrupted (how it\'s guarded). A class can have one without the other.' },
    readMinutes: 2,
    related: ['encapsulation', 'interface'],
  },
  {
    id: 'inheritance',
    title: 'Inheritance',
    group: 'OOP Pillars',
    definition: 'A class acquires the fields and methods of a parent class, modeling an "is-a" relationship.',
    example: {
      code: { language: 'java', code: `class Animal { void eat() { ... } }\nclass Dog extends Animal { void bark() { ... } } // Dog is-a Animal` },
    },
    whyItMatters: [
      'Enables code reuse and polymorphic dispatch through a common supertype',
      'Also the most misused OOP tool — used for convenience reuse rather than a genuine "is-a" relationship',
    ],
    remember: [
      'Prefer composition unless the relationship is a true, substitutable "is-a"',
      'Inheritance couples a subclass to the parent\'s implementation, not just its interface (fragile base class problem)',
    ],
    interviewAngle: { q: 'When should you NOT use inheritance?', a: 'When you just want to reuse some methods and there\'s no real "is-a" relationship — that\'s what composition is for. Inheritance for convenience, not substitutability, is a common design smell.' },
    readMinutes: 3,
    related: ['composition-vs-inheritance', 'polymorphism'],
  },
  {
    id: 'polymorphism',
    title: 'Polymorphism',
    group: 'OOP Pillars',
    definition: 'The same method call produces different behavior depending on the object\'s actual runtime type.',
    example: {
      code: { language: 'java', code: `Shape s = new Circle();\ns.draw(); // runs Circle's draw(), decided at runtime — not by the "Shape" reference type` },
    },
    diagram: `flowchart LR
    Shape --> Circle
    Shape --> Square`,
    remember: ['Two forms: compile-time (overloading) and runtime (overriding) — see the dedicated cards', 'What makes Strategy, Template Method, and most plugin architectures possible'],
    interviewAngle: { q: 'What lets a List<Shape> hold Circles and Squares and call draw() on each correctly?', a: 'Runtime (dynamic) dispatch — the JVM looks up the actual object\'s class to find the method, not the variable\'s declared type.' },
    readMinutes: 2,
    related: ['overriding', 'dynamic-dispatch'],
  },

  // ── Java OOP Mechanics ─────────────────────────────────────
  {
    id: 'overloading',
    title: 'Method Overloading',
    group: 'Java OOP Mechanics',
    definition: 'Multiple methods share a name but differ in parameter list — resolved at compile time.',
    example: {
      code: { language: 'java', code: `int add(int a, int b) { return a + b; }\ndouble add(double a, double b) { return a + b; }` },
    },
    remember: ['Resolved by the compiler from the static (declared) argument types — not true polymorphism'],
    interviewAngle: { q: 'Which overload runs if you pass a subtype where both a supertype and subtype overload exist?', a: 'The one matching the reference\'s declared (static) type at compile time — not the runtime type. This trips people up because it looks like overriding but isn\'t.' },
    readMinutes: 1,
    related: ['overriding'],
  },
  {
    id: 'overriding',
    title: 'Method Overriding',
    group: 'Java OOP Mechanics',
    definition: 'A subclass replaces a parent\'s method implementation — resolved at runtime by actual object type.',
    example: {
      code: { language: 'java', code: `class Animal { void speak() { System.out.println("..."); } }\nclass Dog extends Animal {\n    @Override void speak() { System.out.println("Woof"); }\n}` },
    },
    remember: ['@Override isn\'t required but catches typos (wrong signature = new overload, not an override) at compile time'],
    readMinutes: 1,
    related: ['dynamic-dispatch', 'overloading'],
  },
  {
    id: 'dynamic-dispatch',
    title: 'Dynamic Method Dispatch',
    group: 'Java OOP Mechanics',
    definition: 'The runtime mechanism that picks which overridden method actually runs, based on the object\'s real class.',
    whyItMatters: [
      'The reason polymorphism works at all — without it, "Animal a = new Dog(); a.speak();" would call Animal\'s method',
      'Underpins Strategy, Template Method, and most dependency-injected designs',
    ],
    remember: ['Fields are NOT dynamically dispatched — only methods. Field access uses the reference\'s declared type.'],
    interviewAngle: { q: 'Does dynamic dispatch apply to fields the same way it does to methods?', a: 'No — field access is resolved statically by the declared type of the reference, only method calls use the object\'s actual runtime type. A common gotcha in tricky interview snippets.' },
    readMinutes: 2,
    related: ['polymorphism', 'overriding'],
  },
  {
    id: 'interface',
    title: 'Interface',
    group: 'Java OOP Mechanics',
    definition: 'A pure contract of method signatures a class commits to implementing — a class can implement many.',
    example: {
      code: { language: 'java', code: `interface Flyable {\n    void fly();\n    default void takeOff() { System.out.println("Taking off"); } // shared default, still no state\n}` },
    },
    remember: ['Since Java 8, an interface can have default methods — but never instance fields (no shared state)', 'Two default methods with the same signature from different interfaces force a compile error until you override explicitly'],
    interviewAngle: { q: 'How does Java avoid the multiple-inheritance diamond problem?', a: 'By refusing to guess: if two implemented interfaces provide the same default method, the implementing class gets a compile error until it overrides the method explicitly (optionally calling Interface.super.method()).' },
    readMinutes: 2,
    related: ['abstract-class'],
  },
  {
    id: 'abstract-class',
    title: 'Abstract Class',
    group: 'Java OOP Mechanics',
    definition: 'A class that can\'t be instantiated directly and can mix fully-implemented methods with ones subclasses must supply.',
    example: {
      code: { language: 'java', code: `abstract class Bird {\n    protected int altitude; // shared mutable state — an interface cannot do this\n    abstract void fly();\n}` },
    },
    remember: ['The deciding line vs. an interface: an abstract class can hold shared instance state, an interface never can'],
    interviewAngle: { q: 'Interface with default methods vs abstract class — what\'s actually left to decide between?', a: 'State. Use an interface for a capability a type can implement alongside others; use an abstract class when subclasses genuinely need to share mutable state or a behavior template.' },
    readMinutes: 2,
    related: ['interface'],
  },
  {
    id: 'composition',
    title: 'Composition',
    group: 'Java OOP Mechanics',
    definition: 'An object holds a reference to another object and delegates to it, instead of inheriting from it.',
    example: {
      code: { language: 'java', code: `class Car {\n    private final Engine engine; // "has-a", swappable, explicit dependency\n    Car(Engine engine) { this.engine = engine; }\n}` },
    },
    remember: ['Models "has-a", not "is-a"', 'The dependency is explicit and swappable — no fragile-base-class risk'],
    readMinutes: 1,
    related: ['composition-vs-inheritance'],
  },
  {
    id: 'composition-vs-inheritance',
    title: 'Composition vs Inheritance',
    group: 'Java OOP Mechanics',
    definition: '"Favor composition over inheritance" — default to composition, reach for inheritance only for genuine substitutable "is-a".',
    whyItMatters: [
      'Inheritance couples a subclass to the parent\'s implementation details, not just its public contract',
      'A base-class change that looks safe can silently break subclasses that never touched the changed code — the fragile base class problem',
    ],
    remember: [
      'Composition: explicit, swappable dependency, no hidden coupling',
      'Inheritance: implicit coupling to internals, but gives you real polymorphic dispatch through a shared type',
      'Use inheritance when callers need to treat every subtype uniformly through the parent type',
    ],
    interviewAngle: { q: 'When is inheritance still the right call over composition?', a: 'When the relationship is a genuine, Liskov-honoring "is-a" AND you specifically need polymorphic dispatch through the parent type — composition alone can\'t give callers that without also defining an interface.' },
    diagram: `flowchart LR
    subgraph is-a
    Dog --> Animal
    end
    subgraph has-a
    Car -->|has| Engine
    end`,
    readMinutes: 3,
    related: ['inheritance', 'composition'],
  },

  // ── Object Contracts ─────────────────────────────────────────
  {
    id: 'equality-vs-equals',
    title: '`==` vs `equals()`',
    group: 'Object Contracts',
    definition: '== compares references (same object in memory); equals() compares logical value, if overridden to do so.',
    example: {
      code: { language: 'java', code: `String a = new String("hi");\nString b = new String("hi");\na == b;        // false — different objects\na.equals(b);    // true — same characters` },
    },
    remember: ['Default Object.equals() is just ==, unless a class overrides it', 'For boxed types (Integer, Long) == can "work" by accident for small cached values — never rely on it'],
    readMinutes: 1,
    related: ['equals-hashcode'],
  },
  {
    id: 'equals-hashcode',
    title: '`equals()` / `hashCode()`',
    group: 'Object Contracts',
    definition: 'A contract, not two independent methods: equal objects MUST report equal hashCodes.',
    example: {
      code: { language: 'java', code: `@Override public boolean equals(Object o) {\n    if (!(o instanceof Point p)) return false;\n    return x == p.x && y == p.y;\n}\n@Override public int hashCode() { return Objects.hash(x, y); }` },
    },
    whyItMatters: [
      'HashMap/HashSet compute a bucket from hashCode(), then use equals() only to disambiguate within it',
      'Breaking the contract causes silent lookup failures — no exception, the entry is just "not found"',
    ],
    remember: ['Override both together or neither', 'Fields used in the contract should be immutable — mutating them after insertion can make an object unfindable in a HashSet'],
    interviewAngle: { q: 'What breaks if you override equals() but not hashCode()?', a: 'Two "equal" objects can land in different HashMap buckets, so get()/contains() silently fail to find an entry that logically exists — no exception, just wrong behavior.' },
    readMinutes: 2,
    related: ['equality-vs-equals', 'object-class'],
  },
  {
    id: 'tostring',
    title: '`toString()`',
    group: 'Object Contracts',
    definition: 'Produces a human-readable representation — overridden for logging/debugging, not for equality logic.',
    example: {
      code: { language: 'java', code: `@Override public String toString() {\n    return "Point{x=" + x + ", y=" + y + "}";\n}` },
    },
    remember: ['Default is ClassName@hashCodeHex — practically useless in logs, override it'],
    readMinutes: 1,
    related: ['object-class'],
  },
  {
    id: 'object-class',
    title: '`Object` class',
    group: 'Object Contracts',
    definition: 'The implicit superclass of every Java class, supplying equals/hashCode/toString and a few others by default.',
    whyItMatters: ['Every class you write already inherits behavior you may not have realized you\'re overriding or relying on'],
    remember: ['Also provides getClass(), clone(), wait()/notify() (concurrency primitives) — most of which you rarely call directly'],
    interviewAngle: { q: 'Why do wait()/notify() live on Object instead of Thread?', a: 'Because any object can be a lock/monitor in Java (every object has an intrinsic lock) — wait/notify coordinate threads through whichever object\'s monitor they\'re synchronized on, not through the Thread class itself.' },
    readMinutes: 1,
    related: ['equals-hashcode', 'tostring'],
  },

  // ── Design ────────────────────────────────────────────────────
  {
    id: 'immutability',
    title: 'Immutability',
    group: 'Design',
    definition: 'An object whose state can never change after construction — final fields, no setters, defensive copies.',
    example: {
      code: { language: 'java', code: `final class Money {\n    private final long cents;\n    Money(long cents) { this.cents = cents; } // no setters — instance never changes\n}` },
    },
    whyItMatters: [
      'Thread-safe with zero synchronization — an immutable object can never be observed mid-mutation',
      'Safe to share and cache freely',
    ],
    remember: ['final on a field only locks the reference, not the object it points to — a final List can still have items added'],
    interviewAngle: { q: 'Why does immutability matter for concurrency specifically?', a: 'An immutable object has no mutable state to race on — it can be freely shared across threads with zero synchronization, because it can never be observed in an inconsistent, half-updated state.' },
    readMinutes: 2,
    related: ['equals-hashcode'],
  },
  {
    id: 'solid',
    title: 'SOLID',
    group: 'Design',
    definition: 'Five design principles that limit the blast radius of change: Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion.',
    remember: [
      'SRP: one reason to change. OCP: extend without modifying. LSP: subtypes must be substitutable.',
      'ISP: small focused interfaces over one fat one. DIP: depend on abstractions, not concretions.',
    ],
    interviewAngle: { q: 'Give a real example of an OCP violation you\'d flag in review.', a: 'A growing if/else or switch on type that gets a new branch every time a new case is added — the Strategy pattern (polymorphism) usually fixes it by letting new cases be added as new classes instead.' },
    readMinutes: 2,
    related: ['dependency-inversion', 'composition-vs-inheritance'],
  },
  {
    id: 'dependency-inversion',
    title: 'Dependency Inversion',
    group: 'Design',
    definition: 'High-level modules depend on abstractions, not on concrete low-level implementations — and low-level modules implement those abstractions.',
    example: {
      code: { language: 'java', code: `class OrderService {\n    private final PaymentGateway gateway; // depends on an interface, not StripeClient\n    OrderService(PaymentGateway gateway) { this.gateway = gateway; }\n}` },
    },
    whyItMatters: ['This is exactly what dependency-injection frameworks (Spring, etc.) exist to enforce automatically'],
    remember: ['"Dependency injection" is the mechanism; "dependency inversion" is the principle it serves'],
    readMinutes: 2,
    related: ['solid', 'interface'],
  },
  {
    id: 'extensible-classes',
    title: 'Designing Extensible Classes',
    group: 'Design',
    definition: 'Design so new behavior can be added without modifying existing, tested code.',
    whyItMatters: [
      'Untested edits to working code are where regressions come from — extension avoids touching it at all',
      'Usually achieved via an interface/abstract seam plus composition (Strategy), not inheritance for reuse',
    ],
    remember: ['Ask "what will need to vary?" before designing the seam — designing for hypothetical variation that never happens is its own anti-pattern'],
    interviewAngle: { q: 'How do you avoid over-engineering "extensibility" nobody needs?', a: 'Don\'t add a seam (interface, strategy, plugin point) until there\'s a real, current need for variation — speculative flexibility adds indirection and cost with no payoff, and is itself a design smell interviewers probe for.' },
    readMinutes: 2,
    related: ['solid', 'composition-vs-inheritance'],
  },
]

const stringsConcepts: ConceptCard[] = [
  // ── Foundations ──────────────────────────────────────────────
  {
    id: 'string-immutability',
    title: 'String Immutability',
    group: 'Foundations',
    definition: 'Once created, a String\'s character data can never change — every "modifying" operation returns a new String.',
    example: {
      code: { language: 'java', code: `String s = "hello";\ns.concat(" world"); // returns a NEW string\nSystem.out.println(s); // still "hello" — s itself never changed` },
      note: 'concat() didn\'t mutate s — it returned a value that was thrown away.',
    },
    whyItMatters: [
      'Makes Strings safe to share across threads and cache in the pool without defensive copies',
      'Lets String cache its hashCode() once, since it can never change — HashMap key lookups stay fast',
    ],
    remember: ['Any method that looks like it "changes" a String actually returns a new one', 'The underlying char/byte array is final and never exposed for mutation'],
    interviewAngle: { q: 'Why is String immutable in Java?', a: 'Security (can\'t be altered after being passed to a method/API), thread-safety (safe to share with zero synchronization), and it enables both the string pool and hashCode caching.' },
    readMinutes: 2,
    related: ['string-pool', 'string-hashcode-caching'],
  },
  {
    id: 'string-creation',
    title: 'String Creation: Literal vs `new`',
    group: 'Foundations',
    definition: 'A string literal is looked up or interned in the string pool; `new String(...)` always allocates a fresh object on the heap.',
    example: {
      code: { language: 'java', code: `String a = "hi";          // pool reference\nString b = "hi";          // same pool reference as a\nString c = new String("hi"); // distinct heap object\na == b;  // true\na == c;  // false` },
    },
    remember: ['`new String(...)` is almost never what you want — it defeats pooling for no benefit'],
    readMinutes: 1,
    related: ['string-pool', 'string-equality'],
  },
  {
    id: 'string-pool',
    title: 'String Pool (Interning)',
    group: 'Foundations',
    definition: 'A JVM-managed cache of unique String literals — identical literals are automatically deduplicated to a single shared object.',
    diagram: `flowchart LR
    a[a = literal hi] --> Pool
    b[b = literal hi] --> Pool
    c[c = new String] --> Heap`,
    whyItMatters: ['Since Java 7 the pool lives in the heap (not PermGen), so it\'s subject to normal garbage collection instead of causing OutOfMemoryError under heavy literal use'],
    remember: ['Compile-time constant expressions ("a" + "b") are folded and pooled by the compiler; runtime-built strings are not, even if equal'],
    readMinutes: 2,
    related: ['string-creation', 'string-intern'],
  },
  {
    id: 'string-intern',
    title: '`String.intern()`',
    group: 'Foundations',
    definition: 'Manually adds (or looks up) a String in the pool, returning the pooled reference.',
    example: {
      code: { language: 'java', code: `String a = new String("hi").intern();\nString b = "hi";\na == b; // true — a now points at the pooled instance` },
    },
    whyItMatters: ['Useful when you\'re holding many runtime-built duplicate strings (e.g. parsed from a large file) and want to collapse them to save memory'],
    remember: ['Overusing intern() can itself bloat the pool and add lookup overhead — profile before reaching for it'],
    readMinutes: 1,
    related: ['string-pool'],
  },

  // ── Memory & Internals ───────────────────────────────────────
  {
    id: 'substring-memory',
    title: '`substring()` Memory Behavior',
    group: 'Memory & Internals',
    definition: 'Before Java 7, substring() shared the original char array (risking a memory leak); Java 7+ always copies only the needed characters.',
    example: {
      code: { language: 'java', code: `String big = readHugeFileAsOneString(); // 10 MB\nString tiny = big.substring(0, 10);     // Java 7+: copies just 10 chars\n// big is now eligible for GC even though tiny lives on` },
      note: 'Pre-Java 7, tiny would have silently kept the entire 10 MB array alive.',
    },
    whyItMatters: ['A classic "why does this app leak memory" gotcha in older codebases or when reasoning about JVM version differences'],
    remember: ['Java 7+ substring() is O(n) in the slice length; the old behavior was O(1) but leak-prone'],
    interviewAngle: { q: 'Can substring() ever cause a memory leak in modern Java?', a: 'Not via the old shared-array mechanism — Java 7+ always copies. It can still contribute to memory pressure just like any other allocation, but not the classic "tiny substring keeps a huge string alive" leak.' },
    readMinutes: 2,
    related: ['string-immutability'],
  },
  {
    id: 'string-hashcode-caching',
    title: 'Cached `hashCode()`',
    group: 'Memory & Internals',
    definition: 'String computes its hashCode() once and caches it, because immutability guarantees the value can never go stale.',
    remember: ['This is exactly why String is such a popular HashMap key — repeated lookups reuse the cached hash instead of rescanning characters'],
    readMinutes: 1,
    related: ['string-immutability'],
  },
  {
    id: 'stringbuilder-capacity',
    title: 'StringBuilder Internal Capacity',
    group: 'Memory & Internals',
    definition: 'StringBuilder wraps a mutable, resizable char array that grows (roughly doubles) when appends exceed its current capacity.',
    example: {
      code: { language: 'java', code: `StringBuilder sb = new StringBuilder(64); // pre-size to avoid resize churn\nfor (String part : parts) sb.append(part);` },
      note: 'Pre-sizing when you know roughly how large the result will be avoids repeated array copy-and-grow.',
    },
    whyItMatters: ['Every resize copies the whole backing array — in a hot loop with a poor size estimate, this shows up in profiling'],
    remember: ['Default initial capacity is 16 characters if unspecified'],
    readMinutes: 1,
    related: ['string-concat-loop'],
  },
  {
    id: 'string-concat-loop',
    title: 'String Concatenation in Loops',
    group: 'Memory & Internals',
    definition: '`+` inside a loop allocates a new String (and often a throwaway StringBuilder) on every single iteration — O(n²) total work for n appends.',
    example: {
      code: { language: 'java', code: `// Bad: new String object every iteration\nString s = "";\nfor (int i = 0; i < 1000; i++) s += i;\n\n// Good: one mutable buffer\nStringBuilder sb = new StringBuilder();\nfor (int i = 0; i < 1000; i++) sb.append(i);` },
    },
    whyItMatters: ['The compiler optimizes a single-statement chain of + into one StringBuilder automatically — it cannot do that across loop iterations'],
    remember: ['Rule of thumb: any concatenation inside a loop should be a StringBuilder append instead'],
    readMinutes: 2,
    related: ['stringbuilder-capacity', 'stringbuilder-vs-buffer'],
  },

  // ── Comparison ───────────────────────────────────────────────
  {
    id: 'string-equality',
    title: '`==` vs `equals()` for Strings',
    group: 'Comparison',
    definition: '== compares references (same pooled/heap object); equals() compares the actual character sequence.',
    example: {
      code: { language: 'java', code: `new String("hi") == new String("hi");      // false — different objects\nnew String("hi").equals(new String("hi")); // true — same characters` },
    },
    remember: ['Always use equals() (or .equalsIgnoreCase()) for content comparison — == "working" for two literals is a pooling coincidence, not a guarantee to rely on'],
    readMinutes: 1,
    related: ['string-pool', 'string-comparison-ordering'],
  },
  {
    id: 'string-comparison-ordering',
    title: '`compareTo()` and Natural Ordering',
    group: 'Comparison',
    definition: 'compareTo() returns a lexicographic (character-by-character, Unicode value) comparison — negative, zero, or positive.',
    example: {
      code: { language: 'java', code: `"apple".compareTo("banana"); // negative — 'a' < 'b'\nList<String> names = new ArrayList<>(...);\nCollections.sort(names); // uses compareTo() via Comparable` },
    },
    whyItMatters: ['Powers default sorting for Strings in collections and TreeMap/TreeSet ordering'],
    remember: ['Locale-sensitive or human-friendly sorting needs Collator, not compareTo() — lexicographic order isn\'t the same as alphabetical for many locales'],
    readMinutes: 1,
    related: ['string-equality'],
  },

  // ── Building & Formatting ────────────────────────────────────
  {
    id: 'stringbuilder-vs-buffer',
    title: 'StringBuilder vs StringBuffer',
    group: 'Building & Formatting',
    definition: 'Identical API; StringBuffer synchronizes every method (thread-safe, slower), StringBuilder does not (faster, single-threaded use).',
    remember: ['Default to StringBuilder — StringBuffer\'s synchronization is dead weight in the overwhelmingly common single-threaded case', 'If you truly need a shared mutable string buffer across threads, prefer a proper concurrency-safe design over relying on StringBuffer\'s per-method locking'],
    interviewAngle: { q: 'Why does StringBuffer still exist if StringBuilder is almost always preferred?', a: 'Legacy — StringBuffer predates StringBuilder (added in Java 5). It\'s kept for backward compatibility, not because per-method synchronization is a good concurrency strategy for building a string.' },
    readMinutes: 1,
    related: ['string-concat-loop'],
  },
  {
    id: 'string-format',
    title: '`String.format()` / `Formatter`',
    group: 'Building & Formatting',
    definition: 'Builds a string from a template with typed placeholders (%s, %d, %.2f, ...), similar to printf.',
    example: {
      code: { language: 'java', code: `String msg = String.format("User %s has %d points (%.1f%%)", name, points, pct);` },
    },
    remember: ['Readable for multi-value templates, but noticeably slower than StringBuilder for hot-path code due to parsing the format string each call'],
    readMinutes: 1,
    related: ['string-join'],
  },
  {
    id: 'string-join',
    title: '`String.join()` / `StringJoiner`',
    group: 'Building & Formatting',
    definition: 'Joins a sequence of strings with a delimiter, and optional prefix/suffix — no manual loop or trailing-delimiter bookkeeping.',
    example: {
      code: { language: 'java', code: `String.join(", ", "a", "b", "c"); // "a, b, c"\nnew StringJoiner(", ", "[", "]").add("a").add("b"); // "[a, b]"` },
    },
    remember: ['Prefer this over a hand-rolled loop with a trailing-delimiter check — it\'s a common, easy-to-get-subtly-wrong pattern'],
    readMinutes: 1,
    related: ['string-format'],
  },
  {
    id: 'text-blocks',
    title: 'Text Blocks (Java 15+)',
    group: 'Building & Formatting',
    definition: 'A `"""`-delimited multi-line string literal that handles embedded quotes and indentation without manual escaping/concatenation.',
    example: {
      code: { language: 'java', code: `String json = """\n    {\n      "name": "Ada"\n    }\n    """;` },
    },
    remember: ['Incidental leading whitespace (common to every line) is stripped automatically based on the closing """ position'],
    readMinutes: 1,
  },

  // ── Unicode & Encoding ───────────────────────────────────────
  {
    id: 'char-vs-codepoint',
    title: 'char vs Code Point (Surrogate Pairs)',
    group: 'Unicode & Encoding',
    definition: 'A Java char is a 16-bit UTF-16 code unit — some Unicode characters (emoji, many CJK extensions) need two chars (a surrogate pair) to represent one code point.',
    example: {
      code: { language: 'java', code: `String s = "😀";\ns.length();          // 2 — counts UTF-16 chars, not "characters"\ns.codePointCount(0, s.length()); // 1 — the actual number of Unicode characters` },
      note: '.length() lies about "how many characters" once surrogate pairs are involved.',
    },
    whyItMatters: ['A common source of subtle bugs: truncating a string by char index can split a surrogate pair, producing invalid/corrupted output'],
    remember: ['Iterate by code point (codePoints(), or String\'s codePointAt) when correctness with emoji/extended Unicode matters, not by char'],
    readMinutes: 2,
    related: ['string-chars-codepoints'],
  },
  {
    id: 'string-chars-codepoints',
    title: '`chars()` / `codePoints()` Streams',
    group: 'Unicode & Encoding',
    definition: 'Stream-based ways to iterate a String\'s UTF-16 units (chars()) or actual Unicode characters (codePoints()).',
    example: {
      code: { language: 'java', code: `"hi".chars().mapToObj(c -> (char) c).forEach(System.out::println);` },
    },
    remember: ['Prefer codePoints() over chars() whenever the string might contain characters outside the Basic Multilingual Plane'],
    readMinutes: 1,
    related: ['char-vs-codepoint'],
  },
  {
    id: 'string-charset',
    title: 'Charset & Byte Conversion',
    group: 'Unicode & Encoding',
    definition: 'Converting between String and byte[] (getBytes(), new String(bytes, ...)) always involves a charset — never assume the platform default.',
    example: {
      code: { language: 'java', code: `byte[] bytes = s.getBytes(StandardCharsets.UTF_8);\nString back = new String(bytes, StandardCharsets.UTF_8);` },
      note: 'Omitting the charset silently uses the JVM\'s platform default, which differs across environments/OSes — a classic "works on my machine" bug.',
    },
    remember: ['Always pass an explicit Charset (usually StandardCharsets.UTF_8) for both directions'],
    interviewAngle: { q: 'What breaks if you call getBytes() with no charset argument?', a: 'It silently uses the JVM\'s platform default charset, which can differ between your machine, CI, and production — producing mojibake or data corruption that only shows up in some environments.' },
    readMinutes: 2,
  },

  // ── Regex & Parsing ──────────────────────────────────────────
  {
    id: 'string-split-gotchas',
    title: '`split()` Gotchas',
    group: 'Regex & Parsing',
    definition: 'split() takes a regex, not a literal string — and by default silently drops trailing empty strings from the result.',
    example: {
      code: { language: 'java', code: `"a.b.c".split(".");        // WRONG: "." is regex "any character" → empty array\n"a.b.c".split("\\\\.");      // correct: escaped dot → ["a","b","c"]\n"a,b,,".split(",");         // ["a","b"] — trailing empties dropped by default\n"a,b,,".split(",", -1);     // ["a","b","","" ] — pass limit -1 to keep them` },
    },
    remember: ['Special regex characters (. * + ? etc.) must be escaped or use Pattern.quote() if splitting on a literal delimiter', 'Pass a negative limit to preserve trailing empty strings when they\'re meaningful (e.g. CSV parsing)'],
    interviewAngle: { q: 'Why did `csvLine.split(",")` silently drop my last empty column?', a: 'split() discards trailing empty strings unless you pass a negative limit — a frequent, silent CSV-parsing bug.' },
    readMinutes: 2,
    related: ['pattern-matcher'],
  },
  {
    id: 'pattern-matcher',
    title: '`Pattern` / `Matcher`',
    group: 'Regex & Parsing',
    definition: 'Compile a regex once into a Pattern, reuse it to create Matchers — avoids recompiling the regex on every call the way String.matches() does.',
    example: {
      code: { language: 'java', code: `private static final Pattern EMAIL = Pattern.compile("^[\\\\w.]+@[\\\\w.]+$");\n// reused across many calls, no recompilation cost\nboolean valid = EMAIL.matcher(input).matches();` },
    },
    whyItMatters: ['String.matches()/replaceAll() recompile the pattern internally every single call — fine for one-offs, a real cost in a hot path or loop'],
    remember: ['Store frequently-used Patterns as static final fields'],
    readMinutes: 2,
    related: ['string-split-gotchas'],
  },

  // ── Design & Production ───────────────────────────────────────
  {
    id: 'string-switch',
    title: 'Switch on String',
    group: 'Design & Production',
    definition: 'Since Java 7, switch can branch on a String, internally compiled to a hashCode()-based lookup plus equals() to confirm.',
    example: {
      code: { language: 'java', code: `switch (status) {\n    case "ACTIVE" -> handleActive();\n    case "CLOSED" -> handleClosed();\n    default -> handleUnknown();\n}` },
    },
    remember: ['Case labels are compared with equals(), not ==, so this works correctly across pooled/non-pooled strings alike'],
    readMinutes: 1,
  },
  {
    id: 'string-security',
    title: 'Strings and Sensitive Data',
    group: 'Design & Production',
    definition: 'Because Strings are immutable and pooled, a password/secret stored as a String can linger in memory (and potentially the pool) until GC — with no way to force-clear it.',
    example: {
      code: { language: 'java', code: `char[] password = readPassword(); // prefer char[] for secrets\ntry {\n    authenticate(password);\n} finally {\n    Arrays.fill(password, '\\0'); // can be explicitly wiped — a String cannot\n}` },
    },
    whyItMatters: ['This is why security-sensitive APIs (password fields, KeyStore) take char[] instead of String — a String\'s content can\'t be scrubbed on demand and may be copied into the pool'],
    interviewAngle: { q: 'Why do password-handling APIs prefer char[] over String?', a: 'A String is immutable and may live in the pool indefinitely — you can\'t force it to be overwritten in memory. A char[] can be explicitly zeroed out the moment it\'s no longer needed.' },
    readMinutes: 2,
  },
]


const java8Concepts: ConceptCard[] = [
// ── Functional Interfaces & Lambdas ──────────────────────────
{
  id: 'lambda-basics',
  title: 'Lambda Expressions',
  group: 'Functional Interfaces & Lambdas',
  definition: 'A compact, unnamed block of code that implements a functional interface\'s single abstract method — `(args) -> body`.',
  example: {
    code: { language: 'java', code: `Comparator<String> byLength = (a, b) -> a.length() - b.length();\nRunnable r = () -> System.out.println("go");` },
  },
  whyItMatters: [
    'Replaces most single-method anonymous inner classes with far less boilerplate',
    'Enables passing behavior as a value — the foundation the whole Streams API is built on',
  ],
  remember: ['A lambda has no name and no independent identity — it only exists as an implementation of some functional interface', 'The compiler infers the target type from context (assignment, method parameter), not from the lambda itself'],
  interviewAngle: { q: 'Does a lambda create a new class file at compile time like an anonymous inner class does?', a: 'No — javac uses invokedynamic and a bootstrap method to generate the implementation at runtime, avoiding a separate .class file per lambda and reducing JAR bloat.' },
  readMinutes: 2,
  related: ['functional-interface', 'lambda-variable-capture'],
},
{
  id: 'functional-interface',
  title: 'Functional Interface',
  group: 'Functional Interfaces & Lambdas',
  definition: 'An interface with exactly one abstract method — the only kind of interface a lambda or method reference can implement.',
  example: {
    code: { language: 'java', code: `@FunctionalInterface\ninterface Transformer<T, R> {\n    R transform(T input);\n    // default/static methods are fine — they don't count toward the "one abstract method" rule\n}` },
  },
  remember: ['@FunctionalInterface is optional but makes the compiler reject accidental extra abstract methods', 'default and static methods don\'t count against the single-abstract-method rule', 'Object\'s public methods (equals, hashCode, toString) also don\'t count, even if redeclared'],
  interviewAngle: { q: 'Is an interface with one abstract method and three default methods still a valid lambda target?', a: 'Yes — only abstract method count matters. default/static methods are already implemented, so they don\'t compete for the "single abstract method" slot.' },
  readMinutes: 2,
  related: ['lambda-basics', 'built-in-functional-interfaces'],
},
{
  id: 'built-in-functional-interfaces',
  title: 'Core Functional Interfaces',
  group: 'Functional Interfaces & Lambdas',
  definition: 'java.util.function ships a standard vocabulary so you rarely need to declare your own: Function, Predicate, Supplier, Consumer, BiFunction, UnaryOperator.',
  example: {
    code: { language: 'java', code: `Function<String, Integer> len = String::length;\nPredicate<String> isEmpty = String::isEmpty;\nSupplier<List<String>> factory = ArrayList::new;\nConsumer<String> print = System.out::println;` },
  },
  remember: [
    'Function<T,R>: takes T, returns R. Predicate<T>: takes T, returns boolean. Supplier<T>: takes nothing, returns T. Consumer<T>: takes T, returns nothing.',
    'UnaryOperator<T> and BinaryOperator<T> are Function/BiFunction specializations where input and output types match',
    'IntFunction, ToIntFunction, IntPredicate etc. exist to avoid autoboxing overhead on primitives',
  ],
  interviewAngle: { q: 'Why does java.util.function have IntPredicate as well as Predicate<Integer>?', a: 'To avoid boxing every int into an Integer on every call — in a hot loop over primitives, the specialized interfaces avoid allocation and unboxing overhead entirely.' },
  readMinutes: 2,
  related: ['functional-interface', 'primitive-streams'],
},
{
  id: 'lambda-variable-capture',
  title: 'Effectively Final Capture',
  group: 'Functional Interfaces & Lambdas',
  definition: 'A lambda can only capture a local variable from its enclosing scope if that variable is final or never reassigned after initialization ("effectively final").',
  example: {
    code: { language: 'java', code: `int total = 0;\n// total++; // if uncommented, the lambda below fails to compile\nRunnable r = () -> System.out.println(total); // fine — total is effectively final` },
    note: 'The restriction exists because the lambda captures the variable\'s value at creation time, not a live reference to it — allowing reassignment would silently desync the two.',
  },
  remember: ['Instance and static fields have no such restriction — only local variables and parameters', 'This is why an accumulator inside a loop is usually wrapped in a single-element array or an AtomicInteger to "mutate" it from a lambda'],
  interviewAngle: { q: 'Why can\'t a lambda capture a mutable local variable directly?', a: 'The lambda may outlive the stack frame it was created in (e.g. stored and invoked later, or run on another thread) — capturing by value at creation time avoids a lambda seeing a variable change after the fact in a way that\'s undefined which write "wins."' },
  readMinutes: 2,
  related: ['lambda-basics'],
},
{
  id: 'static-interface-methods',
  title: 'Static Interface Methods',
  group: 'Functional Interfaces & Lambdas',
  definition: 'Since Java 8, an interface can declare static utility methods that live on the interface itself and aren\'t inherited by implementers.',
  example: {
    code: { language: 'java', code: `interface Validator {\n    boolean isValid(String s);\n    static Validator notBlank() { return s -> s != null && !s.isBlank(); }\n}\nValidator v = Validator.notBlank(); // called on the interface, not an instance` },
  },
  whyItMatters: ['Lets an interface ship factory methods and helpers (Comparator.comparing, List.of, Stream.of) without a separate *Utils class'],
  remember: ['Not inherited — Validator.notBlank() works, but a class implementing Validator does not get a notBlank() of its own', 'This is how default methods evolve an interface without breaking every existing implementer: add a default (or a static factory), old code keeps compiling'],
  readMinutes: 1,
  related: ['functional-interface'],
},

// ── Method References ─────────────────────────────────────────
{
  id: 'method-reference-basics',
  title: 'Method References',
  group: 'Method References',
  definition: 'A shorthand for a lambda that does nothing but call an existing method — `Class::method` instead of `x -> Class.method(x)`.',
  example: {
    code: { language: 'java', code: `list.forEach(System.out::println);\n// equivalent to: list.forEach(x -> System.out.println(x));` },
  },
  remember: ['Purely syntactic sugar over a lambda — resolved to the same functional-interface target type', 'Only usable when the lambda body is literally "call this one method with these exact arguments," nothing more'],
  readMinutes: 1,
  related: ['method-reference-types'],
},
{
  id: 'method-reference-types',
  title: 'The Four Kinds of Method References',
  group: 'Method References',
  definition: 'Static method, bound instance method, unbound instance method, and constructor reference — each resolves its arguments differently.',
  example: {
    code: { language: 'java', code: `Math::max;                 // static: (a, b) -> Math.max(a, b)\nsomeString::toUpperCase;   // bound: () -> someString.toUpperCase()\nString::toUpperCase;       // unbound: (s) -> s.toUpperCase()\nArrayList::new;            // constructor: () -> new ArrayList<>()` },
  },
  remember: [
    'Unbound instance reference (String::toUpperCase) takes the receiver as its first parameter — this is the one that trips people up',
    'Constructor references work for any arity the functional interface expects, matched by parameter count/types',
  ],
  interviewAngle: { q: 'What\'s the difference between `str::toUpperCase` and `String::toUpperCase` as a Function<String,String>?', a: 'str::toUpperCase is bound to a specific instance — it takes zero arguments and always uppercases str. String::toUpperCase is unbound — the first parameter passed in becomes the receiver the method is called on.' },
  readMinutes: 2,
  related: ['method-reference-basics'],
},

// ── Streams Fundamentals ────────────────────────────────────────
{
  id: 'stream-basics',
  title: 'Stream Basics',
  group: 'Streams Fundamentals',
  definition: 'A sequence of elements supporting functional-style, declarative operations — describes a computation over data, not a data structure that stores it.',
  example: {
    code: { language: 'java', code: `long count = names.stream()\n    .filter(n -> n.startsWith("A"))\n    .count();` },
  },
  whyItMatters: ['Shifts code from "how to loop and accumulate" to "what transformation to apply" — usually shorter and less error-prone for multi-step pipelines'],
  remember: ['A Stream holds no elements itself — it\'s a pipeline description that pulls from its source on demand', 'A Stream can be consumed exactly once; reusing a terminated stream throws IllegalStateException'],
  interviewAngle: { q: 'Can you reuse a Stream after calling a terminal operation on it?', a: 'No — a Stream is single-use. Calling any operation on an already-consumed stream throws IllegalStateException. Build a new stream from the source (e.g. call .stream() again) if you need to traverse it a second time.' },
  readMinutes: 2,
  related: ['stream-vs-collection', 'stream-laziness'],
},
{
  id: 'stream-vs-collection',
  title: 'Stream vs Collection',
  group: 'Streams Fundamentals',
  definition: 'A Collection is an in-memory data structure you can iterate repeatedly; a Stream is a one-time, lazily-evaluated pipeline of computations over some source.',
  remember: ['Collections are about storage; Streams are about computation', 'Getting a Stream from a Collection (.stream()) doesn\'t copy or consume the Collection — the Collection is untouched and reusable'],
  readMinutes: 1,
  related: ['stream-basics'],
},
{
  id: 'stream-laziness',
  title: 'Intermediate vs Terminal Operations',
  group: 'Streams Fundamentals',
  definition: 'Intermediate operations (map, filter, sorted) are lazy and return a new Stream; nothing runs until a terminal operation (collect, forEach, reduce) triggers the whole pipeline.',
  example: {
    code: { language: 'java', code: `Stream<String> s = list.stream().filter(x -> {\n    System.out.println("checking " + x); // never prints yet\n    return x.length() > 3;\n});\n// nothing has run so far — only .filter() has been recorded\ns.count(); // NOW the pipeline executes` },
    note: 'No filtering happens until count() (a terminal op) is called — this is why building a pipeline is cheap even before you decide to run it.',
  },
  whyItMatters: [
    'Enables short-circuiting: findFirst()/anyMatch() can stop the whole pipeline early instead of processing every element',
    'A forgotten terminal operation means the pipeline silently never runs at all — a common "why isn\'t this doing anything" bug',
  ],
  remember: ['Elements flow through the entire pipeline one at a time (vertically), not stage-by-stage across the whole collection', 'Intermediate ops are chainable and lazy; there\'s exactly one terminal op per pipeline, and it\'s what actually executes it'],
  interviewAngle: { q: 'You call .stream().map(...).filter(...) and never see any exception or effect, even though map() should throw for one element. Why?', a: 'Without a terminal operation, the pipeline never executes at all — intermediate ops just build up a description. Add a terminal op like .forEach() or .collect() and the exception (and every side effect) will actually occur.' },
  readMinutes: 2,
  related: ['stream-pipeline', 'stream-short-circuit'],
},
{
  id: 'stream-pipeline',
  title: 'Stream Pipeline Flow',
  group: 'Streams Fundamentals',
  definition: 'A pipeline is Source, then zero or more lazy intermediate stages, then exactly one terminal operation that pulls elements through all stages.',
  diagram: `flowchart LR
    Source --> Map
    Map --> Filter
    Filter --> Terminal`,
  remember: ['Each element is pulled through map then filter then the terminal op individually, not processed stage-by-stage in bulk — this is what makes short-circuiting possible'],
  readMinutes: 1,
  related: ['stream-laziness'],
},
{
  id: 'stream-creation',
  title: 'Creating Streams',
  group: 'Streams Fundamentals',
  definition: 'Streams come from collections (.stream()), arrays (Arrays.stream), static factories (Stream.of, Stream.iterate, Stream.generate), or I/O sources (Files.lines).',
  example: {
    code: { language: 'java', code: `Stream.of(1, 2, 3);\nStream.iterate(1, n -> n * 2).limit(5);   // 1, 2, 4, 8, 16 — infinite, must limit\nStream.generate(Math::random).limit(3);` },
  },
  remember: ['Stream.iterate and Stream.generate produce infinite streams — always pair with limit() or another short-circuit or the pipeline never terminates'],
  interviewAngle: { q: 'What happens if you call Stream.iterate(1, n -> n + 1).forEach(System.out::println) without a limit()?', a: 'It never terminates — Stream.iterate is infinite, and forEach is not short-circuiting, so the pipeline runs forever (or until memory/CPU exhaustion depending on what forEach does).' },
  readMinutes: 1,
  related: ['stream-basics'],
},
{
  id: 'primitive-streams',
  title: 'Primitive Streams',
  group: 'Streams Fundamentals',
  definition: 'IntStream, LongStream, and DoubleStream avoid boxing every element into Integer/Long/Double for numeric pipelines.',
  example: {
    code: { language: 'java', code: `int sum = IntStream.rangeClosed(1, 100).sum();\nIntStream.range(0, list.size()).forEach(i -> ...); // indexed iteration` },
  },
  whyItMatters: ['A Stream<Integer> boxes every element; IntStream keeps them primitive — meaningful for large numeric pipelines'],
  remember: ['mapToInt/mapToObj/boxed() convert between a Stream<T> and its primitive counterpart', 'IntStream has sum/average/max built in — a Stream<Integer> does not, since generic Stream has no notion of "numeric"'],
  readMinutes: 1,
  related: ['built-in-functional-interfaces'],
},

// ── Stream Operations & Collectors ───────────────────────────────
{
  id: 'stream-map-filter',
  title: 'map() / filter()',
  group: 'Stream Operations & Collectors',
  definition: 'map() transforms each element 1-to-1; filter() keeps only elements matching a Predicate, both without touching the source.',
  example: {
    code: { language: 'java', code: `names.stream()\n    .filter(n -> n.length() > 3)\n    .map(String::toUpperCase)\n    .forEach(System.out::println);` },
  },
  remember: ['map() must return exactly one output per input — for zero-or-many outputs per input, use flatMap()'],
  readMinutes: 1,
  related: ['stream-flatmap-deep'],
},
{
  id: 'stream-flatmap-deep',
  title: 'flatMap() for Nested Structures',
  group: 'Stream Operations & Collectors',
  definition: 'Maps each element to its own Stream, then flattens all of those streams into a single one — the tool for List<List<T>> to List<T> and similar.',
  example: {
    code: { language: 'java', code: `List<List<String>> nested = List.of(List.of("a","b"), List.of("c"));\nList<String> flat = nested.stream()\n    .flatMap(List::stream)\n    .collect(Collectors.toList()); // [a, b, c]` },
  },
  whyItMatters: ['The standard fix for "I have a Stream of Streams (or a Stream of Optional) and need one flat Stream"'],
  remember: ['map() + flatMap() together are how Streams model Optional::stream to skip empty Optionals cleanly'],
  interviewAngle: { q: 'How would you get a Stream<String> of all order item names from a List<Order> where each Order has a List<Item>?', a: 'orders.stream().flatMap(o -> o.getItems().stream()).map(Item::getName) — map alone would give a Stream<List<Item>>, not a flat stream of items.' },
  readMinutes: 2,
  related: ['stream-map-filter'],
},
{
  id: 'stream-reduce',
  title: '`reduce()`',
  group: 'Stream Operations & Collectors',
  definition: 'Combines all elements into a single result by repeatedly applying a BinaryOperator, optionally starting from an identity value.',
  example: {
    code: { language: 'java', code: `int product = Stream.of(1, 2, 3, 4).reduce(1, (a, b) -> a * b); // 24\nOptional<Integer> max = Stream.of(3, 7, 2).reduce(Integer::max);` },
  },
  whyItMatters: ['The general-purpose fold — sum, max, string concatenation, and collect() itself can all be expressed as a reduce'],
  remember: ['No identity value → returns Optional<T> (empty stream has no result); with an identity → returns T directly', 'For anything producing a mutable container (List, Map, StringBuilder), prefer collect() — reduce() with a mutable accumulator is awkward and easy to get wrong in parallel'],
  interviewAngle: { q: 'Why does the two-arg reduce() overload return Optional but the three-arg one returns T directly?', a: 'Without an identity value, an empty stream has genuinely no result to return — Optional models that. With an identity supplied, the identity itself is the fallback result for an empty stream, so a plain T is enough.' },
  readMinutes: 2,
  related: ['stream-collect'],
},
{
  id: 'stream-collect',
  title: '`collect()` and Collectors',
  group: 'Stream Operations & Collectors',
  definition: 'The general-purpose terminal operation for accumulating stream elements into a result container, driven by a Collector strategy.',
  example: {
    code: { language: 'java', code: `List<String> names = people.stream().map(Person::getName).collect(Collectors.toList());\nString csv = names.stream().collect(Collectors.joining(", "));\nMap<Boolean, List<Person>> byAdult = people.stream().collect(Collectors.partitioningBy(p -> p.getAge() >= 18));` },
  },
  whyItMatters: ['Collectors.toList/toSet/toMap/joining/groupingBy cover almost every "accumulate results" need without hand-writing mutable-state loops'],
  remember: ['toMap() throws IllegalStateException on a duplicate key unless you supply a merge function as the third argument', 'Collectors.toUnmodifiableList() (Java 10+) if the result should never be mutated by callers'],
  interviewAngle: { q: 'Why does Collectors.toMap() throw at runtime on duplicate keys instead of just overwriting?', a: 'It refuses to silently pick a "winner" — data loss on a key collision should be an explicit decision, made by supplying a merge function (e.g. (a, b) -> a) as the third argument, not an accident.' },
  readMinutes: 2,
  related: ['stream-grouping', 'stream-reduce'],
},
{
  id: 'stream-grouping',
  title: 'groupingBy() / partitioningBy()',
  group: 'Stream Operations & Collectors',
  definition: 'groupingBy() buckets elements into a Map by a classifier function; partitioningBy() is the two-bucket (true/false) special case for a Predicate.',
  example: {
    code: { language: 'java', code: `Map<String, List<Employee>> byDept = employees.stream()\n    .collect(Collectors.groupingBy(Employee::getDepartment));\n\nMap<String, Long> countByDept = employees.stream()\n    .collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting())); // downstream collector` },
  },
  whyItMatters: ['The downstream-collector form (groupingBy with a second Collector argument) is what replaces a hand-rolled "group then aggregate" loop — counting, summing, mapping, or another nested groupingBy'],
  remember: ['partitioningBy always produces exactly two keys (true/false) in the result Map, even if one bucket is empty', 'groupingBy defaults to HashMap + ArrayList downstream — pass an explicit Supplier/Collector to control the Map or container type'],
  readMinutes: 2,
  related: ['stream-collect'],
},
{
  id: 'stream-parallel',
  title: 'Parallel Streams',
  group: 'Stream Operations & Collectors',
  definition: '.parallelStream() (or .parallel()) splits the pipeline across the common ForkJoinPool — a one-line switch from sequential to multi-threaded execution.',
  example: {
    code: { language: 'java', code: `long total = hugeList.parallelStream()\n    .mapToInt(Item::getValue)\n    .sum();` },
  },
  whyItMatters: [
    'Only pays off for CPU-bound work on large enough datasets — the fork/join overhead can make small collections slower in parallel',
    'Shares the JVM-wide common ForkJoinPool by default, so a blocking or slow parallel stream elsewhere can starve other unrelated parallel streams and CompletableFutures',
  ],
  remember: ['Never use for I/O-bound operations (network, blocking calls) — the pool has a small, CPU-core-sized thread count and blocking starves it', 'Operations must be stateless, non-interfering, and associative — a shared mutable accumulator in a parallel stream is a race condition'],
  interviewAngle: { q: 'What\'s the actual risk of using parallelStream() for a task that makes blocking network calls?', a: 'It shares the JVM-wide common ForkJoinPool (sized to CPU cores), so blocking threads in it starves every other unrelated parallel stream and CompletableFuture running anywhere in the JVM at the same time — a classic production incident, not just a local slowdown.' },
  readMinutes: 2,
  related: ['functional-vs-imperative'],
},
{
  id: 'stream-short-circuit',
  title: 'Short-circuiting Operations',
  group: 'Stream Operations & Collectors',
  definition: 'Operations like anyMatch, findFirst, and limit stop pulling elements through the pipeline as soon as the answer is known, instead of processing every element.',
  example: {
    code: { language: 'java', code: `boolean hasAdmin = users.stream().anyMatch(User::isAdmin); // stops at first match` },
  },
  remember: ['anyMatch/allMatch/noneMatch/findFirst/findAny/limit are short-circuiting; map/filter/collect/reduce/forEach process every element'],
  interviewAngle: { q: 'Does short-circuiting still help if the stream source is a plain in-memory List?', a: 'Yes — it avoids running the rest of the pipeline (map/filter transformations) on elements past the match, which matters when those intermediate steps are expensive, not just for infinite/lazy sources.' },
  readMinutes: 1,
  related: ['stream-laziness'],
},

// ── Optional ─────────────────────────────────────────────────────
{
  id: 'optional-basics',
  title: 'Optional',
  group: 'Optional',
  definition: 'A container that may or may not hold a non-null value, used as a return type to make "this might have nothing" explicit in the method signature.',
  example: {
    code: { language: 'java', code: `Optional<User> findById(long id) { ... }\n\nfindById(42)\n    .map(User::getEmail)\n    .orElse("unknown@example.com");` },
  },
  whyItMatters: ['Forces the caller to consciously handle absence at the type level, instead of a null they can forget to check until an NPE in production'],
  remember: ['Optional.of(x) throws immediately on null — use Optional.ofNullable(x) when x might legitimately be null', 'orElse(x) always evaluates x eagerly, even when the Optional is present — use orElseGet(supplier) when computing the fallback is expensive'],
  interviewAngle: { q: 'What\'s wrong with `optional.orElse(expensiveDefault())` when the Optional is usually present?', a: 'orElse() eagerly evaluates its argument every time, whether or not it\'s used — expensiveDefault() runs even when the Optional already has a value. orElseGet(() -> expensiveDefault()) only calls the supplier when actually needed.' },
  readMinutes: 2,
  related: ['optional-antipatterns'],
},
{
  id: 'optional-antipatterns',
  title: 'Optional Misuse Patterns',
  group: 'Optional',
  definition: 'Optional is designed as a return-type signal for "might be absent" — not a general-purpose container for fields, parameters, or collections.',
  example: {
    code: { language: 'java', code: `// Avoid:\nclass User { private Optional<String> nickname; }  // fields\nvoid process(Optional<String> name) { ... }         // parameters\n\n// Prefer:\nclass User { private String nickname; /* null or absent-check separately */ }\nvoid process(String name) { ... } // just don't pass null, or overload` },
  },
  whyItMatters: [
    'Optional isn\'t Serializable and adds an allocation + indirection layer that\'s wasted cost as a field or in a hot-path collection',
    'Optional.get() without isPresent()/ifPresent() throws NoSuchElementException — using get() defeats the entire purpose of using Optional in the first place',
  ],
  remember: ['Never use Optional as a method parameter type — overload the method or just don\'t pass null', 'Never wrap a collection field/return in Optional — return an empty collection instead of Optional<List<T>>', 'Avoid Optional.get() directly — use map/orElse/orElseThrow/ifPresent instead'],
  interviewAngle: { q: 'Why is Optional.get() considered a code smell even though it\'s a public method?', a: 'It throws NoSuchElementException on empty exactly like a raw null dereference would throw NPE — you\'ve added the wrapping overhead of Optional without gaining any of its safety benefit. The whole point is to force handling both cases via orElse/map/ifPresent.' },
  readMinutes: 2,
  related: ['optional-basics'],
},

// ── java.time ──────────────────────────────────────────────────
{
  id: 'datetime-overview',
  title: 'java.time Overview',
  group: 'java.time',
  definition: 'Java 8\'s date/time API (JSR-310) replaces the mutable, thread-unsafe java.util.Date/Calendar with immutable, clearly-scoped types.',
  example: {
    code: { language: 'java', code: `LocalDate date = LocalDate.of(2024, 3, 15);\nLocalTime time = LocalTime.of(14, 30);\nLocalDateTime dt = LocalDateTime.of(date, time);` },
  },
  whyItMatters: ['java.util.Date was mutable, not thread-safe, had a confusing API (months 0-indexed, years offset from 1900), and conflated date/time/timezone concepts into one type'],
  remember: ['LocalDate/LocalTime/LocalDateTime carry no timezone at all — they represent a date and/or time "on the wall," not an instant', 'Every java.time type is immutable — every "modifying" method (plusDays, withYear) returns a new instance'],
  readMinutes: 2,
  related: ['datetime-immutability', 'datetime-instant-vs-localdatetime'],
},
{
  id: 'datetime-immutability',
  title: 'Immutability & Thread-safety of java.time',
  group: 'java.time',
  definition: 'Every core java.time type is immutable and thread-safe by design — a direct fix for SimpleDateFormat, which was famously not thread-safe.',
  example: {
    code: { language: 'java', code: `LocalDate today = LocalDate.now();\nLocalDate nextWeek = today.plusWeeks(1); // today itself is unchanged\nDateTimeFormatter fmt = DateTimeFormatter.ISO_LOCAL_DATE; // safe to share/cache as a static final` },
  },
  whyItMatters: ['SimpleDateFormat instances shared across threads without synchronization silently corrupted results — a real, recurring production bug in pre-Java-8 code'],
  remember: ['DateTimeFormatter is immutable and thread-safe — safe to store as a static final constant, unlike SimpleDateFormat'],
  interviewAngle: { q: 'Why was SimpleDateFormat dangerous to share as a static field across threads?', a: 'It\'s mutable and stateful internally (not thread-safe) — concurrent parse()/format() calls on the same shared instance could corrupt each other\'s results silently, with no exception. DateTimeFormatter fixes this by being immutable.' },
  readMinutes: 1,
  related: ['datetime-overview'],
},
{
  id: 'datetime-instant-vs-localdatetime',
  title: 'Instant vs LocalDateTime vs ZonedDateTime',
  group: 'java.time',
  definition: 'Instant is a machine timestamp on the UTC timeline; LocalDateTime is a timezone-less date and time; ZonedDateTime combines a LocalDateTime with a specific time zone.',
  example: {
    code: { language: 'java', code: `Instant now = Instant.now();                       // point on the UTC timeline\nZonedDateTime nyTime = now.atZone(ZoneId.of("America/New_York"));\nLocalDateTime wallClock = nyTime.toLocalDateTime();  // no zone info anymore` },
  },
  whyItMatters: [
    'Storing/comparing event timestamps should almost always use Instant — it\'s unambiguous regardless of the reader\'s locale',
    'Storing "meeting at 2pm every Tuesday" needs LocalTime/DayOfWeek, not an Instant — that concept has no fixed point in absolute time until a zone is chosen',
  ],
  remember: ['Instant: absolute point in time (like epoch millis, but typed). LocalDateTime: wall-clock time, no zone, ambiguous in absolute terms. ZonedDateTime: wall-clock time + explicit zone = resolvable to an Instant.', 'Persist Instant (or UTC) for logged/stored timestamps; convert to a ZonedDateTime only at the display/UI boundary'],
  interviewAngle: { q: 'Why is it a bug to store LocalDateTime for a server timestamp used across regions?', a: 'LocalDateTime carries no time zone, so "2024-03-15T14:30" is genuinely ambiguous — the same value means a different absolute instant depending on which zone you assume when reading it back. Use Instant (or an explicit ZonedDateTime/OffsetDateTime) for anything compared across systems or regions.' },
  readMinutes: 2,
  related: ['datetime-overview'],
},

// ── Design & Production Judgment ──────────────────────────────────
{
  id: 'stream-debugging',
  title: 'Debugging Stream Pipelines',
  group: 'Design & Production Judgment',
  definition: 'A stack trace inside a stream pipeline points at lambda$method$N, not a readable call site — peek() and breaking the chain into named variables are the practical tools.',
  example: {
    code: { language: 'java', code: `list.stream()\n    .filter(x -> x.isValid())\n    .peek(x -> System.out.println("after filter: " + x)) // debug-only, never rely on peek for real work\n    .map(Item::process)\n    .collect(Collectors.toList());` },
  },
  remember: ['peek() is for debugging visibility only — the JDK explicitly discourages relying on it for side effects, and some JIT optimizations can skip it entirely if the result is unused', 'For anything genuinely hard to debug, extract intermediate stages into named local variables — readability and debuggability both improve'],
  interviewAngle: { q: 'Why shouldn\'t peek() be used to implement real application logic (like counting or logging important events)?', a: 'peek() is documented as primarily for debugging — the JVM may elide it if the terminal operation doesn\'t actually need the elements it touches (e.g. count() on some sources), meaning its side effects aren\'t reliably guaranteed to run.' },
  readMinutes: 2,
  related: ['functional-vs-imperative'],
},
{
  id: 'functional-vs-imperative',
  title: 'When Not to Use Streams',
  group: 'Design & Production Judgment',
  definition: 'A senior engineer reaches for a Stream pipeline for transform/filter/aggregate logic, and reaches for a plain loop when there\'s complex branching, multiple accumulators, or early-exit-with-side-effects.',
  whyItMatters: [
    'A stream pipeline crammed with nested lambdas and nine chained operations is often less readable than the equivalent loop, not more',
    'Checked exceptions don\'t compose cleanly inside lambdas — wrapping every call site in a try/catch to satisfy a functional interface signature is a common sign the loop form is simpler here',
  ],
  remember: ['Streams excel at: single-pass transform/filter/collect over a collection', 'Plain loops often win for: multiple related accumulators, complex conditional branching, or operations with checked exceptions'],
  interviewAngle: { q: 'Give a case where a for-loop is genuinely the better choice over a stream pipeline.', a: 'Computing several different running aggregates in one pass (e.g. running sum, running max, and a side log) — a loop does this naturally with local variables, while forcing it into a stream means an awkward custom Collector or multiple passes over the data.' },
  readMinutes: 2,
  related: ['stream-parallel', 'stream-debugging'],
},
]

const collectionsConcepts: ConceptCard[] = [
// ── List Implementations ────────────────────────────────────
{
  id: 'collections-framework-overview',
  title: 'Collections Framework Overview',
  group: 'List Implementations',
  definition: 'A unified set of interfaces (List, Set, Map, Queue) and implementations for storing and manipulating groups of objects.',
  whyItMatters: [
    'Choosing the wrong implementation is one of the most common, easily-avoided performance mistakes in production Java',
    'Map is deliberately not a Collection — it stores pairs, not single elements',
  ],
  remember: ['List: ordered, duplicates allowed', 'Set: no duplicates', 'Map: key→value, not a Collection subtype', 'Queue/Deque: ordered for processing, not just storage'],
  readMinutes: 1,
  related: ['arraylist', 'hashmap-internals'],
},
{
  id: 'arraylist',
  title: 'ArrayList',
  group: 'List Implementations',
  definition: 'A resizable array — contiguous backing storage that grows (1.5x) when it runs out of capacity.',
  example: {
    code: { language: 'java', code: `List<String> list = new ArrayList<>();\nlist.add("a");        // O(1) amortized\nlist.get(0);           // O(1) — direct index into the array\nlist.add(0, "z");      // O(n) — shifts every element right` },
  },
  whyItMatters: [
    'Cache-friendly contiguous memory makes iteration and get(index) fast in practice, not just in Big-O',
    'Growth means occasional O(n) copy — pre-sizing with new ArrayList<>(expectedSize) avoids repeated resizing in a hot path',
  ],
  remember: ['get/set: O(1)', 'add at end: O(1) amortized', 'add/remove at index or via iterator.remove() on a value: O(n) — shifts elements', 'Default capacity grows by roughly 1.5x, not doubling like most hash structures'],
  interviewAngle: { q: 'Why does ArrayList grow by 1.5x instead of doubling?', a: 'A design tradeoff, not a hard rule — smaller growth factor wastes less memory on over-allocation at the cost of slightly more frequent resizes; doubling (used by HashMap) favors fewer resizes over memory tightness.' },
  readMinutes: 2,
  related: ['linkedlist', 'list-resizing-cost'],
},
{
  id: 'linkedlist',
  title: 'LinkedList',
  group: 'List Implementations',
  definition: 'A doubly-linked list — each element is a node holding references to the previous and next node, no contiguous array.',
  example: {
    code: { language: 'java', code: `Deque<Integer> ll = new LinkedList<>();\nll.addFirst(1); // O(1) — no shifting, just relink pointers\nll.get(500);    // O(n) — must walk from an end` },
  },
  whyItMatters: [
    'Genuinely useful for frequent insert/remove at the head or via a live ListIterator — not as a general-purpose List substitute',
    'Every node carries pointer + object header overhead absent from ArrayList\'s flat array, so it uses noticeably more memory per element',
  ],
  remember: ['get(index): O(n), never O(1) — a common surprise for people used to arrays', 'addFirst/addLast/removeFirst/removeLast: O(1)', 'Implements both List and Deque'],
  interviewAngle: { q: 'When would you actually pick LinkedList over ArrayList in production?', a: 'Almost never for a plain List — ArrayDeque beats it for stack/queue use, and ArrayList beats it for everything else including most insert-heavy scenarios once you account for cache locality. It\'s mostly a teaching example now.' },
  readMinutes: 2,
  related: ['arraylist', 'arraydeque'],
},
{
  id: 'list-resizing-cost',
  title: 'ArrayList Resizing Cost',
  group: 'List Implementations',
  definition: 'When capacity is exhausted, ArrayList allocates a new, larger backing array and copies every existing element into it.',
  whyItMatters: ['A loop that adds N elements to a default-capacity ArrayList triggers O(log N) resize events, each copying the array — amortized O(1) per add, but a visible latency spike on the resize itself'],
  remember: ['Always pre-size (new ArrayList<>(n)) when the final size is roughly known — avoids repeated array copies', 'trimToSize() reclaims wasted capacity after bulk removals, rarely used but worth knowing'],
  readMinutes: 1,
  related: ['arraylist'],
},
{
  id: 'array-vs-list',
  title: 'Array vs List',
  group: 'List Implementations',
  definition: 'A raw array has fixed size and can hold primitives directly; a List is resizable and (outside a few wrapper tricks) only holds objects.',
  example: {
    code: { language: 'java', code: `int[] primitives = new int[100];         // no boxing, contiguous primitives\nList<Integer> boxed = new ArrayList<>(); // every element is a boxed Integer object` },
    note: 'A List<Integer> pays boxing overhead per element — a hot numeric loop over millions of items is a legitimate reason to reach for a raw array instead.',
  },
  remember: ['List<int> doesn\'t compile — generics can\'t hold primitives, hence autoboxing into Integer', 'Arrays.asList() returns a fixed-size list backed by the array — add()/remove() throw UnsupportedOperationException'],
  readMinutes: 1,
},

// ── Set Implementations ─────────────────────────────────────
{
  id: 'hashset',
  title: 'HashSet',
  group: 'Set Implementations',
  definition: 'A Set backed internally by a HashMap — each element is stored as a key with a fixed placeholder value.',
  example: {
    code: { language: 'java', code: `Set<String> set = new HashSet<>();\nset.add("a");\nset.contains("a"); // O(1) average — hashCode() finds the bucket directly` },
  },
  whyItMatters: ['Iteration order is unspecified and can change across JDK versions or even between runs — never write code that depends on it'],
  remember: ['add/remove/contains: O(1) average, O(n) worst case under heavy hash collisions', 'Relies entirely on a correct equals()/hashCode() contract on the element type'],
  interviewAngle: { q: 'What silently breaks if you put mutable objects into a HashSet and then mutate a field used in hashCode()?', a: 'The object becomes "lost" — it\'s still in the set, but contains()/remove() with an equal-looking object now hash to the wrong bucket and can\'t find it. Only immutable or identity-stable keys belong in a HashSet.' },
  readMinutes: 2,
  related: ['hashmap-internals', 'linkedhashset'],
},
{
  id: 'linkedhashset',
  title: 'LinkedHashSet',
  group: 'Set Implementations',
  definition: 'A HashSet that additionally maintains a doubly-linked list through entries, preserving insertion order on iteration.',
  whyItMatters: ['Gives you predictable, deterministic iteration order — useful for tests, caches, or anywhere output order must be stable — at a modest extra memory cost over HashSet'],
  remember: ['Lookup/insert cost is the same O(1) average as HashSet — the ordering is nearly free', 'Order is insertion order, not any kind of sorted order'],
  readMinutes: 1,
  related: ['hashset', 'linkedhashmap'],
},
{
  id: 'treeset',
  title: 'TreeSet',
  group: 'Set Implementations',
  definition: 'A Set backed by a red-black tree (via TreeMap), keeping elements in sorted order at all times.',
  example: {
    code: { language: 'java', code: `TreeSet<Integer> set = new TreeSet<>();\nset.add(5); set.add(1); set.add(3);\nset;                 // [1, 3, 5] — always sorted\nset.first(); set.ceiling(2); // navigation methods HashSet doesn't have` },
  },
  whyItMatters: ['Trades O(1) HashSet lookups for O(log n) in exchange for always-sorted order and range/navigation queries (first, last, headSet, ceiling, floor)'],
  remember: ['add/remove/contains: O(log n), not O(1)', 'Requires elements to be Comparable, or a Comparator supplied at construction', 'Sorted order, not insertion order — different from LinkedHashSet'],
  interviewAngle: { q: 'TreeSet vs sorting a List once — when does TreeSet actually earn its cost?', a: 'When the set is mutated repeatedly and must stay sorted between mutations, or you need range queries (headSet/tailSet/ceiling). A one-time sort of a static List is cheaper than maintaining a tree for data that never changes again.' },
  readMinutes: 2,
  related: ['hashset', 'comparable-vs-comparator'],
},
{
  id: 'set-implementation-tradeoffs',
  title: 'Choosing a Set Implementation',
  group: 'Set Implementations',
  definition: 'HashSet for raw speed with no ordering guarantee, LinkedHashSet for insertion-order iteration, TreeSet for sorted order and range queries.',
  remember: ['Default to HashSet unless you specifically need one of the other two properties', 'The ordering/sorting cost is real — don\'t reach for LinkedHashSet/TreeSet out of habit when order never matters'],
  readMinutes: 1,
  related: ['hashset', 'linkedhashset', 'treeset'],
},

// ── Map Internals ────────────────────────────────────────────
{
  id: 'hashmap-internals',
  title: 'HashMap Internals',
  group: 'Map Internals',
  definition: 'An array of buckets, each holding entries whose key\'s hashCode() maps to that bucket index; collisions within a bucket form a chain.',
  diagram: `flowchart LR
    Key -->|hashCode| Bucket
    Bucket --> Entry1
    Bucket --> Entry2`,
  whyItMatters: [
    'put/get are O(1) average only if hashCode() spreads keys evenly across buckets — a bad hashCode() degrades every operation toward O(n)',
    'HashMap additionally spreads the hash itself (XORs high and low bits) to reduce clustering from poor user hashCode() implementations',
  ],
  remember: ['Bucket index = hash(key.hashCode()) & (capacity - 1) — capacity is always a power of two so this is a fast bitmask, not a modulo', 'get() uses hashCode() to find the bucket, then equals() to find the right entry within it'],
  interviewAngle: { q: 'Why must a HashMap key\'s class implement equals() and hashCode() consistently?', a: 'hashCode() alone only picks a bucket — equals() disambiguates entries that collided into the same bucket. Break the contract and get()/put() can silently treat logically-equal keys as different.' },
  readMinutes: 3,
  related: ['hashmap-treeification', 'load-factor'],
},
{
  id: 'load-factor',
  title: 'Load Factor & Resizing',
  group: 'Map Internals',
  definition: 'HashMap resizes (doubles capacity, rehashes everything) once size exceeds capacity × loadFactor — default 0.75.',
  example: {
    code: { language: 'java', code: `new HashMap<>(1024, 0.75f); // pre-size when the final entry count is roughly known` },
  },
  whyItMatters: [
    'A lower load factor means more memory, fewer collisions, faster lookups; a higher one is the reverse — 0.75 is a tuned default balancing both',
    'Every resize rehashes every existing entry into new buckets — O(n) — an unavoidable but avoidable-in-frequency cost if you pre-size',
  ],
  remember: ['Default initial capacity is 16, default load factor 0.75 → resizes at 12 entries', 'Constructing with an expected size upfront avoids repeated resize-and-rehash during bulk population'],
  readMinutes: 2,
  related: ['hashmap-internals'],
},
{
  id: 'hashmap-treeification',
  title: 'HashMap Treeification (Java 8+)',
  group: 'Map Internals',
  definition: 'Since Java 8, a bucket whose chain grows past 8 entries (and the table is large enough) converts from a linked list to a red-black tree, capping worst-case lookup at O(log n) instead of O(n).',
  diagram: `flowchart LR
    Chain -->|more than 8| Tree
    Tree -->|shrinks below 6| Chain`,
  whyItMatters: ['Defends against pathological hashCode() implementations (or adversarially-crafted hash collisions) that would otherwise degrade a bucket to a slow linked-list scan'],
  remember: ['Threshold to treeify: 8 entries in one bucket AND table capacity ≥ 64 — below that capacity it resizes the table instead', 'Untreeifies back to a list if the bucket shrinks below 6 entries', 'Keys must be Comparable for the tree ordering to work — Object\'s identity hash is used as a tiebreaker otherwise'],
  interviewAngle: { q: 'Why does treeification only kick in above a table capacity of 64?', a: 'Below that size, resizing the whole table (spreading entries into more buckets) is a cheaper fix for a crowded bucket than building a tree — treeification is reserved for genuinely pathological collision cases in a table that\'s already reasonably sized.' },
  readMinutes: 2,
  related: ['hashmap-internals'],
},
{
  id: 'linkedhashmap',
  title: 'LinkedHashMap',
  group: 'Map Internals',
  definition: 'A HashMap that also maintains a doubly-linked list through entries, in either insertion order or (optionally) access order.',
  example: {
    code: { language: 'java', code: `// LRU cache in a few lines\nnew LinkedHashMap<K, V>(16, 0.75f, true) { // true = access-order\n    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {\n        return size() > 100; // evict oldest once over capacity\n    }\n};` },
  },
  whyItMatters: ['The classic building block for a simple LRU cache — access-order mode plus removeEldestEntry gives you eviction with no manual list bookkeeping'],
  remember: ['Insertion-order by default; pass accessOrder=true to reorder on every get(), not just put()'],
  readMinutes: 2,
  related: ['hashmap-internals'],
},
{
  id: 'treemap',
  title: 'TreeMap',
  group: 'Map Internals',
  definition: 'A Map backed by a red-black tree, keeping keys in sorted order — the Map counterpart to TreeSet.',
  example: {
    code: { language: 'java', code: `TreeMap<String, Integer> map = new TreeMap<>();\nmap.put("b", 2); map.put("a", 1);\nmap.firstKey();      // "a"\nmap.ceilingKey("aa"); // "b" — smallest key >= "aa"` },
  },
  remember: ['get/put: O(log n), not O(1)', 'Keys must be Comparable or a Comparator supplied at construction', 'Adds navigation: firstKey/lastKey/floorKey/ceilingKey/headMap/tailMap/subMap'],
  interviewAngle: { q: 'When would you reach for TreeMap over sorting HashMap.entrySet() once?', a: 'When the map is mutated repeatedly and you need it sorted at every point in time, or you need range queries — a one-off sort of a static snapshot is cheaper than maintaining tree balance for data that never changes.' },
  readMinutes: 1,
  related: ['treeset', 'comparable-vs-comparator'],
},
{
  id: 'concurrenthashmap-overview',
  title: 'ConcurrentHashMap (Conceptual)',
  group: 'Map Internals',
  definition: 'A thread-safe HashMap that allows concurrent reads and writes without locking the entire map — internals covered in depth in Concurrent Collections.',
  whyItMatters: [
    'Never returns ConcurrentModificationException on iteration during concurrent modification — iterators are weakly consistent instead',
    'null keys and null values are disallowed (unlike HashMap) specifically to avoid ambiguity between "no mapping" and "mapping to null" under concurrent access',
  ],
  remember: ['Java 7 and earlier: segment-based locking. Java 8+: per-bucket (per-node) locking via CAS and synchronized on the head node — far higher concurrency', 'Not a drop-in replacement for "synchronize all my HashMap access" — compound operations still need atomic methods like computeIfAbsent/merge'],
  interviewAngle: { q: 'Why not just use Collections.synchronizedMap(new HashMap<>()) instead of ConcurrentHashMap?', a: 'synchronizedMap locks the entire map on every operation — one thread blocks all others even for unrelated keys. ConcurrentHashMap locks at a much finer grain (per bucket), giving real concurrent throughput, plus it never throws ConcurrentModificationException during iteration.' },
  readMinutes: 2,
  related: ['hashmap-internals', 'fail-fast-iterators'],
},
{
  id: 'map-implementation-tradeoffs',
  title: 'Choosing a Map Implementation',
  group: 'Map Internals',
  definition: 'HashMap for raw speed, LinkedHashMap for predictable/LRU ordering, TreeMap for sorted order and range queries, ConcurrentHashMap for concurrent access.',
  remember: ['Default to HashMap; add ordering (LinkedHashMap) or sorting (TreeMap) only when the requirement is real, not speculative', 'Reach for ConcurrentHashMap the moment more than one thread touches the map — not a synchronized wrapper'],
  readMinutes: 1,
  related: ['hashmap-internals', 'linkedhashmap', 'treemap', 'concurrenthashmap-overview'],
},

// ── Queues & Deques ──────────────────────────────────────────
{
  id: 'queue-interface',
  title: 'Queue Interface',
  group: 'Queues & Deques',
  definition: 'Models FIFO processing — offer/poll/peek are the safe (non-throwing) API; add/remove/element throw on failure instead.',
  example: {
    code: { language: 'java', code: `Queue<String> q = new LinkedList<>();\nq.offer("a"); q.offer("b");\nq.poll();     // "a" — removes and returns, or null if empty` },
  },
  remember: ['offer/poll/peek return a sentinel (false/null) on failure', 'add/remove/element throw an exception on failure — pick the pair deliberately, don\'t mix them by accident'],
  readMinutes: 1,
  related: ['arraydeque', 'priorityqueue'],
},
{
  id: 'arraydeque',
  title: 'ArrayDeque',
  group: 'Queues & Deques',
  definition: 'A resizable circular-array double-ended queue — efficient at both ends, and the recommended implementation for stack or queue use over LinkedList.',
  example: {
    code: { language: 'java', code: `Deque<Integer> stack = new ArrayDeque<>();\nstack.push(1); stack.push(2);\nstack.pop(); // 2 — LIFO` },
  },
  whyItMatters: ['Backed by a contiguous array (unlike LinkedList\'s per-node pointers), so it\'s faster and more memory-efficient for the same stack/queue operations'],
  remember: ['Explicitly documented by the JDK as faster than Stack for LIFO use and faster than LinkedList for FIFO use', 'Does not allow null elements — LinkedList does, which is one reason ArrayDeque is preferred'],
  interviewAngle: { q: 'Should you use java.util.Stack in new code?', a: 'No — Stack extends Vector, inheriting legacy synchronization overhead on every operation even in single-threaded use. ArrayDeque\'s push/pop/peek cover the same LIFO use case faster.' },
  readMinutes: 2,
  related: ['queue-interface', 'linkedlist'],
},
{
  id: 'priorityqueue',
  title: 'PriorityQueue',
  group: 'Queues & Deques',
  definition: 'A binary heap where poll() always returns the smallest element by natural ordering (or a supplied Comparator) — not insertion order.',
  example: {
    code: { language: 'java', code: `PriorityQueue<Integer> pq = new PriorityQueue<>();\npq.addAll(List.of(5, 1, 3));\npq.poll(); // 1 — smallest first, regardless of insertion order` },
  },
  whyItMatters: ['Iterating a PriorityQueue directly does NOT yield sorted order — only repeated poll() does, since the heap only guarantees the root is smallest'],
  remember: ['offer/poll: O(log n)', 'peek: O(1)', 'Not thread-safe — PriorityBlockingQueue is the concurrent equivalent'],
  interviewAngle: { q: 'Why does iterating a PriorityQueue with a for-each loop not print elements in sorted order?', a: 'A heap only guarantees the minimum is at the root — the rest of the backing array is only partially ordered. Only successive poll() calls drain it in sorted order; direct iteration exposes the raw heap layout.' },
  readMinutes: 2,
  related: ['queue-interface', 'comparable-vs-comparator'],
},
{
  id: 'deque-as-stack-and-queue',
  title: 'Deque as Both Stack and Queue',
  group: 'Queues & Deques',
  definition: 'Deque (double-ended queue) supports insertion/removal at both ends, so a single implementation can serve as a stack, a queue, or a plain double-ended buffer.',
  remember: ['push/pop = LIFO stack semantics (both operate on the head)', 'offer/poll = FIFO queue semantics (offer at tail, poll from head)', 'Prefer Deque<T> as the declared type over the legacy Stack class for new stack code'],
  readMinutes: 1,
  related: ['arraydeque'],
},

// ── Iteration & Concurrency Gotchas ──────────────────────────
{
  id: 'fail-fast-iterators',
  title: 'Fail-Fast Iterators & ConcurrentModificationException',
  group: 'Iteration & Concurrency Gotchas',
  definition: 'Most java.util collection iterators track a modCount and throw ConcurrentModificationException if the collection is structurally modified during iteration by any means other than the iterator itself.',
  example: {
    code: { language: 'java', code: `List<String> list = new ArrayList<>(List.of("a", "b", "c"));\nfor (String s : list) {\n    if (s.equals("b")) list.remove(s); // throws ConcurrentModificationException\n}` },
    note: 'The exception fires on the NEXT call to iterator.next() after the mutation, not at the point of the remove() call itself.',
  },
  whyItMatters: ['A best-effort safety net for catching bugs during development, not a real concurrency guarantee — it can also miss detecting a modification and fail silently'],
  remember: ['Use Iterator.remove() (or removeIf()) to safely remove during iteration, not the collection\'s own remove()', 'This is single-threaded-safe advice too — even one thread mutating a list it\'s currently for-each-ing over triggers it'],
  interviewAngle: { q: 'How do you correctly remove elements matching a condition while iterating a List?', a: 'Use an explicit Iterator and call iterator.remove(), or simply use list.removeIf(predicate) — both update the internal modCount consistently instead of triggering ConcurrentModificationException.' },
  readMinutes: 2,
  related: ['concurrenthashmap-overview'],
},
{
  id: 'concurrentmodification-single-thread',
  title: 'ConcurrentModificationException Is Not Just a Concurrency Bug',
  group: 'Iteration & Concurrency Gotchas',
  definition: 'Despite the name, this exception most commonly fires in purely single-threaded code — any structural mutation of a collection during its own for-each loop.',
  remember: ['"Structural" means add/remove that changes size — calling list.set(i, x) to replace a value in place does not trigger it'],
  readMinutes: 1,
  related: ['fail-fast-iterators'],
},
{
  id: 'copy-on-write-lists',
  title: 'CopyOnWriteArrayList (Conceptual)',
  group: 'Iteration & Concurrency Gotchas',
  definition: 'A thread-safe List that copies the entire backing array on every write; iterators see a fixed snapshot and never throw ConcurrentModificationException.',
  whyItMatters: ['A good fit for read-heavy, write-rare data (e.g. a list of event listeners) — terrible for write-heavy workloads since every single write is an O(n) array copy'],
  remember: ['Iterators never see later writes and never fail — they operate on the snapshot taken at iterator creation, which can itself surprise callers expecting "live" iteration'],
  readMinutes: 1,
  related: ['fail-fast-iterators'],
},

// ── Ordering ──────────────────────────────────────────────────
{
  id: 'comparable-vs-comparator',
  title: 'Comparable vs Comparator',
  group: 'Ordering',
  definition: 'Comparable defines a single natural ordering inside the class itself (compareTo); Comparator defines an external, swappable ordering (compare) you can pass around.',
  example: {
    code: { language: 'java', code: `class Person implements Comparable<Person> {\n    public int compareTo(Person o) { return Integer.compare(age, o.age); } // natural order: by age\n}\nComparator<Person> byName = Comparator.comparing(p -> p.name); // alternate order, external` },
  },
  whyItMatters: [
    'A class gets at most one Comparable ordering — Comparator lets you sort the same objects different ways in different contexts without touching the class',
    'TreeMap/TreeSet use whichever is available: a supplied Comparator if given, else the element\'s Comparable',
  ],
  remember: ['compareTo/compare: negative = this before other, 0 = equal order, positive = this after other', 'Comparator.comparing(...).thenComparing(...) chains multi-key sorts without writing a manual if/else compare method'],
  interviewAngle: { q: 'Should compareTo() ever be inconsistent with equals()?', a: 'Strongly discouraged — TreeSet/TreeMap use compareTo() (or the Comparator) as the sole definition of equality for storage purposes, ignoring equals() entirely. If compareTo() says two objects are "equal" but equals() disagrees, TreeSet silently treats them as duplicates and drops one.' },
  readMinutes: 2,
  related: ['treeset', 'treemap'],
},
{
  id: 'natural-ordering-pitfalls',
  title: 'compareTo/equals Inconsistency Pitfall',
  group: 'Ordering',
  definition: 'A TreeSet/TreeMap uses compareTo() (or its Comparator) as the sole test for "already present" — not equals().',
  example: {
    code: { language: 'java', code: `TreeSet<BigDecimal> set = new TreeSet<>();\nset.add(new BigDecimal("1.0"));\nset.add(new BigDecimal("1.00")); // compareTo() says equal (same value) — silently NOT added\nset.size(); // 1, even though equals() would say these are different objects with different scale` },
    note: 'BigDecimal.equals() considers scale (1.0 != 1.00) but compareTo() does not — a textbook case of this trap.',
  },
  remember: ['Always keep a Comparable/Comparator implementation consistent with equals() unless you specifically intend and document the divergence'],
  readMinutes: 1,
  related: ['comparable-vs-comparator'],
},
{
  id: 'unmodifiable-and-immutable-collections',
  title: 'Immutable & Unmodifiable Collections',
  group: 'Ordering',
  definition: 'List.of/Set.of/Map.of create genuinely immutable collections; Collections.unmodifiableList wraps an existing mutable one in a read-only view that can still change underneath it.',
  example: {
    code: { language: 'java', code: `List<String> immutable = List.of("a", "b");        // truly fixed, throws on add()\n\nList<String> mutable = new ArrayList<>(List.of("a"));\nList<String> view = Collections.unmodifiableList(mutable);\nmutable.add("b");\nview;  // ["a", "b"] — the "unmodifiable" view still changed, because the backing list did` },
    note: 'unmodifiableList blocks writes THROUGH the view — it does nothing to stop the original reference from mutating underneath it.',
  },
  whyItMatters: ['A frequent production bug: returning Collections.unmodifiableList(internalField) from a getter and assuming callers can never see it change'],
  remember: ['List.of()/Map.of() also reject null elements and throw immediately, unlike a mutable ArrayList', 'Collections.unmodifiableX is a thin wrapper, not a copy — genuine immutability needs a defensive copy'],
  interviewAngle: { q: 'Is Collections.unmodifiableList(list) actually immutable?', a: 'No — it only blocks mutation attempts made through that specific view reference. The underlying list can still be changed directly by anyone holding the original reference, and that change is visible through the "unmodifiable" view.' },
  readMinutes: 2,
  related: ['immutability'],
},

// ── Design & Production Judgment ─────────────────────────────
{
  id: 'choosing-a-collection',
  title: 'Choosing the Right Collection',
  group: 'Design & Production Judgment',
  definition: 'The choice should follow from the actual access pattern — index lookups, uniqueness, ordering, key-value mapping, or FIFO/LIFO processing — not habit.',
  remember: [
    'Random access by index, few inserts in the middle → ArrayList',
    'Uniqueness with no ordering need → HashSet; predictable order → LinkedHashSet; sorted → TreeSet',
    'Key-value lookup → HashMap by default; sorted/range queries → TreeMap; LRU/insertion order → LinkedHashMap',
    'Stack or queue semantics → ArrayDeque, not Stack or LinkedList',
  ],
  interviewAngle: { q: 'A senior candidate defaults to ArrayList for everything and HashMap for everything else — is that wrong?', a: 'Not wrong as defaults — they\'re the right first choice most of the time. It becomes a problem when a specific requirement (sorted iteration, frequent head insertion, thread-safety) is known upfront and the default is used anyway without considering the alternative.' },
  readMinutes: 2,
  related: ['set-implementation-tradeoffs', 'map-implementation-tradeoffs'],
},
{
  id: 'collections-utility-class',
  title: 'The Collections Utility Class',
  group: 'Design & Production Judgment',
  definition: 'A static-method toolbox for operating on collections — sort, reverse, shuffle, binarySearch, unmodifiable/synchronized wrappers, min/max, emptyList().',
  example: {
    code: { language: 'java', code: `Collections.sort(list, comparator);\nCollections.max(list);\nList<String> safe = Collections.synchronizedList(new ArrayList<>()); // caller must still manually synchronize on compound operations like iteration` },
  },
  remember: ['Collections.synchronizedX wraps individual method calls, but a get-then-put or iteration sequence still needs external synchronization on the returned object itself'],
  readMinutes: 1,
},
{
  id: 'defensive-copies-in-apis',
  title: 'Defensive Copies at API Boundaries',
  group: 'Design & Production Judgment',
  definition: 'Returning or accepting a mutable collection field directly hands callers a live reference to your internal state — copy it (or wrap it) at the boundary if that\'s not intended.',
  example: {
    code: { language: 'java', code: `class Order {\n    private final List<Item> items = new ArrayList<>();\n    List<Item> getItems() { return List.copyOf(items); } // safe snapshot, not the live field\n}` },
  },
  whyItMatters: ['Without a copy, a caller mutating the returned list silently corrupts the object\'s internal state — one of the most common encapsulation leaks in real codebases'],
  remember: ['List.copyOf() / new ArrayList<>(source) for a defensive copy; Collections.unmodifiableList only prevents writes through that one reference, not the underlying corruption'],
  readMinutes: 1,
  related: ['unmodifiable-and-immutable-collections', 'encapsulation'],
},
]

const genericsConcepts: ConceptCard[] = [
// ── Foundations ──────────────────────────────────────────────
{
  id: 'generic-type-parameter',
  title: 'Generic Type Parameter',
  group: 'Foundations',
  definition: 'A placeholder type (e.g. `T`, `E`, `K`, `V`) that lets a class, interface, or method operate on any type while catching type mismatches at compile time.',
  whyItMatters: [
    'Moves ClassCastException from runtime (pre-Java 5, everything was Object) to a compile error',
    'Eliminates the manual cast that raw collections required at every read site',
  ],
  example: {
    code: { language: 'java', code: `List<String> names = new ArrayList<>();\nnames.add("Ada");\nString first = names.get(0); // no cast needed, compiler knows it's String` },
  },
  remember: ['Generics are a compile-time-only feature — see type erasure', 'By convention: T=Type, E=Element, K/V=Key/Value, R=Return'],
  readMinutes: 1,
  related: ['generic-type-erasure'],
},
{
  id: 'generic-class',
  title: 'Generic Class',
  group: 'Foundations',
  definition: 'A class parameterized over one or more types, declared with `<T>` after the class name.',
  example: {
    code: { language: 'java', code: `class Box<T> {\n    private T value;\n    void set(T value) { this.value = value; }\n    T get() { return value; }\n}` },
  },
  remember: ['The type parameter is fixed once per instance: `new Box<String>()` is a Box of String forever', 'Static members cannot use the class type parameter — they exist before any T is chosen'],
  interviewAngle: { q: 'Why can\'t a static method reference the class\'s type parameter T?', a: 'Static members belong to the class, not an instance, but T is only bound when an instance is created — there\'s no T to refer to at the static level.' },
  readMinutes: 1,
  related: ['generic-method'],
},
{
  id: 'generic-bounded-type',
  title: 'Bounded Type Parameters',
  group: 'Foundations',
  definition: '`<T extends Upper>` restricts T to Upper or its subtypes, giving the generic code access to Upper\'s methods without casting.',
  example: {
    code: { language: 'java', code: `<T extends Comparable<T>> T max(T a, T b) {\n    return a.compareTo(b) >= 0 ? a : b;\n}` },
    note: '`extends` here means "extends or implements" — it works for both classes and interfaces.',
  },
  whyItMatters: [
    'Without a bound, T is treated as Object — you lose access to any type-specific behavior',
    'Multiple bounds are allowed (`T extends A & B`) but at most one can be a class, and it must come first',
  ],
  remember: ['There is no `<T super Lower>` for type parameter declarations — that form only exists on wildcards'],
  readMinutes: 2,
  related: ['generic-self-bounded', 'generic-lower-bound-wildcard'],
},

// ── Type Erasure & Its Consequences ─────────────────────────
{
  id: 'generic-type-erasure',
  title: 'Type Erasure',
  group: 'Type Erasure & Its Consequences',
  definition: 'The compiler checks generic types, then strips them from the bytecode — at runtime a `List<String>` and a `List<Integer>` are both just `List`.',
  whyItMatters: [
    'Generics were retrofitted onto Java 5 for binary compatibility with pre-generics bytecode and libraries',
    'Every generics gotcha (no generic arrays, no `instanceof List<String>`, no overloading on type argument) traces back to this one fact',
  ],
  example: {
    code: { language: 'java', code: `List<String> a = new ArrayList<>();\nList<Integer> b = new ArrayList<>();\nSystem.out.println(a.getClass() == b.getClass()); // true` },
  },
  remember: ['Unbounded T erases to Object; `T extends Comparable` erases to Comparable', 'Erasure happens at compile time — the .class file has no generic type info to reflect on'],
  interviewAngle: { q: 'Why does Java erase generics instead of reifying them like C# does?', a: 'Backward compatibility — Java 5 needed generic and non-generic code to interoperate on the same JVM and bytecode format without a flag day.' },
  readMinutes: 2,
  diagram: `flowchart LR
    A[Source with T] -->|compile-time check| B[Bytecode]
    B -->|T erased to bound or Object| C[Runtime type List]`,
  related: ['generic-cannot-create-array', 'generic-cannot-instantiate-t', 'generic-unchecked-warning'],
},
{
  id: 'generic-bridge-methods',
  title: 'Bridge Methods',
  group: 'Type Erasure & Its Consequences',
  definition: 'Synthetic methods the compiler generates to preserve polymorphism when a generic method\'s erased signature would otherwise mismatch the overridden one.',
  example: {
    code: { language: 'java', code: `class IntBox implements Comparable<IntBox> {\n    public int compareTo(IntBox o) { return 0; }\n    // compiler also emits: compareTo(Object o) { return compareTo((IntBox) o); }\n}` },
  },
  remember: ['You never write bridge methods — javac generates them silently', 'They\'re why `getClass().getDeclaredMethods()` on a generic subtype sometimes shows an extra Object-typed overload'],
  readMinutes: 1,
  related: ['generic-type-erasure'],
},
{
  id: 'generic-cannot-create-array',
  title: 'No Generic Array Creation',
  group: 'Type Erasure & Its Consequences',
  definition: '`new T[10]` and `new List<String>[10]` don\'t compile — arrays are reified (they know their element type at runtime) but generics aren\'t.',
  whyItMatters: [
    'An array remembers its component type and enforces it on every store (ArrayStoreException) — a generic array\'s erased element type could never do that safely',
  ],
  example: {
    code: { language: 'java', code: `Object[] objs = new String[3];\nobjs[0] = 42; // compiles, throws ArrayStoreException at runtime\n// generics can't offer even that runtime safety net, so the language forbids the array outright` },
    note: 'The point isn\'t the ArrayStoreException itself — it\'s that generics have no equivalent runtime tag to check against.',
  },
  remember: ['Workaround: `@SuppressWarnings("unchecked") T[] arr = (T[]) new Object[10];`', '`Arrays.asList` and collection-to-array methods work around this internally with reflection or Object arrays'],
  interviewAngle: { q: 'How does ArrayList implement `Object[] toArray()` if you can\'t create a generic array?', a: 'It backs the list with a plain `Object[]` internally — the array is never actually typed `T[]`, only the API surface pretends it is.' },
  readMinutes: 2,
  related: ['generic-type-erasure', 'generic-varargs-heap-pollution'],
},
{
  id: 'generic-cannot-instantiate-t',
  title: 'Cannot Instantiate a Type Parameter',
  group: 'Type Erasure & Its Consequences',
  definition: '`new T()` doesn\'t compile because at runtime the JVM has no idea what T erased from — there\'s no class to allocate.',
  example: {
    code: { language: 'java', code: `class Factory<T> {\n    // T create() { return new T(); }        // compile error\n    T create(Supplier<T> ctor) { return ctor.get(); } // pass the constructor in instead\n}` },
  },
  remember: ['Workaround: pass a `Class<T>` token or a `Supplier<T>`/factory lambda and let the caller supply the actual construction'],
  interviewAngle: { q: 'How would you build a generic factory that needs to construct T?', a: 'Accept a `Supplier<T>` or `Class<T>` in the constructor and delegate — you can\'t synthesize the construction yourself because erasure removes the concrete type.' },
  readMinutes: 1,
  related: ['generic-type-erasure'],
},
{
  id: 'generic-raw-types',
  title: 'Raw Types',
  group: 'Type Erasure & Its Consequences',
  definition: 'Using a generic class without a type argument (`List` instead of `List<String>`) — legal only for backward compatibility with pre-Java-5 code.',
  example: {
    code: { language: 'java', code: `List list = new ArrayList(); // raw type\nlist.add("a");\nlist.add(42);                // compiles! no type checking at all\nString s = (String) list.get(1); // ClassCastException at runtime` },
  },
  whyItMatters: [
    'A raw type doesn\'t just erase T to Object — it disables generic type checking entirely for that variable, including in code that later assigns it into a properly-typed generic',
  ],
  remember: ['Never write raw types in new code — always at least use the diamond `<>` or an explicit wildcard `<?>`', 'Mixing raw and generic usage of the same class is the classic way heap pollution sneaks in'],
  interviewAngle: { q: 'What\'s the practical difference between `List` and `List<Object>`?', a: '`List<Object>` is still fully type-checked (you can only add Objects, and it can\'t be assigned from a `List<String>`); the raw `List` bypasses generic checking altogether and can silently accept anything.' },
  readMinutes: 2,
  related: ['generic-unchecked-warning', 'generic-varargs-heap-pollution'],
},
{
  id: 'generic-unchecked-warning',
  title: 'Unchecked Warnings',
  group: 'Type Erasure & Its Consequences',
  definition: 'The compiler\'s way of saying "I can\'t verify this cast/operation is type-safe because the info was erased" — a warning, not an error.',
  example: {
    code: { language: 'java', code: `@SuppressWarnings("unchecked")\nT[] arr = (T[]) new Object[size]; // suppress only after you've verified it's actually safe` },
  },
  remember: ['Suppress at the narrowest possible scope (a local variable or single statement), never at the class level', 'A pile of unchecked warnings is exactly where a ClassCastException likes to hide — don\'t routinely ignore them'],
  readMinutes: 1,
  related: ['generic-raw-types'],
},
{
  id: 'generic-no-overload-erasure',
  title: 'No Overloading on Erased Signature',
  group: 'Type Erasure & Its Consequences',
  definition: 'Two methods that only differ by generic type argument (`void f(List<String>)` and `void f(List<Integer>)`) collide after erasure — the compiler rejects both in the same class.',
  example: {
    code: { language: 'java', code: `// void process(List<String> l) {}\n// void process(List<Integer> l) {} // compile error: erasure clash\nvoid process(List<?> l) {}          // one method, handle dispatch internally` },
  },
  remember: ['This is the same erasure fact as arrays and instantiation — different symptom, same root cause'],
  readMinutes: 1,
  related: ['generic-type-erasure'],
},
{
  id: 'generic-varargs-heap-pollution',
  title: 'Varargs Heap Pollution',
  group: 'Type Erasure & Its Consequences',
  definition: 'A generic varargs parameter (`T... args`) is implemented as `T[]`, which erasure makes an unsafe array — mixing types through it can corrupt the heap without an immediate exception.',
  example: {
    code: { language: 'java', code: `@SafeVarargs\nstatic <T> List<T> listOf(T... items) { return Arrays.asList(items); }` },
    note: '@SafeVarargs is a promise to the compiler that the method doesn\'t do anything unsafe with the array — it suppresses the warning, it doesn\'t fix unsafe code.',
  },
  remember: ['Only apply `@SafeVarargs` to `static`, `final`, `private`, or constructor methods — those can\'t be overridden with unsafe behavior'],
  readMinutes: 2,
  related: ['generic-cannot-create-array'],
},

// ── Wildcards & Variance ─────────────────────────────────────
{
  id: 'generic-invariance',
  title: 'Generics Are Invariant',
  group: 'Wildcards & Variance',
  definition: '`List<Integer>` is not a `List<Number>`, even though `Integer` is a `Number` — generic type arguments don\'t follow subtyping.',
  whyItMatters: [
    'If it were allowed, you could add a Double into what the caller thinks is a `List<Integer>` through the `List<Number>` reference — invariance is what prevents that',
  ],
  example: {
    code: { language: 'java', code: `List<Integer> ints = new ArrayList<>();\n// List<Number> nums = ints; // compile error — not allowed\nList<? extends Number> nums = ints; // this is allowed — see wildcards` },
  },
  remember: ['Arrays are covariant in Java (unsafely — see ArrayStoreException); generics deliberately are not'],
  readMinutes: 1,
  related: ['generic-upper-bound-wildcard', 'generic-cannot-create-array'],
},
{
  id: 'generic-upper-bound-wildcard',
  title: '? extends — Producer',
  group: 'Wildcards & Variance',
  definition: '`List<? extends T>` accepts a list of T or any subtype — you can safely read T out of it, but not add anything (except null) into it.',
  example: {
    code: { language: 'java', code: `void printAll(List<? extends Number> nums) {\n    for (Number n : nums) System.out.println(n); // reading is safe\n    // nums.add(1); // compile error — could be List<Integer> or List<Double>, compiler can't know\n}` },
  },
  remember: ['? extends = you can only produce (read) values out — this is the "Extends = Exports" half of PECS'],
  readMinutes: 2,
  related: ['generic-pecs', 'generic-lower-bound-wildcard'],
},
{
  id: 'generic-lower-bound-wildcard',
  title: '? super — Consumer',
  group: 'Wildcards & Variance',
  definition: '`List<? super T>` accepts a list of T or any supertype — you can safely add T into it, but reads only give you Object.',
  example: {
    code: { language: 'java', code: `void addNumbers(List<? super Integer> list) {\n    list.add(1);           // safe — any supertype list can hold an Integer\n    // Integer x = list.get(0); // compile error — could be List<Number> or List<Object>\n    Object o = list.get(0); // this is all you get back\n}` },
  },
  remember: ['? super = you can only consume (write) values in — this is the "Super = Stores" half of PECS'],
  readMinutes: 2,
  related: ['generic-pecs', 'generic-upper-bound-wildcard'],
},
{
  id: 'generic-pecs',
  title: 'PECS Principle',
  group: 'Wildcards & Variance',
  definition: 'Producer Extends, Consumer Super — pick the wildcard based on whether the parameter feeds data out to you or takes data in from you.',
  whyItMatters: [
    'This is the single most-tested generics interview concept — it\'s the difference between reading Collections.copy\'s signature and actually understanding why it\'s written that way',
  ],
  example: {
    code: { language: 'java', code: `static <T> void copy(List<? super T> dest, List<? extends T> src) {\n    for (T item : src) dest.add(item);\n}` },
    note: 'src produces items (extends), dest consumes them (super) — exactly PECS.',
  },
  diagram: `flowchart LR
    A[Source extends T] -->|read only| B[copy]
    B -->|write only| C[Destination super T]`,
  remember: ['Producer you read from -> extends', 'Consumer you write to -> super', 'Read and write both? Use the exact type, no wildcard'],
  interviewAngle: { q: 'Why does `Collections.copy` take `List<? super T> dest` first and `List<? extends T> src` second?', a: 'dest only receives elements (consumer -> super), src only yields them (producer -> extends) — textbook PECS.' },
  readMinutes: 2,
  related: ['generic-upper-bound-wildcard', 'generic-lower-bound-wildcard'],
},
{
  id: 'generic-unbounded-wildcard',
  title: 'Unbounded Wildcard ?',
  group: 'Wildcards & Variance',
  definition: '`List<?>` means "a list of some unknown type" — used when the method only needs operations that don\'t depend on the element type at all.',
  example: {
    code: { language: 'java', code: `void printSize(List<?> list) {\n    System.out.println(list.size()); // fine, size() doesn't care about T\n    // list.add("x"); // compile error — unknown type, nothing is provably safe to add\n}` },
  },
  remember: ['`List<?>` is more restrictive to write into than `List<Object>` — the latter is a real, known type; `?` is genuinely unknown'],
  readMinutes: 1,
  related: ['generic-upper-bound-wildcard'],
},

// ── Generic Methods & Design ─────────────────────────────────
{
  id: 'generic-method',
  title: 'Generic Method',
  group: 'Generic Methods & Design',
  definition: 'A method with its own type parameter, declared before the return type, independent of any type parameter its enclosing class might have.',
  example: {
    code: { language: 'java', code: `static <T> T firstOf(List<T> list) {\n    return list.get(0);\n}\nString s = firstOf(List.of("a", "b")); // T inferred as String` },
  },
  whyItMatters: [
    'Lets a static utility method (like most of java.util.Collections) be generic without the class itself needing a type parameter',
  ],
  remember: ['The type argument is almost always inferred from the call site — explicit `Collections.<String>emptyList()` syntax exists but is rarely needed'],
  readMinutes: 1,
  related: ['generic-class', 'generic-type-inference'],
},
{
  id: 'generic-type-inference',
  title: 'Target-Type Inference',
  group: 'Generic Methods & Design',
  definition: 'Since Java 8, the compiler infers a generic method\'s type argument from the expected result type (the assignment target), not just the arguments passed in.',
  example: {
    code: { language: 'java', code: `List<String> list = Collections.emptyList(); // T inferred as String from the target, not any argument` },
  },
  remember: ['This is why the diamond operator `new ArrayList<>()` can infer the type from the declared variable'],
  readMinutes: 1,
  related: ['generic-method'],
},
{
  id: 'generic-self-bounded',
  title: 'Self-Bounded (Recursive) Generics',
  group: 'Generic Methods & Design',
  definition: '`class Enum<E extends Enum<E>>` — a type parameter bounded by an expression that refers to itself, used to make a supertype method return the concrete subtype.',
  example: {
    code: { language: 'java', code: `enum Day implements Comparable<Day> { MON, TUE }\n// Enum<E extends Enum<E>> lets compareTo(Day) be strongly typed on Day, not just Enum` },
  },
  whyItMatters: [
    'Powers the "curiously recurring generic pattern" seen in Enum, and in fluent builder hierarchies that need `this`-returning methods to stay typed as the subclass',
  ],
  remember: ['Reads as: E must be a comparable-to-itself family of the exact enum in question', 'Rare to write yourself, common to be asked to explain (usually via Enum or a builder pattern)'],
  interviewAngle: { q: 'Why is `Enum` declared as `Enum<E extends Enum<E>>` instead of just `Enum<E>`?', a: 'So `compareTo` and other supertype methods are typed to the concrete enum subclass instead of the generic Enum base — without the self-bound, compareTo would only accept a plain Enum, losing type safety.' },
  readMinutes: 2,
  related: ['generic-bounded-type'],
},
{
  id: 'generic-covariant-return',
  title: 'Generic Covariant Return',
  group: 'Generic Methods & Design',
  definition: 'An overriding method can narrow its return type to a subtype of the original — including narrowing a generic return type — without breaking the override relationship.',
  example: {
    code: { language: 'java', code: `interface Repo<T> { T save(T item); }\nclass UserRepo implements Repo<User> {\n    public User save(User item) { return item; } // return type is User, not T — still a valid override\n}` },
  },
  remember: ['This relies on the bridge method mechanism to keep the erased signature compatible'],
  readMinutes: 1,
  related: ['generic-bridge-methods'],
},

// ── Design Judgment ───────────────────────────────────────────
{
  id: 'generic-reified-workarounds',
  title: 'Working Around Erasure',
  group: 'Design Judgment',
  definition: 'When code genuinely needs the runtime type (deserialization, reflection-based factories), pass an explicit `Class<T>` token — a "super type token" — since generics themselves carry nothing at runtime.',
  example: {
    code: { language: 'java', code: `<T> T fromJson(String json, Class<T> type) {\n    return objectMapper.readValue(json, type); // type carries what erasure removed\n}` },
  },
  remember: ['Jackson\'s TypeReference and Guava\'s TypeToken solve the harder case (generic types like `List<User>`) by capturing the type via an anonymous subclass at compile time, since even a Class<T> token can\'t express a parameterized type'],
  interviewAngle: { q: 'How do libraries like Jackson deserialize into `List<User>` if generics are erased?', a: 'They use a "super type token": you subclass an abstract generic class (e.g. `new TypeReference<List<User>>(){}`), and the library reads the parameterized supertype off that anonymous subclass\'s reflective metadata, which the JVM does retain.' },
  readMinutes: 2,
  related: ['generic-type-erasure', 'generic-cannot-instantiate-t'],
},
{
  id: 'generic-over-engineering',
  title: 'When Generics Over-Complicate an API',
  group: 'Design Judgment',
  definition: 'A generic parameter earns its place when callers plug in genuinely different types and get real compile-time safety back — not every reusable-looking class needs one.',
  whyItMatters: [
    'A single-implementation "just in case" type parameter (`Repository<T, ID>` used by exactly one entity) adds ceremony at every call site for no real flexibility gained',
    'Deeply nested bounded wildcards (`Map<? extends K, ? extends List<? super V>>`) often signal the design should be simplified, not that the generics are wrong',
  ],
  remember: ['Prefer a generic method over a generic class when only one method actually varies by type', 'If a wildcard type is unreadable at the call site, consider whether a concrete type or a small non-generic interface says the same thing more plainly'],
  interviewAngle: { q: 'When would you deliberately avoid making a class generic even though it could be?', a: 'When there\'s exactly one real consumer type and no evidence more are coming — a concrete type keeps the API and stack traces readable, and you can always generify later without breaking well-encapsulated callers.' },
  readMinutes: 2,
  related: ['generic-pecs'],
},
]

export const javaConcepts: ConceptSection[] = [
  {
    id: 'java-concept-fundamentals',
    subtopic: 'fundamentals',
    title: 'Class, Object & OOP',
    intro: 'A quick-reference pass through Java\'s object model — from class/object mechanics to the four pillars, Java-specific mechanics, the Object contract, and the design judgment that separates a senior engineer from someone reciting definitions.',
    concepts: fundamentalsConcepts,
  },
  {
    id: 'java-concept-strings',
    subtopic: 'strings',
    title: 'Strings',
    intro: 'Strings look simple but hide real interview depth: immutability\'s consequences, pool/memory internals, performance traps in concatenation, and Unicode correctness that trips up even experienced engineers.',
    concepts: stringsConcepts,
  },
  {
    id: 'java-concept-java8',
    subtopic: 'java8',
    title: 'Java 8+ Features',
    intro: 'Lambdas, method references, and the Streams API reshaped how idiomatic Java is written — this is the mechanics plus the judgment calls senior engineers are expected to have about when functional style genuinely helps.',
    concepts: java8Concepts,
  },
  {
    id: 'java-concept-collections',
    subtopic: 'collections',
    title: 'Collections',
    intro: 'The Collections Framework from the inside — what each implementation actually costs, where the classic gotchas hide, and how to choose deliberately instead of defaulting to ArrayList and HashMap out of habit.',
    concepts: collectionsConcepts,
  },
  {
    id: 'java-concept-generics',
    subtopic: 'generics',
    title: 'Generics',
    intro: 'Type erasure explains almost every generics gotcha in Java — once that clicks, wildcards, bounded types, and the handful of things you genuinely can\'t do with generics all make sense as consequences of one design decision.',
    concepts: genericsConcepts,
  },
]

