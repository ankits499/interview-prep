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
    Dog -->|is-a| Animal
    Car -->|has-a| Engine`,
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

const concurrencyConcepts: ConceptCard[] = [
  // ── Foundations ──────────────────────────────────────────────
  {
    id: 'thread-basics',
    title: 'Thread Creation & Lifecycle',
    group: 'Foundations',
    definition: 'A thread is a lightweight execution context within a process — create one by extending Thread or passing a Runnable to `new Thread()`, then call start() (not run() directly) to begin execution.',
    example: {
      code: { language: 'java', code: `Thread t = new Thread(() -> System.out.println("runs concurrently"));\nt.start();  // spawns a new thread\n// t.run() directly would block, not spawn` },
      note: 'Calling start() schedules the thread on the scheduler; calling run() just executes synchronously in the current thread.',
    },
    whyItMatters: [
      'A common mistake to call run() thinking it spawns a thread',
      'Thread.start() is not idempotent — calling it twice throws IllegalThreadStateException',
    ],
    remember: ['start() spawns; run() is just a method', 'A thread has states: new, runnable, running, blocked, terminated'],
    readMinutes: 2,
    related: ['thread-safety-by-design'],
  },
  {
    id: 'synchronized-keyword',
    title: 'Synchronized & Intrinsic Locks',
    group: 'Foundations',
    definition: 'synchronized marks a block or method as guarded by a lock — on a method, it locks the object (this); on a block, it locks a specified object. Only one thread can hold a given object\'s lock at a time.',
    example: {
      code: { language: 'java', code: `class Counter {\n    private int count = 0;\n    synchronized void increment() { count++; }  // locks this.Counter instance\n}\n\nsynchronized (lock) {  // block-level locking\n    // only one thread at a time\n}` },
    },
    whyItMatters: [
      'synchronized protects against race conditions by serializing access to shared mutable state',
      'Every Java object has an intrinsic monitor — synchronized uses that, no explicit Lock object needed',
    ],
    remember: ['Lock is per-object, not per-variable or per-thread', 'Recursive entry is allowed — a thread can re-acquire a lock it already holds'],
    interviewAngle: { q: 'If two threads call synchronized methods on different instances of the same class, do they block each other?', a: 'No — each instance has its own lock. Only synchronized (this) for instance methods; synchronized static methods lock the class object, not instances.' },
    readMinutes: 2,
    related: ['intrinsic-monitor', 'visibility-guarantees'],
  },
  {
    id: 'intrinsic-monitor',
    title: 'Object as Monitor',
    group: 'Foundations',
    definition: 'Every Java object is a monitor — it holds an intrinsic lock and can be used as a coordination point for wait/notify, even if it\'s just `new Object()`.',
    example: {
      code: { language: 'java', code: `Object lock = new Object();\nsynchronized (lock) { lock.wait(); }    // releases lock, waits for notification\nsynchronized (lock) { lock.notify(); }  // wakes one waiting thread` },
    },
    remember: ['wait/notify are on Object, not Thread, because the synchronization point is the monitor, not the thread', 'wait() can only be called from within a synchronized block; same for notify()'],
    readMinutes: 1,
    related: ['synchronized-keyword', 'wait-notify'],
  },

  // ── Visibility & Memory Order ─────────────────────────────────
  {
    id: 'visibility-guarantees',
    title: 'Visibility & Happens-Before',
    group: 'Visibility & Memory Order',
    definition: 'Without synchronization, one thread\'s write to a variable may not be visible to another thread for an arbitrarily long time. synchronized and volatile create visibility guarantees via happens-before relations.',
    whyItMatters: [
      'Compiler and CPU optimizations can reorder operations, cache results in registers, or delay flushing to shared memory',
      'A thread may see stale cached values indefinitely without explicit synchronization',
    ],
    remember: ['synchronized/volatile create visibility guarantees that plain reads/writes do not', 'Race condition ≠ visibility issue — even single-threaded access to a shared variable can have visibility problems in a multi-threaded system'],
    interviewAngle: { q: 'A field is written by one thread and read by another, both unsynchronized. Is the reader guaranteed to see the write?', a: 'No — the write may sit in a cache or register indefinitely. volatile or synchronized on both sides are needed to guarantee visibility.' },
    readMinutes: 2,
    related: ['volatile-keyword', 'memory-model'],
  },
  {
    id: 'volatile-keyword',
    title: 'volatile Modifier',
    group: 'Visibility & Memory Order',
    definition: 'Marks a field as requiring visibility guarantees: every read must see the most recent write, and writes are visible to all subsequent reads, even without synchronization.',
    example: {
      code: { language: 'java', code: `class Flag {\n    private volatile boolean running = true;\n    void stop() { running = false; }          // visible to reader immediately\n    void work() { while (running) { ... } }   // always sees latest value\n}` },
    },
    whyItMatters: [
      'Allows coordination between threads without the throughput cost of locking',
      'Only guarantees visibility, not atomicity — volatile boolean running = !running is still racy',
    ],
    remember: ['volatile ≠ atomic — it guarantees visibility, not atomic operations', 'Never use volatile as a substitute for synchronization when you need to protect compound operations'],
    readMinutes: 1,
    related: ['visibility-guarantees', 'atomic-operations'],
  },

  // ── Race Conditions & Deadlock ─────────────────────────────────
  {
    id: 'race-condition',
    title: 'Race Condition',
    group: 'Race Conditions & Deadlock',
    definition: 'Two or more threads access shared mutable state concurrently, at least one writes, and the order of access is not synchronized — the result depends on the timing of thread execution.',
    example: {
      code: { language: 'java', code: `int balance = 100;\n// Thread A: balance += 50\n// Thread B: balance -= 30\n// Unsynchronized: final value might be 70, 100, or 120 depending on interleaving` },
      note: 'Even a single operation like += is multiple CPU instructions (load, increment, store) — a race between threads can interleave them.',
    },
    remember: ['A race condition is a bug in the code, not necessarily a crash or exception', 'Tests may pass despite a race — it only manifests when scheduling aligns just right'],
    interviewAngle: { q: 'A field is protected by synchronized methods, but a race still surfaces. What\'s the likely cause?', a: 'The race is across multiple fields or multiple operations — e.g., check-then-act (if (balance >= amount) then balance -= amount) where the check and withdrawal are separate, unsynchronized steps.' },
    readMinutes: 2,
    related: ['synchronized-keyword', 'check-then-act'],
  },
  {
    id: 'check-then-act',
    title: 'Check-Then-Act Race Window',
    group: 'Race Conditions & Deadlock',
    definition: 'A compound operation (check a condition, then take action based on it) where the state can change between the check and the act, even if each individual operation is synchronized.',
    example: {
      code: { language: 'java', code: `// WRONG: race between check and withdrawal\nif (balance >= amount) {        // Thread A checks: true\n    balance -= amount;          // Thread B withdraws in between, balance < amount now\n                                // Thread A proceeds anyway, overdraft\n}\n\n// Correct: atomic compound operation\nsynchronized void withdraw(int amount) {\n    if (balance >= amount) balance -= amount;\n}` },
    },
    remember: ['Synchronizing individual operations is not enough if the logic spans multiple steps', 'The synchronized block must cover the entire compound operation, not just pieces of it'],
    readMinutes: 1,
    related: ['race-condition'],
  },
  {
    id: 'deadlock',
    title: 'Deadlock',
    group: 'Race Conditions & Deadlock',
    definition: 'Two or more threads each hold a lock and wait for another\'s lock, forming a circular dependency — all waiting threads are blocked indefinitely, making no progress.',
    diagram: `flowchart LR
    A[Thread A] -->|holds| L1[Lock 1]
    A -->|waits for| L2[Lock 2]
    B[Thread B] -->|holds| L2
    B -->|waits for| L1`,
    whyItMatters: [
      'Deadlock is impossible to fully prevent without discipline, since each thread acting correctly in isolation doesn\'t prevent circular dependencies',
      'Hard to debug — the system appears frozen with no exception thrown',
    ],
    remember: ['Always acquire multiple locks in the same order across all threads — lock ordering prevents circular waits', 'Timeouts (tryLock with a duration) can break deadlock if the wait exceeds the timeout'],
    readMinutes: 2,
    related: ['lock-ordering'],
  },
  {
    id: 'lock-ordering',
    title: 'Lock Ordering',
    group: 'Race Conditions & Deadlock',
    definition: 'If code must acquire multiple locks, always do so in a consistent global order across every part of the codebase — prevents circular wait chains and deadlock.',
    example: {
      code: { language: 'java', code: `// Consistent order: always lock A before B\nObject lockA = ...;\nObject lockB = ...;\n\nsynchronized (lockA) {       // first lock\n    synchronized (lockB) {   // then lock\n        // safe from deadlock (as long as every other call also respects this order)\n    }\n}` },
    },
    remember: ['Document the lock order — it\'s a contract any code acquiring the same locks must honor', 'Violating the order in even one code path can deadlock the entire system'],
    readMinutes: 1,
    related: ['deadlock'],
  },

  // ── Coordination Primitives ────────────────────────────────────
  {
    id: 'wait-notify',
    title: 'wait() and notify()',
    group: 'Coordination Primitives',
    definition: 'wait() releases a held lock and suspends until another thread calls notify() on the same monitor; notify() wakes one waiting thread (or notifyAll() wakes all).',
    example: {
      code: { language: 'java', code: `Object lock = new Object();\n\n// Producer\nsynchronized (lock) {\n    item = produce();\n    lock.notifyAll();  // wake consumers\n}\n\n// Consumer\nsynchronized (lock) {\n    while (item == null) lock.wait();  // release lock, wait\n    consume(item);\n}` },
      note: 'Always check the condition in a while loop, not if — spurious wakeups can happen.',
    },
    whyItMatters: ['Enables efficient producer/consumer patterns without spinning/polling', 'notify() is unpredictable (wakes an arbitrary thread), so notifyAll() is safer despite the cost'],
    remember: ['wait() must be called from within a synchronized block', 'Use while (condition) not if — condition may change before your thread wakes, or spurious wakeup may occur'],
    readMinutes: 2,
    related: ['spurious-wakeup', 'intrinsic-monitor'],
  },
  {
    id: 'spurious-wakeup',
    title: 'Spurious Wakeup',
    group: 'Coordination Primitives',
    definition: 'A thread can wake from wait() without anyone calling notify() — rare but legal per the spec. Calling wait() in a while loop re-checks the condition and re-waits if false.',
    remember: ['Never use if (condition) wait(); always while (condition) wait()', 'Spurious wakeups are a correctness requirement, not a bug — code must handle them'],
    readMinutes: 1,
    related: ['wait-notify'],
  },
  {
    id: 'notify-vs-notifyall',
    title: 'notify() vs notifyAll()',
    group: 'Coordination Primitives',
    definition: 'notify() wakes one arbitrary waiting thread; notifyAll() wakes all. Use notifyAll() unless you\'re certain exactly one waiter needs waking.',
    whyItMatters: [
      'notify() can lead to lost notifications if the wrong thread wakes (e.g., a thread waiting on a different condition)',
      'notifyAll() is safer but has a higher cost if many threads are waiting',
    ],
    remember: ['Default to notifyAll()', 'notify() only makes sense if all waiters will perform the same action on waking'],
    readMinutes: 1,
    related: ['wait-notify'],
  },

  // ── Atomics & Concurrent Primitives ────────────────────────────
  {
    id: 'atomic-operations',
    title: 'Atomic Operations (AtomicInteger, etc.)',
    group: 'Atomics & Concurrent Primitives',
    definition: 'java.util.concurrent.atomic classes provide thread-safe, lock-free operations like compareAndSet (CAS) — faster than synchronized for simple counters or flags.',
    example: {
      code: { language: 'java', code: `AtomicInteger counter = new AtomicInteger(0);\ncounter.incrementAndGet();   // atomic, no lock\nboolean swapped = counter.compareAndSet(5, 10);  // CAS: set to 10 only if currently 5` },
    },
    whyItMatters: [
      'CAS (compare-and-swap) is faster than locking for uncontended updates — backed by CPU instruction support',
      'Useful for counters, flags, simple state transitions where locking would be overkill',
    ],
    remember: ['No more efficient than synchronized for heavy contention — both spin/retry under load', 'Atomic ≠ immutable — the value can still change after you read it'],
    readMinutes: 2,
    related: ['volatile-keyword', 'compare-and-swap'],
  },
  {
    id: 'compare-and-swap',
    title: 'Compare-And-Swap (CAS)',
    group: 'Atomics & Concurrent Primitives',
    definition: 'An atomic CPU instruction that compares a variable\'s current value to an expected value and only swaps it if they match — the basis of lock-free programming.',
    example: {
      code: { language: 'java', code: `// Atomically set value only if currently == expected\nboolean success = atomicRef.compareAndSet(expected, newValue);` },
    },
    remember: ['CAS is atomic at the hardware level, not requiring a software lock', 'Retry loops using CAS can handle contention by spinning rather than blocking, which is fast for uncontended updates but expensive under heavy load'],
    readMinutes: 1,
    related: ['atomic-operations'],
  },

  // ── Thread Safety Design ──────────────────────────────────────
  {
    id: 'thread-safety-by-design',
    title: 'Thread Safety by Design',
    group: 'Thread Safety Design',
    definition: 'Design thread-safe classes from the start: document concurrency policy, make mutable state explicit, guard it consistently, and prefer immutability or confinement where possible.',
    whyItMatters: [
      'Thread-safety bolted on later is harder to verify and more bug-prone than designing for it',
      'Clear concurrency documentation prevents misuse by callers who assume thread-safety without it',
    ],
    remember: [
      'Immutability is the simplest thread-safety strategy — if there is no shared mutable state, there is no race condition',
      'Thread confinement: if each thread owns its own copy of state (no sharing), no synchronization is needed',
    ],
    readMinutes: 2,
    related: ['immutability-for-concurrency', 'thread-confinement'],
  },
  {
    id: 'immutability-for-concurrency',
    title: 'Immutability',
    group: 'Thread Safety Design',
    definition: 'An immutable object cannot change after construction — it is thread-safe by definition, requiring no synchronization to share across threads.',
    example: {
      code: { language: 'java', code: `final class Point {\n    private final int x;\n    private final int y;\n    Point(int x, int y) { this.x = x; this.y = y; }  // no setters\n}\n// Point is thread-safe: no thread can modify it after construction` },
    },
    whyItMatters: [
      'The simplest and most efficient thread-safety guarantee — zero synchronization overhead',
      'Enables fearless sharing of objects across threads and in collections',
    ],
    remember: [
      'A final field holding a reference to a mutable object (final List list) is not fully immutable — the list can be mutated through the reference',
      'Immutability + confinement is a powerful combination: immutable objects can be freely shared; confined mutable state needs synchronization only within its owner thread',
    ],
    readMinutes: 2,
    related: ['thread-confinement', 'thread-safety-by-design'],
  },
  {
    id: 'thread-confinement',
    title: 'Thread Confinement',
    group: 'Thread Safety Design',
    definition: 'Mutable state owned by a single thread, never shared or accessed by others — requires no synchronization, and the owning thread can do whatever it wants with the state.',
    example: {
      code: { language: 'java', code: `// Thread confinement via stack-local variables\nvoid process() {\n    List<Item> batch = new ArrayList<>();  // confined to this method/thread\n    for (...) batch.add(...);              // no race possible\n}` },
    },
    remember: ['Confinement is enforced by design/discipline, not by the language — a confined object shared by mistake is racy', 'Stack-local variables are automatically confined; heap-allocated objects require careful passing rules to remain confined'],
    readMinutes: 1,
    related: ['thread-safety-by-design', 'threadlocal'],
  },
  {
    id: 'threadlocal',
    title: 'ThreadLocal',
    group: 'Thread Safety Design',
    definition: 'A container that holds a separate value per thread — each thread sees its own, independent instance, eliminating the need to share or synchronize.',
    example: {
      code: { language: 'java', code: `ThreadLocal<SimpleDateFormat> dateFormat = ThreadLocal.withInitial(\n    () -> new SimpleDateFormat("yyyy-MM-dd")\n);\n// Each thread calling dateFormat.get() gets its own SimpleDateFormat instance` },
    },
    whyItMatters: [
      'Solves the problem of thread-unsafe objects (like SimpleDateFormat) that must be used by many threads',
      'Often cheaper than synchronization or per-thread object creation',
    ],
    remember: ['ThreadLocal creates a separate instance per thread, but remember to remove() after the thread dies to prevent memory leaks', 'ThreadLocal is not a replacement for proper synchronization of shared state — it only works when true sharing is not needed'],
    readMinutes: 2,
    related: ['thread-confinement'],
  },

  // ── Advanced Patterns ─────────────────────────────────────────
  {
    id: 'thread-interruption',
    title: 'Thread Interruption',
    group: 'Advanced Patterns',
    definition: 'A thread can request another thread to stop by calling interrupt() — the interrupted thread checks isInterrupted() or catches InterruptedException and decides whether to comply.',
    example: {
      code: { language: 'java', code: `Thread t = new Thread(() -> {\n    try {\n        while (!Thread.currentThread().isInterrupted()) {\n            doWork();\n        }\n    } catch (InterruptedException e) {\n        Thread.currentThread().interrupt();\n    }\n});\nt.start();\nt.interrupt();` },
    },
    whyItMatters: [
      'Allows graceful shutdown — the thread being interrupted has a chance to clean up',
      'Catching InterruptedException clears the interrupted flag, so always restore it unless you intend to suppress the interrupt',
    ],
    remember: ['Thread.stop() is deprecated and dangerous — interruption is the correct cooperative mechanism', 'Catching InterruptedException should generally re-set the flag by calling interrupt() again, or propagate it'],
    readMinutes: 2,
    related: ['thread-basics'],
  },
  {
    id: 'memory-model',
    title: 'Java Memory Model (Brief)',
    group: 'Advanced Patterns',
    definition: 'The JMM defines how threads interact with memory — synchronized and volatile enforce ordering guarantees, ensuring one thread\'s writes become visible to others predictably.',
    remember: ['The JMM is the contract between the language and the CPU — without it, optimizations could break correctness', 'Key guarantee: actions within a lock are visible to the next thread acquiring that same lock (lock-before-unlock happens-before)'],
    readMinutes: 1,
    related: ['visibility-guarantees', 'volatile-keyword'],
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
  importance: 'must-know',
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
  comparison: {
    columns: ['Choice', 'Indexed access', 'Insert at head', 'Memory', 'Best use'],
    rows: [
      ['ArrayList', 'O(1)', 'O(n)', 'Compact array', 'Default general-purpose list'],
      ['LinkedList', 'O(n)', 'O(1)', 'Node and pointer overhead', 'Rare iterator-based insertion'],
      ['ArrayDeque', 'No indexed access', 'O(1)', 'Compact array', 'Queue or stack'],
    ],
    takeaway: 'Default to ArrayList for a List and ArrayDeque for a queue or stack. LinkedList is rarely the best production choice.',
  },
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
  related: ['defensive-copies-in-apis'],
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
  related: ['unmodifiable-and-immutable-collections'],
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

const jmmConcepts: ConceptCard[] = [
// Group: Foundations
  {
    id: 'jmm-why-exists',
    title: 'Why the JMM Exists',
    group: 'Foundations',
    definition: 'Compilers, JITs, and CPUs are free to reorder and cache instructions as long as a single thread cannot observe the reordering — the JMM is what constrains that freedom once a second thread is watching.',
    whyItMatters: [
      'Without it, "correct" single-threaded code gives no guarantee another thread ever sees your writes, or sees them in the order you wrote them',
      'It defines the minimum contract a JVM implementation must honor across every architecture (x86, ARM), which is why some races that "work" on your laptop fail in production',
    ],
    remember: ['The model is about visibility and ordering across threads, not about making operations atomic'],
    readMinutes: 2,
  },

  // Group: Happens-Before
  {
    id: 'happens-before-formal',
    title: 'Happens-Before Is Not About Time',
    group: 'Happens-Before',
    definition: 'Happens-before is a partial ordering the JMM guarantees between specific actions — if A happens-before B, A\'s effects are visible to B, regardless of whether A finished executing before B started on the clock.',
    whyItMatters: [
      'Two actions can happen-before each other without any real-time ordering guarantee at all — happens-before is purely about what the JMM promises is visible',
      'If no happens-before edge connects two accesses to the same variable from different threads, that\'s a data race, and the JVM is free to produce any result',
    ],
    remember: ['"Happens-before" is a legal/spec term, not a scheduling guarantee — don\'t confuse it with "happens earlier"'],
    interviewAngle: { q: 'Does happens-before guarantee thread A\'s action actually executes before thread B\'s?', a: 'No — it guarantees visibility of effects if an edge exists, nothing about wall-clock execution order.' },
    readMinutes: 2,
  },
  {
    id: 'happens-before-rules',
    title: 'The Happens-Before Rules',
    group: 'Happens-Before',
    definition: 'A small, closed set of rules generates every happens-before edge in the JMM: program order within a thread, monitor unlock before a later lock on the same monitor, a volatile write before a later volatile read of the same field, and a thread start/termination before the spawned/joining thread\'s actions — all composed transitively.',
    whyItMatters: [
      'Transitivity is what makes real programs work: if A happens-before B and B happens-before C, A happens-before C, even across three different threads',
      'Interviewers use this list to probe whether you actually know the mechanism behind synchronized/volatile/Thread.join, not just their surface behavior',
    ],
    remember: [
      'Program order only holds within a single thread — it says nothing about how another thread observes those actions',
      'Thread.start() happens-before anything the new thread does; the last action in a thread happens-before another thread\'s successful join() on it',
    ],
    diagram: 'flowchart LR\n  a[Thread A writes field] --> b[Thread A writes volatile flag]\n  b --> c[Thread B reads volatile flag]\n  c --> d[Thread B reads field]',
    readMinutes: 3,
    related: ['happens-before-formal', 'volatile-memory-barrier'],
  },

  // Group: Volatile Semantics
  {
    id: 'volatile-visibility-not-atomicity',
    title: 'Volatile: Visibility, Not Atomicity',
    group: 'Volatile Semantics',
    definition: 'volatile guarantees every read sees the most recent write and establishes a happens-before edge, but it does nothing to make compound operations like increment-and-store a single atomic step.',
    whyItMatters: [
      'A volatile int counter under concurrent counter++ still loses updates — the read, increment, and write are three separate steps that can interleave',
      'This is the single most common volatile misuse in interview scenarios and in real code review',
    ],
    remember: ['Use volatile for single-writer or flag/status fields; use AtomicInteger/AtomicLong or synchronized for read-modify-write'],
    readMinutes: 2,
    related: ['happens-before-rules'],
  },
  {
    id: 'volatile-memory-barrier',
    title: 'Volatile as a Reordering Barrier',
    group: 'Volatile Semantics',
    definition: 'A volatile write acts as a store barrier that prevents the JIT/CPU from reordering any earlier write past it, and a volatile read acts as a load barrier that prevents any later read from being reordered before it.',
    whyItMatters: [
      'This is exactly what makes a volatile flag work as a publish signal — all plain writes before the volatile write are guaranteed visible to any thread that observes the volatile write',
      'It\'s the mechanism, not folklore, behind why "write data, then write volatile done = true" is safe but "write volatile done = true, then write data" is not',
    ],
    remember: ['Ordering constraints only apply relative to that specific volatile field — it is not a global fence like a full synchronized block'],
    readMinutes: 2,
    related: ['happens-before-rules'],
  },
  {
    id: 'long-double-tearing',
    title: 'Word Tearing on long/double',
    group: 'Volatile Semantics',
    definition: 'On a 32-bit JVM (and historically per-spec, before JLS clarified 64-bit atomicity for non-volatile fields), a non-volatile long or double write could be executed as two separate 32-bit writes, letting another thread observe a torn value made of half the old bits and half the new.',
    whyItMatters: [
      'Marking a shared long/double volatile forces a single atomic 64-bit write, eliminating tearing regardless of platform',
      'Modern 64-bit JVMs on common hardware happen not to tear in practice, but relying on that is relying on an implementation detail the spec doesn\'t promise for non-volatile fields',
    ],
    remember: ['Only long and double are ever at risk — every other primitive is guaranteed atomic on both read and write even without volatile'],
    readMinutes: 2,
  },

  // Group: Final Field Semantics
  {
    id: 'final-field-safe-publication',
    title: 'Final Fields and Safe Publication',
    group: 'Final Field Semantics',
    definition: 'The JMM guarantees that once a constructor finishes, any thread that obtains a reference to the object will see the correctly-initialized values of its final fields, with no synchronization required.',
    whyItMatters: [
      'This is what makes immutable objects safely publishable across threads for free — no volatile, no synchronized, no locks, just the final keyword',
      'The guarantee breaks completely if the constructor lets this escape before finishing (e.g. registering the object with a listener, or starting a thread from the constructor) — a reader could then see a partially-constructed object',
    ],
    remember: ['The guarantee is specifically about final fields — plain fields on an otherwise-immutable-looking object get no such guarantee without an additional happens-before edge'],
    interviewAngle: { q: 'Why can this "leak" from a constructor break the final-field guarantee?', a: 'Another thread can observe the object via the leaked reference before the constructor — and therefore the final field initialization — has completed.' },
    readMinutes: 2,
  },

  // Group: Broken Idioms
  {
    id: 'double-checked-locking-broken',
    title: 'Double-Checked Locking, Pre-Java-5',
    group: 'Broken Idioms',
    definition: 'The classic "check null, lock, check null again, assign" singleton idiom was broken before Java 5 because the compiler/CPU could reorder the constructor\'s internal writes to happen after the reference assignment, letting a second thread see a non-null but partially-constructed object.',
    whyItMatters: [
      'It\'s the textbook example of why "it looks correct and even usually works" is not the same as "it is correct" under the JMM — reordering bugs are timing-dependent and can pass thousands of test runs',
      'Understanding this is really understanding that "assign the reference" and "finish constructing the object" are two separate, independently-reorderable events without a happens-before edge between them',
    ],
    remember: ['The bug requires no exotic hardware — it was a real, JLS-sanctioned reordering, not just a theoretical race'],
    readMinutes: 2,
    related: ['double-checked-locking-fixed'],
  },
  {
    id: 'double-checked-locking-fixed',
    title: 'Double-Checked Locking, Fixed',
    group: 'Broken Idioms',
    definition: 'Declaring the singleton field volatile (Java 5+) reinstates a store barrier around the reference assignment, so all of the constructor\'s writes happen-before the reference becomes visible to any other thread.',
    whyItMatters: [
      'It\'s the minimal fix — one keyword — once you understand the actual mechanism (volatile write ordering), rather than a vague "add more synchronization"',
      'A common wrong answer under pressure is wrapping everything in synchronized instead, which fixes correctness but throws away the whole point of the double-checked pattern (avoiding lock contention on the fast path)',
    ],
    remember: ['The initialization-on-demand holder idiom (a static nested class) sidesteps this entirely by relying on class-loading guarantees instead of double-checked locking'],
    readMinutes: 2,
  },

  // Group: JMM in java.util.concurrent
  {
    id: 'jmm-role-in-juc',
    title: 'JMM as the Foundation of java.util.concurrent',
    group: 'JMM in Practice',
    definition: 'Every higher-level concurrency utility — ConcurrentHashMap, BlockingQueue, CountDownLatch, ExecutorService — is correct only because its internals establish explicit happens-before edges (via volatile fields or CAS) that the JMM then propagates to your code.',
    whyItMatters: [
      'This is why you get correctness guarantees "for free" from these classes without writing a single synchronized block yourself — the library authors did the happens-before reasoning once',
      'It explains a common surprise: a put() into a ConcurrentHashMap on thread A happens-before a get() that retrieves it on thread B, without either thread using a lock the caller can see',
    ],
    remember: ['Task submission to an ExecutorService happens-before the task starts running, and the task\'s completion happens-before a caller\'s Future.get() returns'],
    readMinutes: 2,
    related: ['cas-atomic-visibility'],
  },
  {
    id: 'cas-atomic-visibility',
    title: 'CAS and Atomic Classes Carry Volatile Semantics',
    group: 'JMM in Practice',
    definition: 'AtomicInteger, AtomicReference, and the rest wrap a volatile-backed value and use compare-and-swap, so every successful CAS gives you both the atomicity a plain volatile lacks and the same happens-before visibility a volatile write gives.',
    whyItMatters: [
      'This is why AtomicInteger.incrementAndGet() is safe under contention where a volatile int counter++ is not — it fixes the exact gap called out by the visibility-vs-atomicity distinction',
      'The underlying value field is volatile, so even a plain get() on an Atomic type gets the same read-the-latest-write guarantee as reading a volatile field directly',
    ],
    remember: ['CAS failure (a lost race) doesn\'t retry itself — java.util.concurrent.atomic classes loop internally until the CAS succeeds'],
    readMinutes: 2,
  },
]

const locksConcepts: ConceptCard[] = [
// --- Explicit Locks ---
  {
    id: 'reentrant-lock',
    title: 'ReentrantLock',
    group: 'Explicit Locks',
    importance: 'must-know',
    definition: 'An explicit, reentrant mutual-exclusion lock implementing the Lock interface, offering everything synchronized does plus tryLock, lockInterruptibly, and configurable fairness.',
    whyItMatters: [
      'Unlike synchronized, acquisition and release are separate statements, so a forgotten unlock leaks the lock forever instead of the compiler enforcing release',
      'Backed by AbstractQueuedSynchronizer (AQS), the same framework underlying Semaphore, CountDownLatch, and ReentrantReadWriteLock',
    ],
    example: {
      code: {
        language: 'java',
        code: `Lock lock = new ReentrantLock();
lock.lock();
try {
    // critical section
} finally {
    lock.unlock();
}`,
      },
      note: 'unlock() in finally is not optional — without it an exception mid-section leaves the lock held forever.',
    },
    remember: [
      'try/finally is mandatory discipline, not a style choice — synchronized releases automatically on any exit path, explicit locks do not',
      'Reentrant like synchronized: the owning thread can re-acquire without deadlocking itself, but must call unlock() the same number of times',
    ],
    interviewAngle: {
      q: 'Why would you choose ReentrantLock over synchronized?',
      a: 'When you need tryLock (non-blocking attempts), lockInterruptibly (cancellable waits), fairness ordering, or non-block-structured locking (acquire in one method, release in another) — none of which synchronized supports.',
    },
    readMinutes: 2,
    related: ['try-lock', 'lock-interruptibly', 'lock-fairness'],
    comparison: {
      columns: ['Feature', 'synchronized', 'ReentrantLock', 'ReadWriteLock'],
      rows: [
        ['Release', 'Automatic', 'Manual in finally', 'Manual in finally'],
        ['Timed attempt', 'No', 'Yes', 'Yes'],
        ['Interruptible wait', 'No', 'Yes', 'Yes'],
        ['Concurrent readers', 'No', 'No', 'Yes'],
        ['Typical use', 'Simple critical section', 'Advanced lock control', 'Long read-heavy work'],
      ],
      takeaway: 'Use synchronized by default. Choose an explicit lock only when its extra control solves a measured requirement.',
    },
  },
  {
    id: 'try-lock',
    title: 'tryLock()',
    group: 'Explicit Locks',
    definition: 'A non-blocking (or bounded-wait, with a timeout overload) attempt to acquire a lock that returns false instead of blocking indefinitely when the lock is unavailable.',
    whyItMatters: [
      'Enables deadlock avoidance: a thread that fails to acquire a second lock can back off and retry instead of holding the first lock while waiting forever',
      'Lets a thread do useful work (or give up) instead of blocking — synchronized offers no equivalent',
    ],
    example: {
      code: {
        language: 'java',
        code: `if (lock.tryLock(500, TimeUnit.MILLISECONDS)) {
    try { /* work */ } finally { lock.unlock(); }
} else {
    // back off, log, or take an alternate path
}`,
      },
    },
    remember: [
      'The timed overload throws InterruptedException — it is itself interruptible, unlike the zero-arg tryLock()',
      'Classic use: acquire multiple locks in arbitrary order safely by trying each and releasing-all-and-retrying on failure, avoiding the lock-ordering deadlock problem entirely',
    ],
    readMinutes: 1,
    related: ['reentrant-lock'],
  },
  {
    id: 'lock-interruptibly',
    title: 'lockInterruptibly()',
    group: 'Explicit Locks',
    definition: 'Acquires the lock, blocking as normal, but responds to Thread.interrupt() by throwing InterruptedException instead of ignoring it while waiting.',
    whyItMatters: [
      'A thread blocked on plain lock() (or a synchronized monitor) is uninterruptible until it gets the lock — this is the only way to make lock *acquisition itself* cancellable',
      'Essential for building responsive cancellation into services that must not deadlock a shutdown sequence waiting on a contended lock',
    ],
    remember: [
      'Only affects waiting to acquire — once held, the critical section still needs its own interruption checks if it does blocking work',
    ],
    readMinutes: 1,
    related: ['reentrant-lock'],
  },
  {
    id: 'lock-fairness',
    title: 'Lock Fairness Policy',
    group: 'Explicit Locks',
    importance: 'deep-dive',
    definition: 'ReentrantLock (and ReentrantReadWriteLock) can be constructed with fair=true to grant the lock to the longest-waiting thread instead of allowing barging.',
    whyItMatters: [
      'Fair mode prevents thread starvation under sustained contention, but costs significant throughput — enforcing strict queue order defeats optimizations like allowing a thread already on the CPU to grab a just-released lock',
      'Default is unfair (false) precisely because barging is much faster in the common case and starvation is rare in practice',
    ],
    remember: [
      'Fairness is a constructor argument, not something you can toggle at runtime',
      'Even a "fair" lock does not guarantee FIFO for every internal operation (e.g. tryLock() with no timeout can still barge even on a fair lock)',
    ],
    interviewAngle: {
      q: 'When would you actually pay the cost of a fair lock?',
      a: 'Only when measured starvation is a real problem — e.g. a low-priority background thread never getting the lock under heavy load — since fairness can drop throughput by an order of magnitude under contention.',
    },
    readMinutes: 1,
    related: ['reentrant-lock'],
  },
  {
    id: 'condition-variables',
    title: 'Condition',
    group: 'Explicit Locks',
    definition: 'The java.util.concurrent.locks replacement for Object.wait/notify — created from a Lock via newCondition(), supporting multiple independent wait-sets per lock.',
    whyItMatters: [
      'A single ReentrantLock can spawn several Conditions (e.g. notFull and notEmpty on a bounded buffer), so signaling can target exactly the threads waiting on that specific predicate instead of waking everyone with notifyAll()',
      'await()/signal()/signalAll() mirror wait/notify/notifyAll semantics exactly, including the requirement to hold the lock and to re-check the predicate in a loop (spurious wakeups still possible)',
    ],
    example: {
      code: {
        language: 'java',
        code: `Lock lock = new ReentrantLock();
Condition notEmpty = lock.newCondition();
Condition notFull = lock.newCondition();
// producer: notFull.await() while full; notEmpty.signal() after adding
// consumer: notEmpty.await() while empty; notFull.signal() after removing`,
      },
    },
    remember: [
      'await() releases the lock while waiting and reacquires it before returning, same contract as Object.wait()',
      'Splitting one intrinsic monitor’s single wait-set into multiple Conditions avoids the "thundering herd" of notifyAll waking threads waiting on unrelated predicates',
    ],
    readMinutes: 2,
    related: ['reentrant-lock'],
  },

  // --- Read/Write Locks ---
  {
    id: 'read-write-lock',
    title: 'ReadWriteLock / ReentrantReadWriteLock',
    group: 'Read/Write Locks',
    definition: 'A lock pair — a shared read lock and an exclusive write lock — allowing any number of concurrent readers when no writer holds the lock, but only one writer at a time and no readers during a write.',
    whyItMatters: [
      'Improves throughput dramatically over a single mutex for read-heavy workloads, since readers no longer serialize against each other, only against writers',
      'Comes with real bookkeeping cost: internally an int holds both read and write hold counts packed into bit-shifted halves, so it is heavier per-acquisition than a plain ReentrantLock',
    ],
    remember: [
      'A thread holding the write lock can downgrade to the read lock (acquire read before releasing write) without releasing exclusivity in between — the reverse, upgrading read to write, is not supported and self-deadlocks',
      'Only worth it when reads are both frequent and non-trivial in duration — for very short critical sections the read/write bookkeeping overhead can beat the concurrency gain',
    ],
    interviewAngle: {
      q: 'Why can a ReentrantReadWriteLock deadlock if a thread tries to upgrade its own read lock to a write lock?',
      a: 'Because the write lock cannot be acquired while any read lock is held, including by the same thread — and that thread cannot release its read lock and immediately reacquire the write lock atomically without another thread grabbing the write lock in between, so the naive attempt just blocks forever waiting on itself.',
    },
    readMinutes: 2,
    related: ['reentrant-lock', 'lock-striping'],
  },
  {
    id: 'rw-lock-writer-starvation',
    title: 'Writer Starvation Under Read Locks',
    group: 'Read/Write Locks',
    definition: 'With a non-fair ReentrantReadWriteLock, a steady stream of new readers can keep acquiring the read lock and indefinitely delay a waiting writer.',
    whyItMatters: [
      'A read-heavy system that looks perfectly healthy under light load can silently starve writers once read traffic becomes continuous, since each individual reader only holds the lock briefly',
      'Fair mode fixes this by making new readers block once a writer is queued, at the cost of reduced read concurrency',
    ],
    remember: [
      'Non-fair mode explicitly favors readers over queued writers when readers keep arriving — this is documented, intentional behavior, not a bug',
    ],
    readMinutes: 1,
    related: ['read-write-lock', 'lock-fairness'],
  },

  // --- Advanced Locks ---
  {
    id: 'stamped-lock-optimistic',
    title: 'StampedLock and Optimistic Reads',
    group: 'Advanced Locks',
    definition: 'A Java 8 lock offering read, write, and a third optimistic-read mode that takes no lock at all — it hands back a stamp and the caller validates afterward that no write occurred during the read.',
    whyItMatters: [
      'Optimistic reads avoid all reader-side memory contention (no CAS, no shared counter increment) — under high read concurrency this beats ReentrantReadWriteLock by a wide margin because readers never write to shared state at all',
      'Not reentrant — recursively acquiring on the same thread deadlocks, unlike ReentrantLock and ReentrantReadWriteLock',
    ],
    example: {
      code: {
        language: 'java',
        code: `long stamp = lock.tryOptimisticRead();
double x = this.x, y = this.y; // read fields without locking
if (!lock.validate(stamp)) {
    stamp = lock.readLock();
    try { x = this.x; y = this.y; } finally { lock.unlockRead(stamp); }
}`,
      },
      note: 'Fields read during the optimistic window must be local copies — re-reading a field after validate() defeats the purpose.',
    },
    remember: [
      'Not reentrant, does not support Condition, and is not a java.util.concurrent.locks.Lock (different API surface entirely)',
      'validate() only tells you a write did not occur — it does not itself synchronize, so the values read during the optimistic window can still be a torn/inconsistent snapshot if you read more than one field without care',
    ],
    interviewAngle: {
      q: 'Why is StampedLock generally faster than ReentrantReadWriteLock for read-heavy code?',
      a: 'Its optimistic-read mode lets readers proceed without acquiring anything — no shared state is touched at all unless validate() detects a concurrent write, at which point it falls back to a real read lock. ReadWriteLock readers always mutate a shared reader count, which becomes a contention point at high concurrency.',
    },
    readMinutes: 2,
    related: ['read-write-lock'],
  },
  {
    id: 'stamped-lock-no-reentrancy',
    title: 'StampedLock Is Not Reentrant',
    group: 'Advanced Locks',
    definition: 'Calling readLock() or writeLock() again on the same thread that already holds one — even indirectly through a recursive call — blocks forever instead of succeeding.',
    whyItMatters: [
      'This is the most common production bug with StampedLock: code migrated from ReentrantLock/ReentrantReadWriteLock assumes reentrancy and self-deadlocks the first time a method calls another method that also locks',
    ],
    remember: [
      'Because stamps are just longs with no owner-thread tracking, StampedLock also cannot detect or report which thread holds it — debugging a stuck stamped lock is harder than a stuck ReentrantLock',
    ],
    readMinutes: 1,
    related: ['stamped-lock-optimistic'],
  },
  {
    id: 'lock-striping',
    title: 'Lock Striping / Segmentation',
    group: 'Advanced Locks',
    definition: 'Splitting one shared resource into N independently-locked stripes (e.g. an array of locks indexed by hash) so unrelated operations can proceed in parallel instead of contending on a single lock.',
    whyItMatters: [
      'This is the technique legacy ConcurrentHashMap used internally (pre-Java 8, 16 segments by default) to allow concurrent writers as long as they hash to different segments',
      'Operations that must span the whole structure (like size() or a global iteration) become more expensive — they may need to acquire every stripe, or accept an approximate/weakly-consistent answer',
    ],
    remember: [
      'The tradeoff is fixed at construction — stripe count is a capacity-planning decision, not something that adapts to load automatically',
      'Choosing too few stripes reduces the benefit (back to coarse-grained contention); too many wastes memory and complicates operations needing global consistency',
    ],
    interviewAngle: {
      q: 'How would you design a thread-safe rate limiter or counter map for millions of keys without one global lock?',
      a: 'Stripe the lock by hashing the key into a fixed-size array of locks (or use per-bucket locks as ConcurrentHashMap does), so contention is limited to keys that happen to collide into the same stripe rather than serializing all keys through one mutex.',
    },
    readMinutes: 2,
    related: ['read-write-lock'],
  },

  // --- Synchronizers ---
  {
    id: 'semaphore',
    title: 'Semaphore',
    group: 'Synchronizers',
    definition: 'A counter-based synchronizer that limits the number of threads that can access a resource concurrently, via acquire() (decrement, blocking if zero) and release() (increment).',
    whyItMatters: [
      'Unlike a lock, a Semaphore has no notion of ownership — any thread can call release(), including one that never called acquire(), which makes it useful for signaling between threads but also a source of bugs if permits leak or get released twice',
      'A Semaphore with 1 permit behaves like a lock but without reentrancy or ownership checks — acquiring twice on the same thread with permits=1 deadlocks',
    ],
    remember: [
      'Classic uses: bounding concurrent access to a limited resource pool (DB connections, outbound HTTP calls) and implementing simple producer/consumer signaling',
      'Fair vs non-fair construction exists here too, same throughput-vs-starvation tradeoff as ReentrantLock',
    ],
    readMinutes: 1,
    related: ['reentrant-lock'],
  },
  {
    id: 'countdown-latch',
    title: 'CountDownLatch',
    group: 'Synchronizers',
    definition: 'A one-shot synchronizer that lets one or more threads block via await() until a counter, decremented by countDown() calls from other threads, reaches zero.',
    whyItMatters: [
      'It cannot be reset — once the count hits zero every past and future await() returns immediately forever; a workflow needing repeated synchronization points needs CyclicBarrier instead',
      'Common pattern: start N worker threads, have the main thread await() a latch that each worker counts down on completion, to know when all finished',
    ],
    remember: [
      'countDown() can be called more times than the initial count with no error (count just floors at zero) — and by threads that never call await() at all',
    ],
    interviewAngle: {
      q: 'CountDownLatch vs CyclicBarrier — when does the difference actually matter?',
      a: 'A latch is single-use and decrements from any number of arbitrary threads (asymmetric: waiters vs counters can be different threads), while a barrier is reusable and requires the exact same fixed set of N threads to each arrive before any proceeds — used for phased, repeating computations like generation-based simulations.',
    },
    readMinutes: 1,
    related: ['cyclic-barrier'],
  },
  {
    id: 'cyclic-barrier',
    title: 'CyclicBarrier',
    group: 'Synchronizers',
    definition: 'A reusable synchronizer that blocks a fixed-size group of threads at await() until all of them arrive, then releases all simultaneously and automatically resets for the next round.',
    whyItMatters: [
      'Supports an optional barrier action — a Runnable executed by the last arriving thread once all parties reach the barrier, useful for merging per-thread partial results before the next phase begins',
      'A single party failing to call await() (crash, exception, or getting stuck) breaks the barrier for everyone still waiting, throwing BrokenBarrierException on the others — unlike a latch, one straggler can permanently jam a barrier',
    ],
    remember: [
      'Reusable across multiple phases, unlike CountDownLatch which is strictly one-shot',
      'Requires the exact configured number of parties every round — you cannot dynamically add or remove participants',
    ],
    readMinutes: 1,
    related: ['countdown-latch'],
  },
  {
    id: 'exchanger',
    title: 'Exchanger',
    group: 'Synchronizers',
    definition: 'A synchronization point where exactly two threads meet and atomically swap objects via exchange() — each thread\'s call blocks until the other thread arrives with its own object.',
    whyItMatters: [
      'Niche but occasionally exactly right for pipeline designs — e.g. two threads swapping a "full" buffer for an "empty" one to double-buffer work without extra copying or locking',
    ],
    remember: [
      'Strictly pairwise — a third thread calling exchange() concurrently just waits for the next available partner, there is no broadcast/group form',
    ],
    readMinutes: 1,
  },

  // --- Design Tradeoffs ---
  {
    id: 'explicit-lock-vs-synchronized',
    title: 'Explicit Locks vs synchronized: The Real Tradeoffs',
    group: 'Design Tradeoffs',
    definition: 'Explicit Lock implementations trade the safety of automatic, block-structured release for flexibility synchronized cannot offer: tryLock, interruptible acquisition, configurable fairness, multiple Conditions, and non-block-structured hand-off locking.',
    whyItMatters: [
      'Non-block-structured locking (acquire in one method, release in another, or hand a held lock across threads/callbacks) is impossible with synchronized, which is strictly scoped to a single block — some designs like lock coupling in linked structures genuinely need this',
      'Modern JVMs optimize synchronized well (biased/thin/fat locking) and it cannot be misused into a leaked lock, so the default guidance is still: reach for synchronized first, use an explicit Lock only when you need a specific capability it lacks',
    ],
    remember: [
      'synchronized cannot time out, cannot be interrupted while waiting, and cannot be polled — Lock.tryLock()/lockInterruptibly() fill exactly those three gaps',
      'The forgotten try/finally is the single biggest real-world risk of switching to explicit locks — it is a footgun synchronized structurally cannot have',
    ],
    diagram: `flowchart LR
  A[synchronized] -->|simple scoped block| B[JVM auto releases]
  C[Lock] -->|manual acquire| D[try finally required]
  D -->|adds| E[tryLock timeout interrupt fairness]`,
    readMinutes: 2,
    related: ['reentrant-lock', 'try-lock', 'lock-interruptibly'],
  },
]

const concurrentCollectionsConcepts: ConceptCard[] = [
// --- Group: ConcurrentHashMap ---
  {
    id: 'chm-locking-evolution',
    title: 'ConcurrentHashMap Locking: Segments to Bins',
    group: 'ConcurrentHashMap',
    definition: 'Java 7 ConcurrentHashMap partitioned the table into a fixed set of Segments (each its own ReentrantLock), while Java 8+ dropped segments entirely and synchronizes per-bin using CAS for empty-bin inserts and a synchronized block only on the head node when a bin already has entries.',
    whyItMatters: [
      'Java 8 concurrency level is no longer capped by a segment count set at construction — contention scales with table size, not a fixed 16-way split',
      'Reads never block: get() is lock-free in both versions, relying on volatile reads of Node.val',
    ],
    remember: ['Segment class still exists in Java 8+ only for API/serialization compatibility, not for locking', 'Resize in Java 8 is done cooperatively — multiple threads can help transfer bins in parallel'],
    readMinutes: 2,
    related: ['chm-null-prohibition', 'chm-compute-atomicity'],
  },
  {
    id: 'chm-null-prohibition',
    title: 'Why ConcurrentHashMap Forbids Null',
    group: 'ConcurrentHashMap',
    definition: 'ConcurrentHashMap throws NullPointerException on a null key or value because in a concurrent map, get(key) returning null is inherently ambiguous between "not mapped" and "mapped to null," and there is no safe way to resolve that with containsKey() without a second, non-atomic call.',
    whyItMatters: [
      'HashMap tolerates the ambiguity because a single-threaded caller can trust the map was not mutated between the two calls — that guarantee does not exist under concurrent access',
    ],
    remember: ['Applies to keys, values, and elements of the concurrent Set/Collection views alike', 'Doug Lea\'s design choice, not a JVM limitation — deliberately closes off a race-prone API pattern'],
    readMinutes: 1,
    interviewAngle: { q: 'Why can HashMap store null but ConcurrentHashMap cannot?', a: 'Because in a concurrent map, checking containsKey() then get() is two separate atomic operations — another thread can mutate the map between them, making null-as-absent vs null-as-value unresolvable.' },
  },
  {
    id: 'chm-compute-atomicity',
    title: 'compute/computeIfAbsent Atomicity Gotchas',
    group: 'ConcurrentHashMap',
    definition: 'ConcurrentHashMap guarantees compute(), computeIfAbsent(), and merge() run atomically per key — the whole read-modify-write happens under that bin\'s lock — but the mapping function must not itself touch the same map, or the thread deadlocks against its own held lock or corrupts the table.',
    whyItMatters: [
      'This atomicity is the correct replacement for the classic "check-then-act" race (if !containsKey then put) that plagues HashMap under concurrent use',
      'A slow or blocking function passed to compute() holds that bin\'s lock the whole time, stalling every other thread contending for the same bin',
    ],
    remember: ['Recursive update on the same key from within computeIfAbsent throws IllegalStateException or deadlocks depending on JDK version — never call map.put/compute on the same map inside the lambda', 'Keep the mapping function fast and side-effect-free'],
    example: {
      code: { language: 'java', code: 'counts.computeIfAbsent(key, k -> new AtomicLong()).incrementAndGet();' },
      note: 'Atomic get-or-create without a separate containsKey race.',
    },
    readMinutes: 2,
    related: ['chm-locking-evolution'],
  },
  {
    id: 'chm-weakly-consistent-iteration',
    title: 'Weakly Consistent Iterators',
    group: 'ConcurrentHashMap',
    definition: 'ConcurrentHashMap iterators reflect the state of the map at (or after) iterator creation and never throw ConcurrentModificationException, but they are not guaranteed to show every update made concurrently during the traversal — a put during iteration may or may not be seen by that iterator.',
    whyItMatters: [
      'Trades a strict consistency guarantee for never blocking and never failing — appropriate for a highly-contended shared structure where pausing all writers to iterate safely would defeat the point',
    ],
    remember: ['size(), isEmpty(), and containsValue() are also only approximate under concurrent modification — they scan live buckets and can be stale by the time they return', 'Contrast with HashMap\'s fail-fast iterator, which throws ConcurrentModificationException on any detected structural change'],
    readMinutes: 2,
    related: ['weakly-consistent-vs-failfast'],
  },
  {
    id: 'chm-vs-synchronizedmap-vs-hashtable',
    title: 'ConcurrentHashMap vs synchronizedMap vs Hashtable',
    group: 'ConcurrentHashMap',
    definition: 'Collections.synchronizedMap() and the legacy Hashtable both wrap every operation in one global lock, serializing all access, while ConcurrentHashMap partitions locking at the bin level and never locks for reads at all.',
    whyItMatters: [
      'Under real contention synchronizedMap/Hashtable throughput collapses because every thread — readers included — funnels through a single lock',
      'synchronizedMap still requires the caller to manually synchronize on the map itself when iterating, since its iterator is fail-fast, not weakly consistent',
    ],
    remember: ['Hashtable additionally forbids null like ConcurrentHashMap, but for a different reason — it predates the ambiguity discussion and just never allowed it'],
    readMinutes: 1,
  },

  // --- Group: CopyOnWrite Collections ---
  {
    id: 'cow-internals',
    title: 'CopyOnWriteArrayList/Set Internals',
    group: 'CopyOnWrite Collections',
    definition: 'Every mutation (add, remove, set) on a CopyOnWriteArrayList or CopyOnWriteArraySet copies the entire backing array, applies the change to the copy, and atomically swaps the volatile array reference — readers always see a fully-formed, immutable snapshot with no locking at all.',
    whyItMatters: [
      'Reads are as fast as a plain ArrayList and never block or throw, because a reader is always iterating a snapshot array that no writer can mutate underneath it',
      'Writes are O(n) and allocate a new array every time, so this structure is fundamentally wrong for write-heavy workloads regardless of read pattern',
    ],
    remember: ['CopyOnWriteArraySet is implemented as a CopyOnWriteArrayList internally, using linear scan for uniqueness checks — O(n) contains() and add()', 'Good fit: listener/observer lists that are read constantly (every event dispatch) and modified rarely (occasional subscribe/unsubscribe)'],
    readMinutes: 2,
    related: ['cow-iterator-snapshot'],
  },
  {
    id: 'cow-iterator-snapshot',
    title: 'CopyOnWrite Iterators Never Reflect Later Writes',
    group: 'CopyOnWrite Collections',
    definition: 'A CopyOnWriteArrayList iterator is bound to the array snapshot that existed at the moment the iterator was created and will never show any add/remove/set made after that point, even ones from the same thread, and its remove() method is unsupported (throws UnsupportedOperationException).',
    whyItMatters: [
      'This is stronger than "weakly consistent" — it is a true point-in-time snapshot, not a best-effort partial view, which is exactly why it can never throw ConcurrentModificationException',
    ],
    remember: ['Iterator.remove/add/set all throw UnsupportedOperationException — the snapshot is read-only by design', 'A common bug: iterating and expecting a concurrent writer\'s update to appear mid-loop — it structurally cannot'],
    readMinutes: 1,
  },

  // --- Group: BlockingQueue Family ---
  {
    id: 'blocking-queue-family',
    title: 'BlockingQueue Family Comparison',
    group: 'BlockingQueue Family',
    definition: 'BlockingQueue implementations differ in bounding, ordering, and backing structure: ArrayBlockingQueue is a fixed-capacity circular array with one lock shared by put/take, LinkedBlockingQueue is optionally-bounded with separate put and take locks for higher throughput, PriorityBlockingQueue is unbounded and orders by Comparator instead of FIFO, SynchronousQueue holds zero elements and pairs each put directly with a waiting take, and DelayQueue only releases elements once their delay has expired.',
    whyItMatters: [
      'LinkedBlockingQueue\'s two-lock design lets a producer and consumer proceed concurrently without contending on the same lock, unlike ArrayBlockingQueue\'s single lock for both ends',
      'SynchronousQueue has no internal capacity at all — a put() blocks until some thread calls take(), making it a direct handoff point rather than a buffer',
    ],
    remember: ['Executors.newCachedThreadPool() uses a SynchronousQueue internally, which is why it can spawn unbounded threads instead of queuing work', 'PriorityBlockingQueue is unbounded by default — a producer that outpaces consumers can grow it without limit and exhaust heap, unlike a bounded ArrayBlockingQueue which would instead apply backpressure'],
    diagram: 'flowchart LR\n  producer[Producer] -->|put blocks if full| queue[Bounded Queue]\n  queue -->|take blocks if empty| consumer[Consumer]',
    readMinutes: 3,
    related: ['blocking-vs-backpressure'],
  },
  {
    id: 'blocking-vs-backpressure',
    title: 'Bounded Queues as Backpressure',
    group: 'BlockingQueue Family',
    definition: 'A bounded BlockingQueue (fixed-capacity ArrayBlockingQueue, or LinkedBlockingQueue given an explicit capacity) makes put() block once full, which is the mechanism that lets a slow consumer naturally throttle a fast producer instead of the producer piling up unbounded work in memory.',
    whyItMatters: [
      'Using an unbounded LinkedBlockingQueue (the no-arg constructor defaults to Integer.MAX_VALUE capacity) in a producer-consumer pipeline silently removes backpressure — the queue just grows until OutOfMemoryError instead of signaling the producer to slow down',
    ],
    remember: ['offer(timeout) and poll(timeout) give bounded-wait alternatives to the fully-blocking put()/take() when a thread cannot afford to block indefinitely'],
    readMinutes: 1,
  },
  {
    id: 'synchronousqueue-handoff',
    title: 'SynchronousQueue as a Direct Handoff',
    group: 'BlockingQueue Family',
    definition: 'SynchronousQueue has zero internal capacity — it is not a buffer at all, only a rendezvous point where a put() call and a take() call must meet before either returns, making every element handed directly from one thread to another with no intermediate storage.',
    whyItMatters: [
      'Because there\'s nothing to store, size() always returns 0 and peek() always returns null, which surprises anyone expecting normal queue semantics',
    ],
    remember: ['Two internal modes exist — fair (FIFO handoff via a queue of waiting threads) and unfair/non-fair (a stack, default, generally higher throughput)'],
    readMinutes: 1,
  },

  // --- Group: Lock-Free Structures ---
  {
    id: 'concurrentlinkedqueue-cas',
    title: 'ConcurrentLinkedQueue/Deque: Lock-Free via CAS',
    group: 'Lock-Free Structures',
    definition: 'ConcurrentLinkedQueue and ConcurrentLinkedDeque are unbounded, non-blocking structures built on Michael-Scott-style CAS loops on node links rather than locks — offer()/poll() retry a compare-and-swap until it succeeds instead of ever acquiring a lock.',
    whyItMatters: [
      'No thread can block another here — a thread that gets preempted mid-CAS-retry never holds a lock that stalls others, unlike ArrayBlockingQueue where a stalled lock-holder stalls everyone',
      'They are not BlockingQueues — there is no put()/take() that waits for space or an element, only non-blocking offer()/poll() that return immediately (empty or full-equivalent never applies since they\'re unbounded)',
    ],
    remember: ['size() is O(n) and only approximate under concurrent modification — the class explicitly discourages relying on it', 'Right choice when you need a genuinely non-blocking queue and don\'t need bounding or blocking semantics'],
    readMinutes: 2,
  },
  {
    id: 'concurrentskiplist-ordering',
    title: 'ConcurrentSkipListMap/Set: Sorted, Lock-Free, No TreeMap Equivalent',
    group: 'Lock-Free Structures',
    definition: 'ConcurrentSkipListMap/Set provide the concurrent, sorted equivalent of TreeMap/TreeSet using a probabilistic multi-level linked-list (skip list) structure with lock-free CAS-based insertion, since a red-black tree\'s rebalancing cannot be done lock-free without effectively serializing writers.',
    whyItMatters: [
      'There is no concurrent TreeMap — a red-black tree needs whole-subtree rotations to stay balanced, which don\'t decompose into small CAS steps the way skip-list level insertion does',
      'Average O(log n) for get/put/remove, same asymptotic complexity as TreeMap, achieved via random leveling instead of guaranteed balance',
    ],
    remember: ['Navigable operations (firstKey, ceilingKey, headMap, etc.) all work as in TreeMap, and are safe under concurrent modification', 'size() is also O(n) here, same caveat as the other lock-free structures'],
    readMinutes: 2,
  },
  {
    id: 'weakly-consistent-vs-failfast',
    title: 'Weakly Consistent vs Fail-Fast: The General Contract',
    group: 'Lock-Free Structures',
    definition: 'Every java.util.concurrent collection (ConcurrentHashMap, CopyOnWrite*, ConcurrentLinkedQueue, ConcurrentSkipListMap, the BlockingQueue family) documents its iterators as weakly consistent — tolerant of concurrent modification, never throwing ConcurrentModificationException — in contrast to the fail-fast iterators of HashMap, ArrayList, and the rest of java.util, which detect structural modification via a modCount check and throw defensively rather than risk silent corruption.',
    whyItMatters: [
      'Fail-fast exists to surface bugs fast in single-threaded-assumption code; weakly consistent exists because throwing is the wrong tradeoff for structures explicitly designed for concurrent access',
      '"Weakly consistent" is a spectrum, not one guarantee — CopyOnWrite gives a strict point-in-time snapshot, while ConcurrentHashMap only promises to reflect the state at-or-since creation with no guarantee on which concurrent updates are visible',
    ],
    remember: ['Never rely on a java.util.concurrent iterator throwing to detect a bug — it won\'t, by design'],
    readMinutes: 2,
    related: ['chm-weakly-consistent-iteration', 'cow-iterator-snapshot'],
  },
]

const asyncConcepts: ConceptCard[] = [
// Group: Executor Framework
  {
    id: 'executor-vs-thread',
    title: 'Executor Framework Abstraction',
    group: 'Executor Framework',
    definition: 'The Executor/ExecutorService abstraction decouples task submission from thread management, letting you swap the underlying pooling policy without touching call sites.',
    whyItMatters: [
      'Raw thread-per-task code has no back-pressure — an unbounded flood of new Thread() calls can exhaust OS resources',
      'ExecutorService adds lifecycle control (shutdown, awaitTermination) that bare threads lack',
    ],
    remember: ['submit() returns a Future; execute() is fire-and-forget with no result handle'],
    readMinutes: 2,
  },
  {
    id: 'executors-factory-pitfalls',
    title: 'Executors Factory Methods and Their Traps',
    group: 'Executor Framework',
    definition: 'Executors.newFixedThreadPool/newCachedThreadPool/newSingleThreadExecutor are convenience wrappers over ThreadPoolExecutor with pre-set, often dangerous queue and pool configurations.',
    whyItMatters: [
      'newFixedThreadPool uses an unbounded LinkedBlockingQueue — under sustained overload, tasks queue forever instead of failing fast, hiding backlog until OOM',
      'newCachedThreadPool has no upper bound on thread count (Integer.MAX_VALUE), so a burst of tasks can spawn thousands of threads',
    ],
    remember: [
      'Effectively deprecated in production guidance in favor of constructing ThreadPoolExecutor directly with explicit bounds',
      'newSingleThreadExecutor still uses an unbounded queue underneath a single worker',
    ],
    interviewAngle: { q: 'Why do style guides discourage Executors.newFixedThreadPool in production?', a: 'Its unbounded work queue means a slow consumer or task surge accumulates unbounded memory instead of applying back-pressure or rejecting — failures surface late as OOM rather than early as a rejection.' },
    readMinutes: 2,
  },
  {
    id: 'threadpoolexecutor-internals',
    title: 'ThreadPoolExecutor Core/Max/Queue Interplay',
    group: 'Executor Framework',
    definition: 'A ThreadPoolExecutor grows workers up to corePoolSize first, then queues tasks, and only creates threads beyond core up to maximumPoolSize once the queue is full.',
    whyItMatters: [
      'This order surprises people: with an unbounded queue, maximumPoolSize is effectively dead code because the queue never fills, so threads never exceed corePoolSize',
      'To actually use extra capacity up to maximumPoolSize, the queue must be bounded (e.g. ArrayBlockingQueue)',
    ],
    remember: [
      'Order is: use idle core thread -> enqueue -> spin up thread beyond core (if queue full and below max) -> reject (if at max and queue full)',
      'keepAliveTime only reclaims threads above corePoolSize by default; allowCoreThreadTimeOut(true) extends that to core threads too',
    ],
    diagram: 'flowchart LR\n  a[Task submitted] --> b{Core threads free}\n  b -->|yes| c[Run on core thread]\n  b -->|no| d{Queue has room}\n  d -->|yes| e[Enqueue task]\n  d -->|no| f{Below max pool size}\n  f -->|yes| g[Spawn extra thread]\n  f -->|no| h[Reject task]',
    readMinutes: 3,
  },
  {
    id: 'threadpool-rejection-policy',
    title: 'RejectedExecutionHandler Policies',
    group: 'Executor Framework',
    definition: 'When a bounded queue and max pool size are both saturated, the configured RejectedExecutionHandler decides what happens to the new task: abort, discard, discard-oldest, or caller-runs.',
    whyItMatters: [
      'AbortPolicy (default) throws RejectedExecutionException — silent failure if the caller does not handle it',
      'CallerRunsPolicy runs the task on the submitting thread itself, which naturally throttles the producer since it can no longer submit while busy executing',
    ],
    remember: [
      'DiscardPolicy silently drops the task — dangerous for anything with side effects or correctness requirements',
      'CallerRunsPolicy is a common choice for back-pressure in producer/consumer pipelines',
    ],
    readMinutes: 2,
    related: ['threadpoolexecutor-internals'],
  },
  {
    id: 'scheduled-thread-pool',
    title: 'ScheduledThreadPoolExecutor Semantics',
    group: 'Executor Framework',
    definition: 'ScheduledExecutorService runs delayed or periodic tasks, but scheduleAtFixedRate and scheduleWithFixedDelay differ in how they handle a task that overruns its period.',
    whyItMatters: [
      'fixedRate schedules the next run relative to the previous scheduled start time, so a long-running task causes back-to-back catch-up executions once it finally finishes',
      'fixedDelay schedules the next run relative to the previous completion, so overruns just push the whole schedule later without pile-up',
    ],
    remember: ['A single uncaught exception in a scheduled task silently cancels all future executions of that task — always wrap the body in try/catch'],
    readMinutes: 2,
  },

  // Group: Future & CompletableFuture
  {
    id: 'future-limitations',
    title: 'Future Interface Limitations',
    group: 'Future & CompletableFuture',
    definition: 'java.util.concurrent.Future gives you a blocking get() and cancellation but no way to attach a callback, combine with other futures, or compose a pipeline without blocking a thread.',
    whyItMatters: [
      'Any chaining ("when this finishes, then do that") forces a blocking get() somewhere, tying up a thread just to wait',
      'This gap is exactly what CompletableFuture (Java 8) was introduced to close',
    ],
    remember: ['Future.cancel(true) only interrupts if the task cooperates by checking Thread.interrupted() — it cannot forcibly stop a running thread'],
    readMinutes: 2,
  },
  {
    id: 'completablefuture-composition',
    title: 'thenApply vs thenCompose vs thenCombine',
    group: 'Future & CompletableFuture',
    definition: 'thenApply transforms a result in place, thenCompose flattens a chained async call that itself returns a CompletableFuture, and thenCombine joins two independent futures with a function.',
    whyItMatters: [
      'Using thenApply where thenCompose is needed produces a nested CompletableFuture<CompletableFuture<T>> instead of a flat pipeline — a classic map-vs-flatMap mistake',
      'thenCombine is for two unrelated async computations that both need to finish before proceeding, unlike thenCompose\'s sequential dependency',
    ],
    diagram: 'flowchart LR\n  a[fetchUser] --> b[thenCompose fetchOrders]\n  a --> c[thenCombine fetchPricing]\n  b --> d[Combined result]\n  c --> d',
    readMinutes: 2,
  },
  {
    id: 'completablefuture-exception-handling',
    title: 'exceptionally vs handle vs whenComplete',
    group: 'Future & CompletableFuture',
    definition: 'exceptionally recovers from a failure by supplying a fallback value, handle sees both outcome and exception and can transform either, and whenComplete observes both without changing the result.',
    whyItMatters: [
      'A stage\'s exception propagates downstream like a checked-exception chain — nothing after a failed stage runs unless something in the chain calls exceptionally/handle to recover',
      'whenComplete is for side effects like logging/metrics; it rethrows the original exception (or a CompletionException wrapping it) rather than swallowing it',
    ],
    remember: ['handle() runs unconditionally (success or failure), unlike exceptionally() which only fires on failure'],
    readMinutes: 2,
    related: ['completablefuture-composition'],
  },
  {
    id: 'completablefuture-async-variants',
    title: 'Async Suffix Variants and Thread Control',
    group: 'Future & CompletableFuture',
    definition: 'thenApplyAsync (and its siblings) run the callback on the common ForkJoinPool by default instead of the thread that completed the previous stage — unless you pass an explicit Executor.',
    whyItMatters: [
      'Without the Async suffix, a callback can run on whatever thread happens to complete the prior stage, which for I/O completion could be a small I/O thread pool never meant to run CPU work',
      'Omitting an explicit Executor on the Async variants silently routes blocking or CPU-heavy work onto the shared common ForkJoinPool, starving unrelated parallel-stream or fork/join work elsewhere in the JVM',
    ],
    remember: ['Always pass a dedicated Executor to *Async methods when the callback does blocking I/O — never let it fall onto the common pool'],
    interviewAngle: { q: 'Why is CompletableFuture.supplyAsync(supplier) risky for a blocking database call?', a: 'With no Executor argument it runs on the common ForkJoinPool, a shared, sized-for-CPU-work pool — a blocking call there can starve parallel streams and other CompletableFuture chains across the whole JVM that also default to it.' },
    readMinutes: 2,
  },
  {
    id: 'completablefuture-multi-combine',
    title: 'Combining Many Futures: allOf / anyOf',
    group: 'Future & CompletableFuture',
    definition: 'CompletableFuture.allOf waits for every future in a set to complete and returns CompletableFuture<Void>, while anyOf completes as soon as the first one does and returns its (untyped) result.',
    whyItMatters: [
      'allOf discards individual results — you must go back to the original futures\' join()/get() to collect values, which is a common source of boilerplate and bugs',
      'A failure in any one future does not stop the others from running under allOf, but the combined future itself completes exceptionally once any input does',
    ],
    remember: ['A common idiom: futures.stream().map(CompletableFuture::join).collect(toList()) after allOf(...).join() to gather results'],
    readMinutes: 2,
  },
  {
    id: 'future-vs-completablefuture',
    title: 'Future vs CompletableFuture Tradeoffs',
    group: 'Future & CompletableFuture',
    definition: 'CompletableFuture is a superset of Future adding composability and manual completion (complete()/completeExceptionally()), but that same manual-completion API means it can be completed from outside the task that created it.',
    whyItMatters: [
      'The ability for any caller to call complete() on a CompletableFuture breaks the "only the task itself decides its outcome" invariant Future provides, which is a real API-design footgun in shared code',
      'Returning the raw CompletableFuture type from a public API exposes callers to that mutability; some codebases intentionally return the narrower Future type or a read-only view',
    ],
    readMinutes: 2,
    related: ['future-limitations'],
  },

  // Group: Fork/Join Framework
  {
    id: 'forkjoin-divide-conquer',
    title: 'Fork/Join Divide-and-Conquer Model',
    group: 'Fork/Join Framework',
    definition: 'ForkJoinPool executes tasks that recursively split into smaller subtasks (fork), run them in parallel, and combine their results (join), using RecursiveTask<V> for tasks that return a value or RecursiveAction for those that do not.',
    whyItMatters: [
      'Splitting too finely adds fork/join overhead that outweighs the parallel work; a threshold-based base case (e.g. "sort sequentially below 1000 elements") is essential, not optional',
      'compute() typically forks one half and computes the other half directly on the current thread, rather than forking both, to avoid wasting a thread waiting on its own fork',
    ],
    remember: ['fork() schedules a subtask for another worker to steal; join() blocks the current task until that subtask completes'],
    readMinutes: 3,
  },
  {
    id: 'forkjoin-work-stealing',
    title: 'Work-Stealing Deques',
    group: 'Fork/Join Framework',
    definition: 'Each ForkJoinPool worker thread owns a double-ended queue of tasks; it pushes/pops its own tasks from the head (LIFO, cache-friendly) while idle threads steal from the tail (FIFO) of other workers\' queues.',
    whyItMatters: [
      'Stealing from the opposite end minimizes contention between the owning thread and thieves, and stealing older (larger, coarser-grained) tasks tends to give the thief more work per steal',
      'This self-balancing design is why fork/join keeps all cores busy even when subtasks have wildly uneven sizes, unlike a fixed static partition',
    ],
    remember: ['A worker with an empty deque becomes a thief rather than sitting idle — this is the core mechanism behind ForkJoinPool\'s throughput advantage for irregular workloads'],
    diagram: 'flowchart LR\n  a[Worker A deque] -->|own tasks LIFO| a\n  b[Idle Worker B] -->|steals from tail| a\n  c[Idle Worker C] -->|steals from tail| a',
    readMinutes: 3,
    related: ['forkjoin-divide-conquer'],
  },
  {
    id: 'forkjoin-common-pool-sizing',
    title: 'Common Pool Sizing and Blocking Hazards',
    group: 'Fork/Join Framework',
    definition: 'ForkJoinPool.commonPool() is sized by default to Runtime.availableProcessors() - 1 and is shared JVM-wide by parallel streams, CompletableFuture async defaults, and any explicit commonPool() use.',
    whyItMatters: [
      'A blocking call (I/O, lock wait) inside a common-pool task ties up one of a small, fixed number of threads shared across the whole application, unlike a dedicated ExecutorService that can be sized generously',
      'ManagedBlocker lets a task tell the pool it is about to block, so the pool can temporarily spawn a compensating thread and avoid starving other work',
    ],
    remember: ['On a single-core machine, commonPool() falls back to a pool size of 1, making parallel operations effectively sequential'],
    readMinutes: 2,
    related: ['completablefuture-async-variants'],
  },

  // Group: Modern Concurrency (Java 21+)
  {
    id: 'virtual-threads-executor-model',
    title: 'Virtual Threads and the Executor Model',
    group: 'Modern Concurrency (Java 21+)',
    definition: 'Virtual threads (Java 21, Project Loom) are cheap, JVM-scheduled threads that let you keep the simple one-thread-per-task programming model while scaling to hundreds of thousands of concurrent blocking tasks.',
    whyItMatters: [
      'Executors.newVirtualThreadPerTaskExecutor() intentionally has no pooling — a fresh virtual thread is created per task and discarded, since virtual threads are cheap enough that reuse isn\'t needed',
      'They make thread-pool tuning (core/max size, queue bounds) largely moot for I/O-bound workloads, but they do not help CPU-bound work, which still contends for the same physical cores',
    ],
    remember: [
      'A blocking call on a virtual thread unmounts it from its carrier platform thread, freeing that carrier to run other virtual threads instead of sitting idle',
      'synchronized blocks historically pinned a virtual thread to its carrier during the block (fixed for most cases in later 21+ updates) — a legacy gotcha worth knowing about for interview purposes',
    ],
    interviewAngle: { q: 'Should you replace a CPU-bound fixed thread pool with virtual threads?', a: 'No — virtual threads remove the cost of blocking/waiting, not the cost of computation; a CPU-bound pool should stay sized near availableProcessors() regardless of virtual vs platform threads.' },
    readMinutes: 3,
  },
  {
    id: 'structured-concurrency-intro',
    title: 'Structured Concurrency (Preview)',
    group: 'Modern Concurrency (Java 21+)',
    definition: 'StructuredTaskScope treats a group of related subtasks as a single unit of work with one lifetime, so a scope\'s failure or cancellation propagates to all its children instead of leaving orphaned tasks.',
    whyItMatters: [
      'It directly targets a CompletableFuture pain point: nothing about allOf/thenCombine chains prevents a "leaked" subtask that keeps running after its sibling failed or the caller stopped caring',
      'ShutdownOnFailure cancels sibling subtasks as soon as one fails, giving fail-fast semantics that manual future composition has to hand-roll',
    ],
    remember: ['Still a preview/incubating API as of Java 21-23 — know it conceptually for interviews, but expect it to still be evolving'],
    readMinutes: 2,
    related: ['virtual-threads-executor-model', 'completablefuture-multi-combine'],
  },
]

const jvmInternalsConcepts: ConceptCard[] = [
// Group: Class Loading
  {
    id: 'classloader-hierarchy',
    title: 'ClassLoader Hierarchy',
    group: 'Class Loading',
    definition: 'Classes are loaded by a chain of three built-in loaders — bootstrap (native, loads java.base), platform (loads other JDK modules), and application/system (loads your classpath) — each with the previous as its parent.',
    whyItMatters: ['The bootstrap loader has no Java-side representation — getClass().getClassLoader() returns null for java.lang.String, which trips people up in loader-identity checks'],
    remember: ['Order: bootstrap -> platform -> application, each parent of the next', 'Pre-Java 9 this was bootstrap -> extension -> application; "extension" was renamed/restructured into "platform" with the module system'],
    readMinutes: 2,
    related: ['classloader-delegation-model'],
  },
  {
    id: 'classloader-delegation-model',
    title: 'Parent-First Delegation Model',
    group: 'Class Loading',
    definition: 'Before loading a class itself, a class loader asks its parent to try first, walking all the way up to bootstrap, so a class only gets loaded by a descendant loader if every ancestor already failed to find it.',
    whyItMatters: ['This is what stops core-class spoofing: an application-loaded java.lang.String can never shadow the bootstrap-loaded one, because bootstrap always gets first crack at java.* names'],
    remember: ['Delegation is a convention enforced by ClassLoader.loadClass(), not a JVM-level law — a custom loader that overrides loadClass() instead of just findClass() can break it', 'Class loading is lazy: a class is loaded only on first active use (new, static field access, static method call, subclassing), not just because it is on the classpath'],
    diagram: 'flowchart LR\n  App[Application Loader] --> Platform[Platform Loader]\n  Platform --> Boot[Bootstrap Loader]\n  Boot -.loads first.-> Boot\n  Platform -.if boot fails.-> Platform\n  App -.if platform fails.-> App',
    readMinutes: 2,
    related: ['classloader-hierarchy', 'custom-classloaders'],
  },
  {
    id: 'class-loading-phases',
    title: 'Loading, Linking, Initialization',
    group: 'Class Loading',
    definition: 'A class goes through three ordered phases before use: loading (bytes brought in, Class object created), linking (verify, prepare, optionally resolve symbolic references), and initialization (static initializers and static field assignments run).',
    whyItMatters: ['Initialization is deferred as late as possible and triggered by "active use" — merely referencing a class in code, or accessing a static final constant folded at compile time, does not trigger it'],
    remember: ['A subclass reference does not force superclass initialization unless the superclass is itself actively used', 'Initialization is guaranteed thread-safe and idempotent — the JVM synchronizes per-class so only one thread runs the static initializer, others block'],
    readMinutes: 2,
  },
  {
    id: 'custom-classloaders',
    title: 'Custom ClassLoaders',
    group: 'Class Loading',
    definition: 'Overriding findClass() (not loadClass()) lets an application define new class-loading sources — plugin jars, hot-reloaded code, per-tenant isolation — while still preserving parent-first delegation for everything else.',
    whyItMatters: ['App servers and plugin frameworks use one loader per deployed unit specifically so unloading is possible: a class (and its static state) can only be garbage collected once its defining ClassLoader and every instance it loaded become unreachable'],
    remember: ['Classloader leaks happen when something outside the deployed unit (a thread pool, a static reference held by a shared library, a ThreadLocal) still points into it, pinning the entire loader and metaspace for that "undeployed" app in memory'],
    readMinutes: 2,
    related: ['classloader-delegation-model', 'metaspace-vs-permgen'],
  },
  {
    id: 'class-identity-and-loader',
    title: 'Class Identity Includes Its Loader',
    group: 'Class Loading',
    definition: 'A class\'s runtime identity is the pair (fully-qualified name, defining ClassLoader) — the same bytecode loaded by two different loaders produces two distinct, mutually-incompatible Class objects.',
    whyItMatters: ['This is the mechanism behind module/plugin isolation, but it also causes the classic "ClassCastException: com.foo.Bar cannot be cast to com.foo.Bar" when a class is visible through two loaders in the same JVM'],
    interviewAngle: {
      q: 'Two loaders each load the same .class file — is instanceof true between the resulting objects?',
      a: 'No. Even with byte-for-byte identical bytecode, the JVM treats them as unrelated types because identity is scoped by defining loader, not just by name.',
    },
    readMinutes: 1,
    related: ['classloader-delegation-model'],
  },

  // Group: Memory Areas
  {
    id: 'jvm-runtime-memory-areas',
    title: 'JVM Runtime Memory Areas',
    group: 'Memory Areas',
    definition: 'The JVM partitions memory into the heap and method area (shared across threads) plus a JVM stack, PC register, and (for native code) a native method stack per thread.',
    whyItMatters: ['Only the heap and method area are subject to garbage collection; the per-thread areas are reclaimed automatically when the thread exits, which is why thread-local data structures never show up as GC roots the way heap objects do'],
    remember: ['PC register holds the address of the currently executing JVM instruction — undefined/unused for native method frames', 'Method area (Metaspace on HotSpot) stores class metadata, method bytecode, the runtime constant pool, and static variables — not instances'],
    diagram: 'flowchart LR\n  Heap[Heap] --- Method[Method Area]\n  Method --- Stack[JVM Stack per thread]\n  Stack --- PC[PC Register per thread]\n  Stack --- Native[Native Stack per thread]',
    readMinutes: 2,
    related: ['metaspace-vs-permgen', 'stack-frame-structure'],
  },
  {
    id: 'metaspace-vs-permgen',
    title: 'Metaspace Replaced PermGen (Java 8)',
    group: 'Memory Areas',
    definition: 'Since Java 8, class metadata lives in Metaspace, native memory outside the heap, replacing the fixed-size PermGen that previously lived inside heap-managed space.',
    whyItMatters: ['PermGen had a hard default cap that classloader-leak-heavy apps (frameworks that generate proxy classes per request) would blow through constantly; Metaspace grows into native memory by default, trading that OOM for silent host memory pressure if left unbounded'],
    remember: ['MaxMetaspaceSize is unlimited by default — set it explicitly in containers or a leak degrades the whole host, not just the JVM', 'String pool moved to the heap back in Java 7, separately from this PermGen-to-Metaspace move in Java 8 — don\'t conflate the two'],
    readMinutes: 2,
    related: ['custom-classloaders', 'oom-metaspace'],
  },
  {
    id: 'stack-frame-structure',
    title: 'Stack Frame Structure',
    group: 'Memory Areas',
    definition: 'Each method invocation pushes a new frame onto the calling thread\'s JVM stack, holding its local variable array, an operand stack for intermediate computation, and a reference to the runtime constant pool.',
    whyItMatters: ['Frame size is fixed at compile time from the method\'s bytecode (javac computes max locals and max stack), so per-call stack cost is deterministic — depth, not per-call variability, is what blows the stack'],
    remember: ['Recursion depth times per-frame size is what -Xss actually bounds, not total variable count', 'Deep call chains through wrapped exceptions or heavily inlined lambdas (many small synthetic frames) can hit the limit faster than the visible code depth suggests'],
    readMinutes: 2,
    related: ['jvm-runtime-memory-areas', 'oom-stackoverflow'],
  },

  // Group: Bytecode & Execution
  {
    id: 'class-file-format',
    title: 'Class File Format & Constant Pool',
    group: 'Bytecode & Execution',
    definition: 'javac compiles source into a platform-independent .class file — a magic number, version, and a constant pool of literals/names/type references that every other section (fields, methods, bytecode) refers to by index rather than by embedding values inline.',
    whyItMatters: ['Because method bytecode references the constant pool by index instead of holding literal values, tools can rewrite bytecode (instrumentation, AOP proxies, bytecode-level mocking libraries) without recompiling from source'],
    remember: ['Constant pool entries are resolved lazily by default (lazy/late resolution), which is part of why a NoClassDefFoundError can surface long after a class was first loaded, on first actual use of the missing reference'],
    readMinutes: 2,
    related: ['bytecode-verification', 'bytecode-stack-machine'],
  },
  {
    id: 'bytecode-verification',
    title: 'Bytecode Verification',
    group: 'Bytecode & Execution',
    definition: 'Before a class is linked, the verifier statically checks its bytecode for type safety and structural soundness — stack depth never underflows/overflows, jumps target valid instructions, operand types match instruction expectations — independent of whether it came from trusted javac output.',
    whyItMatters: ['Verification is what lets the JVM safely execute bytecode from any source (network-loaded classes, hand-crafted bytecode, other-language compilers) without trusting the compiler that produced it — it is a security boundary, not just a correctness check'],
    remember: ['Verification failure throws VerifyError at link time, distinct from a compile-time error — you can hand-craft a syntactically valid but type-unsafe class file and it fails only when the JVM loads it'],
    readMinutes: 2,
  },
  {
    id: 'bytecode-stack-machine',
    title: 'JVM as a Stack-Based Machine',
    group: 'Bytecode & Execution',
    definition: 'JVM bytecode instructions operate on an implicit per-frame operand stack (push operands, execute an instruction, pop results) rather than addressing a fixed set of registers the way native CPU instruction sets do.',
    whyItMatters: ['Stack-based instructions are compact and trivially platform-independent (no register file to map), at the cost of more instructions per operation than a register machine — the JIT\'s job includes translating this into efficient register-allocated native code'],
    remember: ['Local variables (the "local variable array") are separate from the operand stack — load/store instructions (iload, istore) move values between them; arithmetic instructions only ever operate on the operand stack'],
    readMinutes: 1,
    related: ['class-file-format', 'interpreter-vs-jit-tiered-compilation'],
  },

  // Group: JIT Compilation
  {
    id: 'interpreter-vs-jit-tiered-compilation',
    title: 'Interpreter & Tiered JIT Compilation',
    group: 'JIT Compilation',
    definition: 'HotSpot starts every method in the bytecode interpreter, then promotes "hot" methods through tiered compilation — C1 (client compiler, fast to compile, lighter optimization, adds invocation counters) and eventually C2 (server compiler, slower to compile, aggressively optimized) — based on observed call/loop-back-edge counts.',
    whyItMatters: ['This is why a fresh JVM process runs measurably slower for the first seconds-to-minutes under load — "warmup" — before hot paths reach C2-compiled steady state, which matters directly for benchmark validity and for short-lived processes/serverless cold starts'],
    remember: ['Tiers run 0 (interpreter) through 4 (full C2); a method can be C1-compiled, still gathering profile data, before ever reaching C2', '-Xint forces interpreter-only (useful for isolating a JIT-related bug); -Xcomp forces compilation before execution (rarely a good idea outside diagnostics)'],
    readMinutes: 2,
    related: ['bytecode-stack-machine', 'jit-deoptimization'],
  },
  {
    id: 'jit-deoptimization',
    title: 'Deoptimization',
    group: 'JIT Compilation',
    definition: 'C2 compiles native code under speculative assumptions gathered from observed behavior (e.g. a call site has only ever seen one concrete type); if runtime behavior later violates an assumption, the JVM discards the compiled code and falls back to the interpreter for that method.',
    whyItMatters: ['A call site that looked monomorphic during warmup but later becomes megamorphic (many implementing types) can silently fall back to interpreted execution, producing a performance cliff with no code change and no error — a classic hard-to-diagnose production regression'],
    interviewAngle: {
      q: 'A method runs fast for an hour then suddenly slows down with no load change and no exception. What JIT-level cause could explain it?',
      a: 'A previously monomorphic/bimorphic call site started hitting a third implementing type, invalidating the C2 compiler\'s type-specialization assumption and triggering deoptimization back to the interpreter for that method.',
    },
    readMinutes: 2,
    related: ['interpreter-vs-jit-tiered-compilation'],
  },

  // Group: OOM Diagnostics
  {
    id: 'oom-heap-space',
    title: 'java.lang.OutOfMemoryError: Java heap space',
    group: 'OOM Diagnostics',
    definition: 'Thrown when the garbage collector cannot reclaim enough heap to satisfy an allocation even after a full collection, meaning live (reachable) objects genuinely exceed the configured heap — either a real leak or an undersized -Xmx.',
    whyItMatters: ['Distinguishing "leak" from "undersized" requires a heap dump, not just the stack trace — the error\'s stack trace only shows where the failing allocation happened, not what is holding everything else reachable'],
    remember: ['GC overhead limit exceeded is a related-but-distinct variant: thrown when the collector is running repeatedly and reclaiming very little (default threshold: >98% of time in GC, <2% heap recovered), which happens before a pool is literally exhausted'],
    readMinutes: 2,
    related: ['oom-metaspace'],
  },
  {
    id: 'oom-metaspace',
    title: 'java.lang.OutOfMemoryError: Metaspace',
    group: 'OOM Diagnostics',
    definition: 'Thrown when class metadata exceeds MaxMetaspaceSize (or exhausts native memory if unbounded) — almost always caused by loading far more classes than expected, not by ordinary object allocation.',
    whyItMatters: ['The dominant real-world cause is classloader leaks from repeated redeploys or dynamic-proxy/bytecode-generation frameworks (CGLIB, dynamic lambdas at scale) creating unbounded numbers of anonymous classes that never become unreachable'],
    remember: ['A heap dump shows this as an accumulation of ClassLoader instances or duplicate class metadata, not oversized object graphs — different investigation path than a heap-space OOM'],
    readMinutes: 2,
    related: ['metaspace-vs-permgen', 'custom-classloaders'],
  },
  {
    id: 'oom-stackoverflow',
    title: 'StackOverflowError vs OutOfMemoryError',
    group: 'OOM Diagnostics',
    definition: 'StackOverflowError (not an OutOfMemoryError) is thrown when a single thread\'s call depth exceeds its -Xss-bounded JVM stack, typically from unbounded or excessively deep recursion.',
    whyItMatters: ['It is scoped to one thread and its own stack memory, unlike heap/metaspace OOM which reflects shared-area exhaustion — one thread overflowing does not by itself starve other threads or corrupt heap state'],
    remember: ['It is a distinct Error subtype from OutOfMemoryError entirely (both extend VirtualMachineError) — "stack overflow" is not a flavor of OOM despite the intuitive association'],
    readMinutes: 1,
    related: ['stack-frame-structure'],
  },
  {
    id: 'oom-native-thread',
    title: 'java.lang.OutOfMemoryError: unable to create new native thread',
    group: 'OOM Diagnostics',
    definition: 'Thrown when the OS refuses a new native thread creation request — usually because the process has hit the OS\'s max-threads/max-processes limit or exhausted available native (non-heap) address space for thread stacks, not because the Java heap is full.',
    whyItMatters: ['This is a classic container/cgroup gotcha: a JVM sized generously for heap but running in a container with a low process/thread ulimit, or with a large default -Xss multiplied across an unbounded thread pool, exhausts native capacity long before the heap does'],
    remember: ['Fix paths are: raise the OS thread/process ulimit, lower -Xss to shrink per-thread native footprint, or bound the thread pool — increasing -Xmx does nothing for this one'],
    readMinutes: 2,
    related: ['stack-frame-structure', 'jvm-flags-heap-stack-sizing'],
  },

  // Group: JVM Flags & Reflection
  {
    id: 'jvm-flags-heap-stack-sizing',
    title: 'Core Sizing Flags: -Xmx / -Xms / -Xss',
    group: 'JVM Flags & Reflection',
    definition: '-Xmx sets max heap size, -Xms sets initial heap size, and -Xss sets the per-thread JVM stack size — none of these affect Metaspace, which has its own -XX:MaxMetaspaceSize.',
    whyItMatters: ['Setting -Xms equal to -Xmx avoids heap-resize pauses as the JVM grows the heap under load, a common production tuning default for latency-sensitive services'],
    remember: ['Total process memory is heap + metaspace + thread stacks (count x -Xss) + native/off-heap (direct buffers, JIT code cache, GC structures) — sizing only -Xmx and ignoring the rest is the top cause of container OOM-kills despite a "safe" heap setting'],
    readMinutes: 2,
    related: ['oom-native-thread', 'oom-heap-space'],
  },
  {
    id: 'reflection-mechanics-performance',
    title: 'Reflection Mechanics & Cost',
    group: 'JVM Flags & Reflection',
    definition: 'Reflective calls (Method.invoke, Field access) go through additional access-checking and argument-boxing/unboxing machinery compared to direct calls, and historically bypassed JIT inlining, though HotSpot generates bytecode-based accessor stubs after a warmup threshold to close most of the gap.',
    whyItMatters: ['setAccessible(true) skips Java-level access checks (private/protected) but is itself increasingly restricted by the module system (strong encapsulation, JEP 403+), which breaks reflection-heavy frameworks and libraries running against modularized JDK internals'],
    remember: ['After ~15 invocations (sun.reflect.inflationThreshold default) HotSpot "inflates" a reflective call from a slow native-call path to a generated bytecode accessor — the first several calls are noticeably slower than the steady state'],
    readMinutes: 2,
  },
]

const gcConcepts: ConceptCard[] = [
// Group: Generational Hypothesis
  {
    id: 'generational-hypothesis',
    title: 'Generational Hypothesis',
    group: 'Generational Hypothesis',
    definition: 'Empirical observation that most objects die young, so splitting the heap into generations and collecting the young one far more often than the old one is dramatically cheaper than scanning the whole heap every time.',
    whyItMatters: [
      'Justifies why nearly every production collector (Serial, Parallel, G1, and to a lesser extent ZGC/Shenandoah) is generational rather than treating the heap uniformly',
      'A workload that violates the hypothesis (lots of medium-lived objects) degrades minor-GC efficiency and pushes objects into the old generation prematurely',
    ],
    remember: [
      'Two corollaries: most objects die young; few references cross from old generation to young generation',
      'The second corollary is what makes the card table / remembered set optimization for minor GC roots correct and cheap',
    ],
    diagram: 'flowchart LR\n  Eden --> Survivor\n  Survivor --> Survivor\n  Survivor --> Old',
    readMinutes: 2,
  },
  {
    id: 'eden-survivor-tenuring',
    title: 'Eden, Survivor Spaces, and Object Aging',
    group: 'Generational Hypothesis',
    definition: 'New objects allocate into Eden; a minor GC copies surviving objects between two Survivor spaces (S0/S1), incrementing an age counter each time, until the object is promoted (tenured) to the old generation.',
    whyItMatters: [
      'Copying collection in the young generation is fast precisely because most of Eden is garbage — live objects are the minority being copied, not the majority',
      'Only one Survivor space is ever "active" at a time; the other is always kept empty as the copy target, which is why sizing SurvivorRatio too small causes premature promotion',
    ],
    remember: [
      'TenuringThreshold (default up to 15, tracked with a 4-bit age field) controls how many survived minor GCs before promotion to old gen',
      'Dynamic age computation can also promote a batch of objects early if survivor space is nearly full, regardless of the threshold',
    ],
    interviewAngle: {
      q: 'Why does the JVM keep one Survivor space empty at all times?',
      a: 'It\'s the copy destination for the next minor GC — Eden and the occupied Survivor space are scavenged into it, which is what makes the young-gen collector a cheap copying (not mark-sweep) collector with no fragmentation.',
    },
    readMinutes: 2,
  },
  {
    id: 'minor-major-full-gc',
    title: 'Minor vs Major vs Full GC',
    group: 'Generational Hypothesis',
    definition: 'A minor GC collects only the young generation, a major GC collects the old generation (terminology varies by collector), and a full GC collects the entire heap including metaspace, and is the most expensive of the three.',
    whyItMatters: [
      'Interview and production shorthand is often used loosely — knowing that "major" and "full" aren\'t strictly synonymous across collectors (G1 has "mixed" collections that are neither) is a signal of real experience',
      'A spike in full GC frequency, not minor GC frequency, is usually the symptom worth paging someone over',
    ],
    remember: [
      'Minor GCs are frequent and typically sub-millisecond to tens-of-ms; full GCs can run into seconds on a large heap with a non-concurrent collector',
      'A full GC is often triggered by old-gen exhaustion, explicit System.gc() calls, or metaspace expansion failure',
    ],
    readMinutes: 1,
  },

  // Group: Collector Algorithms
  {
    id: 'serial-collector',
    title: 'Serial Collector',
    group: 'Collector Algorithms',
    definition: 'A single-threaded, stop-the-world collector (mark-copy for young gen, mark-sweep-compact for old gen) intended for small heaps or single-core environments where collector overhead itself matters more than pause time.',
    whyItMatters: [
      'Still the right default for constrained containers or CLI tools where a background GC thread pool would waste resources',
      'Enabled with -XX:+UseSerialGC; useful as a baseline when isolating whether a performance issue is collector-related at all',
    ],
    readMinutes: 1,
  },
  {
    id: 'parallel-collector',
    title: 'Parallel (Throughput) Collector',
    group: 'Collector Algorithms',
    definition: 'Uses multiple threads for both young and old generation collection but still stops all application threads during collection, optimizing for maximum throughput rather than pause time.',
    whyItMatters: [
      'Was the default collector through Java 8; still the right choice for batch jobs where total throughput matters more than individual pause latency',
      'Tuned via -XX:MaxGCPauseMillis (a goal, not a guarantee) and -XX:GCTimeRatio to trade throughput against pause time',
    ],
    remember: ['-XX:+UseParallelGC; old gen uses parallel mark-sweep-compact, unlike Serial\'s single-threaded version'],
    readMinutes: 1,
  },
  {
    id: 'cms-collector-deprecated',
    title: 'CMS Collector (Deprecated/Removed)',
    group: 'Collector Algorithms',
    definition: 'Concurrent Mark Sweep collected the old generation concurrently with application threads to minimize pause time, but never compacted, which caused fragmentation and unpredictable "concurrent mode failure" full-GC fallback.',
    whyItMatters: [
      'Deprecated in Java 9 (JEP 291) and removed in Java 14 (JEP 363) in favor of G1 as the default, then ZGC/Shenandoah for stricter latency needs — a senior engineer should know why, not just that it happened',
      'Concurrent mode failure — CMS unable to keep up with allocation rate and falling back to a full stop-the-world collection with the slower non-compacting old-gen sweep — was the operational nightmare that killed it',
    ],
    remember: [
      'Fragmentation without compaction eventually forces a full GC anyway, defeating the low-pause goal it was designed for',
      'G1 was designed specifically to replace CMS by adding region-based incremental compaction while remaining mostly concurrent',
    ],
    readMinutes: 2,
  },
  {
    id: 'g1-region-based-collection',
    title: 'G1: Region-Based Collection',
    group: 'Collector Algorithms',
    definition: 'G1 divides the heap into many equal-sized regions (not contiguous young/old spaces) and dynamically assigns each region a role (Eden, Survivor, Old, Humongous), collecting the regions with the most garbage first to hit a pause-time target.',
    whyItMatters: [
      'Region-based layout is what enables G1 to do incremental compaction and avoid CMS\'s fragmentation problem while still being mostly concurrent for old-gen marking',
      'Has been the default collector since Java 9, so understanding its mechanics is table stakes for a senior JVM conversation',
    ],
    remember: [
      'Humongous objects (larger than 50% of a region size) get their own contiguous set of regions and bypass normal young-gen allocation, which can fragment the heap and trigger extra full GCs if frequent',
      '-XX:MaxGCPauseMillis is a soft target G1 uses to choose how many regions to collect per cycle, not a hard cap',
    ],
    diagram: 'flowchart LR\n  Region1[Eden Region] --> Region2[Survivor Region]\n  Region2 --> Region3[Old Region]\n  Region4[Humongous Region] --> Region3',
    readMinutes: 2,
  },
  {
    id: 'g1-mixed-collections-rsets',
    title: 'G1 Mixed Collections and Remembered Sets',
    group: 'Collector Algorithms',
    definition: 'After a concurrent marking cycle identifies mostly-garbage old regions, G1 runs mixed collections that reclaim young regions plus a subset of those old regions in the same pause, using per-region remembered sets to avoid scanning the whole heap for cross-region references.',
    whyItMatters: [
      'Remembered sets (backed by a card table) are what let G1 collect a subset of regions without scanning every other region for incoming pointers — this is the same generational "old rarely points to young" trade CMS and Parallel also exploit, just region-granular',
      'A workload with very high cross-region mutation rate increases remembered-set maintenance cost (write barriers), which is a real throughput tax that shows up in GC logs as increased "Update RS" time',
    ],
    remember: [
      'Concurrent marking cycle triggers based on old-gen occupancy (-XX:InitiatingHeapOccupancyPercent, default 45%)',
      'Mixed collections continue for several cycles after marking, gradually reclaiming the identified old regions rather than all at once',
    ],
    related: ['g1-region-based-collection'],
    readMinutes: 2,
  },
  {
    id: 'stop-the-world-pauses',
    title: 'Stop-the-World Pauses',
    group: 'Collector Algorithms',
    definition: 'A phase where every application thread is suspended at a safepoint so the collector can move or reclaim objects without a mutator thread observing or corrupting an inconsistent heap state.',
    whyItMatters: [
      'Root scanning (stack frames, thread locals, JNI handles) and object relocation/compaction fundamentally require the heap to be consistent, so even "concurrent" collectors keep a few short STW phases (initial mark, remark)',
      'A thread that takes a long time to reach a safepoint (e.g., a long counted loop the JIT hasn\'t inserted a safepoint poll into) delays the entire pause for every other thread — "safepoint bias"',
    ],
    remember: ['"Concurrent" collectors are not pauseless — they minimize STW time, not eliminate it entirely (except ZGC/Shenandoah\'s relocation, which is also concurrent)'],
    readMinutes: 1,
  },

  // Group: Modern Low-Pause Collectors
  {
    id: 'zgc-concurrent-collector',
    title: 'ZGC',
    group: 'Modern Low-Pause Collectors',
    definition: 'A scalable, mostly-concurrent collector using colored pointers (metadata bits stored in the unused upper bits of a 64-bit reference) and load barriers to perform marking, relocation, and reference remapping without stopping application threads, targeting sub-millisecond pauses regardless of heap size.',
    whyItMatters: [
      'Colored pointers let ZGC know an object\'s state (marked, relocating, remapped) by reading the pointer itself, avoiding a separate metadata lookup — this is the core trick that makes concurrent relocation feasible',
      'Pause times are effectively decoupled from heap size and live-set size, which is the pitch for very large heaps (hundreds of GB+) where G1\'s pauses would scale up',
      'Production-ready without experimental flags since Java 15; generational ZGC (default mode since Java 21) added a young generation to reduce CPU overhead on allocation-heavy workloads',
    ],
    remember: [
      'Trades some throughput and memory overhead (colored pointer bits limit addressable heap on older releases, load barrier cost on every reference read) for pause-time predictability',
      'Read/load barriers intercept reference loads to self-heal a stale pointer to a relocated object on the fly, called "loaded barrier remapping"',
    ],
    related: ['shenandoah-collector'],
    readMinutes: 2,
  },
  {
    id: 'shenandoah-collector',
    title: 'Shenandoah',
    group: 'Modern Low-Pause Collectors',
    definition: 'A low-pause collector (originally Red Hat, OpenJDK since 12) using Brooks forwarding pointers — an extra indirection word per object — so it can relocate objects concurrently with application threads without ZGC\'s pointer-coloring approach.',
    whyItMatters: [
      'Brooks pointers add a per-object memory overhead (one extra word) and an indirection on every access, which is a different cost model than ZGC\'s colored pointers — useful to contrast when asked "ZGC vs Shenandoah"',
      'Like ZGC, decouples pause time from heap size, but historically supported a wider range of JDK versions (backported to 8 and 11 by Red Hat) making it the pragmatic low-pause choice on older LTS deployments',
    ],
    remember: ['Region-based like G1, but does concurrent compaction instead of G1\'s STW-during-mixed-collection compaction'],
    related: ['zgc-concurrent-collector'],
    readMinutes: 2,
  },
  {
    id: 'choosing-a-collector',
    title: 'Choosing a Collector for a Workload',
    group: 'Modern Low-Pause Collectors',
    definition: 'Collector choice is a throughput-vs-latency trade: Parallel for batch/throughput jobs tolerant of pauses, G1 as a balanced default for most services, ZGC/Shenandoah when p99/p999 pause latency is the binding constraint (trading, real-time bidding, large heaps).',
    whyItMatters: [
      'Picking ZGC for a batch ETL job wastes the CPU overhead of load barriers and concurrent threads for a latency guarantee nobody needs; picking Parallel for a latency-sensitive API causes SLA-violating multi-second pauses under load',
      'Heap size is a factor too — G1\'s pause time grows with live-set size on very large heaps, which is exactly the scenario ZGC/Shenandoah were built for',
    ],
    remember: ['A senior answer names the trade-off axis (throughput vs pause latency vs heap size), not just "use G1, it\'s the default"'],
    readMinutes: 1,
  },

  // Group: References & Leaks
  {
    id: 'weak-soft-phantom-references',
    title: 'Weak, Soft, and Phantom References',
    group: 'References & Leaks',
    definition: 'The three non-strong reference types trade off differently against GC: SoftReference is cleared only under memory pressure (good for caches), WeakReference is cleared at the next GC cycle once unreachable via strong refs (good for canonicalizing maps), and PhantomReference is never usable to resurrect the object and exists purely to get post-finalization cleanup notification via a ReferenceQueue.',
    whyItMatters: [
      'PhantomReference.get() always returns null by design — the only signal it gives is presence in a ReferenceQueue, which is exactly what makes it safe for cleanup logic (no risk of resurrecting a half-finalized object)',
      'WeakHashMap and ThreadLocal\'s internal ThreadLocalMap both key on WeakReference, which is precisely why ThreadLocal leaks happen when the value is strongly referenced elsewhere despite the key being weak',
    ],
    remember: [
      'Soft references are cleared "as needed" before an OutOfMemoryError, in roughly LRU order across all soft refs — never rely on a specific eviction point',
      'Cleaner/PhantomReference + ReferenceQueue is the modern replacement for finalize(), used internally by java.nio direct buffers to free native memory',
    ],
    interviewAngle: {
      q: 'Why does PhantomReference.get() always return null?',
      a: 'By the time it\'s enqueued, the object is unreachable and finalization (if any) has already run — allowing get() to return it would let cleanup code accidentally resurrect a partially-finalized object, so the API forbids it entirely.',
    },
    readMinutes: 2,
  },
  {
    id: 'finalization-deprecated',
    title: 'Finalization (Deprecated)',
    group: 'References & Leaks',
    definition: 'Object.finalize() was deprecated for removal in Java 9+ (JEP 421 formally deprecated it in 18) because it runs on an unpredictable GC-controlled thread, can resurrect objects, silently swallows exceptions, and can delay reclamation by requiring two GC cycles.',
    whyItMatters: [
      'An object with a finalizer isn\'t reclaimed in the GC cycle where it becomes unreachable — it\'s queued for finalization, finalized on a separate thread, then only reclaimed on a subsequent GC pass, which is a real and surprising latency/memory cost',
      'A slow or backed-up finalizer thread can cause unbounded memory growth even though objects are technically unreachable — a classic and hard-to-diagnose leak',
    ],
    remember: ['Replacement is try-with-resources / AutoCloseable for deterministic cleanup, or Cleaner (PhantomReference-based) for GC-triggered native resource cleanup'],
    related: ['weak-soft-phantom-references'],
    readMinutes: 1,
  },
  {
    id: 'java-memory-leaks',
    title: 'Memory Leaks Despite GC',
    group: 'References & Leaks',
    definition: 'GC only reclaims unreachable objects — a "leak" in Java is an object that stays reachable long after it\'s logically dead, most commonly via static collections that only grow, listener/callback registrations never removed, ThreadLocal values retained on pooled threads, or a classloader kept alive by one lingering reference from an object it loaded.',
    whyItMatters: [
      'Classloader leaks are the classic app-server/hot-redeploy failure: if any object created by a webapp\'s classloader (a thread, a static field in a shared library, a JDBC driver registered in DriverManager) survives redeploy, the entire old classloader and every class+static it loaded stays retained',
      'ThreadLocal leaks are specifically dangerous in thread-pooled environments (app servers, ExecutorService) because the thread — and its ThreadLocalMap — outlives the logical request, keeping the value alive indefinitely unless remove() is called',
    ],
    remember: [
      'Static fields are GC roots for as long as their class is loaded — an ever-growing static Map/List is the single most common interview example',
      'Listener/observer leaks: registering with a long-lived subject (e.g. a Swing component or event bus) without unregistering keeps the listener, and everything it closes over, reachable',
    ],
    related: ['weak-soft-phantom-references'],
    readMinutes: 2,
  },

  // Group: Tuning & Diagnostics
  {
    id: 'gc-tuning-flags',
    title: 'Core GC Tuning Flags',
    group: 'Tuning & Diagnostics',
    definition: 'Beyond selecting a collector (-XX:+UseG1GC etc.), the highest-leverage tuning flags are heap sizing (-Xms/-Xmx, ideally equal to avoid resize pauses), pause-time goals (-XX:MaxGCPauseMillis), and generation ratios (-XX:NewRatio, -XX:SurvivorRatio).',
    whyItMatters: [
      'Setting -Xms below -Xmx lets the heap resize at runtime, and heap expansion itself is a stop-the-world operation — fixing them equal in latency-sensitive services avoids surprise pauses during warm-up',
      'A too-small young generation causes premature promotion (short-lived objects tenured before dying), inflating old-gen occupancy and triggering more expensive major/mixed GCs',
    ],
    remember: ['MaxGCPauseMillis is a target the collector tunes region/generation sizing toward, not an enforced ceiling — an aggressive target it can\'t hit just means more frequent, not shorter, collections'],
    readMinutes: 1,
  },
  {
    id: 'gc-logging-interpretation',
    title: 'GC Logging and Interpretation',
    group: 'Tuning & Diagnostics',
    definition: 'Unified JVM logging (-Xlog:gc*, standard since Java 9) reports pause type, cause, before/after occupancy per region type, and pause duration for every collection — the primary tool for diagnosing whether GC is a throughput or latency problem in production.',
    whyItMatters: [
      'Distinguishing "Pause Young (Normal)" from "Pause Young (Concurrent Start)" from "Pause Full" in G1 logs tells you immediately whether you\'re looking at routine collection, the start of a marking cycle, or the expensive fallback path worth investigating',
      'A rising "before" occupancy trend across successive GC logs, even after collection, is the textbook signature of a slow leak — a healthy heap saw-tooths back down close to its post-startup baseline',
    ],
    remember: ['-Xlog:gc*:file=gc.log:time,uptime,level,tags is a reasonable production baseline; GCViewer/GCEasy can visualize the log instead of eyeballing it'],
    readMinutes: 1,
  },
]

const performanceConcepts: ConceptCard[] = [
// Group: JIT Optimization
  {
    id: 'jit-inlining',
    title: 'Method Inlining',
    group: 'JIT Optimization',
    definition: 'The JIT replaces a call to a small, frequently-called method with the method body directly, eliminating call overhead and opening the door to further optimizations on the merged code.',
    whyItMatters: [
      'Inlining is the optimization that enables most others — escape analysis, dead code elimination, and constant folding all work better across an inlined boundary than across a real call',
      'Megamorphic call sites (3+ receiver types at runtime) defeat inlining because the JIT cannot pick one target to inline; this silently degrades hot polymorphic dispatch',
    ],
    remember: [
      'Default inlining size cap is small (~35 bytecodes for hot methods via -XX:MaxInlineSize, ~325 for "hot" trivial-frequency methods) — large helper methods on a hot path can get excluded',
      'Getters/setters and small private methods are the classic beneficiaries; deep call chains of large methods are not',
    ],
    interviewAngle: {
      q: 'Why can adding an interface with 3+ implementations on a hot path make code slower even though the logic is unchanged?',
      a: 'It turns a monomorphic or bimorphic call site into a megamorphic one; the JIT can no longer inline a single likely target and falls back to a virtual dispatch (or an inline cache with a slow-path check), losing inlining and everything it would have unlocked downstream.',
    },
    readMinutes: 2,
    related: ['escape-analysis-scalar-replacement', 'polymorphism-inlining-cost'],
  },
  {
    id: 'polymorphism-inlining-cost',
    title: 'Monomorphic vs Megamorphic Call Sites',
    group: 'JIT Optimization',
    definition: 'The JIT tracks how many distinct concrete types have been seen at a call site and only speculatively inlines/devirtualizes when there are one (monomorphic) or two (bimorphic) — three or more (megamorphic) forces a real virtual dispatch every time.',
    whyItMatters: [
      'This is invisible in code review — two functionally identical call sites can have wildly different steady-state throughput purely based on how many implementations flow through them at runtime',
    ],
    remember: [
      'Inline caches degrade: monomorphic (direct jump) -> bimorphic (two-way check) -> megamorphic (full vtable lookup, no inlining)',
      'Mixing a hot generic dispatch loop (e.g. a visitor over many small types) is a classic way to accidentally go megamorphic',
    ],
    readMinutes: 2,
    related: ['jit-inlining'],
  },
  {
    id: 'escape-analysis-scalar-replacement',
    title: 'Escape Analysis & Scalar Replacement',
    group: 'JIT Optimization',
    definition: 'The JIT proves an object never "escapes" the method or thread that creates it, then avoids allocating it on the heap at all — either eliminating it entirely or splitting its fields into scalar local variables/registers.',
    whyItMatters: [
      'This is the mechanism that makes "just wrap it in a small object for readability" often free in hot loops — a short-lived point-in-a-method object can vanish entirely from the compiled code',
      'It only fires after the method is hot enough to reach C2 (or C1 with tiering) and the escape proof holds; it silently stops working the moment the object is passed somewhere the compiler can\'t fully track (e.g. stored into a field, passed to a non-inlined call, or used across a lock)',
    ],
    remember: [
      'Escaping conditions: stored to a static/instance field, returned, passed to a method that isn\'t inlined, or thrown as an exception',
      'Scalar replacement can also let the JIT eliminate the memory barrier/monitor overhead of an object whose lock is provably never contended (lock elision) — related but distinct from escape analysis itself',
      'Never rely on it for correctness or as a benchmarked guarantee — it\'s a best-effort optimization, not a language feature',
    ],
    interviewAngle: {
      q: 'Does escape analysis mean I should stop worrying about small helper object allocation in hot loops?',
      a: 'No — treat it as a possible bonus, not a guarantee. It requires the code to be JIT-warm, the object to provably not escape, and often depends on other inlining succeeding first; small changes (a debug log capturing the reference, a call that stops getting inlined) can silently disable it.',
    },
    readMinutes: 3,
    related: ['jit-inlining', 'object-allocation-cost'],
  },
  {
    id: 'loop-optimizations',
    title: 'Loop Unrolling & Dead Code Elimination',
    group: 'JIT Optimization',
    definition: 'C2 duplicates loop bodies to reduce per-iteration branch/counter overhead (unrolling) and removes computations whose results are provably never observed (dead code elimination), both conditioned on the loop being hot and its bounds/side effects being analyzable.',
    whyItMatters: [
      'Dead code elimination is the single biggest trap in naive benchmarking — if a loop\'s result is never used, the JIT can legally delete the entire loop',
    ],
    remember: [
      'Unrolling trades code size for fewer branch mispredictions and better instruction-level parallelism; JIT decides the unroll factor, you don\'t control it directly',
      'DCE requires proving no observable side effect — an unused local is deleted, but a loop with a volatile write or I/O call is not',
    ],
    readMinutes: 2,
    related: ['jmh-benchmarking', 'jmh-blackhole'],
  },
  {
    id: 'jit-warmup-tiered-compilation',
    title: 'Warm-up and Tiered Compilation',
    group: 'JIT Optimization',
    definition: 'New code starts in the interpreter (or quick, lightly-optimized C1), and only after a method crosses invocation/back-edge thresholds does the JVM recompile it with the heavily-optimizing C2 — meaning identical code is measurably slower for the first tens of thousands of calls than at steady state.',
    whyItMatters: [
      'This is why the same request can take 50ms cold and 2ms once "warm," and why short-lived processes (CLI tools, some serverless invocations) may never reach C2 for their hot paths at all',
      'Deoptimization can happen even after C2 compilation — if a speculative assumption (e.g. a monomorphic call site) is invalidated by a newly-loaded class, the method is discarded and falls back to the interpreter until it re-warms',
    ],
    remember: [
      'Tiers roughly: 0 interpreter, 1-3 C1 (with increasing profiling), 4 C2 — tiered compilation (default on) lets code get fast quickly via C1 while C2 compiles in the background',
      '-XX:+PrintCompilation and JFR compilation events show when/why a method (re)compiles or deoptimizes',
    ],
    interviewAngle: {
      q: 'A batch job that processes 10 million records is slow for the first 2 seconds then speeds up dramatically. Is that a bug?',
      a: 'No — that\'s expected JIT warm-up: the hot loop starts interpreted/C1-compiled and only gets C2-optimized once it crosses the invocation threshold. It only becomes a problem if the workload is dominated by short-lived processes that never get to amortize that cost.',
    },
    readMinutes: 2,
    related: ['jmh-benchmarking'],
  },

  // Group: Benchmarking Correctly
  {
    id: 'naive-benchmark-pitfalls',
    title: 'Why System.currentTimeMillis() Loops Lie',
    group: 'Benchmarking Correctly',
    definition: 'A hand-rolled "time a loop with currentTimeMillis" benchmark conflates interpreter time with JIT-compiled time, can have its entire measured code deleted by dead code elimination, and is too coarse-grained (millisecond resolution) to measure nanosecond-to-microsecond operations.',
    whyItMatters: [
      'This is the single most common performance-interview trap — engineers ship benchmarks that "prove" an optimization works when they actually measured warm-up noise or nothing at all',
    ],
    remember: [
      'Three failure modes to name: no warm-up (measuring interpreted code), dead code elimination (result unused, so the JIT deletes the work), and constant folding (JIT computes a loop-invariant result once and reuses it, when it should be recomputed per input)',
      'System.nanoTime() fixes resolution but fixes none of the JIT-correctness problems',
    ],
    readMinutes: 2,
    related: ['jmh-benchmarking', 'jmh-blackhole'],
  },
  {
    id: 'jmh-benchmarking',
    title: 'JMH (Java Microbenchmark Harness)',
    group: 'Benchmarking Correctly',
    definition: 'An OpenJDK-maintained benchmarking framework that runs code in a forked JVM with explicit warm-up iterations, isolates measurement from JIT noise, and provides annotations to prevent the compiler from optimizing away the very code being measured.',
    whyItMatters: [
      'It\'s the accepted answer to "how do you correctly benchmark Java code" in a senior interview — naming it without knowing why naive timing fails is a red flag',
    ],
    example: {
      code: {
        language: 'java',
        code: `@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.NANOSECONDS)
@State(Scope.Thread)
@Warmup(iterations = 5)
@Measurement(iterations = 5)
@Fork(1)
public class MyBenchmark {
    @Benchmark
    public int addTwo(MyState state) {
        return state.a + state.b;
    }
}`,
      },
      note: 'State fields prevent constant folding; @Fork runs in a fresh JVM to avoid cross-benchmark JIT pollution.',
    },
    remember: [
      '@Fork isolates each benchmark in its own JVM process — without it, profile pollution from one benchmark can bias JIT decisions in the next',
      '@State(Scope.Thread/Benchmark/Group) controls whether fields are shared or per-thread, which matters for both correctness and contention modeling',
      'Modes: Throughput, AverageTime, SampleTime, SingleShotTime — pick based on whether you care about ops/sec or per-call latency distribution',
    ],
    readMinutes: 3,
    related: ['naive-benchmark-pitfalls', 'jmh-blackhole'],
  },
  {
    id: 'jmh-blackhole',
    title: 'JMH Blackhole & Dead Code Elimination Defense',
    group: 'Benchmarking Correctly',
    definition: 'Blackhole.consume() marks a computed value as observably used without the overhead of a real side effect, preventing the JIT from proving the result is dead and eliminating the code under test; JMH also flags @Benchmark methods returning a value as automatically consumed.',
    whyItMatters: [
      'Without it (or a returned value), a benchmark loop computing an unused result can be optimized down to literally nothing, reporting impossibly fast numbers',
    ],
    remember: [
      'Constant folding is the other half of the trap — if every input to the code under test is a compile-time constant, C2 can precompute the result once; JMH @State fields defeat this by keeping inputs runtime-opaque',
      'Prefer returning the value from @Benchmark over calling Blackhole.consume() manually when there\'s a single result — simpler and JMH handles it',
    ],
    readMinutes: 2,
    related: ['jmh-benchmarking', 'loop-optimizations'],
  },

  // Group: Profiling
  {
    id: 'sampling-vs-instrumenting-profilers',
    title: 'Sampling vs Instrumenting Profilers',
    group: 'Profiling',
    definition: 'Sampling profilers periodically snapshot thread stacks (low overhead, statistical, can miss short-lived methods) while instrumenting profilers inject bytecode at every method entry/exit (exact call counts, but overhead is often large enough to change the very hot path being measured).',
    whyItMatters: [
      'Instrumenting profilers routinely produce misleading results in practice — a method that looks expensive may just be one the instrumentation overhead hit hardest; production profiling almost always means sampling',
    ],
    remember: [
      'Classic safepoint bias: older JVM sampling profilers could only sample at JVM safepoints, systematically over- or under-representing certain code (e.g. tight loops without safepoint polls); async-profiler exists specifically to avoid this',
      'Sampling frequency is a tradeoff — too low misses short hot spots, too high adds its own overhead',
    ],
    readMinutes: 2,
    related: ['async-profiler-flame-graphs', 'jfr'],
  },
  {
    id: 'async-profiler-flame-graphs',
    title: 'async-profiler & Flame Graphs',
    group: 'Profiling',
    definition: 'async-profiler is a low-overhead sampling profiler that uses AsyncGetCallTrace/perf_events to sample both Java and native (JNI, JVM-internal) frames without safepoint bias, commonly visualized as a flame graph where stack depth is height and width is relative time spent.',
    whyItMatters: [
      'It can profile CPU, allocation (via TLAB sampling), lock contention, and wall-clock time — allocation profiling in particular is how you find the actual allocation hot spot instead of guessing from code review',
    ],
    remember: [
      'Flame graph width = proportion of samples with that frame on the stack, not call count or absolute time — a wide frame near the top means "expensive leaf," wide near the bottom means "commonly on the call path"',
      'Differential/diff flame graphs (before vs after a change) are the fast way to confirm an optimization actually moved the needle rather than just moving cost around',
    ],
    readMinutes: 2,
    related: ['sampling-vs-instrumenting-profilers', 'jfr'],
  },
  {
    id: 'jfr',
    title: 'JFR (Java Flight Recorder)',
    group: 'Profiling',
    definition: 'A production-safe, low-overhead (typically well under 1-2%) event-recording facility built into the JVM that captures GC pauses, allocation, lock contention, thread state, and method sampling into a single timeline, viewable in JDK Mission Control.',
    whyItMatters: [
      'Because overhead is low enough to leave running continuously in production, it\'s often the only profiling data available for an incident that already happened — attaching an external profiler after the fact is too late',
      'It correlates JIT compilation events, GC pauses, and CPU sampling on one timeline, which is what lets you say "this latency spike coincided with a GC pause" instead of guessing',
    ],
    remember: [
      'Enable with -XX:+FlightRecorder -XX:StartFlightRecording=... (built into the JDK since 11, backported to 8u); no extra agent needed',
      'Continuous/circular recordings ("always-on JFR") are cheap enough to keep on as an insurance policy, then dumped on demand when something goes wrong',
    ],
    readMinutes: 2,
    related: ['async-profiler-flame-graphs', 'gc-pause-tail-latency'],
  },

  // Group: Allocation & Memory Patterns
  {
    id: 'object-allocation-cost',
    title: 'Object Allocation Cost & TLABs',
    group: 'Allocation & Memory Patterns',
    definition: 'A typical JVM allocation is a bump-the-pointer operation inside a per-thread Thread-Local Allocation Buffer (TLAB), making it cheap compared to malloc — but the real cost of excessive allocation shows up downstream as increased GC frequency and cache pressure, not at the allocation site itself.',
    whyItMatters: [
      'This reframes the classic "avoid object allocation" advice — the allocation itself is fast; the problem is the collection work and cache-locality cost it generates later, which is why allocation rate (MB/s), not object count, is the metric that predicts GC impact',
    ],
    remember: [
      'TLAB exhaustion forces a slow-path allocation (synchronized, from shared eden space) — high allocation rate under contention can surface as this directly',
      'Escape analysis / scalar replacement can eliminate the cost entirely for provably non-escaping objects — see that card',
    ],
    readMinutes: 2,
    related: ['escape-analysis-scalar-replacement', 'boxing-unboxing-cost', 'gc-pause-tail-latency'],
  },
  {
    id: 'boxing-unboxing-cost',
    title: 'Boxing/Unboxing & Primitive Collection Cost',
    group: 'Allocation & Memory Patterns',
    definition: 'Autoboxing allocates a wrapper object per value outside the small cached range (Integer -128..127 by default), and generic collections of boxed primitives pay both that per-element allocation cost and pointer-chasing cache-miss cost that a primitive array avoids entirely.',
    whyItMatters: [
      'A List<Integer> summing loop is not just "a bit slower" than an int[] loop — it\'s allocating N objects, each requiring a heap dereference to read, defeating CPU cache locality that a contiguous primitive array gets for free',
    ],
    remember: [
      'Integer.valueOf() caching only covers -128 to 127 (tunable via -XX:AutoBoxCacheMax for Integer) — code that looks identical behaves differently just based on the value range in production data',
      'Primitive-specialized libraries (Eclipse Collections, fastutil, Trove) exist specifically to avoid this in allocation- or throughput-sensitive code',
    ],
    interviewAngle: {
      q: 'Why might switching a hot numeric loop from List<Integer> to int[] give a bigger speedup than expected from "just removing boxing"?',
      a: 'Boxing removal eliminates the per-element allocation, but the bigger win is often cache locality — a primitive array is contiguous memory the CPU prefetcher handles well, while a List<Integer> is an array of pointers to scattered heap objects, each access a potential cache miss.',
    },
    readMinutes: 2,
    related: ['object-allocation-cost', 'cpu-cache-locality'],
  },
  {
    id: 'cpu-cache-locality',
    title: 'CPU Cache Locality in Java',
    group: 'Allocation & Memory Patterns',
    definition: 'Java\'s object-per-heap-allocation model (unlike C-style structs-in-arrays) means related data is often scattered across the heap, so iteration patterns that look equivalent in complexity can differ by multiples in wall-clock time based purely on cache-line locality.',
    whyItMatters: [
      'This is why array-of-structs-style modeling (e.g. parallel primitive arrays, or libraries offering off-heap struct layouts) sometimes beats "clean" object-oriented modeling by a large margin in throughput-critical code — it\'s a real tradeoff against readability, not a free win',
    ],
    remember: [
      'Row-major iteration over a 2D array (int[][]) is dramatically faster than column-major because it follows cache-line order — a classic, testable example',
      'Object header overhead (12-16 bytes per object) plus alignment padding also reduces effective cache-line usage for small objects',
    ],
    readMinutes: 2,
    related: ['false-sharing', 'boxing-unboxing-cost'],
  },
  {
    id: 'false-sharing',
    title: 'False Sharing / Cache Line Contention',
    group: 'Allocation & Memory Patterns',
    definition: 'When two independent variables written by different threads happen to land on the same 64-byte CPU cache line, hardware cache-coherency traffic forces the line to bounce between cores on every write, even though the threads never touch each other\'s data — this can be as slow as real contention.',
    whyItMatters: [
      'It\'s invisible in code review — two unrelated fields being adjacent in memory (e.g. two counters in neighboring array slots, or two fields in the same object updated by different threads) is enough to tank throughput on multi-core hardware',
    ],
    example: {
      code: {
        language: 'java',
        code: `class Counters {
    @jdk.internal.vm.annotation.Contended
    volatile long counterA;
    @jdk.internal.vm.annotation.Contended
    volatile long counterB;
}`,
      },
      note: '@Contended (needs -XX:-RestrictContended outside java.* on some JDKs) pads fields onto separate cache lines to eliminate the bounce.',
    },
    remember: [
      'Classic reproduction: an array of per-thread counters where each thread updates its own slot — logically independent, physically adjacent, and heavily contended',
      'LongAdder\'s internal striping deliberately pads cells to avoid this, which is part of why it beats AtomicLong under contention',
    ],
    readMinutes: 3,
    related: ['cpu-cache-locality'],
  },
  {
    id: 'off-heap-direct-buffers',
    title: 'Off-Heap Memory & Direct ByteBuffers',
    group: 'Allocation & Memory Patterns',
    definition: 'DirectByteBuffer allocates memory outside the managed heap, avoiding a JVM-to-native copy for I/O operations and avoiding GC scanning of that memory entirely — at the cost of manual lifecycle management and a separate, easy-to-exhaust memory limit.',
    whyItMatters: [
      'It\'s the standard technique for high-throughput I/O (NIO channels, network buffers, memory-mapped files) where copying gigabytes through the managed heap would both cost CPU and inflate GC scan time',
    ],
    remember: [
      'Direct buffer allocation/deallocation is comparatively expensive and historically relied on GC-triggered Cleaner/PhantomReference cleanup — pooling direct buffers rather than allocating per-request is the norm',
      'Sized separately via -XX:MaxDirectMemorySize; exhausting it throws OutOfMemoryError: Direct buffer memory even while heap usage looks fine, a common on-call confusion',
    ],
    readMinutes: 2,
    related: ['object-allocation-cost'],
  },

  // Group: Latency Engineering
  {
    id: 'jvm-throughput-vs-latency',
    title: 'Throughput vs Latency Tradeoffs',
    group: 'Latency Engineering',
    definition: 'Optimizing for maximum operations-per-second and optimizing for predictable per-operation response time are frequently in tension — batching, larger buffers, and background compaction all improve throughput while adding variance that hurts tail latency.',
    whyItMatters: [
      'A senior engineer needs to state which one a given change actually targets — a "performance improvement" that raises average throughput while worsening p99 latency can be a net loss for a user-facing service even though every dashboard-friendly average looks better',
    ],
    remember: [
      'JMH\'s Throughput mode and SampleTime/latency-percentile mode are answering genuinely different questions — pick the mode that matches what production actually needs',
      'GC collector choice is the textbook example: throughput-oriented collectors accept longer occasional pauses for less total CPU overhead; low-pause collectors trade some throughput for latency predictability (see gc subtopic)',
    ],
    readMinutes: 2,
    related: ['gc-pause-tail-latency'],
  },
  {
    id: 'gc-pause-tail-latency',
    title: 'GC Pause Impact on Tail Latency',
    group: 'Latency Engineering',
    definition: 'Even a "fast" collector\'s occasional stop-the-world pause directly shows up as a latency spike for whatever requests happen to be in flight at that moment, so p99/p999 latency is often dominated by GC behavior rather than by average-case application code.',
    whyItMatters: [
      'This is why allocation rate reduction matters even on modern low-pause collectors — fewer/smaller collections means fewer opportunities for a pause to land under an SLA-sensitive request, independent of which collector algorithm is chosen (algorithm detail is the gc subtopic\'s territory)',
    ],
    remember: [
      'Correlate GC pause timestamps against a latency histogram (JFR makes this direct) before assuming a tail-latency spike is application code rather than collector-caused',
      'Reducing allocation rate is a lever every collector benefits from; picking a different collector is a separate, complementary lever',
    ],
    readMinutes: 2,
    related: ['jvm-throughput-vs-latency', 'jfr'],
  },
  {
    id: 'method-inlining-limits-warmup-interaction',
    title: 'Warm-up Cost in Latency-Sensitive Deploys',
    group: 'Latency Engineering',
    definition: 'A freshly-started or newly-deployed JVM instance serves its first requests through interpreted/C1 code before JIT warm-up completes, so rolling deploys and autoscaling that route production traffic to a cold instance immediately create a burst of elevated latency.',
    whyItMatters: [
      'This is a real production pattern, not a micro-benchmarking footnote — it drives practices like health-check delay/warm-up traffic replay before adding an instance to a load balancer, and it\'s a reason serverless cold starts are particularly costly for JVM-based functions',
    ],
    remember: [
      'AppCDS / Class Data Sharing and, on newer JDKs, Project Leyden-style ahead-of-time work aim to reduce startup/warm-up cost, distinct from steady-state optimization',
      'Synthetic warm-up traffic before joining a load balancer is a standard mitigation for user-facing latency-sensitive services',
    ],
    readMinutes: 2,
    related: ['jit-warmup-tiered-compilation', 'jvm-throughput-vs-latency'],
  },
]

const productionConcepts: ConceptCard[] = [
// --- Observability ---
  {
    id: 'structured-logging-mdc',
    title: 'Structured Logging & MDC/Correlation IDs',
    group: 'Observability',
    definition: 'Logging as key-value structured events (usually JSON) with a request-scoped correlation ID propagated via MDC (Mapped Diagnostic Context) so every log line from a request can be grepped together across threads and services.',
    whyItMatters: [
      'MDC is thread-local, so it silently disappears across thread pool handoffs (async/@Async, executor submissions, reactive schedulers) unless explicitly propagated — a common source of "missing" correlation IDs in async code paths',
      'Structured (JSON) logs are what makes log aggregation and querying (not just full-text search) viable at production scale',
    ],
    remember: ['MDC.put() before dispatch, MDC.clear() in a finally — leaking MDC state across pooled threads leaks one request\'s correlation ID into another\'s logs'],
    readMinutes: 2,
  },
  {
    id: 'production-jvm-metrics',
    title: 'What to Actually Monitor for a JVM Service',
    group: 'Observability',
    definition: 'A short list of JVM/service metrics that predict incidents before users notice: heap usage after full GC, GC pause time and frequency, thread pool queue depth/saturation, and error rate/latency percentiles (not averages).',
    whyItMatters: [
      'Heap usage right after a full GC (not the sawtooth peak) is the real signal for a leak — a rising floor across GCs means live objects are accumulating, not just garbage waiting to be collected',
      'p99 latency and error rate catch problems averages hide entirely — a stalled thread pool can show a fine average while 1% of requests time out',
    ],
    remember: ['Thread pool queue depth approaching capacity is often the earliest signal of downstream slowness, well before error rate moves', 'See GC tuning subtopic for pause-time mechanics — this card is about which numbers to watch, not how GC works'],
    interviewAngle: { q: 'Why watch post-GC heap floor instead of peak heap usage?', a: 'Peak heap rises and falls normally with allocation; a rising floor after each full GC means objects that should be garbage are still reachable — the actual leak signal.' },
    readMinutes: 2,
  },
  {
    id: 'health-vs-readiness-liveness',
    title: 'Liveness vs Readiness Probes',
    group: 'Observability',
    definition: 'Liveness answers "is this process alive and should be restarted if not"; readiness answers "is this instance currently able to serve traffic" — conflating them causes orchestrators to either kill healthy-but-busy pods or route traffic to broken ones.',
    whyItMatters: [
      'A liveness probe that checks downstream dependencies (a database, a queue) causes cascading restarts during an outage — the app is fine, the dependency isn\'t, and killing the app makes recovery slower, not faster',
      'Readiness should reflect the ability to serve now (warm caches, DB connection available, thread pool not saturated) and can flip false temporarily without killing the process',
    ],
    remember: ['Liveness failing = restart the process; readiness failing = stop routing traffic but keep it running', 'A slow startup (cache warmup, large classloading) should hold readiness false, not fail liveness'],
    readMinutes: 2,
  },

  // --- Lifecycle & Shutdown ---
  {
    id: 'graceful-shutdown-sigterm',
    title: 'Graceful Shutdown & SIGTERM Handling',
    group: 'Lifecycle & Shutdown',
    definition: 'On SIGTERM, a well-behaved JVM service stops accepting new work, drains in-flight requests within a bounded grace period, then exits — via a JVM shutdown hook plus application-level draining, before the orchestrator escalates to SIGKILL.',
    whyItMatters: [
      'Orchestrators (Kubernetes, ECS) send SIGTERM then SIGKILL after a fixed grace period (default 30s in k8s) — anything not drained by then is abruptly terminated mid-request',
      'Abrupt termination mid-write can corrupt state or lose data that a graceful drain would have completed or safely rejected',
    ],
    remember: ['Register via Runtime.getRuntime().addShutdownHook(), but keep the hook fast and non-blocking-forever — it still has a hard deadline', 'Readiness should flip to not-ready immediately on SIGTERM so the load balancer stops sending new traffic before the drain even starts — this closes the race between "signal received" and "traffic still arriving"'],
    diagram: 'flowchart LR\n  a[SIGTERM received] --> b[Readiness flips false]\n  b --> c[Stop accepting new requests]\n  c --> d[Drain in flight requests]\n  d --> e[Shutdown hook runs]\n  e --> f[Process exits]',
    readMinutes: 3,
  },
  {
    id: 'jvm-startup-warmup-containers',
    title: 'JVM Startup & Warm-up in Containers',
    group: 'Lifecycle & Shutdown',
    definition: 'Cold JVM startup pays for class loading and JIT warm-up (interpreted/C1 execution before C2 kicks in) every time a container restarts or autoscales, which matters far more in short-lived containers than long-running servers.',
    whyItMatters: [
      'Aggressive autoscaling or frequent redeploys mean a meaningful fraction of a service\'s traffic can hit cold, unoptimized instances — this is why readiness gating on real warmup (not just process-up) matters',
      'CDS (Class Data Sharing) / AppCDS and tools like CRaC exist specifically to cut startup and warmup cost in container-heavy environments — worth naming even without deep JIT mechanics (see performance subtopic for JIT tiering details)',
    ],
    remember: ['Don\'t mark readiness true immediately on process start if the service needs real warmup — early traffic will hit slow, un-JIT\'d code paths'],
    readMinutes: 2,
    related: ['health-vs-readiness-liveness'],
  },
  {
    id: 'externalized-config-secrets',
    title: 'Externalized Config, Feature Flags & Secrets',
    group: 'Lifecycle & Shutdown',
    definition: 'Production JVM config is externalized from the build artifact (env vars, config server, mounted files) so the same binary is promoted unchanged across environments, with feature flags enabling safe rollout and secrets kept out of both config files and logs.',
    whyItMatters: [
      'Baking environment-specific config into the artifact means you\'re no longer testing the thing you ship — the build that passed staging isn\'t bit-identical to what runs in prod',
      'Secrets landing in application logs (accidentally toString()\'d, or logged at debug level) is a recurring real-world incident category, not a hypothetical',
    ],
    remember: ['Feature flags let you decouple deploy from release — ship dark, enable gradually, kill instantly without a redeploy'],
    readMinutes: 2,
  },

  // --- Diagnostics ---
  {
    id: 'thread-dump-analysis',
    title: 'Thread Dump Analysis (jstack)',
    group: 'Diagnostics',
    definition: 'A thread dump (jstack, or kill -3/SIGQUIT) captures every thread\'s stack and state at one instant, used to diagnose a stuck, deadlocked, or thrashing service by reading what threads are blocked on and where.',
    whyItMatters: [
      'A single dump shows blocking; diagnosing a genuine deadlock reliably needs the JVM\'s own "Found one Java-level deadlock" detection in the dump output, or 2-3 dumps a few seconds apart to see if the same threads are stuck in the same place',
      'Many threads all BLOCKED waiting on the same lock (not deadlocked, just contended) looks similar to a hang at first glance but has a completely different fix — reduce lock scope, not break a cycle',
    ],
    remember: ['Thread states to know: RUNNABLE, BLOCKED (waiting on a monitor), WAITING/TIMED_WAITING (Object.wait, park, sleep) — BLOCKED vs WAITING tells you contention vs voluntary pause', 'Take multiple dumps over time for a suspected hang, not just one — a single snapshot can\'t distinguish "stuck" from "just slow right now"'],
    interviewAngle: { q: 'A service is unresponsive but not crashed — walk through diagnosing it.', a: 'Take 2-3 thread dumps a few seconds apart via jstack; look for "Found Java-level deadlock" in the output, or the same threads BLOCKED on the same lock across dumps, which points at contention rather than a true cycle.' },
    readMinutes: 2,
  },
  {
    id: 'heap-dump-analysis',
    title: 'Heap Dump Capture & Analysis',
    group: 'Diagnostics',
    definition: 'A heap dump (jmap -dump, or -XX:+HeapDumpOnOutOfMemoryError) snapshots every live object on the heap for offline analysis of memory leaks, usually via retained-size and dominator-tree views rather than raw object counts.',
    whyItMatters: [
      'jmap triggers a stop-the-world pause proportional to heap size — dumping a multi-GB heap on a live production instance can freeze it for tens of seconds, so it\'s usually done on one instance pulled out of rotation, not the whole fleet',
      'HeapDumpOnOutOfMemoryError captures the dump automatically at the moment of failure, which is often more useful than a manually triggered dump because it catches the actual leaking state',
    ],
    remember: ['Look at retained size and the dominator tree, not shallow object count — a few large retained objects (e.g. an ever-growing cache) explain more than counting instances', 'Prefer capturing on a drained/cordoned instance, or accept the pause as a deliberate tradeoff — never dump blind on a fully-loaded production node without expecting a stall'],
    readMinutes: 2,
    related: ['production-jvm-metrics'],
  },
  {
    id: 'oom-killer-vs-heap-oom',
    title: 'Container OOM Killer vs JVM Heap OutOfMemoryError',
    group: 'Diagnostics',
    definition: 'A container silently killed by the Linux/cgroup OOM killer (exit code 137, no stack trace) is a different failure from a JVM-thrown OutOfMemoryError — the former means total process memory (heap + metaspace + thread stacks + native/off-heap) exceeded the container limit, not just the heap.',
    whyItMatters: [
      '-Xmx only bounds the heap; metaspace, thread stacks (each thread costs real native memory), direct/native buffers, and JIT code cache all count against the container\'s memory limit but aren\'t covered by -Xmx',
      'Setting -Xmx close to the container memory limit with no headroom for those other regions is one of the most common causes of mysterious container restarts that never show a Java-level OOM stack trace',
    ],
    remember: ['Exit code 137 + no JVM stack trace = suspect the OOM killer, not a heap OutOfMemoryError', '-XX:+UseContainerSupport (default since JDK 10+) makes the JVM heap-size ergonomics aware of cgroup limits, but doesn\'t eliminate the need for headroom'],
    readMinutes: 2,
  },
  {
    id: 'classloader-leaks-redeploy',
    title: 'Classloader Leaks on Redeploy',
    group: 'Diagnostics',
    definition: 'In app-server-style hot redeploys, a static reference, unclosed ThreadLocal, or a lingering non-daemon thread from the old application version can keep its entire classloader (and every class it loaded) reachable, so repeated redeploys accumulate leaked classloaders until metaspace exhausts.',
    whyItMatters: [
      'Metaspace OutOfMemoryError after N redeploys with no code change is the classic symptom — each redeploy looked fine individually',
      'Common root causes: a driver or logging framework registered in a static registry that outlives the redeploy, or a ThreadLocal set by old-version code never cleared',
    ],
    remember: ['Frameworks like JDBC drivers and java.util.logging are common offenders because they self-register in static, JVM-lifetime registries'],
    readMinutes: 2,
  },

  // --- Resilience ---
  {
    id: 'circuit-breakers-jvm-services',
    title: 'Circuit Breakers for JVM Services',
    group: 'Resilience',
    definition: 'A circuit breaker wraps a call to a flaky dependency and, after enough failures, "opens" to fail fast instead of continuing to call and pile up blocked threads — moving to half-open after a cooldown to test recovery.',
    whyItMatters: [
      'Without a breaker, a slow downstream dependency doesn\'t just fail its own calls — it exhausts the calling service\'s thread pool as threads pile up waiting on timeouts, taking down unrelated functionality too',
      'A breaker only helps if timeouts are also set sensibly — a breaker guarding a call with no timeout, or an absurdly long one, still lets threads pile up before it ever trips',
    ],
    remember: ['Fail fast beats fail slow: an open circuit returning an immediate fallback protects the caller\'s own resources, not just the failing dependency'],
    readMinutes: 2,
  },
  {
    id: 'connection-pool-sizing-exhaustion',
    title: 'Connection Pool Sizing & Exhaustion',
    group: 'Resilience',
    definition: 'A connection pool (DB, HTTP client) sized too small starves the service under load; sized too large can overwhelm the downstream resource or exhaust its own connection limit — exhaustion shows up as request threads blocked waiting on pool checkout, not as an obvious connection error.',
    whyItMatters: [
      'Pool size should be informed by downstream capacity and typical hold time, not guessed — a common rule of thumb (Little\'s Law-based) is far smaller than intuition suggests, since more connections than CPU cores usually just adds contention on the DB side',
      'A leaked connection (never returned to the pool — missing close() in a code path, especially on an exception branch) slowly shrinks effective pool size until checkout waits exhaust request threads, and it can look identical to underprovisioning at first',
    ],
    remember: ['Symptom to know: pool-exhaustion timeouts spike while the database itself shows low load — the bottleneck is checkout, not the query', 'Always distinguish "pool too small for the load" from "pool leaking connections" before resizing — resizing a leak just delays the same failure'],
    readMinutes: 2,
  },
]

const modernJavaConcepts: ConceptCard[] = [
  {
    id: 'record-canonical-compact-constructor',
    title: 'Canonical vs Compact Constructor',
    group: 'Records',
    definition: 'Every record gets an auto-generated canonical constructor assigning each component; a compact constructor (no parameter list) lets you validate or normalize arguments before that implicit assignment runs.',
    whyItMatters: [
      'Compact constructors are the only sanctioned place to enforce invariants (null checks, defensive copies) without duplicating the field list',
      "You cannot reassign a component to a different value inside a compact constructor's body in a way that skips the implicit assignment — the parameter name IS the field, assignment to it just feeds the generated assignment",
    ],
    example: {
      code: {
        language: 'java',
        code: `record Range(int lo, int hi) {
    Range {
        if (lo > hi) throw new IllegalArgumentException("lo > hi");
    }
}`,
      },
      note: "No explicit field assignments appear in the body — the compiler still emits this.lo = lo; this.hi = hi; after the compact constructor's code runs.",
    },
    remember: [
      'Compact constructor: no parens, no explicit field assignment — validate/normalize the parameters, compiler assigns fields after',
      'Declaring a full canonical constructor (with parameter list) suppresses the compact form and requires you to assign every field yourself',
      'You can still add other overloaded constructors, but they must ultimately delegate to the canonical one',
    ],
    interviewAngle: {
      q: "Why can't you reject a bad argument by just not assigning it in a compact constructor?",
      a: 'The implicit field assignment always runs after the compact constructor body — the only way to reject bad input is to throw, not to skip an assignment.',
    },
    readMinutes: 2,
  },
  {
    id: 'record-shallow-immutability',
    title: 'Records Are Only Shallowly Immutable',
    group: 'Records',
    definition: "A record's components are final and can't be reassigned, but if a component holds a mutable object (array, List, Date), the referenced object's contents can still be mutated from outside.",
    whyItMatters: [
      'Common production bug: a record wrapping an int[] or a mutable List looks immutable but leaks a mutable reference through its accessor',
      "equals()/hashCode() are generated from the component values at the time of comparison — mutating a held collection after construction silently changes a record's equality/hash behavior",
    ],
    remember: [
      'Defensive-copy mutable components in a compact constructor, and return unmodifiable views from custom accessors if you override them',
      'Arrays as record components are a double trap: auto-generated equals()/hashCode() use reference identity for arrays, not Arrays.equals()/deepEquals()',
    ],
    related: ['record-canonical-compact-constructor'],
    readMinutes: 2,
  },
  {
    id: 'record-structural-contract',
    title: 'Records as a Structural (Not Inheritance) Tool',
    group: 'Records',
    definition: "Records can implement interfaces but can never extend a class or be extended themselves — they're a final, transparent carrier for data, not a base for behavior hierarchies.",
    whyItMatters: [
      "Forces a design choice: model shared behavior via interfaces + default methods, not via a record base class, since that option doesn't exist",
      "Being implicitly final means you can't mock a record with a subclassing-based mocking approach — tests need to construct real instances or mock the interface it implements",
    ],
    remember: [
      'Implicitly final and implicitly extends Record (so it inherits equals/hashCode/toString from there, not Object)',
      'Static fields and static methods are allowed on a record, instance fields beyond the components are not',
    ],
    readMinutes: 1,
  },
  {
    id: 'sealed-exhaustive-switch',
    title: 'Sealed Types + Exhaustive Switch',
    group: 'Sealed & Pattern Matching',
    definition: 'A sealed interface or class declares its complete, closed set of permitted subtypes via `permits`, letting a pattern-matching switch over it omit `default` when every permitted case is covered.',
    whyItMatters: [
      "The compiler rejects the switch at compile time if a new subtype is added and the switch isn't updated — turns a runtime bug (missed case) into a build failure",
      'This is the main practical payoff over a plain enum or abstract class: closed-world modeling with compiler-checked coverage, useful for modeling API results, AST nodes, or state machines',
    ],
    example: {
      code: {
        language: 'java',
        code: `sealed interface Shape permits Circle, Square {}
record Circle(double r) implements Shape {}
record Square(double side) implements Shape {}

double area(Shape s) {
    return switch (s) {
        case Circle c -> Math.PI * c.r() * c.r();
        case Square sq -> sq.side() * sq.side();
    };
}`,
      },
    },
    remember: [
      'permits list can be omitted if all permitted subtypes are nested in the same file — compiler infers it',
      'Every permitted subtype must itself be sealed, final, or non-sealed — non-sealed reopens the hierarchy for unrestricted extension',
      'Exhaustiveness checking only kicks in for switch expressions/statements using pattern matching over the sealed type, not for plain switch on an enum-like discriminator field',
    ],
    readMinutes: 2,
  },
  {
    id: 'sealed-non-sealed-escape-hatch',
    title: 'The non-sealed Escape Hatch',
    group: 'Sealed & Pattern Matching',
    definition: 'A permitted subtype can be declared non-sealed to deliberately reopen that one branch of the hierarchy to arbitrary further extension, breaking the closed-world guarantee for just that branch.',
    whyItMatters: [
      "Once any permitted type is non-sealed, exhaustive switches over the root sealed type lose their compile-time completeness guarantee for that branch — new subclasses of the non-sealed type won't be caught",
      'Common library-design tension: you want closed control at the top but need one extension point for consumers — non-sealed is the sanctioned way to say that explicitly rather than leaving the whole hierarchy open',
    ],
    remember: [
      'Each permitted subtype must pick exactly one of: final, sealed (with its own permits), or non-sealed',
    ],
    related: ['sealed-exhaustive-switch'],
    readMinutes: 1,
  },
  {
    id: 'pattern-matching-instanceof',
    title: 'Pattern Matching for instanceof',
    group: 'Sealed & Pattern Matching',
    definition: '`if (obj instanceof String s)` tests the type and binds a scoped variable in one step, eliminating the separate explicit cast.',
    whyItMatters: [
      "The bound variable's scope follows normal flow analysis — it's usable after a negated check that returns/throws (`if (!(obj instanceof String s)) return; use(s);`), which surprises people expecting block-only scope",
    ],
    remember: [
      'Flow scoping, not block scoping — the pattern variable is definitely assigned wherever the compiler can prove the instanceof was true',
      'Combines with `&&` in the same condition: `if (obj instanceof String s && !s.isEmpty())`',
    ],
    readMinutes: 1,
  },
  {
    id: 'record-deconstruction-patterns',
    title: 'Record Patterns (Deconstruction) in switch',
    group: 'Sealed & Pattern Matching',
    definition: 'A record pattern like `case Point(int x, int y)` both matches the type and destructures its components into new bindings in a single case label, and these can nest arbitrarily deep.',
    whyItMatters: [
      'Nested deconstruction (`case Line(Point(var x1, var y1), Point(var x2, var y2))`) replaces chains of manual accessor calls and casts when working with algebraic data modeled as nested records',
    ],
    example: {
      code: {
        language: 'java',
        code: `sealed interface Shape permits Circle, Rect {}
record Point(int x, int y) {}
record Circle(Point center, int r) implements Shape {}

String describe(Shape s) {
    return switch (s) {
        case Circle(Point(var x, var y), var r) when r > 100 -> "big circle";
        case Circle c -> "circle";
        default -> "other";
    };
}`,
      },
      note: 'The `when` clause is a guard — it only applies after the type/shape pattern already matched, and does not itself count toward exhaustiveness.',
    },
    remember: [
      "A guard (`when`) makes an otherwise-exhaustive switch potentially non-exhaustive again, since the compiler can't prove the guard's boolean covers all remaining cases",
      "`var` inside a nested pattern infers the component's declared type",
    ],
    related: ['sealed-exhaustive-switch'],
    readMinutes: 2,
  },
  {
    id: 'switch-null-case',
    title: 'case null in switch (Java 21)',
    group: 'Sealed & Pattern Matching',
    definition: 'A pattern-matching switch can include an explicit `case null` label, letting one switch handle both the null case and typed cases instead of requiring a separate null check beforehand.',
    whyItMatters: [
      'Before this, switching on a reference type threw NullPointerException on a null subject with no way to handle it inside the switch itself',
      'case null can be combined with default via `case null, default ->` to route null the same way as the fallback case',
    ],
    remember: [
      'A traditional (non-pattern) switch on a reference type still throws NPE on null — this only applies to switches using type patterns',
      'Without an explicit `case null`, a pattern-matching switch still throws NPE on a null subject',
    ],
    readMinutes: 1,
  },
  {
    id: 'virtual-threads-model',
    title: 'Virtual Threads: What They Actually Change',
    group: 'Virtual Threads',
    definition: 'Virtual threads are cheap, JVM-scheduled threads multiplexed M:N onto a small pool of OS-backed carrier threads, unmounting the carrier whenever the virtual thread blocks on supported blocking I/O.',
    whyItMatters: [
      'The payoff is specifically for thread-per-request-style blocking I/O code — you keep the simple synchronous programming model but stop paying one-OS-thread-per-request in memory/context-switch cost',
      "They give zero benefit for CPU-bound work — a virtual thread doing pure computation ties up its carrier thread exactly like a platform thread would, so a CPU-bound service doesn't get faster by switching to virtual threads",
    ],
    example: {
      code: {
        language: 'java',
        code: `try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    executor.submit(() -> callBlockingService());
}`,
      },
    },
    remember: [
      'Virtual threads are daemon threads by default and are never reused/pooled — creating millions is intended and cheap',
      "The carrier pool defaults to a size equal to available processors, similar to ForkJoinPool's common pool sizing",
    ],
    diagram: `flowchart LR
  A[Virtual Thread] -->|mounted on| B[Carrier Thread]
  B -->|blocks on IO| C[Unmount]
  C -->|carrier freed| D[Runs Other Virtual Thread]`,
    readMinutes: 2,
  },
  {
    id: 'virtual-thread-pinning',
    title: "Pinning: When a Virtual Thread Can't Unmount",
    group: 'Virtual Threads',
    definition: "A virtual thread stays pinned to its carrier thread instead of unmounting on block if it's inside a `synchronized` block/method or executing certain native/JNI frames — during a pin, the carrier is unavailable to run any other virtual thread.",
    whyItMatters: [
      'Widespread synchronized-guarded blocking I/O (a common legacy pattern) can silently degrade virtual thread throughput back toward platform-thread-like scaling limits since carriers get starved',
      'As of JDK 21, `synchronized` pins; `ReentrantLock` does not — swapping legacy synchronized blocks for ReentrantLock around blocking calls is a real, recommended migration step, not a style preference',
    ],
    remember: [
      'Enable `-Djdk.tracePinnedThreads=full` (or short) to log pinning events during development to find hotspots',
      "A pin isn't a deadlock or an error — it's a scalability cliff that only shows up under load, making it easy to miss in testing",
    ],
    related: ['virtual-threads-model'],
    readMinutes: 2,
  },
  {
    id: 'virtual-threads-dont-pool',
    title: 'Never Pool Virtual Threads',
    group: 'Virtual Threads',
    definition: 'Thread pools exist to amortize the expensive cost of OS thread creation across reused workers — virtual threads are already cheap to create and discard, so pooling them adds overhead and reintroduces the fixed-capacity bottleneck Loom was meant to remove.',
    whyItMatters: [
      "A bounded ExecutorService of virtual threads defeats the point: you've capped concurrency artificially and added queueing delay for no reuse benefit",
      'Correct pattern is one virtual thread per task via newVirtualThreadPerTaskExecutor, with backpressure applied at a different layer (e.g. a semaphore, or limiting an upstream connection pool) rather than via thread pool sizing',
    ],
    remember: [
      'If you need to cap concurrent downstream calls, gate with a Semaphore or a bounded resource (DB connection pool), not by pooling the virtual threads themselves',
    ],
    related: ['virtual-threads-model'],
    readMinutes: 1,
  },
  {
    id: 'virtual-threads-threadlocal-caution',
    title: 'ThreadLocal Cost Under Millions of Virtual Threads',
    group: 'Virtual Threads',
    definition: "ThreadLocal still works correctly on virtual threads, but a ThreadLocal that's expensive to populate (e.g. a pooled buffer, a per-thread connection) becomes a liability when threads number in the millions instead of dozens.",
    whyItMatters: [
      'A common platform-thread idiom — cache an expensive object per-thread to avoid reallocation — assumes a small, stable thread count; that assumption breaks when a service spins up a fresh virtual thread per request',
      "ScopedValue (introduced alongside virtual threads) is the recommended alternative for passing immutable per-task context down a call stack without ThreadLocal's mutability and per-thread-instance cost",
    ],
    remember: [
      "ThreadLocal isn't banned with virtual threads — it's specifically the pattern of using it as an expensive-object cache that stops making sense",
    ],
    readMinutes: 1,
  },
  {
    id: 'structured-concurrency',
    title: 'Structured Concurrency (Preview)',
    group: 'Virtual Threads',
    definition: "StructuredTaskScope groups a set of related subtasks (often virtual threads) so they share a lifetime — if one fails, siblings are cancelled, and the scope doesn't exit until all subtasks have completed or been cancelled.",
    whyItMatters: [
      'Fixes the classic ExecutorService.submit() fire-and-forget failure mode where a fork gets leaked (a task keeps running after its caller returned or failed) — structured concurrency makes the parent-child task relationship explicit and enforced',
      'Still a preview/incubating API as of JDK 21 — expect API shape to keep changing across releases before finalization',
    ],
    example: {
      code: {
        language: 'java',
        code: `try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    var user = scope.fork(() -> fetchUser());
    var orders = scope.fork(() -> fetchOrders());
    scope.join().throwIfFailed();
    return render(user.get(), orders.get());
}`,
      },
    },
    remember: [
      'Cancellation propagates: if one forked subtask throws, ShutdownOnFailure cancels the others rather than letting them run to completion unattended',
      "The try-with-resources block enforces the structuring — the scope can't be exited while children are still outstanding",
    ],
    related: ['virtual-threads-model'],
    readMinutes: 2,
  },
  {
    id: 'text-block-whitespace',
    title: 'Text Block Incidental Whitespace Stripping',
    group: 'Syntax',
    definition: 'A text block\'s leading whitespace is stripped based on the least-indented line (including the closing delimiter\'s position), which can silently change content if the closing `"""` is indented differently than intended.',
    whyItMatters: [
      "Moving the closing triple-quote left or right re-derives the common indentation baseline for every line — an accidental reformat/auto-indent from an IDE can quietly alter the literal string's leading spaces",
      'Trailing whitespace on each line is stripped by default too; `\\s` at line-end is the escape to preserve an intentional trailing space',
    ],
    example: {
      code: {
        language: 'java',
        code: `String json = """
    {
      "key": "value"
    }
    """;`,
      },
      note: "The indentation of the closing delimiter's line sets the stripped margin for every content line above it.",
    },
    remember: [
      '`\\` at end of line suppresses the implicit newline (line continuation), `\\s` preserves a trailing space that would otherwise be stripped',
    ],
    readMinutes: 1,
  },
  {
    id: 'var-inference-gotchas',
    title: 'var Inference Gotchas',
    group: 'Syntax',
    definition: "`var` infers the most specific static type of the initializer expression at compile time — it's still fully statically typed, but that inferred type can be narrower or more implementation-specific than the type you'd have declared explicitly.",
    whyItMatters: [
      "`var list = new ArrayList<String>();` infers ArrayList<String>, not List<String> — code depending on `list` staying an interface-typed reference (e.g. later reassignment to a different List implementation) won't compile",
      "`var` cannot be used for fields, method parameters, lambda parameters without an explicit target type, or when the initializer is `null` or a bare `{}` array initializer, since there's no expression to infer from",
    ],
    remember: [
      "var with a diamond generic on an anonymous class actually captures the anonymous subtype, exposing any extra members it declares — a rare case where var infers a type you can't even name explicitly",
      'Style guidance: var trades away the declared-type-as-documentation signal, so it reads best when the right-hand side already makes the type obvious',
    ],
    readMinutes: 1,
  },
]

const exceptionsConcepts: ConceptCard[] = [
  {
    id: 'checked-vs-unchecked-tradeoff',
    title: 'Checked vs Unchecked: The Real Design Tradeoff',
    group: 'Design Philosophy',
    definition: 'Checked exceptions force callers to handle or declare a failure at compile time; unchecked exceptions rely on documentation and runtime discovery, trading safety for API flexibility.',
    whyItMatters: [
      "Checked exceptions don't compose with functional interfaces — a Stream.map() lambda can't throw a checked exception without wrapping it, which is why the Java 8 Stream/Optional/CompletableFuture APIs standardized on unchecked exceptions",
      'Checked exceptions leak implementation details up the call stack: a method throwing SQLException forces every caller between it and the handler to know about SQL, breaking abstraction layers',
    ],
    remember: [
      "Modern API design (Stream, Optional, reactive libraries) avoids checked exceptions almost entirely — this is a deliberate, debated reaction to Java's early-2000s design",
      'Checked exceptions still earn their keep for recoverable conditions the caller can meaningfully act on (e.g. retry, fallback) at a stable API boundary',
    ],
    interviewAngle: {
      q: "Why can't you throw a checked exception from inside a Stream.map() lambda?",
      a: "Functional interfaces like Function<T,R> don't declare checked exceptions in their signature, so the compiler rejects it — you must catch-and-wrap into a RuntimeException or use a helper that does that, which is exactly why modern libraries lean unchecked.",
    },
    readMinutes: 2,
  },
  {
    id: 'try-with-resources-suppressed',
    title: 'Try-With-Resources & Suppressed Exceptions',
    group: 'Resource Management',
    definition: 'try-with-resources auto-closes AutoCloseable resources in reverse declaration order, and if both the try body and close() throw, the close() exception is attached as a suppressed exception rather than replacing the original.',
    whyItMatters: [
      'Before Java 7, a close() exception in a finally block silently masked the real failure from the try body — suppressed exceptions preserve both, retrievable via getSuppressed()',
    ],
    remember: [
      'The exception from the try block is the one propagated; close()-time exceptions ride along as suppressed, not thrown separately',
      'Multiple resources close in reverse order of declaration, and each close() failure after the first becomes suppressed on the primary exception',
    ],
    example: {
      code: {
        language: 'java',
        code: `try (var conn = ds.getConnection()) {
    conn.doWork(); // throws WorkException
} // close() also throws SQLException
// caught exception is WorkException
// exception.getSuppressed() contains the SQLException`,
      },
      note: 'Without try-with-resources, the SQLException from a manual finally-block close() would have replaced WorkException entirely, hiding the real cause.',
    },
    readMinutes: 2,
    related: ['exception-chaining'],
  },
  {
    id: 'exception-chaining',
    title: 'Exception Chaining vs Losing the Stack Trace',
    group: 'Resource Management',
    definition: 'Wrapping a caught exception with new X("msg", cause) preserves the original stack trace via getCause(); re-throwing a freshly constructed exception without passing the cause silently discards it.',
    whyItMatters: [
      'The single most common production logging bug: `catch (SQLException e) { throw new ServiceException("failed"); }` loses exactly the stack trace you need to diagnose the failure — the fix is trivial (pass `e` as cause) but easy to forget under a checked-to-unchecked translation',
    ],
    remember: [
      "printStackTrace() and most loggers print the full cause chain automatically once it's wired — the cost of forgetting is invisible until you actually need the trace",
      "initCause() exists for exceptions whose constructor doesn't take a cause, but can only be called once and never after the exception has been thrown",
    ],
    readMinutes: 2,
  },
  {
    id: 'custom-hierarchy-design',
    title: 'Custom Exception Hierarchy: Checked or Unchecked?',
    group: 'Design Philosophy',
    definition: "Design custom exceptions around whether the caller has a real, distinct recovery action to take — if so, a checked exception at a stable boundary communicates that contract; otherwise it's an unchecked programming-error or unrecoverable-condition signal.",
    whyItMatters: [
      "A common anti-pattern is one giant checked ServiceException for every failure mode in a module — callers can't discriminate the case at compile time, so they end up catching it and doing nothing useful, defeating the point of it being checked",
    ],
    remember: [
      'Extend RuntimeException for things that indicate a bug or an unrecoverable state (bad input already validated earlier, invariant violation) — forcing every caller to catch these adds noise, not safety',
      'Reserve checked exceptions for a narrow, well-named type per distinct recoverable condition at a boundary you control (e.g. InsufficientFundsException), not as a catch-all',
    ],
    readMinutes: 2,
  },
  {
    id: 'finally-return-swallows',
    title: 'Finally Block Return Swallows Exceptions',
    group: 'Control Flow Gotchas',
    definition: "A return (or throw) statement inside a finally block silently discards any exception in flight from the try/catch, replacing it with the finally block's own outcome.",
    whyItMatters: [
      'This is a genuine compiler-legal footgun, not a rare edge case — a finally block that returns a value or swallows-and-returns after catching inside itself will mask a real failure with no warning',
    ],
    example: {
      code: {
        language: 'java',
        code: `static int risky() {
    try {
        throw new RuntimeException("boom");
    } finally {
        return 42; // exception is discarded, method returns 42
    }
}`,
      },
      note: 'Static analyzers (and IDE warnings) flag this, but it compiles cleanly and fails silently at runtime.',
    },
    remember: [
      'Same rule applies to a bare `throw` in finally — it replaces whatever exception was already propagating',
      'finally still runs on a normal return from try, on any thrown exception, and on a caught-and-handled exception — but NOT if the JVM itself halts, e.g. System.exit() or a JVM crash/kill -9',
    ],
    readMinutes: 2,
  },
  {
    id: 'finally-system-exit',
    title: 'finally Does Not Run on System.exit()',
    group: 'Control Flow Gotchas',
    definition: 'Calling System.exit() from inside a try block terminates the JVM immediately and skips any pending finally blocks — this is different from every other way a try block can end.',
    whyItMatters: [
      'Resource cleanup (connection close, file flush) written in finally will not happen if a shutdown path calls System.exit() mid-try — this has caused real data-loss and leaked-handle incidents in production shutdown code',
    ],
    remember: [
      'Shutdown hooks (Runtime.addShutdownHook) are the mechanism designed to run cleanup during System.exit() — finally blocks are not',
      'An uncaught Error like OutOfMemoryError can also abort before finally runs, depending on where memory allocation fails',
    ],
    readMinutes: 2,
    related: ['finally-return-swallows'],
  },
  {
    id: 'exception-perf-cost',
    title: 'Performance Cost of Exceptions',
    group: 'Performance',
    definition: 'Throwing an exception is expensive primarily because fillInStackTrace() walks and captures the entire call stack at construction time, not because of the throw/catch mechanism itself.',
    whyItMatters: [
      'Using exceptions for routine control flow in a hot path (e.g. a loop relying on catching an exception instead of checking a condition) can be orders of magnitude slower than a normal branch, purely from stack trace capture',
    ],
    remember: [
      'A custom exception can override fillInStackTrace() to no-op (or pass writableStackTrace=false to the protected Throwable constructor) when the stack trace is genuinely never needed, e.g. a high-frequency validation-failure signal used purely as control flow',
      "JIT can sometimes eliminate stack trace cost entirely for exceptions that are thrown and caught locally without ever escaping (partly why microbenchmarks on this are unreliable) — don't over-optimize speculatively, measure first",
    ],
    interviewAngle: {
      q: 'Why are exceptions considered slow, and how would you make a custom exception cheap?',
      a: 'The cost is fillInStackTrace() capturing the call stack at throw time, not the try/catch mechanism. Override fillInStackTrace() to no-op, or use the protected Throwable(String, Throwable, boolean, boolean) constructor with writableStackTrace=false, when the exception is used as frequent control-flow signaling and the trace is never read.',
    },
    readMinutes: 2,
  },
  {
    id: 'exceptions-completablefuture',
    title: 'Exceptions in CompletableFuture Chains',
    group: 'Concurrent & Async',
    definition: 'An exception thrown inside any stage of a CompletableFuture chain short-circuits subsequent thenApply/thenAccept stages and only surfaces at a terminal call like get(), join(), or a dedicated exceptionally/handle stage.',
    whyItMatters: [
      "A chain with no .exceptionally(), .handle(), or .whenComplete() and whose result is never joined/get()'d will silently swallow the failure entirely — nothing logs it, nothing crashes, the work just vanishes",
    ],
    remember: [
      'get() throws it wrapped in ExecutionException; join() throws it wrapped in unchecked CompletionException — same cause, different wrapper, easy to mismatch in a catch clause',
      'exceptionally() only sees failures, handle() sees both success and failure and can recover in either case — prefer handle() when you need one place to normalize the outcome',
    ],
    diagram: `flowchart LR
  A[supplyAsync] --> B[thenApply]
  B -->|exception| C[skipped stages]
  C --> D[exceptionally or handle]`,
    readMinutes: 2,
  },
  {
    id: 'exceptions-fire-and-forget',
    title: 'Exceptions Lost in Fire-and-Forget Threads',
    group: 'Concurrent & Async',
    definition: "An uncaught exception in a manually spawned Thread or a submitted Runnable (not Callable) doesn't propagate to the caller — it's handed to the thread's UncaughtExceptionHandler, which by default just prints to stderr and is easy to miss in production logging pipelines.",
    whyItMatters: [
      "ExecutorService.submit(Runnable) swallows the exception into the Future silently — it only surfaces if you call future.get(); execute(Runnable) instead routes it to the uncaught exception handler, and if nobody set a custom one, it's stderr-only and invisible to most log aggregators",
    ],
    remember: [
      "Set Thread.setDefaultUncaughtExceptionHandler() (or per-thread via a ThreadFactory) at application startup so pool threads' failures actually reach your logging/alerting instead of a container's stdout that nobody scrapes",
      "A thread pool's worker thread dying from an uncaught exception (rather than being caught inside the task) can silently shrink the pool over time unless the pool replaces terminated threads",
    ],
    readMinutes: 2,
    related: ['exceptions-completablefuture'],
  },
]

const ioNioConcepts: ConceptCard[] = [
  {
    id: 'io-stream-vs-nio-model',
    title: 'java.io Streams vs java.nio Channels',
    group: 'Foundations',
    definition: 'java.io models I/O as a blocking, byte-at-a-time (or buffered-block) stream tied to one thread per connection; java.nio models it as buffer-oriented channels that can be driven non-blocking by a single thread via a Selector.',
    whyItMatters: [
      'Streams are simpler to write and reason about; channels/selectors exist specifically to scale thread count independently of connection count',
      'Picking NIO for a low-concurrency batch job or picking blocking streams for a 50k-connection server are both the classic wrong-tool mistakes',
    ],
    remember: [
      'java.io is thread-per-connection: blocked threads just sit there consuming a stack',
      "java.nio channels are bidirectional and buffer-based (vs. io's directional streams)",
      'NIO.2 (java.nio.file, Java 7+) is a separate, unrelated upgrade to file/path handling — not about non-blocking I/O at all',
    ],
    interviewAngle: {
      q: 'Why would you choose java.io over java.nio for a file-processing batch job?',
      a: "Batch jobs are typically single-connection and CPU/IO-bound, not connection-count-bound — the blocking model is simpler to write correctly and NIO's non-blocking machinery buys nothing when there's no thread-multiplexing problem to solve.",
    },
    related: ['buffered-streams-syscalls', 'selector-reactor-pattern'],
    readMinutes: 2,
  },
  {
    id: 'buffered-streams-syscalls',
    title: 'Why Buffered Streams Matter',
    group: 'Foundations',
    definition: 'BufferedInputStream/BufferedReader (and their Writer counterparts) batch many small reads/writes into fewer, larger native calls, because each unbuffered read()/write() on a FileInputStream or Socket is a system call.',
    whyItMatters: [
      'Wrapping a raw stream costs one allocation; forgetting to wrap it costs one syscall (and one context switch) per byte or per line read',
    ],
    example: {
      code: {
        language: 'java',
        code: `try (var r = new BufferedReader(new FileReader("data.txt"))) {
    String line;
    while ((line = r.readLine()) != null) {
        process(line);
    }
}`,
      },
      note: "readLine() only exists on BufferedReader — wrapping isn't just about speed, it's the API you actually want.",
    },
    remember: [
      'Default buffer size is 8KB for both BufferedInputStream and BufferedReader',
      'Double-buffering (e.g. BufferedReader over a BufferedInputStream over an InputStreamReader) wastes a copy for no benefit',
      "PrintWriter's autoFlush only flushes on println/newline, not on every write — still buffer underneath it",
    ],
    interviewAngle: {
      q: 'What actually goes wrong if you read a file byte-by-byte from a raw FileInputStream?',
      a: "Every single read() call crosses into the kernel — for a multi-MB file that's millions of syscalls and context switches, turning an I/O-bound operation into one dominated by call overhead.",
    },
    related: ['io-stream-vs-nio-model', 'try-with-resources-io'],
    readMinutes: 2,
  },
  {
    id: 'bytebuffer-state-model',
    title: 'ByteBuffer: position/limit/capacity and flip()',
    group: 'NIO Buffers',
    definition: 'A Buffer is a fixed-capacity array plus three cursors — position, limit, capacity — and flip()/clear()/rewind() are how you switch it between write-mode and read-mode.',
    whyItMatters: [
      'The single most common NIO bug is reading from a buffer you just filled without calling flip() first — you get zero or garbage bytes because position is sitting at the end',
    ],
    example: {
      code: {
        language: 'java',
        code: `ByteBuffer buf = ByteBuffer.allocate(1024);
channel.read(buf);   // fills buffer, position advances
buf.flip();           // limit = position, position = 0 -> ready to read
while (buf.hasRemaining()) {
    process(buf.get());
}
buf.clear();           // position = 0, limit = capacity -> ready to write again`,
      },
      note: "flip() and clear() don't erase data; they only reposition the cursors.",
    },
    remember: [
      'flip(): limit = current position, position = 0 — switches write mode to read mode',
      'clear(): position = 0, limit = capacity — resets for writing, but old data is still physically present (not zeroed)',
      'rewind(): position = 0, limit unchanged — re-read the same data without resetting limit',
      'compact(): keeps unread data (between position and limit), shifts it to the front, and sets position after it — for partial reads',
    ],
    diagram: `flowchart LR
  A[allocate] --> B[write via channel]
  B --> C[flip]
  C --> D[read via get]
  D --> E[clear or compact]
  E --> B`,
    interviewAngle: {
      q: 'You wrote data into a ByteBuffer via channel.read() and immediately called buf.get() — why is it returning nothing?',
      a: 'After a write phase, position sits at the end of the written data and limit is still at capacity; get() reads from position forward, so without flip() it reads from the empty tail of the buffer, not the data you just wrote.',
    },
    related: ['memory-mapped-files'],
    readMinutes: 2,
  },
  {
    id: 'selector-reactor-pattern',
    title: 'Selector and the Reactor Pattern',
    group: 'NIO Non-Blocking I/O',
    definition: 'A Selector lets one thread monitor many SelectableChannels for readiness (readable/writable/connectable/acceptable) via select(), dispatching only the channels that are actually ready — the classic single-threaded reactor.',
    whyItMatters: [
      'This is how you serve thousands of connections without a thread per connection — the tradeoff is that all handler code must be non-blocking or it stalls the whole event loop',
      "Netty, Redis, and nginx-style event loops are all this pattern; understanding it explains why 'don't block the event loop' is a rule in those systems",
    ],
    example: {
      code: {
        language: 'java',
        code: `Selector selector = Selector.open();
channel.configureBlocking(false);
channel.register(selector, SelectionKey.OP_READ);
while (true) {
    selector.select();
    for (SelectionKey key : selector.selectedKeys()) {
        if (key.isReadable()) handleRead(key);
    }
}`,
      },
    },
    remember: [
      'select() blocks until at least one registered channel is ready, or the optional timeout elapses',
      'selectedKeys() is not auto-cleared — forgetting to remove a handled key means it reappears next iteration',
      'One blocking call inside a handler stalls readiness checks for every other registered channel on that selector',
    ],
    interviewAngle: {
      q: 'Why does a single misbehaving handler on a Netty-style event loop thread degrade every other connection on that loop?',
      a: "The event loop thread is the same thread running select() and dispatching ready channels — any blocking call inside a handler occupies that thread, so no other channel's readiness gets checked or dispatched until it returns.",
    },
    related: ['bytebuffer-state-model', 'virtual-threads-io-impact'],
    readMinutes: 3,
  },
  {
    id: 'memory-mapped-files',
    title: 'Memory-Mapped Files (MappedByteBuffer)',
    group: 'NIO Non-Blocking I/O',
    definition: "FileChannel.map() asks the OS to map a file region directly into the process's virtual address space, so reads/writes become plain memory accesses instead of read()/write() syscalls, with the OS page cache handling actual disk I/O lazily.",
    whyItMatters: [
      'Worth it for large files accessed randomly or repeatedly (indexes, log-structured stores, Kafka-style segment files) — not worth the complexity for small files or purely sequential one-pass reads',
    ],
    remember: [
      'The map is backed by OS page cache; a page fault on first touch triggers the real disk read, which can surface as unpredictable latency spikes instead of a visible I/O call',
      "MappedByteBuffer has no reliable unmap/close — the mapping is released only on GC of the buffer object, which historically caused file-deletion-on-Windows and resource-leak problems (Java 21's FileChannel.MapMode with Arena-based mapping addresses this)",
      'Changes to a MappedByteBuffer.map(READ_WRITE) may not hit disk until the OS decides to flush, unless force() is called explicitly',
    ],
    interviewAngle: {
      q: 'When is a memory-mapped file the wrong tool even though it sounds faster?',
      a: "For small files or single sequential passes the syscall savings don't matter, but you still pay for page-fault unpredictability and the mapping lifecycle headache — a BufferedInputStream is simpler and just as fast in that case.",
    },
    related: ['bytebuffer-state-model'],
    readMinutes: 2,
  },
  {
    id: 'try-with-resources-io',
    title: 'try-with-resources for I/O Cleanup',
    group: 'Resource Management',
    definition: 'Streams, Readers/Writers, and Channels all implement Closeable/AutoCloseable, and try-with-resources guarantees close() runs even on exception, closing resources in reverse declaration order.',
    whyItMatters: [
      'A leaked FileInputStream or Socket eventually exhausts file descriptors process-wide — a resource leak in one code path can take down unrelated code paths sharing the same process',
    ],
    example: {
      code: {
        language: 'java',
        code: `try (var in = new FileInputStream(src);
     var out = new FileOutputStream(dst)) {
    in.transferTo(out);
} // out closed first, then in — reverse of declaration order`,
      },
    },
    remember: [
      "If both the try block and close() throw, the try block's exception is primary; close()'s exception is attached as a suppressed exception, not lost",
      'close() itself can throw — a naive manual finally-block close can mask the original exception by throwing over it; try-with-resources avoids that',
    ],
    interviewAngle: {
      q: 'What happens if the try block throws AND close() also throws?',
      a: "The try block's exception propagates as the primary one; the exception from close() is attached to it via addSuppressed() rather than replacing it, so nothing is silently lost.",
    },
    related: ['buffered-streams-syscalls'],
    readMinutes: 1,
  },
  {
    id: 'nio2-path-files-api',
    title: 'NIO.2: Path and Files (Java 7+)',
    group: 'NIO.2 File API',
    definition: 'java.nio.file.Path and the Files utility class replaced java.io.File with a filesystem-abstraction API that supports symbolic links, atomic move, directory streaming, and pluggable filesystems (e.g. zip-as-filesystem).',
    whyItMatters: [
      "Files.move with ATOMIC_MOVE gives an actual atomic rename guarantee that File.renameTo never promised (renameTo's success/failure and atomicity are platform-dependent and silently unreliable)",
    ],
    example: {
      code: {
        language: 'java',
        code: `Files.move(src, dst, StandardCopyOption.ATOMIC_MOVE);
try (var stream = Files.walk(root)) {
    stream.filter(Files::isRegularFile).forEach(System.out::println);
}`,
      },
    },
    remember: [
      'File.renameTo() returns a boolean and gives no reason on failure; Files.move() throws a specific exception (e.g. AtomicMoveNotSupportedException) and supports explicit options',
      'Files.walk() and Files.list() return lazy streams backed by an open directory handle — must be closed (try-with-resources) or the handle leaks',
      'Path is filesystem-pluggable — the same API works against a zip file opened as a FileSystem, not just the default OS filesystem',
    ],
    interviewAngle: {
      q: "Why prefer Files.move with ATOMIC_MOVE over File.renameTo for a 'write to temp file then publish' pattern?",
      a: "renameTo's atomicity and even its success signalling are platform-dependent and can fail silently; ATOMIC_MOVE either succeeds atomically or throws a specific exception, which is what a safe publish pattern actually needs.",
    },
    related: ['io-stream-vs-nio-model'],
    readMinutes: 2,
  },
  {
    id: 'virtual-threads-io-impact',
    title: 'Virtual Threads and the Blocking-I/O Tradeoff',
    group: 'Modern Java Context',
    definition: 'Virtual threads (Java 21+) make a blocking read/write cheap by unmounting the carrier platform thread while the I/O is pending, so blocking java.io/java.net code scales to huge connection counts without hand-rolled NIO reactor code.',
    whyItMatters: [
      "This doesn't obsolete NIO — Selector-based non-blocking I/O and virtual-thread-per-connection blocking I/O are converging solutions to the same C10K-style problem, and for new server code virtual threads now win on simplicity",
    ],
    remember: [
      'Virtual threads park/unpark at blocking calls in java.io/java.net/java.nio (channel-based) that are virtual-thread-aware — not all blocking calls unmount cleanly (e.g. some synchronized blocks around blocking I/O historically pinned the carrier thread)',
      'This is I/O-specific framing: the general virtual-threads model itself lives in the concurrency/modern-java material, not here',
      'Direct low-level Selector/ByteBuffer code is still relevant for building the frameworks (Netty, database drivers) underneath virtual-thread-friendly blocking APIs',
    ],
    interviewAngle: {
      q: "Does the arrival of virtual threads make learning NIO's Selector model pointless for a backend engineer?",
      a: 'No — it changes what most application code needs to write (blocking style now scales fine), but the reactor/selector model still underlies the frameworks and drivers that make that possible, and non-JVM-aware blocking calls can still pin a carrier thread.',
    },
    related: ['selector-reactor-pattern'],
    readMinutes: 2,
  },
]

const serializationConcepts: ConceptCard[] = [
  {
    id: 'serializable-mechanics',
    title: 'Serializable Is a Marker Interface',
    group: 'Mechanics',
    definition: "Implementing Serializable adds no methods — it's a flag telling the JVM's default serialization machinery that reflectively walking and writing this object's fields is allowed.",
    whyItMatters: [
      "Because there's no method to implement, the compiler can't catch a class that isn't actually safe to serialize (e.g. holds a Thread, Socket, or file handle) — it fails at runtime with NotSerializableException instead",
    ],
    remember: [
      "Every non-transient field's type must also be Serializable, recursively, or serialization throws at runtime, not compile time",
      'Static fields are never serialized — they belong to the class, not the instance',
    ],
    readMinutes: 2,
    related: ['serial-version-uid', 'transient-keyword'],
  },
  {
    id: 'serial-version-uid',
    title: 'serialVersionUID',
    group: 'Mechanics',
    definition: "A version stamp written into the serialized bytes and checked against the loading class's own value; if omitted, the compiler generates one from the class's structure (fields, methods, interfaces) that shifts whenever that structure changes.",
    whyItMatters: [
      'Without an explicit UID, an innocuous change like adding a method or reordering fields regenerates the computed value and breaks deserialization of anything persisted or cached under the old class shape — the failure is an InvalidClassException at runtime, often long after the change shipped',
    ],
    example: {
      code: {
        language: 'java',
        code: `public class Session implements Serializable {
    private static final long serialVersionUID = 1L;
    ...
}`,
      },
      note: 'Pinning the UID explicitly decouples compatibility from incidental class edits — you control when the version actually breaks.',
    },
    remember: [
      'Explicit UID: you decide when compatibility breaks. Omitted UID: the compiler decides, based on bytecode-derived hashing that varies across javac versions too',
      'Bumping it deliberately is the correct move when a change genuinely makes old data unreadable',
    ],
    interviewAngle: {
      q: 'Why is omitting serialVersionUID dangerous?',
      a: 'The generated UID is derived from class structure, so any structural change (even a harmless one) silently changes it and breaks deserialization of previously-persisted instances.',
    },
    readMinutes: 2,
    related: ['serializable-mechanics'],
  },
  {
    id: 'transient-keyword',
    title: 'transient Keyword',
    group: 'Mechanics',
    definition: "Marks a field to be skipped by default serialization — it's written as if it doesn't exist and comes back as the type's default value (null, 0, false) on deserialization.",
    whyItMatters: [
      "Used for fields that are either unsafe to serialize (sockets, threads, file handles), derivable from other state (caches, computed totals), or sensitive (raw passwords, unencrypted keys) that shouldn't cross a persistence boundary",
    ],
    remember: [
      "A transient field isn't automatically restored — if it's not recomputed in readObject or elsewhere, the object comes back with a null/0/false hole",
      "Doesn't apply to Externalizable, since that bypasses the default field-walking mechanism entirely",
    ],
    readMinutes: 1,
    related: ['custom-serialization'],
  },
  {
    id: 'custom-serialization',
    title: 'writeObject / readObject',
    group: 'Mechanics',
    definition: "A class can define private writeObject(ObjectOutputStream) and readObject(ObjectInputStream) methods that the JVM invokes via reflection instead of the default field-by-field dump, letting it control exactly what's written and how state is rebuilt.",
    whyItMatters: [
      'Lets you recompute transient fields on read, validate invariants before accepting untrusted bytes, or serialize a field in a custom compact form',
    ],
    example: {
      code: {
        language: 'java',
        code: `private void writeObject(ObjectOutputStream out) throws IOException {
    out.defaultWriteObject();
    out.writeInt(cache.size());
}

private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
    in.defaultReadObject();
    cache = rebuildCache(in.readInt());
}`,
      },
      note: "defaultWriteObject/defaultReadObject still handle the normal fields — these hooks add to that, they don't replace it unless you skip calling them.",
    },
    remember: [
      "These methods are called via reflection despite being private — the JVM's serialization framework has special access",
      "readObject is the natural place to re-validate an object's invariants, since deserialization is really just another constructor path that bypasses your normal ones",
    ],
    readMinutes: 2,
    related: ['deserialization-attack-surface', 'externalizable'],
  },
  {
    id: 'deserialization-attack-surface',
    title: 'Deserialization as an Attack Vector',
    group: 'Security',
    definition: 'readObject reconstructs objects (and transitively, their fields) purely from attacker-controlled bytes before any application logic runs, so a crafted stream can trigger arbitrary code execution via gadget chains in classes already on the classpath.',
    whyItMatters: [
      'Well-known libraries (Commons Collections, Spring, Groovy) have shipped classes whose readObject/equals/hashCode chains can be composed into remote code execution — this is why deserializing untrusted input with native Java serialization is treated as a critical vulnerability class, not a theoretical one',
    ],
    remember: [
      "The vulnerability isn't a bug in your class — it's in transitively reachable classes on the classpath that you don't control, which is what makes it so hard to fully close off",
      'Mitigations: ObjectInputFilter (JEP 290, Java 9+) allowlisting acceptable classes, avoiding native serialization for untrusted input entirely, or using look-ahead deserialization',
    ],
    interviewAngle: {
      q: 'Why do many teams ban java.io.Serializable for anything touching untrusted input?',
      a: 'Deserialization runs before validation logic — a crafted byte stream can chain together classes already on the classpath into remote code execution, independent of any bug in your own code.',
    },
    diagram: `flowchart LR
  A[Attacker bytes] --> B[readObject]
  B --> C[Gadget chain]
  C --> D[Arbitrary code]`,
    readMinutes: 2,
    related: ['custom-serialization', 'json-replaces-native'],
  },
  {
    id: 'externalizable',
    title: 'Externalizable vs Serializable',
    group: 'Mechanics',
    definition: "Externalizable hands full control to writeExternal/readExternal (both public) with no default field-walking at all, versus Serializable's reflective default plus optional writeObject/readObject hooks.",
    whyItMatters: [
      'No reflection-driven field dump means smaller output and faster serialization for hot paths, at the cost of writing every field by hand and manually keeping read/write order in sync',
    ],
    remember: [
      'Externalizable requires a public no-arg constructor — the JVM calls it before readExternal populates state, unlike Serializable which can bypass constructors entirely via reflection',
      'Rarely chosen today; mentioned mainly as a performance-oriented alternative when native serialization is unavoidable',
    ],
    readMinutes: 1,
    related: ['custom-serialization', 'serialization-performance'],
  },
  {
    id: 'json-replaces-native',
    title: 'Why JSON/Protobuf Displaced Native Serialization',
    group: 'Modern Context',
    definition: 'Cross-language interoperability, human-readable debugging, schema evolution without brittle UID matching, and immunity to gadget-chain deserialization attacks made JSON and Protobuf/Avro the default choice for service boundaries, leaving native serialization mostly to same-JVM or same-cluster use.',
    whyItMatters: [
      'Native serialization ties both ends to the exact same class bytecode shape (or a carefully matched serialVersionUID), which breaks down the moment services are deployed independently or written in another language',
    ],
    remember: [
      'Native serialization still turns up where both ends are trusted, same-version JVMs: Hazelcast/Ehcache distributed caches, servlet container session replication, and legacy RMI',
      "Protobuf/Avro add compact binary encoding plus explicit schema evolution rules — a middle ground JSON doesn't give you",
    ],
    readMinutes: 2,
    related: ['deserialization-attack-surface', 'serialization-performance'],
  },
  {
    id: 'records-serialization',
    title: 'Records and Serialization',
    group: 'Modern Context',
    definition: 'A record can implement Serializable, but it deserializes through its canonical constructor rather than field-by-field reflection, so constructor validation always runs even on deserialized data.',
    whyItMatters: [
      "This closes a classic exploit class where readObject bypassed constructor invariant checks — a record's compact constructor can't be skipped, so a crafted byte stream can't produce an object that violates its own validation logic",
    ],
    remember: [
      'writeObject/readObject/readObjectNoData customization is disallowed for records — the format is fixed to (component values) through the canonical constructor',
      "serialVersionUID still applies the same way; records aren't exempt from that pitfall",
    ],
    readMinutes: 1,
    related: ['custom-serialization', 'deserialization-attack-surface'],
  },
  {
    id: 'serialization-performance',
    title: 'Serialization Performance Cost',
    group: 'Modern Context',
    definition: 'Default Java serialization is reflection-heavy and writes verbose per-object metadata (class descriptors, field names, type info) on first occurrence of each class, making it slower and larger on the wire than hand-rolled or schema-based binary formats.',
    whyItMatters: [
      "The class descriptor overhead means many small objects serialize far worse than one large object — a real cost in high-throughput caching or messaging paths, and part of why teams profile before assuming native serialization is 'good enough'",
    ],
    remember: [
      'Externalizable and hand-written writeObject can cut both size and CPU cost meaningfully versus default reflection-based serialization',
      'This cost, not just security, is a reason distributed systems moved to Protobuf/Kryo/Avro for hot paths',
    ],
    readMinutes: 1,
    related: ['externalizable', 'json-replaces-native'],
  },
]

const reflectionConcepts: ConceptCard[] = [
  {
    id: 'class-introspection',
    title: 'Class/Method/Field Introspection',
    group: 'Reflection Mechanics',
    definition: 'Every loaded type has a runtime Class object that exposes its constructors, methods, fields, and annotations for programmatic inspection via java.lang.reflect.',
    whyItMatters: [
      'This is the entry point every framework uses to discover "what does this bean/entity/test class look like" without the developer writing any wiring code',
    ],
    example: {
      code: {
        language: 'java',
        code: `Class<?> clazz = Class.forName("com.app.UserService");
Method[] methods = clazz.getDeclaredMethods();
Field field = clazz.getDeclaredField("repository");`,
      },
    },
    remember: [
      'getMethods() returns only public members (including inherited); getDeclaredMethods() returns all members declared on that exact class, including private, but not inherited ones',
      'Class.forName triggers static initialization by default; getting a Class reference via .class does not',
    ],
    interviewAngle: {
      q: 'Why does getDeclaredFields() not return inherited fields?',
      a: "Because it reflects only what's declared directly on that class's bytecode — walking a superclass chain with getSuperclass() is the caller's job, which is exactly what frameworks like Jackson do to serialize inherited properties.",
    },
    readMinutes: 2,
  },
  {
    id: 'reflective-invocation',
    title: 'Invoking Methods Reflectively',
    group: 'Reflection Mechanics',
    definition: 'Method.invoke() and Field.get/set() call code by passing the target object and boxed arguments as an Object[], bypassing normal static method resolution.',
    example: {
      code: {
        language: 'java',
        code: `Method m = clazz.getDeclaredMethod("save", User.class);
m.setAccessible(true);
Object result = m.invoke(serviceInstance, someUser);`,
      },
    },
    remember: [
      'invoke() wraps any exception the target method throws in an InvocationTargetException — you must unwrap getCause() to see the real error, a common debugging trap',
      'Primitive arguments get autoboxed, and Method.invoke does dynamic dispatch on the runtime type of the target object, same as a normal virtual call',
    ],
    related: ['reflection-performance-cost', 'class-introspection'],
    readMinutes: 2,
  },
  {
    id: 'reflection-performance-cost',
    title: 'The Performance Cost of Reflection',
    group: 'Cost & Optimization',
    definition: "Reflective calls are slower than direct calls because the JIT can't inline them, argument arrays force boxing/unboxing, and each call pays access-check and lookup overhead unless that overhead is cached.",
    whyItMatters: [
      'The lookup (getMethod/getDeclaredField) is the expensive part, not the invoke itself — so every serious framework resolves a Method/Field/Constructor once and caches it, rather than re-resolving it on every request',
    ],
    remember: [
      'setAccessible(true) also disables the per-call access check, which itself is a meaningful speedup — frameworks do this once at cache-build time, not per call',
      'Modern JVMs generate a lightweight bytecode accessor after ~15 invocations (inflation), closing much of the gap after warmup — but the first calls and any one-off reflective code stay slow',
    ],
    interviewAngle: {
      q: 'If reflection is slow, why does Spring feel fast at runtime?',
      a: 'Because Spring resolves all the Method/Field/Constructor objects it needs once during context startup (or ahead-of-time in a AOT/native-image build) and caches them — the per-request cost is a cached invoke, not a fresh lookup.',
    },
    readMinutes: 2,
  },
  {
    id: 'setaccessible-encapsulation',
    title: 'setAccessible() and Breaking Encapsulation',
    group: 'Encapsulation & the Module System',
    definition: 'setAccessible(true) tells the JVM to skip Java-language access checks (private/protected) for a specific reflected member, letting caller code read, write, or invoke it anyway.',
    whyItMatters: [
      'This is how ORMs like Hibernate populate private fields directly without requiring public setters, and how test frameworks reach into private state — but it means "private" is only a compile-time guarantee, not a runtime one',
    ],
    remember: [
      "setAccessible() can throw InaccessibleObjectException on Java 9+ if the target's module doesn't explicitly open that package to the caller's module",
      "It's a security-sensitive call — a SecurityManager (when one was in use) could deny it; frameworks that need broad access historically requested wide permissions",
    ],
    related: ['strong-encapsulation-jpms'],
    readMinutes: 2,
  },
  {
    id: 'strong-encapsulation-jpms',
    title: 'Strong Encapsulation (JPMS, Java 9+)',
    group: 'Encapsulation & the Module System',
    definition: "The module system (JPMS) by default hides a module's non-exported packages from reflection entirely, and even exported packages block deep reflection (setAccessible into private members) unless the module explicitly 'opens' that package.",
    whyItMatters: [
      'This broke reflection-heavy frameworks (Spring, Hibernate, Mockito) on early Java 9 upgrades until they added --add-opens flags or module-info opens directives — a real migration pain point that\'s a common "have you hit this" interview probe',
    ],
    example: {
      code: {
        language: 'java',
        code: `module com.app {
  opens com.app.model to org.hibernate.orm.core;
}`,
      },
    },
    remember: [
      "exports allows normal compile-time/public access; opens additionally allows deep reflection (setAccessible) at runtime — they're separate grants",
      "Unnamed/classpath modules (the default when you don't use module-info.java) stay in weaker legacy-reflection mode, which is why most Spring apps never notice this unless they adopt JPMS explicitly",
    ],
    interviewAngle: {
      q: 'Why did upgrading a reflection-heavy app to Java 9+ sometimes break at runtime with no compile errors?',
      a: 'Because strong encapsulation is enforced at runtime, not compile time — code that reflectively accessed private members of another module compiled fine but threw InaccessibleObjectException the first time it actually ran, until --add-opens was added.',
    },
    readMinutes: 3,
  },
  {
    id: 'annotation-retention',
    title: 'Annotation Retention Policies',
    group: 'Annotations',
    definition: '@Retention controls how long an annotation survives: SOURCE (discarded by the compiler), CLASS (kept in bytecode but not loaded by the JVM at runtime, the default), or RUNTIME (kept and queryable via reflection).',
    whyItMatters: [
      'Any annotation a framework reads with reflection — @Autowired, @Transactional, @Test — must be RUNTIME-retained, or getAnnotation() simply returns null with no error, a classic silent-failure bug when writing a custom annotation',
    ],
    example: {
      code: {
        language: 'java',
        code: `@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Loggable {}`,
      },
    },
    remember: [
      "SOURCE is for compiler-only tools (e.g. @Override, Lombok's own markers); CLASS is the default and rarely what you want since almost nothing reads it; RUNTIME is required for anything reflection-based",
    ],
    related: ['apt-vs-runtime-reflection'],
    readMinutes: 2,
  },
  {
    id: 'apt-vs-runtime-reflection',
    title: 'Annotation Processing (APT) vs Runtime Reflection',
    group: 'Annotations',
    definition: "APT (javax.annotation.processing) runs during compilation and generates new source/bytecode from annotations; runtime reflection reads annotations and structure after the class is already loaded — they're two unrelated mechanisms that happen to both start with '@'.",
    whyItMatters: [
      'Lombok and MapStruct use APT to generate real code at compile time (zero runtime cost, but the generated code is what actually runs); Spring and Hibernate use RUNTIME-retained annotations read reflectively at startup or per-call (runtime cost, but no build-step code generation needed)',
    ],
    remember: [
      "A CLASS or SOURCE-retained annotation can still be read by an annotation processor at compile time — processors work at the source/bytecode level, so they don't need RUNTIME retention at all",
      "Confusing the two is a common mistake: adding @Retention(RUNTIME) to an annotation meant only for an APT processor doesn't break anything, but it's pointless bytecode bloat",
    ],
    diagram: `flowchart LR
  A[Source annotations] -->|compile time| B[APT generates code]
  A -->|kept if RUNTIME| C[Bytecode]
  C -->|reflection at runtime| D[Framework reads it]`,
    interviewAngle: {
      q: "Why is Lombok's @Getter effectively free at runtime while Spring's @Autowired isn't?",
      a: "Lombok is an annotation processor: it generates a real getter method into the .class file at compile time, so at runtime it's just a normal method call. @Autowired is read reflectively by Spring's container at startup — there's real reflection cost, just paid once during context initialization instead of per call.",
    },
    readMinutes: 3,
  },
  {
    id: 'di-reflection-under-hood',
    title: 'How DI Frameworks Use Reflection',
    group: 'Framework Internals',
    definition: 'A DI container scans classpath classes for RUNTIME-retained markers (like @Component), reflectively locates a constructor or setter/field to inject into, resolves matching beans, and calls that constructor/setter/field reflectively to wire the object graph.',
    whyItMatters: [
      'This is literally what "the container instantiates your beans" means mechanically — Class.forName + getDeclaredConstructors + Constructor.newInstance + Field.set, all cached after the first resolution per bean definition',
    ],
    remember: [
      "Constructor injection uses Constructor.newInstance(resolvedArgs); field injection uses setAccessible(true) + Field.set on an already-constructed instance — which is one reason constructor injection is considered cleaner: it doesn't need to break encapsulation on an already-live object",
      'Component scanning itself is reflection over the classpath (walking packages, loading each Class, checking annotations) — this is a real chunk of Spring Boot startup time, which is why AOT/native-image builds try to do it ahead of time instead',
    ],
    related: ['reflective-invocation', 'dynamic-proxies'],
    readMinutes: 2,
  },
  {
    id: 'dynamic-proxies',
    title: 'Dynamic Proxies (Proxy.newProxyInstance)',
    group: 'Framework Internals',
    definition: 'java.lang.reflect.Proxy generates a class implementing a given set of interfaces entirely at runtime, routing every method call through a single InvocationHandler you supply — no source or .class file for the proxy ever exists on disk.',
    example: {
      code: {
        language: 'java',
        code: `UserRepo proxy = (UserRepo) Proxy.newProxyInstance(
  loader, new Class[]{UserRepo.class}, (target, method, args) -> {
    System.out.println("before " + method.getName());
    return method.invoke(realRepo, args);
  });`,
      },
    },
    whyItMatters: [
      "This is the actual mechanism behind Spring's interface-based AOP (@Transactional, @Cacheable when proxying an interface-typed bean): the proxy intercepts the call, runs advice, then delegates to the real target via reflection",
    ],
    remember: [
      'JDK dynamic proxies only work through interfaces, since the generated class implements them; proxying a concrete class with no interface requires bytecode generation (CGLIB, which Spring falls back to) instead of java.lang.reflect.Proxy',
      "Every call through the proxy pays an extra reflective invoke() plus the InvocationHandler's own logic, which is part of why @Transactional on a self-invoked method (a.b() calling a.c() within the same class) doesn't trigger the proxy — the call never leaves the object to go through it",
    ],
    diagram: `flowchart LR
  A[Caller] --> B[Dynamic Proxy]
  B --> C[InvocationHandler]
  C --> D[Real Target]`,
    interviewAngle: {
      q: 'Why does calling a @Transactional method from another method in the same class silently skip the transaction?',
      a: 'Because Spring AOP works by wrapping the bean in a proxy that intercepts calls arriving from outside the object — an internal this.method() call never passes through the proxy, so the advice (starting a transaction) never runs.',
    },
    related: ['di-reflection-under-hood'],
    readMinutes: 3,
  },
]

const designPatternsConcepts: ConceptCard[] = [
  {
    id: 'singleton-thread-safe-lazy-init',
    title: 'Singleton: Thread-Safe Lazy Init',
    group: 'Singleton',
    definition: 'Double-checked locking (DCL) lets a Singleton lazily initialize without synchronizing every call, but only works correctly if the instance field is declared volatile.',
    whyItMatters: [
      "Without volatile, the JIT/JMM can reorder the constructor's writes after the reference assignment, so another thread can observe a non-null but partially-constructed object",
      'volatile inserts the happens-before edge that makes the publish safe',
    ],
    example: {
      code: {
        language: 'java',
        code: `public class Config {
    private static volatile Config instance;

    public static Config getInstance() {
        if (instance == null) {
            synchronized (Config.class) {
                if (instance == null) {
                    instance = new Config();
                }
            }
        }
        return instance;
    }
}`,
      },
      note: 'Both null checks are required: the outer one avoids locking on every call, the inner one avoids a second thread re-constructing after acquiring the lock.',
    },
    remember: [
      'Missing volatile is the classic broken-DCL bug — compiles fine, fails intermittently under real concurrency',
      'The initialization-on-demand holder idiom (a static nested class) gets lazy thread-safe init for free via classloader guarantees, no volatile needed',
      "Simplest correct option when laziness isn't required: eager static final field",
    ],
    interviewAngle: {
      q: 'Why does DCL Singleton need volatile?',
      a: "Without it, a reader thread can see a non-null reference to an object whose constructor hasn't finished writing its fields, because the JMM permits reordering the object's internal writes past the reference publish.",
    },
    related: ['singleton-enum', 'singleton-testability'],
    readMinutes: 2,
  },
  {
    id: 'singleton-enum',
    title: 'Enum Singleton',
    group: 'Singleton',
    definition: "Declaring a single-element enum is Effective Java's recommended Singleton implementation: the JVM guarantees exactly one instance, thread-safe construction, and serialization safety for free.",
    whyItMatters: [
      'A regular class Singleton can be broken by reflection (calling a private constructor) or by naive custom serialization creating a second instance on deserialize — enum is immune to both',
    ],
    example: {
      code: {
        language: 'java',
        code: `public enum ConnectionPool {
    INSTANCE;

    public Connection borrow() { /* ... */ return null; }
}`,
      },
    },
    remember: [
      'Class-loading itself is thread-safe by JLS spec, so enum init needs no explicit synchronization',
      "Can't extend a class (enums can't have a superclass other than Enum), which is the usual objection to using it",
    ],
    related: ['singleton-thread-safe-lazy-init'],
    readMinutes: 1,
  },
  {
    id: 'singleton-testability',
    title: 'Singleton as an Anti-Pattern',
    group: 'Singleton',
    definition: 'Singleton is often criticized less for thread-safety and more because it hardcodes a single global access point, which hides a dependency and makes substitution for tests impossible.',
    whyItMatters: [
      "getInstance() called deep inside a method is an invisible dependency — it doesn't show up in the constructor or method signature, so callers and tests can't see or override it",
      'Global mutable state shared across a test suite causes order-dependent test failures unless every test resets it',
    ],
    remember: [
      "The fix usually isn't 'stop using Singletons', it's 'let a DI container manage the single instance and inject it' — same one-instance guarantee, but the dependency is now visible and swappable",
      "'Singleton' the pattern (enforced by the class itself, via a private constructor) and 'singleton scope' (enforced by a container, e.g. a Spring bean) solve the same problem — the container approach keeps testability",
    ],
    interviewAngle: {
      q: "What's actually wrong with Singleton?",
      a: "Not thread-safety — it's that getInstance() is an invisible, hardcoded dependency that can't be mocked or swapped in a test, unlike a constructor-injected collaborator.",
    },
    related: ['singleton-thread-safe-lazy-init', 'dependency-injection-principle'],
    readMinutes: 2,
  },
  {
    id: 'builder-vs-telescoping',
    title: 'Builder vs Telescoping Constructors',
    group: 'Builder',
    definition: 'Builder trades telescoping constructor overloads (or error-prone all-args calls) for a fluent, named, order-independent way to assemble an object with many optional fields.',
    whyItMatters: [
      'A constructor with 6+ params, several optional, forces callers to either write an overload for every combination (telescoping) or pass positional nulls/defaults that are easy to swap by mistake',
    ],
    example: {
      code: {
        language: 'java',
        code: `HttpRequest req = HttpRequest.builder()
    .url("/users")
    .method("POST")
    .timeoutMs(500)
    .build();`,
      },
    },
    remember: [
      'Real payoff is when there are several optional fields with sane defaults, not just many required ones',
      "A mutable Builder itself should never be shared across threads — it's a single-use scratchpad, discard it after build()",
    ],
    related: ['builder-vs-records'],
    readMinutes: 2,
  },
  {
    id: 'builder-vs-records',
    title: 'Builder vs Records for Simple Cases',
    group: 'Builder',
    definition: "For a small, mostly-required-field value object, a Java record's canonical constructor is simpler and just as safe as a Builder — Builder only earns its ceremony once there are several optional/defaulted fields or validation that benefits from staged assembly.",
    whyItMatters: [
      'A record with 3-4 required fields and a compact constructor for validation gives immutability and equals/hashCode/toString for free, with none of the Builder boilerplate',
      'Adding a Builder over a record (or a static factory that returns one) is fine once optional fields multiply — the record stays the immutable target type, Builder is just the assembly step',
    ],
    remember: [
      'Rule of thumb: reach for record first; add a Builder only when the constructor call site becomes ambiguous or option-heavy, not by default',
      "Lombok's @Builder became less necessary post-records for the simple-object case, but is still common for classes with many optional fields where a record's fixed component list doesn't fit",
    ],
    interviewAngle: {
      q: 'When does Builder still earn its complexity over a record?',
      a: 'When there are several optional fields with different defaults, or when construction needs staged/conditional logic — a record forces every field into one fixed constructor call, which gets unreadable past a handful of optional params.',
    },
    related: ['builder-vs-telescoping'],
    readMinutes: 2,
  },
  {
    id: 'factory-method-vs-abstract-factory',
    title: 'Factory Method vs Abstract Factory',
    group: 'Factory',
    definition: 'Factory Method is a single overridable creation method for one product type; Abstract Factory is an interface bundling several related Factory Methods so a caller gets a consistent family of products without knowing the concrete family.',
    whyItMatters: [
      "The two are often confused because both hide 'new' behind a method — the distinguishing question is whether you're creating one product (Factory Method) or a coordinated set of related products (Abstract Factory)",
    ],
    example: {
      code: {
        language: 'java',
        code: `interface UIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

class DarkUIFactory implements UIFactory {
    public Button createButton() { return new DarkButton(); }
    public Checkbox createCheckbox() { return new DarkCheckbox(); }
}`,
      },
      note: 'UIFactory is the Abstract Factory; each create method inside it is a Factory Method.',
    },
    remember: [
      'Factory Method usually lives as an overridable method on a base/abstract class (subclasses decide the concrete type)',
      'Abstract Factory usually lives as a standalone interface with multiple creation methods, implemented per product family',
      'Both exist to let calling code depend on an interface/abstraction, not a concrete constructor call',
    ],
    interviewAngle: {
      q: 'How do you tell Factory Method and Abstract Factory apart in review?',
      a: 'Count the products: one overridable creation method for one product type is Factory Method; an interface exposing several creation methods that must stay consistent with each other (same theme/family) is Abstract Factory.',
    },
    readMinutes: 2,
  },
  {
    id: 'strategy-vs-lambdas',
    title: 'Strategy Pattern via Lambdas',
    group: 'Strategy & Behavior',
    definition: "Strategy — swapping an algorithm's implementation behind a common interface — used to require a class hierarchy per strategy; a functional interface plus a lambda or method reference gives the same swap with none of the boilerplate.",
    whyItMatters: [
      'Pre-Java-8, each strategy meant a named class implementing an interface, often just to wrap one method — noisy for something conceptually this small',
      'Comparator, Runnable, and Function are just Strategy interfaces the JDK already ships',
    ],
    example: {
      code: {
        language: 'java',
        code: `interface PricingStrategy { BigDecimal price(Order o); }

PricingStrategy bulk = order -> order.total().multiply(DISCOUNT);
PricingStrategy standard = Order::total;`,
      },
    },
    remember: [
      'Keep the strategy as a named class (not a lambda) when it needs its own state, multiple methods, or is complex enough to warrant unit tests on its own — lambdas fit stateless, single-method swaps',
      "This is the pattern most visibly 'absorbed' into the language post-Java-8 — interviewers probe whether you still reach for a class hierarchy out of habit",
    ],
    interviewAngle: {
      q: "Is Strategy still a pattern you'd implement with a class hierarchy in modern Java?",
      a: 'Only if a strategy needs its own state or multiple related methods — a stateless single-method strategy is just a functional interface plus a lambda now.',
    },
    readMinutes: 2,
  },
  {
    id: 'observer-event-driven',
    title: 'Observer Pattern & Event-Driven Systems',
    group: 'Strategy & Behavior',
    definition: "Observer — subjects notifying registered listeners of state changes — is the in-process ancestor of today's event-driven architectures (application events, message brokers, reactive streams).",
    whyItMatters: [
      "Spring's ApplicationEventPublisher/@EventListener, JavaFX listeners, and pub/sub message brokers are all Observer at different scales — in-process synchronous, in-process async, or cross-process",
    ],
    example: {
      code: {
        language: 'java',
        code: `interface OrderListener { void onPlaced(Order o); }

class OrderService {
    private final List<OrderListener> listeners = new ArrayList<>();
    void place(Order o) {
        listeners.forEach(l -> l.onPlaced(o));
    }
}`,
      },
    },
    remember: [
      'Naive in-process Observer notifies synchronously on the calling thread — a slow or throwing listener blocks or breaks the publisher unless you decouple with an executor or event bus',
      'Watch for listener leaks: observers that register but never unregister keep the subject reachable and prevent GC of the observer',
    ],
    interviewAngle: {
      q: 'What breaks a naive synchronous Observer implementation at scale?',
      a: "One slow or exception-throwing listener stalls or crashes the whole publish call because listeners run inline on the publisher's thread — production systems decouple via an async event bus or message queue instead.",
    },
    readMinutes: 2,
  },
  {
    id: 'decorator-vs-proxy',
    title: 'Decorator vs Proxy',
    group: 'Structural Wrapping',
    definition: 'Both wrap an object behind the same interface, but Decorator adds new behavior/responsibility to every call, while Proxy controls access to the wrapped object (lazy loading, security, remoting) without changing what the call means.',
    whyItMatters: [
      "Confusing the two in review misses the actual design question: 'am I adding capability' (Decorator) vs 'am I gatekeeping/mediating access' (Proxy)",
    ],
    example: {
      code: {
        language: 'java',
        code: `InputStream in = new BufferedInputStream(new FileInputStream(f)); // Decorator: adds buffering

UserService svc = (UserService) Proxy.newProxyInstance(
    loader, interfaces, (p, m, args) -> { checkAuth(); return m.invoke(real, args); }); // Proxy: gatekeeps access`,
      },
    },
    remember: [
      'Java I/O streams (BufferedInputStream wrapping FileInputStream) are the textbook Decorator chain',
      "Spring's @Transactional/@Cacheable proxies and JDK dynamic proxies are Proxy — they intercept calls to add cross-cutting behavior around access, not to compose new domain behavior",
      'Structurally near-identical (both implement the same interface as the wrapped object and delegate) — the distinguishing question is intent: adding behavior vs controlling access',
    ],
    interviewAngle: {
      q: 'Structurally Decorator and Proxy look the same — how do you tell them apart in a design discussion?',
      a: 'By intent, not structure: Decorator stacks additional responsibilities onto every call (buffering, compression); Proxy mediates access to the same call without changing its meaning (lazy init, auth, remoting).',
    },
    readMinutes: 2,
  },
  {
    id: 'dependency-injection-principle',
    title: 'Dependency Injection as a General Principle',
    group: 'Dependency Injection',
    definition: 'DI is Inversion of Control applied to object wiring: a class declares what it needs (via constructor/setter) instead of constructing or looking up its own collaborators, and something external supplies them.',
    whyItMatters: [
      "The pattern predates and doesn't require any framework — manually passing collaborators into a constructor from main() is DI; Spring/Guice/Dagger just automate the wiring at scale",
      'Because dependencies are declared, not looked up, any collaborator can be swapped for a test double without touching the class under test',
    ],
    example: {
      code: {
        language: 'java',
        code: `class OrderService {
    private final PaymentGateway gateway; // declared, not constructed here

    OrderService(PaymentGateway gateway) {
        this.gateway = gateway;
    }
}`,
      },
    },
    remember: [
      "DI is the fix for the Singleton-as-anti-pattern problem: same 'one instance shared everywhere' outcome, but the dependency is visible in the constructor and swappable in tests",
      'Constructor injection over field/setter injection is the senior default — it makes required dependencies impossible to construct in an incomplete state and keeps the class usable without the framework',
    ],
    interviewAngle: {
      q: 'Is Dependency Injection a Spring concept?',
      a: "No — it's Inversion of Control applied to object wiring, older than Spring; Spring/Guice/Dagger are just automated containers for a principle you can (and interviewers expect you to be able to) apply by hand.",
    },
    related: ['singleton-testability'],
    readMinutes: 2,
    diagram: `flowchart LR
  Client --> Interface
  Container -->|injects| Interface
  Interface --> Implementation`,
  },
]

const advancedInternalsConcepts: ConceptCard[] = [
  {
    id: 'bytecode-basics',
    title: 'Reading Bytecode: Why It Explains Weird Behavior',
    group: 'Bytecode',
    definition: 'javac compiles Java source to a stack-based bytecode instruction set (in .class files) that says nothing about the source-level constructs (loops, switch, autoboxing) used to produce it — only what the JVM actually executes.',
    whyItMatters: [
      "Source-level reasoning ('this should be one operation') can be wrong — a single line can desugar to several allocations or method calls, which is exactly the class of bug javap -c exposes in seconds",
      "javap -c ClassName is the fastest way to confirm whether a compiler optimization actually happened, or whether autoboxing/string concatenation snuck in an allocation you didn't intend",
    ],
    example: {
      code: {
        language: 'java',
        code: `String s = "a" + "b" + i;
// javap -c shows: constant folding for the literal part,
// but a StringBuilder chain once a variable is involved`,
      },
      note: 'The compiler folds "a"+"b" into one constant at compile time but can\'t fold in i — that part becomes runtime StringBuilder calls',
    },
    remember: [
      'javap -c <class> disassembles compiled bytecode without needing source',
      'Bytecode is stack-based: values get pushed/popped, not stored in named registers like x86',
      'Constant expressions of literals get folded at compile time; anything involving a variable does not',
    ],
    interviewAngle: {
      q: 'Why would you ever read bytecode in a normal debugging session?',
      a: "To settle disputes source can't answer — did this loop really get unrolled, is this string concat allocating, did this get inlined — without guessing from behavior alone",
    },
    related: ['string-switch-internals', 'autoboxing-integer-cache', 'varargs-array-allocation'],
    readMinutes: 2,
  },
  {
    id: 'method-inlining',
    title: 'Method Inlining: Why Small Methods Are Free',
    group: 'JIT Optimizations',
    definition: 'The JIT can replace a call to a small, hot, non-megamorphic method with its body directly at the call site, eliminating call overhead and — critically — opening the door to further optimizations (escape analysis, dead code elimination) that only work within a single compiled unit.',
    whyItMatters: [
      "Inlining is the optimization that enables most other optimizations — a getter call that doesn't get inlined blocks escape analysis on the object it returns, so 'just add a getter' isn't always free the way it looks",
      'Megamorphic call sites (3+ different implementations seen at one call site) defeat inlining, which is one real, measurable cost of over-using interfaces/polymorphism on ultra-hot paths',
    ],
    remember: [
      "Bytecode size caps inlining eligibility (-XX:MaxInlineSize, -XX:FreqInlineSize) — very large 'small' methods can silently fall outside the default threshold",
      "Virtual/interface calls can still be inlined via 'inline caching' when the JIT observes only one or two actual implementations at that call site historically",
      '-XX:+PrintInlining (with -XX:+UnlockDiagnosticVMOptions) shows real inlining decisions per call site',
    ],
    interviewAngle: {
      q: 'Why does wrapping a hot field access in a trivial getter method not cost anything at runtime?',
      a: "The JIT inlines small hot methods, replacing the call with the field access itself — after inlining there's no call overhead, and the inlined code becomes eligible for further optimizations like escape analysis",
    },
    readMinutes: 2,
  },
  {
    id: 'string-switch-internals',
    title: 'String switch: Hash-Then-Equals Under the Hood',
    group: 'Language Desugaring',
    definition: 'A switch on a String is compiled to two nested switches on int — the first switches on hashCode() to jump to a candidate label, the second confirms with equals() to guard against hash collisions — the JVM never had native support for String switching.',
    whyItMatters: [
      "Explains a real gotcha: two case labels with colliding hashCode()s don't misbehave (equals() still disambiguates), but understanding this is what separates 'I memorized it works' from 'I know why it's still correct despite collisions'",
      "It's a good worked example of javac doing meaningful desugaring work — the same lesson applies to enhanced-for, try-with-resources, and autoboxing",
    ],
    example: {
      code: {
        language: 'java',
        code: `switch (s) {
  case "a": ...
  case "b": ...
}
// desugars roughly to:
switch (s.hashCode()) {
  case 97: if (s.equals("a")) { ... } break;
  case 98: if (s.equals("b")) { ... } break;
}`,
      },
      note: 'The equals() guard is what makes hash collisions safe, not just fast',
    },
    remember: [
      'Two-stage: hashCode() dispatch first, equals() confirmation second — a collision falls through to the next candidate or the default, it never picks the wrong branch',
      'javap -c on a compiled String-switch method is the fastest way to see this directly',
    ],
    interviewAngle: {
      q: 'Since the JVM has no bytecode instruction for switching on String, how does a String switch actually work?',
      a: 'javac desugars it into a hashCode()-based int switch to jump to a candidate case, followed by an equals() check to confirm — so hash collisions between case labels are handled safely, just not optimally',
    },
    related: ['bytecode-basics'],
    readMinutes: 2,
  },
  {
    id: 'autoboxing-integer-cache',
    title: 'Autoboxing and the Integer Cache (-128 to 127)',
    group: 'Language Desugaring',
    definition: 'Autoboxing of int literals in the range -128 to 127 (and similarly for Byte, Short, Long, Character within their small ranges) returns a cached, shared instance via valueOf(), so == comparisons on boxed values in that range accidentally succeed while identical code just outside it fails.',
    whyItMatters: [
      "This is one of the most common real production bugs: code that works in dev/test with small sample values ('it always passed with ==!') breaks in production once values exceed 127, because it silently stopped hitting the cache",
      "new Integer(x) (deprecated since Java 9) always bypasses the cache and allocates a fresh object even inside the cached range — a useful fact for explaining why some code 'defeats' the cache on purpose or by accident",
    ],
    example: {
      code: {
        language: 'java',
        code: `Integer a = 127, b = 127;
System.out.println(a == b); // true, cached
Integer c = 128, d = 128;
System.out.println(c == d); // false, not cached`,
      },
      note: 'This is exactly why == on boxed types is a correctness bug waiting to happen — equals() is the only safe comparison',
    },
    remember: [
      "Cache range is fixed at -128..127 for Integer; -XX:AutoBoxCacheMax can raise the upper bound on some JVMs but code shouldn't rely on that",
      'Applies to Byte, Short, Long (same -128..127), Character (0..127), and Boolean — not to Float/Double, which never cache',
      'Autoboxing happens via valueOf(), unboxing via .intValue()/etc — both inserted invisibly by javac, and unboxing a null throws NullPointerException',
    ],
    interviewAngle: {
      q: 'Why does Integer a = 100; Integer b = 100; a == b print true, but the same code with 200 prints false?',
      a: 'Autoboxing routes through Integer.valueOf(), which returns a shared cached instance for values -128..127 and a freshly allocated object outside that range — == is comparing object identity, so it silently changes behavior at the cache boundary',
    },
    related: ['varargs-array-allocation', 'bytecode-basics'],
    readMinutes: 2,
  },
  {
    id: 'varargs-array-allocation',
    title: 'Varargs: Hidden Array Allocation Per Call',
    group: 'Language Desugaring',
    definition: "A varargs parameter (T... args) is just sugar for a T[] parameter — every call site that doesn't already pass an array allocates a new array to hold the arguments, invisibly, on every invocation.",
    whyItMatters: [
      'A hot-path logging call or String.format() using varargs allocates a fresh array (and boxes any primitives) on every call — invisible in source, real in a profiler, and a legitimate reason some hot-path APIs offer non-varargs overloads',
      'Mixing varargs with overload resolution has real gotchas: an exact-arity non-varargs overload is always preferred over the varargs one, which can silently change which method runs after a refactor',
    ],
    example: {
      code: {
        language: 'java',
        code: `void log(String fmt, Object... args) { ... }
log("x={}", x); // compiles to: log("x={}", new Object[]{x})`,
      },
      note: 'The array literal and any autoboxing of primitive args are both inserted by the compiler, invisibly',
    },
    remember: [
      'Every varargs call site allocates unless the caller already passes an array (or, for zero args, some JITs can elide it after inlining/escape analysis)',
      'Overload resolution phase order: exact match, then widening, then varargs last — varargs is always the least-preferred applicable overload',
      'Passing a primitive array to an Object... parameter passes the whole array as one element, not as spread arguments — a classic gotcha with int[] vs Integer...',
    ],
    interviewAngle: {
      q: 'Is a varargs method call free of extra allocation in Java?',
      a: 'No — unless the caller already passes an array, every varargs call site allocates a new backing array (and boxes any primitives), which matters on a hot path even though nothing in the source looks like an allocation',
    },
    related: ['autoboxing-integer-cache', 'bytecode-basics'],
    readMinutes: 2,
  },
  {
    id: 'invokedynamic-lambdas',
    title: 'invokedynamic: How Lambdas Actually Compile',
    group: 'invokedynamic',
    definition: "A lambda expression compiles not to an anonymous inner class but to an invokedynamic call site that, on first invocation, uses LambdaMetafactory to generate the implementing class at runtime and link the call site directly to it — anonymous-class desugaring is what Java did before Java 8, and lambdas deliberately don't use it.",
    whyItMatters: [
      "Explains why decompiling a class with lambdas doesn't show a generated inner class the way anonymous classes do — the implementation is synthesized at runtime by LambdaMetafactory, not baked in at compile time as a nested .class file",
      "invokedynamic is the general mechanism (originally added for dynamic languages on the JVM) that also underpins string concatenation's indy-based StringConcatFactory since Java 9 — worth knowing it's not lambda-specific plumbing",
    ],
    remember: [
      "First call to a lambda's call site is slower (bootstrap: metafactory generates and links the implementation class); subsequent calls are as fast as a direct method call",
      "One class is generated lazily per distinct lambda expression, not per invocation — it's cached after the first bootstrap",
      'Method references (Foo::bar) go through the exact same invokedynamic/LambdaMetafactory path as lambda expressions',
    ],
    interviewAngle: {
      q: "If lambdas aren't compiled to anonymous inner classes, what does javac actually emit for one?",
      a: "An invokedynamic instruction whose bootstrap method is LambdaMetafactory — on first invocation it synthesizes the implementing class at runtime and links the call site to it, which is why you won't find a generated .class file for a lambda the way you would for an anonymous class",
    },
    related: ['bytecode-basics'],
    diagram: `flowchart LR
  A[invokedynamic] --> B[LambdaMetafactory]
  B --> C[Generated class]
  C --> D[Linked call site]`,
    readMinutes: 3,
  },
]

const modernJavaSupplementConcepts: ConceptCard[] = [
  {
    id: 'virtual-thread-pinning-jdk24',
    title: 'Virtual-Thread Pinning Changed in JDK 24',
    group: 'Virtual Threads in Production',
    definition: 'JEP 491 changed HotSpot in JDK 24 so blocking inside synchronized code normally allows a virtual thread to unmount, removing the most common JDK 21-era pinning hazard while native or foreign-function calls can still pin.',
    whyItMatters: [
      'Migration advice must name the JDK version: replacing every synchronized block with ReentrantLock was a practical JDK 21 workaround, not a timeless virtual-thread rule.',
    ],
    remember: [
      'Long or frequent pinning can still reduce scalability; use JFR virtual-thread pinning events and load tests instead of assuming the runtime upgrade fixed every bottleneck',
      'Holding a monitor is still a correctness and contention concern even when it no longer pins a virtual thread',
    ],
    interviewAngle: {
      q: 'Does synchronized always pin a virtual thread?',
      a: "It did for blocking operations in JDK 21, but JDK 24's JEP 491 removed that normal case; native or foreign calls remain important pinning sources.",
    },
    readMinutes: 2,
    related: ['virtual-threads-model', 'virtual-threads-dont-pool'],
  },
  {
    id: 'scoped-values-context-propagation',
    title: 'Scoped Values for Immutable Context',
    group: 'Context Propagation',
    definition: 'ScopedValue, finalized in JDK 25 by JEP 506, binds immutable contextual data for a bounded dynamic scope so child work can read it without the mutable, lifetime-prone semantics of ThreadLocal.',
    diagram: `flowchart LR
  Request --> Binding[Scoped Value]
  Binding --> Parent
  Parent --> ChildA[Child Task]
  Parent --> ChildB[Child Task]`,
    whyItMatters: [
      'Request IDs, principals, and tracing context can follow structured child tasks without copying a ThreadLocal into every virtual thread or risking stale values on reused platform threads.',
    ],
    remember: [
      'Bindings are one-way and immutable to callees, which makes data flow easier to reason about than a mutable ThreadLocal',
      'A binding is available only while the binding operation runs; do not treat it as a general global variable',
      'JDK 25 is the final API; earlier releases exposed preview/incubator shapes that may differ',
    ],
    readMinutes: 2,
    related: ['virtual-threads-threadlocal-caution', 'structured-concurrency-lifecycle'],
  },
  {
    id: 'structured-concurrency-lifecycle',
    title: 'Structured Concurrency Owns Task Lifetimes',
    group: 'Structured Concurrency',
    definition: 'Structured concurrency treats related subtasks as one lexical unit whose owner joins, cancels, and observes them together, preventing orphaned work from outliving the request that created it.',
    diagram: `flowchart LR
  Parent --> Scope
  Scope --> ChildA[Child Task]
  Scope --> ChildB[Child Task]
  ChildA --> Join
  ChildB --> Join`,
    whyItMatters: [
      'On partial failure or timeout, sibling tasks can be cancelled as a group and the parent cannot accidentally return while child work continues consuming sockets or mutating state.',
    ],
    remember: [
      'JEP 505 is a fifth preview in JDK 25, so production adoption requires preview enablement and acceptance that the API can still change',
      'The value is lifecycle and failure structure, not making CPU work faster',
      'Cancellation is cooperative: blocked APIs and task code must respond to interruption or cancellation',
    ],
    readMinutes: 2,
    related: ['scoped-values-context-propagation', 'virtual-threads-model'],
  },
  {
    id: 'virtual-thread-observability',
    title: 'Virtual-Thread Observability at Scale',
    group: 'Virtual Threads in Production',
    definition: 'Virtual-thread incidents require aggregate evidence such as JFR events, scheduler and dependency metrics, and virtual-thread-aware dumps rather than treating millions of threads as a list to inspect one by one.',
    whyItMatters: [
      'A thread-per-request model improves stack-trace readability, but conventional platform-thread dashboards and unbounded full dumps can become misleading or too large at virtual-thread scale.',
    ],
    remember: [
      'Correlate runnable carrier saturation with blocked virtual threads and downstream pool limits',
      'A huge virtual-thread count is not itself a leak; look for tasks whose lifetime exceeds their owning request or that wait indefinitely',
      'Name threads and preserve request correlation so dumps and JFR recordings retain business context',
    ],
    readMinutes: 2,
    related: ['virtual-threads-model', 'structured-concurrency-lifecycle'],
  },
]

const gcSupplementConcepts: ConceptCard[] = [
  {
    id: 'gc-allocation-stall-vs-pause',
    title: 'Allocation Stall vs GC Pause',
    group: 'Incident Signals',
    definition: 'An allocation stall is application work waiting because the collector cannot provide memory quickly enough, whereas a reported stop-the-world pause suspends mutators for a collector phase; both hurt latency but imply different failure modes.',
    whyItMatters: [
      'Low-pause collectors can keep individual STW phases short yet still miss latency SLOs when concurrent relocation or marking falls behind a high allocation rate.',
    ],
    remember: [
      'Correlate application latency with allocation rate, concurrent-cycle timing, and allocation-stall events—not only the longest pause',
      'Repeated stalls can mean too little headroom, insufficient concurrent GC CPU, or a sudden live-set/allocation-rate change',
    ],
    readMinutes: 2,
    related: ['gc-logging-interpretation', 'choosing-a-collector'],
  },
  {
    id: 'gc-incident-evidence-order',
    title: 'Collect GC Evidence Before Changing Flags',
    group: 'Incident Workflow',
    definition: 'A defensible GC investigation starts with unified GC logs, JFR, heap and process-memory trends, and a time-correlated workload signal before changing heap or collector flags.',
    whyItMatters: [
      'Tuning without a baseline can hide a leak, move latency elsewhere, or destroy the evidence needed to explain a one-off incident.',
    ],
    remember: [
      'Use jcmd for targeted runtime evidence such as GC.heap_info, VM.native_memory when NMT is enabled, class histograms, and a carefully timed heap dump',
      'Heap dumps can cause pauses and substantial I/O; check disk headroom and incident impact first',
      'Compare post-GC live set and allocation rate across time, not one snapshot in isolation',
    ],
    readMinutes: 2,
    related: ['gc-logging-interpretation', 'java-memory-leaks'],
  },
  {
    id: 'heap-vs-native-memory-pressure',
    title: 'Heap Pressure vs Native Memory Pressure',
    group: 'Incident Signals',
    definition: 'RSS or container-memory growth with a flat post-GC heap points away from a Java-heap leak and toward native consumers such as direct buffers, thread stacks, metaspace, JIT code cache, GC metadata, agents, or JNI allocations.',
    whyItMatters: [
      'Increasing -Xmx in a container can worsen native-memory OOM kills by leaving less headroom outside the heap.',
    ],
    remember: [
      'Native Memory Tracking helps attribute JVM-managed native categories but has overhead and must be enabled before the incident',
      'Direct-buffer limits and cleaner timing, thread count times -Xss, and classloader growth are common first checks',
      'Container limits apply to the whole process, not merely the Java heap',
    ],
    readMinutes: 2,
    related: ['java-memory-leaks', 'gc-incident-evidence-order'],
  },
  {
    id: 'collector-choice-by-slo',
    title: 'Choose Collectors by Measured SLO',
    group: 'Collector Selection',
    definition: 'Collector selection should start from an explicit latency percentile, throughput budget, heap and live-set size, allocation profile, and CPU headroom, then be validated on the deployed JDK with production-like load.',
    whyItMatters: [
      'A collector with tiny pauses can lose on throughput or concurrent CPU, while a throughput collector may be ideal for batch work even though its worst pause is longer.',
    ],
    remember: [
      'The default is a baseline, not proof of fitness',
      'Keep the JDK version in benchmark results because collector algorithms and defaults evolve',
      'Size enough free headroom for concurrent collectors to finish before allocation consumes the remaining heap',
    ],
    readMinutes: 2,
    related: ['choosing-a-collector', 'gc-allocation-stall-vs-pause'],
  },
  {
    id: 'generational-zgc-versioning',
    title: 'Generational ZGC Is Version-Sensitive',
    group: 'Collector Selection',
    definition: 'Generational ZGC arrived in JDK 21 as an opt-in mode and became the default ZGC mode in JDK 23, using separate young and old generations to reduce collection work for allocation-heavy workloads.',
    whyItMatters: [
      "A claim such as 'we use ZGC' is incomplete during diagnosis unless the JDK version and generational mode are known.",
    ],
    remember: [
      'JEP 439 delivered generational ZGC in JDK 21; JEP 474 made it the default ZGC mode in JDK 23',
      'Upgrade comparisons must control both JDK and mode or they may attribute a generational change to unrelated application work',
      'Low pause time does not remove the need for allocation headroom and CPU capacity',
    ],
    readMinutes: 2,
    related: ['zgc-concurrent-collector', 'collector-choice-by-slo'],
  },
]

const performanceSupplementConcepts: ConceptCard[] = [
  {
    id: 'profile-cpu-vs-wall-clock',
    title: 'CPU vs Wall-Clock Profiling',
    group: 'Profiler Signal Selection',
    definition: 'CPU profiling samples threads while executing on a core, whereas wall-clock profiling samples elapsed stacks including threads blocked on locks, sockets, disk, or scheduling.',
    whyItMatters: [
      'A latency incident caused by a slow downstream can look almost empty in a CPU flame graph because the affected threads spend their time parked rather than consuming CPU',
      'Wall-clock profiles need filtering by thread or request path because idle pool threads can otherwise dominate the recording',
    ],
    remember: [
      'High CPU or throughput regression: begin with CPU samples',
      'High latency with modest CPU: begin with wall-clock stacks, thread states, and dependency timings',
      'A profiler mode answers a specific question; collecting the wrong event can produce a technically accurate but irrelevant flame graph',
    ],
    readMinutes: 2,
    related: ['async-profiler-flame-graphs'],
  },
  {
    id: 'flame-graph-interpretation-traps',
    title: 'Flame Graph Interpretation Traps',
    group: 'Profiler Signal Selection',
    definition: 'A flame graph aggregates sampled stacks, so box width represents sample share in the selected event and time window, not method duration, call count, or chronological order.',
    whyItMatters: [
      'A wide framework frame low in the graph may merely be a common ancestor; optimization candidates are usually wide leaf stacks whose work belongs to the application',
      'A narrow but catastrophic once-per-minute pause may disappear in a long aggregate profile and must be isolated to the incident window',
    ],
    remember: [
      'Read from wide leaf stacks toward their callers; do not blame the widest bottom frame',
      'Flame graphs have no left-to-right timeline semantics',
      'Compare equivalent traffic and time windows when using differential profiles',
    ],
    interviewAngle: {
      q: 'A flame graph is 70% servlet framework frames. Does that prove the framework is the bottleneck?',
      a: 'No. Those frames may be the common base of most request stacks; inspect the wide leaf work above them and compare against a baseline before attributing cost.',
    },
    readMinutes: 2,
    related: ['profile-cpu-vs-wall-clock', 'async-profiler-flame-graphs'],
  },
  {
    id: 'allocation-profile-retention-distinction',
    title: 'Allocation Hotspot vs Retention Leak',
    group: 'Profiler Signal Selection',
    definition: 'An allocation profile identifies code creating bytes rapidly, while a heap dump and dominator analysis identify objects that remain reachable and retain memory.',
    whyItMatters: [
      'High allocation rate can drive frequent GC without leaking anything, while a slow leak can allocate little and still grow the post-GC heap floor',
      'Optimizing the largest allocator does not fix a leak unless those allocations are also the objects being retained',
    ],
    remember: [
      'GC pressure question: allocation profile and allocation rate',
      'Rising live set question: heap dump, dominator tree, and GC roots',
      'Correlate both views before claiming one code path causes both churn and retention',
    ],
    readMinutes: 2,
    related: ['object-allocation-cost'],
  },
  {
    id: 'jfr-event-threshold-blind-spots',
    title: 'JFR Event Thresholds and Recording Profiles',
    group: 'JFR in Production',
    definition: 'JFR settings profiles control which events are enabled, their stack traces, sampling periods, and duration thresholds, so an absent event can mean the recording was not configured to capture it rather than the behavior never occurred.',
    whyItMatters: [
      'The default profile is low overhead but may omit short lock or I/O events that matter when repeated at high frequency',
      'Turning on every event and stack trace during peak load can add avoidable overhead and create an unmanageable recording',
    ],
    remember: [
      'Record continuously with conservative settings, then use a targeted short recording to test a narrowed hypothesis',
      'Check the event configuration before interpreting zero events as zero activity',
      'Preserve the exact incident interval; a long aggregate can dilute a short pathological phase',
    ],
    readMinutes: 2,
    related: ['jfr'],
  },
  {
    id: 'safepoint-time-to-safepoint',
    title: 'Safepoint Pause vs Time to Safepoint',
    group: 'JVM Runtime Stalls',
    definition: 'A JVM stop-the-world operation includes both time waiting for all Java threads to reach a safepoint and time performing the operation after they arrive, and either component can dominate latency.',
    whyItMatters: [
      'Blaming GC for the full application pause can be wrong when most delay was a thread taking unusually long to reach a safepoint',
      'JFR safepoint events and unified JVM logs separate synchronization delay from the operation itself',
    ],
    remember: [
      'Correlate GC pause events with safepoint begin and end rather than using request latency alone',
      'A long safepoint does not automatically imply heap pressure or a collector problem',
      'Diagnose the triggering operation and the lagging thread before changing collector flags',
    ],
    readMinutes: 2,
  },
  {
    id: 'coordinated-omission-load-tests',
    title: 'Coordinated Omission in Load Tests',
    group: 'Measurement Quality',
    definition: 'A closed-loop load generator that waits for each response before issuing more work stops sampling the periods when the system is slow, systematically under-reporting queueing and tail latency.',
    whyItMatters: [
      'During a five-second stall, a real arrival stream keeps producing requests but a coordinated client goes quiet, making the outage look like one slow request instead of a queue of slow requests',
      'Throughput and percentile claims are invalid if the offered-load model does not match real independent arrivals',
    ],
    remember: [
      'Use an open or constant-arrival-rate model for capacity and tail-latency tests',
      'Report offered load separately from achieved throughput',
      'Watch queue depth and rejected work alongside latency percentiles',
    ],
    readMinutes: 2,
  },
  {
    id: 'safe-performance-change-validation',
    title: 'Safe Performance Change Validation',
    group: 'Tuning Discipline',
    definition: 'A safe performance change starts with a measured bottleneck, alters one material variable, and is validated under representative traffic with rollback criteria and guardrail metrics for latency, errors, memory, and downstream load.',
    whyItMatters: [
      'Increasing a pool, heap, or cache can move the bottleneck downstream, lengthen pauses, or consume container headroom while improving one headline metric',
      'A canary and matched before-after profile distinguish a real gain from traffic mix, warm-up, or measurement noise',
    ],
    remember: [
      'Write the hypothesis and expected metric movement before changing a flag',
      'Change one dimension when possible and retain a fast rollback',
      'Optimize service-level outcomes, not an isolated microbenchmark',
    ],
    readMinutes: 2,
  },
]

const productionSupplementConcepts: ConceptCard[] = [
  {
    id: 'cgroup-cpu-throttling-jvm',
    title: 'Cgroup CPU Quotas and Throttling',
    group: 'Container Runtime',
    definition: 'A container CPU limit is enforced as a cgroup time quota, so a JVM can be periodically throttled after consuming its quota even when the host still has idle cores.',
    whyItMatters: [
      'Throttling produces latency cliffs and runnable-thread queues that resemble application contention while host-level CPU dashboards can look healthy',
      'JVM ergonomics use the processors visible to the process to size GC, JIT, and common pools, so incorrect container visibility can multiply runnable work beyond the quota',
    ],
    remember: [
      'Check cgroup throttled periods and throttled time alongside container CPU usage',
      'A CPU request affects scheduling entitlement; a CPU limit introduces hard throttling',
      "Validate the JVM's ActiveProcessorCount against the quota and deployment expectations",
    ],
    readMinutes: 2,
  },
  {
    id: 'container-memory-budgeting',
    title: 'Whole-Process Container Memory Budget',
    group: 'Container Runtime',
    definition: 'A safe container memory budget reserves the cgroup limit across heap, metaspace, code cache, direct/native allocations, thread stacks, GC structures, and JVM overhead rather than assigning nearly all of it to Xmx.',
    whyItMatters: [
      'Percentage-based heap ergonomics are a starting point, not proof of safety, because thread count and direct-buffer usage vary materially between services',
      'RSS can exceed committed Java heap even without a leak, and cgroup enforcement acts on the process total',
    ],
    remember: [
      'Budget from measured peak non-heap and native use plus safety margin',
      'Track container working set or RSS and the cgroup limit in addition to heap metrics',
      'Increasing Xmx can convert a recoverable Java heap OOM into an unlogged SIGKILL',
    ],
    readMinutes: 2,
    related: ['oom-killer-vs-heap-oom'],
  },
  {
    id: 'native-memory-tracking-triage',
    title: 'Native Memory Tracking Triage',
    group: 'Memory Diagnostics',
    definition: 'Native Memory Tracking categorizes JVM-managed native reservations and commitments and supports baseline diffs, helping separate heap, class metadata, thread stacks, code cache, and internal JVM growth.',
    whyItMatters: [
      'A heap dump cannot explain native growth, and RSS alone cannot attribute it',
      'NMT does not track every allocation made by arbitrary JNI libraries, so an unexplained RSS gap remains a useful clue rather than proof that memory is absent',
    ],
    remember: [
      'Enable NMT at JVM startup; it cannot be retrofitted after the incident begins',
      'Use baseline and summary.diff over time instead of comparing unrelated snapshots',
      'Reserved address space is not the same as committed physical memory',
    ],
    readMinutes: 2,
  },
  {
    id: 'incident-evidence-before-restart',
    title: 'Capture Evidence Before Restart',
    group: 'Incident Response',
    definition: 'A restart is a mitigation that destroys volatile diagnostic state, so responders should first capture bounded low-risk evidence when the service and customer impact allow it.',
    whyItMatters: [
      'Thread stacks, JFR buffers, pool state, cgroup counters, and process mappings often contain the only proof of a transient failure',
      'Repeated blind restarts create recovery without learning and make recurrence likely',
    ],
    remember: [
      'Stabilize user impact first when necessary; evidence collection must never block urgent mitigation',
      'Automate a small incident bundle: timestamps, pod events, limits, metrics window, thread dumps, and JFR dump',
      'Record the exact instance and time range so telemetry can be correlated later',
    ],
    readMinutes: 2,
  },
  {
    id: 'observability-cardinality-budget',
    title: 'Metric Cardinality Is a Reliability Budget',
    group: 'Observability',
    definition: 'Every unique metric label combination creates a time series, so unbounded values such as user IDs, raw URLs, exception messages, or trace IDs can overload the monitoring pipeline and make dashboards fail during the incident they should explain.',
    whyItMatters: [
      'Cardinality often grows fastest during failures when novel error values appear, coupling application distress to observability distress',
      'Dimensions needed for one-off diagnosis usually belong in sampled traces or structured logs rather than always-on metrics',
    ],
    remember: [
      'Use bounded route templates, status classes, operation names, and controlled error categories as labels',
      'Monitor active-series count and dropped telemetry as health signals',
      'Never put a trace ID or customer ID in a metric label',
    ],
    readMinutes: 2,
  },
  {
    id: 'slo-burn-rate-alerting',
    title: 'SLO Burn-Rate Alerting',
    group: 'Observability',
    definition: 'Burn rate measures how quickly a service consumes its allowed error budget, enabling alerts that combine a fast window for severe outages with a slow window for persistent degradation.',
    whyItMatters: [
      'Static CPU or latency thresholds page on harmless resource changes and miss user-visible failures that occur below the threshold',
      'Multi-window burn alerts tie urgency to both impact and duration, reducing noisy pages without hiding slow incidents',
    ],
    remember: [
      'Define the service-level indicator from user outcomes before choosing infrastructure symptoms',
      'Page on fast budget burn; ticket or investigate slower sustained burn',
      'Keep resource saturation alerts as diagnostic or capacity signals, not the sole definition of availability',
    ],
    readMinutes: 2,
  },
  {
    id: 'jfr-incident-ring-buffer',
    title: 'Always-On JFR as an Incident Ring Buffer',
    group: 'Incident Response',
    definition: 'A bounded continuous JFR recording retains a rolling window of JVM events that can be dumped when an alert fires, preserving the minutes before a failure without unbounded disk growth.',
    whyItMatters: [
      'Post-incident attachment misses the lead-up, such as rising contention, allocation bursts, or compiler activity',
      'A maximum age and size bound turns continuous recording into predictable operational overhead',
    ],
    remember: [
      'Test the dump path and retention limit before relying on it during an outage',
      'Copy the recording off an ephemeral pod before deletion or restart',
      'Use a low-overhead continuous profile and escalate briefly only for a focused hypothesis',
    ],
    readMinutes: 2,
    related: ['incident-evidence-before-restart'],
  },
]

const asyncLifecycleSupplementConcepts: ConceptCard[] = [
  {
    id: 'completablefuture-cancellation-boundary',
    title: 'CompletableFuture Cancellation Is Not Task Cancellation',
    group: 'Cancellation & Deadlines',
    definition: 'Cancelling a CompletableFuture completes that stage with CancellationException but does not reliably interrupt or stop the supplier that is already running underneath it.',
    diagram: `flowchart LR
  Caller --> Future
  Future --> Dependents
  Future -.work continues.-> Supplier`,
    whyItMatters: [
      'CompletableFuture.cancel(true) treats mayInterruptIfRunning as irrelevant, unlike a Future returned directly by ExecutorService.submit',
      'A cancelled request can therefore keep consuming a thread, connection, or downstream quota unless the operation has its own cancellation mechanism',
    ],
    remember: [
      'Cancellation flows to dependent stages as exceptional completion, not automatically backward to an upstream stage',
      'Design cancellation into the underlying I/O client or task through deadlines, interrupt-aware blocking, or an explicit token',
    ],
    readMinutes: 2,
    related: ['future-limitations', 'structured-concurrency-intro'],
  },
  {
    id: 'completablefuture-timeout-does-not-stop-work',
    title: 'Timeout Completion Does Not Stop Work',
    group: 'Cancellation & Deadlines',
    definition: "orTimeout and completeOnTimeout race a timer against a CompletableFuture's result, but winning that race changes the future's outcome without necessarily terminating the underlying operation.",
    whyItMatters: [
      'A timed-out HTTP or database call can continue occupying capacity after the caller has returned, causing retry amplification and resource exhaustion',
      "The downstream client's own connect, read, and request deadlines remain essential",
    ],
    remember: [
      'orTimeout completes exceptionally with TimeoutException; completeOnTimeout supplies a fallback value',
      'A user-facing deadline and a resource-reclaiming cancellation are separate requirements',
    ],
    readMinutes: 2,
    related: ['completablefuture-cancellation-boundary'],
  },
  {
    id: 'executor-dependency-bulkheads',
    title: 'Executors as Dependency Bulkheads',
    group: 'Isolation & Capacity',
    definition: 'Separate bounded executors for independent blocking dependencies prevent one slow downstream from consuming every worker needed by unrelated work.',
    whyItMatters: [
      'One shared pool couples the failure domains of every dependency using it',
      'Per-dependency queue depth, rejection, and saturation metrics make overload visible and controllable',
    ],
    remember: [
      "Bulkhead sizes should reflect each dependency's concurrency budget, latency, and connection limits",
      'Isolation moves contention to an intentional boundary; it does not create more downstream capacity',
    ],
    readMinutes: 2,
    related: ['threadpool-rejection-policy', 'forkjoin-common-pool-sizing'],
  },
  {
    id: 'threadpool-nested-blocking-starvation',
    title: 'Nested Submission Starvation',
    group: 'Isolation & Capacity',
    definition: 'A bounded executor can deadlock itself when every worker submits another task to the same pool and blocks waiting for that child while no worker remains to run the queued children.',
    whyItMatters: [
      'Thread dumps resemble a slow system rather than a lock cycle: all workers wait in Future.get or join while the required work sits queued',
      'Adding threads only postpones the failure if nesting can consume the new capacity too',
    ],
    remember: [
      'Compose without blocking, execute child work inline, or use a deliberately separate executor',
      'This is thread-starvation deadlock, not a monitor deadlock, so ordinary deadlock detectors may report nothing',
    ],
    readMinutes: 2,
    related: ['executor-dependency-bulkheads'],
  },
]

const concurrentCollectionsCorrectnessSupplementConcepts: ConceptCard[] = [
  {
    id: 'concurrent-collection-linearizability-boundary',
    title: 'Linearizable Operations, Non-Atomic Workflows',
    group: 'Correctness Contracts',
    definition: 'A concurrent collection can make each documented operation appear atomic at one instant while a sequence of individually atomic calls still exposes a race between them.',
    whyItMatters: [
      'containsKey followed by put, or get followed by put, is still check-then-act unless replaced by putIfAbsent, compute, merge, or external coordination',
      'Thread-safe storage does not automatically preserve a business invariant spanning multiple keys or multiple collections',
    ],
    remember: [
      'Choose one atomic API operation that expresses the state transition whenever possible',
      'For cross-key invariants, redesign ownership or introduce a lock/transaction around the whole invariant',
    ],
    readMinutes: 2,
    related: ['chm-compute-atomicity'],
  },
  {
    id: 'lockfree-progress-and-reclamation',
    title: 'Lock-Free Is a Progress Guarantee',
    group: 'Lock-Free Correctness',
    definition: 'Lock-free means the system as a whole keeps making progress despite contention, not that every operation is wait-free or that CAS retries are free.',
    whyItMatters: [
      'One unlucky thread may retry indefinitely while other threads succeed, so lock-free does not guarantee per-thread latency',
      'CAS-heavy algorithms can lose to a well-designed lock under extreme contention because failed retries consume CPU and cache bandwidth',
    ],
    remember: [
      'Wait-free guarantees every operation completes in bounded steps; lock-free only guarantees some operation completes',
      'GC makes node reclamation safer than in unmanaged languages, but logical removal and helping are still required for correct traversal',
    ],
    readMinutes: 2,
    related: ['concurrentlinkedqueue-cas'],
  },
  {
    id: 'aba-problem-and-versioned-cas',
    title: 'ABA Problem in CAS Algorithms',
    group: 'Lock-Free Correctness',
    definition: 'ABA occurs when a CAS sees the same reference or value it observed earlier even though another thread changed it to B and back to A, hiding an intervening state transition the algorithm depended on.',
    whyItMatters: [
      'Reference equality alone cannot prove that a node or state was untouched between the read and CAS',
      'Version stamps, immutable state objects, or algorithm-specific marking prevent a reused value from masquerading as the original state',
    ],
    remember: [
      'AtomicStampedReference pairs a reference with a version; AtomicMarkableReference pairs it with a boolean mark',
      'Java GC prevents use-after-free but does not by itself eliminate logical ABA when references or pooled nodes can reappear',
    ],
    readMinutes: 2,
    related: ['lockfree-progress-and-reclamation'],
  },
  {
    id: 'chm-longadder-frequency-map',
    title: 'ConcurrentHashMap plus LongAdder',
    group: 'Contention-Aware Patterns',
    definition: 'A ConcurrentHashMap whose values are LongAdders forms a scalable frequency map because key creation is atomic and hot increments spread contention across striped cells.',
    whyItMatters: [
      'AtomicLong gives an exact linearizable update but every writer contends on one memory location',
      'LongAdder sum is not an atomic snapshot, so the pattern suits metrics and frequencies rather than balances or strict limits',
    ],
    remember: [
      'Canonical update: map.computeIfAbsent(key, k -> new LongAdder()).increment()',
      'Choose AtomicLong when an exact compare-and-set or instant total is part of correctness',
    ],
    readMinutes: 2,
    related: ['chm-compute-atomicity'],
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
  {
    id: 'java-concept-concurrency',
    subtopic: 'concurrency',
    title: 'Concurrency & Multithreading',
    intro: 'Thread safety is about coordinating access to shared mutable state. This section covers the fundamentals: thread basics, synchronization, visibility, race conditions, deadlock, and design patterns that make concurrent code predictable.',
    concepts: concurrencyConcepts,
  },
  {
    id: 'java-concept-jmm',
    subtopic: 'jmm',
    title: 'Java Memory Model',
    intro: 'The Java Memory Model is the specification that defines which writes by one thread are guaranteed to become visible to reads by another — the formal contract of ordering and visibility that everything else in java.util.concurrent is built on top of.',
    concepts: jmmConcepts,
  },
  {
    id: 'java-concept-locks',
    subtopic: 'locks',
    title: 'Locks & Synchronization',
    intro: 'Goes past the synchronized keyword into java.util.concurrent.locks — explicit lock APIs, read/write splitting, optimistic locking, and the synchronizer classes senior engineers reach for when intrinsic locks run out of expressiveness.',
    concepts: locksConcepts,
  },
  {
    id: 'java-concept-concurrent-collections',
    subtopic: 'concurrent-collections',
    title: 'Concurrent Collections',
    intro: 'The java.util.concurrent collection types purpose-built for multi-threaded access — how each achieves thread safety without a single global lock, and where picking the wrong one costs you correctness or throughput.',
    concepts: concurrentCollectionsConcepts,
  },
  {
    id: 'java-concept-async',
    subtopic: 'async',
    title: 'Async Programming',
    intro: 'Java\'s higher-level execution frameworks for running work off the calling thread — the Executor/ExecutorService family, Future/CompletableFuture composition, ForkJoinPool\'s work-stealing algorithm, and how virtual threads change the calculus.',
    concepts: asyncConcepts,
  },
  {
    id: 'java-concept-jvm-internals',
    subtopic: 'jvm-internals',
    title: 'JVM Internals',
    intro: 'What happens between a .class file and a running program — class loading, the memory areas the JVM structurally partitions, the bytecode execution model, tiered JIT compilation, and how to read an OutOfMemoryError back to its cause.',
    concepts: jvmInternalsConcepts,
  },
  {
    id: 'java-concept-gc',
    subtopic: 'gc',
    title: 'Garbage Collection',
    intro: 'Garbage collection frees Java developers from manual memory management, but senior engineers still need to reason about generational heap layout, choose and tune a collector for a workload, read GC logs under pressure, and recognize the leak patterns GC can\'t save you from.',
    concepts: gcConcepts,
  },
  {
    id: 'java-concept-performance',
    subtopic: 'performance',
    title: 'Java Performance',
    intro: 'Performance engineering on the JVM — how the JIT actually turns hot code into fast machine code, how to measure that honestly with JMH instead of fooling yourself, how to profile production workloads, and the allocation/latency patterns that separate fast code from code that merely looks fast.',
    concepts: performanceConcepts,
  },
  {
    id: 'java-concept-production',
    subtopic: 'production',
    title: 'Production Java',
    intro: 'Running a JVM service in production is a different skill from knowing the language internals — the operational side: what to observe, how to shut down and diagnose safely, and the incident patterns that repeatedly page Java teams on-call.',
    concepts: productionConcepts,
  },
  {
    id: 'java-concept-modern-java',
    subtopic: 'modern-java',
    title: 'Modern Java (Records, Sealed, Virtual Threads)',
    intro: 'Java 14-21+ added structural features (records, sealed types, pattern matching) and a concurrency model (virtual threads) that change everyday API and threading design decisions — the gotchas here are what actually surface in production and interviews.',
    concepts: modernJavaConcepts,
  },
  {
    id: 'java-concept-exceptions',
    subtopic: 'exceptions',
    title: 'Exception Handling',
    intro: 'Beyond try/catch syntax: the checked-vs-unchecked design debate, resource cleanup mechanics, and the production gotchas around performance and concurrency that separate senior engineers from textbook answers.',
    concepts: exceptionsConcepts,
  },
  {
    id: 'java-concept-io-nio',
    subtopic: 'io-nio',
    title: 'I/O & NIO',
    intro: 'The blocking java.io streams, the buffer/channel model of NIO, and the Path/Files API of NIO.2 — plus where virtual threads change the calculus on which of these you should reach for.',
    concepts: ioNioConcepts,
  },
  {
    id: 'java-concept-serialization',
    subtopic: 'serialization',
    title: 'Serialization',
    intro: "Java's built-in object serialization is niche in modern systems but still shows up in distributed caches, session replication, and legacy RMI — and its history of remote-code-execution CVEs makes it a topic senior engineers are expected to reason about even when they've banned it.",
    concepts: serializationConcepts,
  },
  {
    id: 'java-concept-reflection',
    subtopic: 'reflection',
    title: 'Reflection & Annotations',
    intro: 'Reflection lets code inspect and invoke classes, methods, and fields at runtime instead of compile time — it\'s the mechanism nearly every framework (Spring, Hibernate, Jackson, JUnit) is built on. Understanding its cost, its interaction with encapsulation and the module system, and how it differs from compile-time annotation processing is what separates "I use Spring" from "I understand how Spring works."',
    concepts: reflectionConcepts,
  },
  {
    id: 'java-concept-design-patterns',
    subtopic: 'design-patterns',
    title: 'Design Patterns',
    intro: "Classic GoF and enterprise patterns as they actually show up in Java codebases, with an emphasis on when each one earns its complexity versus when it's over-engineering.",
    concepts: designPatternsConcepts,
  },
  {
    id: 'java-concept-advanced-internals',
    subtopic: 'advanced-internals',
    title: 'Java Internals — Advanced',
    intro: 'The deepest layer: what javac and the JIT actually produce, and the language tricks (autoboxing, varargs, invokedynamic) whose bytecode reality differs from their source-level appearance.',
    concepts: advancedInternalsConcepts,
  },
  {
    id: 'java-concept-modern-java-supplement',
    subtopic: 'modern-java',
    title: 'Modern Java Concurrency Updates',
    intro: 'Java 21-25 evolves thread-per-request concurrency beyond virtual threads, with version-sensitive changes to pinning, context propagation, and task lifetimes that matter in production migrations.',
    concepts: modernJavaSupplementConcepts,
  },
  {
    id: 'java-concept-gc-supplement',
    subtopic: 'gc',
    title: 'Production GC Diagnostics',
    intro: 'Collector mechanics become operationally useful when they guide evidence collection, distinguish heap pressure from native memory, and connect pause or allocation symptoms to workload SLOs.',
    concepts: gcSupplementConcepts,
  },
  {
    id: 'java-concept-performance-supplement',
    subtopic: 'performance',
    title: 'Production Performance Diagnostics',
    intro: 'Evidence-first performance diagnosis: choose the right profiler signal, interpret it correctly, and validate changes against production constraints rather than tuning by folklore.',
    concepts: performanceSupplementConcepts,
  },
  {
    id: 'java-concept-production-supplement',
    subtopic: 'production',
    title: 'Container and Incident Operations',
    intro: 'Operational patterns for diagnosing JVM incidents in containers while preserving evidence, bounding blast radius, and avoiding fixes that merely move the failure.',
    concepts: productionSupplementConcepts,
  },
  {
    id: 'java-concept-async-lifecycle-supplement',
    subtopic: 'async',
    title: 'Async Lifecycle & Isolation',
    intro: 'Senior async design is less about chaining callbacks and more about bounding work, propagating cancellation, and containing failure.',
    concepts: asyncLifecycleSupplementConcepts,
  },
  {
    id: 'java-concept-concurrent-collections-correctness-supplement',
    subtopic: 'concurrent-collections',
    title: 'Concurrent Collection Correctness',
    intro: 'Concurrent collections make individual operations safe; senior designs still have to reason about compound invariants, progress, and contention.',
    concepts: concurrentCollectionsCorrectnessSupplementConcepts,
  },
]
