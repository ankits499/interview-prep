import type { ConceptCard, ConceptSection } from '../../types'

const sbIocDiConcepts: ConceptCard[] = [
// Group: IoC Fundamentals
  {
    id: 'ioc-principle',
    title: 'Inversion of Control',
    group: 'IoC Fundamentals',
    definition: 'A design principle where an object no longer constructs or looks up its own dependencies — a container creates them and hands them over.',
    whyItMatters: [
      'Decouples "what an object needs" from "how that thing gets created," so implementations can be swapped without touching consumer code',
      'Enables testing in isolation — dependencies become substitutable inputs instead of hardcoded `new` calls buried in constructors',
    ],
    remember: ['DI is one implementation of IoC (others: service locator, factory pattern) — Spring uses DI as its primary mechanism'],
    readMinutes: 2,
    related: ['application-context-vs-bean-factory'],
  },
  {
    id: 'application-context-vs-bean-factory',
    title: 'ApplicationContext vs BeanFactory',
    group: 'IoC Fundamentals',
    definition: 'BeanFactory is the root container interface providing lazy, on-demand bean instantiation; ApplicationContext extends it with eager singleton pre-instantiation, event publishing, AOP integration, internationalization, and environment abstraction.',
    whyItMatters: [
      'The eager-vs-lazy default is the real distinction, not "one is bigger" — ApplicationContext instantiates all singleton beans at startup by default, which is what surfaces missing-dependency errors at boot instead of at first use',
      'Almost no production Spring Boot app uses raw BeanFactory directly; ApplicationContext (via @SpringBootApplication) is the container in practice',
    ],
    interviewAngle: {
      q: 'Why would a misconfigured bean fail fast at application startup instead of at runtime when it\'s first accessed?',
      a: 'Because ApplicationContext eagerly instantiates singleton beans during context refresh, so a missing or misconfigured dependency throws during startup rather than lazily on first use.',
    },
    readMinutes: 2,
  },

  // Group: Injection Types
  {
    id: 'constructor-vs-field-injection',
    title: 'Constructor vs Setter vs Field Injection',
    group: 'Injection Types',
    definition: 'Spring supports three injection styles — passing dependencies through a constructor, through setter methods, or directly onto annotated fields — and they differ in immutability, testability, and when a missing dependency is caught.',
    whyItMatters: [
      'Constructor injection allows `final` fields, guarantees a fully-initialized object the instant it exists, and fails fast at object-construction time if a required dependency is missing',
      'Setter injection suits genuinely optional dependencies that may be reconfigured after construction, at the cost of a window where the object exists partially wired',
    ],
    remember: [
      'Constructor injection is the Spring team\'s own documented recommendation for mandatory dependencies',
      'A class with a single constructor doesn\'t even need @Autowired on it since Spring 4.3 — it\'s inferred',
    ],
    readMinutes: 2,
    related: ['field-injection-critique'],
  },
  {
    id: 'field-injection-critique',
    title: 'Why Field Injection Is Discouraged',
    group: 'Injection Types',
    definition: '@Autowired directly on a field is common in tutorials but discouraged in production code because it hides dependencies, prevents immutability, and lets the object exist in an invalid state before the container finishes wiring it.',
    whyItMatters: [
      'The field can\'t be `final`, so nothing stops later code from reassigning a dependency mid-lifetime',
      'Dependencies are invisible from the class\'s public contract — you can\'t tell what a class needs without reading its internals, unlike a constructor signature',
      'Unit testing without a Spring context requires reflection or a test framework\'s injection support (e.g. Mockito\'s @InjectMocks) instead of plain `new ClassUnderTest(mockDep)`',
    ],
    remember: ['The object exists as a bare, half-wired instance the moment the no-arg constructor runs, before field injection completes'],
    readMinutes: 2,
    related: ['constructor-vs-field-injection', 'di-testability'],
  },
  {
    id: 'di-testability',
    title: 'DI and Unit Test Isolation',
    group: 'Injection Types',
    definition: 'Constructor injection makes a class instantiable with plain `new` and hand-built or mocked dependencies, so unit tests never need to bootstrap a Spring context.',
    whyItMatters: [
      'Tests run in milliseconds instead of seconds because there\'s no ApplicationContext to start',
      'Forces dependencies to be genuinely substitutable — if a class is hard to construct with mocks, that\'s usually a sign it\'s doing too much',
    ],
    readMinutes: 1,
    related: ['constructor-vs-field-injection'],
  },
  {
    id: 'circular-dependency-fail-fast',
    title: 'Constructor Injection Surfaces Circular Dependencies Early',
    group: 'Injection Types',
    definition: 'Two beans requiring each other through their constructors cannot be resolved by Spring and throw BeanCurrentlyInCreationException at startup, whereas setter or field injection can silently paper over the same design flaw.',
    whyItMatters: [
      'A hard startup failure is a design signal — it forces you to break the cycle (extract a shared interface, merge the classes, use an event) rather than let Spring quietly resolve it via a partially-constructed reference',
    ],
    remember: ['This is a consequence of choosing constructor injection, not a lifecycle mechanism in itself — how Spring resolves cycles via setter/field injection is bean-lifecycle territory, not a DI-style decision'],
    readMinutes: 1,
  },

  // Group: Component Scanning & Stereotypes
  {
    id: 'stereotype-annotations',
    title: 'Stereotype Annotations',
    group: 'Component Scanning & Stereotypes',
    definition: '@Component is the base stereotype registering a class as a Spring-managed bean; @Service, @Repository, and @Controller are specializations that are mechanically identical component scans but carry distinct semantic and (for @Repository) functional meaning.',
    whyItMatters: [
      '@Service and @Controller are pure documentation-by-annotation — they signal intent to readers and tools but add no extra container behavior beyond what @Component does',
      '@Repository is the exception: it enables PersistenceExceptionTranslationPostProcessor, which wraps platform-specific exceptions (e.g. JDBC SQLExceptions) into Spring\'s unchecked DataAccessException hierarchy',
    ],
    remember: ['If you swap @Repository for plain @Component on a DAO, exception translation silently stops working — leaks vendor-specific exceptions up the stack'],
    readMinutes: 2,
  },
  {
    id: 'component-scan-vs-bean-methods',
    title: 'Component Scanning vs @Bean Methods',
    group: 'Component Scanning & Stereotypes',
    definition: 'Component scanning auto-registers your own annotated classes by classpath scanning, while @Bean methods inside an @Configuration class explicitly construct and register a bean — the only option for third-party classes you can\'t annotate.',
    whyItMatters: [
      '@Bean methods are the escape hatch when you need conditional construction logic, multiple beans of the same type with different configuration, or wiring a library class that has no Spring annotations',
      'Java-based @Configuration classes replaced XML bean definitions as the default; XML still works but is now mostly a legacy-integration concern, not something greenfield code reaches for',
    ],
    readMinutes: 2,
  },

  // Group: Bean Resolution
  {
    id: 'autowiring-resolution-order',
    title: 'How @Autowired Resolves a Dependency',
    group: 'Bean Resolution',
    definition: 'Spring first matches by type; if multiple beans of that type exist, it narrows by field/parameter name, then @Qualifier, then @Primary — and throws NoUniqueBeanDefinitionException if ambiguity remains.',
    whyItMatters: [
      'Knowing the order matters when debugging why the "wrong" bean got injected — a bean whose field name happens to match a bean name can win over one you intended via @Primary in some configurations, so relying on name-matching accidentally is fragile',
    ],
    readMinutes: 2,
    related: ['qualifier-vs-primary'],
  },
  {
    id: 'qualifier-vs-primary',
    title: '@Qualifier vs @Primary',
    group: 'Bean Resolution',
    definition: '@Primary marks one bean as the default choice among candidates of the same type; @Qualifier lets a specific injection point name exactly which bean it wants, overriding the default.',
    whyItMatters: [
      '@Primary is a global, container-wide preference — useful when one implementation is the sane default everywhere; @Qualifier is a local, call-site override for the cases that need something different',
      'Mixing both is common: mark the default implementation @Primary, then use @Qualifier at the few injection points that deliberately need the non-default one',
    ],
    example: {
      code: {
        language: 'java',
        code:
`@Primary
@Service
class StripePaymentGateway implements PaymentGateway { }

@Service
class PaypalPaymentGateway implements PaymentGateway { }

@Service
class RefundProcessor {
    RefundProcessor(@Qualifier("paypalPaymentGateway") PaymentGateway gateway) { ... }
}`,
      },
      note: 'RefundProcessor explicitly opts out of the @Primary default.',
    },
    readMinutes: 2,
  },
  {
    id: 'ambiguous-dependency-failure',
    title: 'Ambiguous Dependency Resolution Failure',
    group: 'Bean Resolution',
    definition: 'When two or more beans satisfy an injection point\'s type and neither @Qualifier, @Primary, nor name matching disambiguates them, context startup fails with NoUniqueBeanDefinitionException rather than picking arbitrarily.',
    whyItMatters: [
      'Spring deliberately refuses to guess — a silent arbitrary choice between two beans would be a worse failure mode than a loud startup crash',
    ],
    remember: ['This is a startup-time (context refresh) failure, not a runtime one — another fail-fast property of DI-driven wiring'],
    readMinutes: 1,
  },

  // Group: Design Judgment
  {
    id: 'di-anti-pattern-god-constructor',
    title: 'Constructor Injection as a Design Smell Detector',
    group: 'Design Judgment',
    definition: 'A constructor with an unwieldy number of injected dependencies is a direct, visible signal that a class is violating single responsibility — a symptom that field injection conveniently hides.',
    whyItMatters: [
      'This is frequently cited as the real argument for constructor injection over field injection at senior level: it isn\'t primarily about immutability, it\'s that a bloated constructor is impossible to ignore, while a bloated list of @Autowired fields scrolls by unnoticed',
    ],
    interviewAngle: {
      q: 'Your teammate says field injection is fine because "the IDE handles it." What\'s the design argument against that, beyond testability?',
      a: 'A large constructor parameter list is an immediate, visible code smell for a class doing too much; the same bloat with field injection is invisible until someone counts the @Autowired fields, so it accumulates unnoticed.',
    },
    readMinutes: 2,
  },
]

const sbBeanLifecycleConcepts: ConceptCard[] = [
// Group: Bean Scopes
  {
    id: 'bean-scopes-overview',
    title: 'Bean Scopes',
    group: 'Bean Scopes',
    definition: 'A bean\'s scope controls how many instances the container creates and how long each one lives: singleton (one per container, the default), prototype (a new instance per request for the bean), and the web-aware request/session/application scopes.',
    whyItMatters: [
      'Singleton is shared across every thread that touches the application context — any mutable instance state is a concurrency bug waiting to happen',
      'Choosing the wrong scope for stateful vs stateless components is a recurring source of subtle production bugs, not a compile-time error',
    ],
    remember: [
      'Singleton = one instance per Spring container (not per JVM/classloader)',
      'request/session/application scopes only resolve in a web-aware ApplicationContext',
    ],
    readMinutes: 2,
  },
  {
    id: 'prototype-scope-lifecycle-gap',
    title: 'Prototype Scope Doesn\'t Get Full Lifecycle Management',
    group: 'Bean Scopes',
    definition: 'Spring instantiates, injects, and initializes a prototype bean like any other, but once it hands the instance to the caller it forgets about it entirely — destruction callbacks (@PreDestroy, DisposableBean) never fire automatically.',
    whyItMatters: [
      'The container can\'t track every prototype instance handed out over an application\'s lifetime, so it has no hook to call at shutdown',
      'Any cleanup logic (closing a resource, unregistering a listener) on a prototype bean must be invoked manually by the code that owns the instance',
    ],
    remember: [
      'Container manages the full lifecycle only for singleton beans; for prototype it stops right after handing over the initialized instance',
      'A BeanPostProcessor can be used to track prototype instances yourself if cleanup is unavoidable',
    ],
    interviewAngle: {
      q: 'Why doesn\'t @PreDestroy fire on a prototype-scoped bean?',
      a: 'Because Spring relinquishes ownership of a prototype instance once it\'s created — it never tracks it, so it has nothing to call back into at shutdown.',
    },
    readMinutes: 2,
    related: ['scoped-proxy-singleton-injection'],
  },
  {
    id: 'scoped-proxy-singleton-injection',
    title: 'Injecting a Narrow-Scoped Bean Into a Singleton',
    group: 'Bean Scopes',
    definition: 'Naively injecting a prototype or request-scoped bean into a singleton captures only the single instance that existed at injection time, permanently defeating the narrower scope; the fix is a scoped proxy (@Scope with proxyMode) that injects a proxy which resolves the real target on every method call.',
    whyItMatters: [
      'The singleton is only constructed once, so a plain field injection resolves the dependency once too — the "new instance per use" contract silently breaks',
      'proxyMode = ScopedProxyMode.TARGET_CLASS (or INTERFACES) makes the injected reference a proxy that looks up the correct scoped instance from the current context on every call',
    ],
    example: {
      code: {
        language: 'java',
        code: `@Scope(value = "prototype", proxyMode = ScopedProxyMode.TARGET_CLASS)
@Component
class CartItem { }

@Component // singleton
class OrderService {
    @Autowired
    private CartItem cartItem; // actually a proxy, resolves fresh instance per call
}`,
      },
      note: 'Without proxyMode, OrderService would hold one CartItem forever, shared across every order.',
    },
    remember: [
      'CGLIB proxy for classes (TARGET_CLASS), JDK dynamic proxy for interfaces (INTERFACES)',
      'The same fix applies to request/session-scoped beans injected into singletons',
    ],
    readMinutes: 2,
    related: ['prototype-scope-lifecycle-gap', 'scope-annotation-deep-dive'],
  },
  {
    id: 'scope-annotation-deep-dive',
    title: '@Scope and proxyMode',
    group: 'Bean Scopes',
    definition: '@Scope declares a bean\'s scope and, via proxyMode, whether Spring should wrap it in a scope-resolving proxy so it can be safely injected into beans with a wider (typically singleton) scope.',
    whyItMatters: [
      'Without proxyMode, injecting a narrower-scoped bean into a wider-scoped one either fails at startup (for request/session scope, if resolved eagerly outside a request) or silently freezes to the first instance (for prototype)',
    ],
    remember: [
      'ScopedProxyMode.DEFAULT inherits from the surrounding component-scan config; NO disables proxying explicitly',
      'A scoped proxy adds a method-call indirection cost — negligible for most beans, but not literally free',
    ],
    readMinutes: 1,
  },

  // Group: Lifecycle Callbacks
  {
    id: 'bean-lifecycle-sequence',
    title: 'Full Bean Lifecycle Order',
    group: 'Lifecycle Callbacks',
    definition: 'A managed bean goes through instantiation, dependency injection, Aware interface callbacks, BeanPostProcessor.postProcessBeforeInitialization, init callbacks (@PostConstruct then InitializingBean.afterPropertiesSet), BeanPostProcessor.postProcessAfterInitialization, then sits ready for use until @PreDestroy/DisposableBean fire at container shutdown.',
    whyItMatters: [
      'Knowing the exact ordering explains real bugs: e.g. why a field set by a BeanPostProcessor before init is visible inside @PostConstruct, but one set after init is not',
      'Aware interfaces (BeanNameAware, ApplicationContextAware, etc.) run before any BeanPostProcessor — so a post-processor can rely on those values already being set',
    ],
    remember: [
      '@PostConstruct runs before InitializingBean.afterPropertiesSet if both are present on the same bean',
      'Destruction callbacks only run for singleton beans (and prototypes you destroy manually) — never automatically for prototype scope',
    ],
    diagram: 'flowchart LR\n  A[Instantiate] --> B[Inject Dependencies]\n  B --> C[Aware Callbacks]\n  C --> D[PostProcessor Before Init]\n  D --> E[PostConstruct and InitializingBean]\n  E --> F[PostProcessor After Init]\n  F --> G[Bean Ready]\n  G --> H[PreDestroy on Shutdown]',
    readMinutes: 3,
    related: ['bean-post-processor', 'aware-interfaces'],
  },
  {
    id: 'aware-interfaces',
    title: 'Aware Interfaces',
    group: 'Lifecycle Callbacks',
    definition: 'Aware interfaces like BeanNameAware, BeanFactoryAware, and ApplicationContextAware let a bean request container infrastructure (its own name, the factory, the context) be injected by the container before any initialization callback runs.',
    whyItMatters: [
      'They\'re an escape hatch for framework-style code that needs container access — using them in ordinary application beans is usually a sign you should be using regular DI instead',
      'They run strictly before BeanPostProcessor.postProcessBeforeInitialization, so a bean can safely use its injected name/context inside @PostConstruct',
    ],
    remember: ['Overuse of ApplicationContextAware couples a bean tightly to the Spring framework, hurting testability'],
    readMinutes: 1,
    related: ['bean-lifecycle-sequence'],
  },
  {
    id: 'postconstruct-vs-initializingbean',
    title: '@PostConstruct vs InitializingBean vs @Bean(initMethod)',
    group: 'Lifecycle Callbacks',
    definition: 'All three run an init hook after dependency injection, but @PostConstruct (JSR-250 annotation) is the idiomatic choice, InitializingBean.afterPropertiesSet() couples the bean class to Spring\'s interface, and @Bean(initMethod=...) lets you wire an init method on a class you don\'t own (e.g. third-party code).',
    whyItMatters: [
      '@Bean(initMethod) is the only option when you can\'t annotate the source (a third-party class configured via @Configuration)',
      'Mixing all three on one bean is legal but confusing — the actual firing order is @PostConstruct, then afterPropertiesSet, then the custom init method',
    ],
    remember: ['@PreDestroy / DisposableBean.destroy() / @Bean(destroyMethod) mirror the same three options for shutdown'],
    readMinutes: 1,
  },

  // Group: Post-Processors
  {
    id: 'bean-post-processor',
    title: 'BeanPostProcessor',
    group: 'Post-Processors',
    definition: 'A BeanPostProcessor hooks into the lifecycle of every bean INSTANCE after it\'s constructed and injected, letting it inspect, modify, or wrap (proxy) the instance before and after init callbacks run.',
    whyItMatters: [
      'This is how @Autowired, @Async, @Transactional-driven proxies, and AOP proxies actually get applied — they\'re all implemented as BeanPostProcessors under the hood',
      'postProcessAfterInitialization is the hook where proxying typically happens, since by then the target object is fully initialized and safe to wrap',
    ],
    remember: ['Runs per bean instance, once per bean, at the instance level — not at bean-definition time'],
    readMinutes: 2,
    related: ['bean-factory-post-processor', 'bean-lifecycle-sequence'],
  },
  {
    id: 'bean-factory-post-processor',
    title: 'BeanFactoryPostProcessor vs BeanPostProcessor',
    group: 'Post-Processors',
    definition: 'BeanFactoryPostProcessor runs once, before any bean is instantiated, and modifies bean DEFINITIONS (metadata like class, scope, property values); BeanPostProcessor runs per bean, after instantiation, and modifies bean INSTANCES.',
    whyItMatters: [
      'This is a classic senior-interview differentiator: definition-time vs instance-time is the crux, not just "one runs earlier"',
      'PropertySourcesPlaceholderConfigurer (resolving ${...} placeholders) is a canonical BeanFactoryPostProcessor — it rewrites property values in definitions before any bean is built',
    ],
    example: {
      code: {
        language: 'java',
        code: `class LoggingBeanPostProcessor implements BeanPostProcessor {
    public Object postProcessAfterInitialization(Object bean, String name) {
        return bean; // could return a proxy wrapping bean
    }
}

class CustomBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
    public void postProcessBeanFactory(ConfigurableListableBeanFactory factory) {
        BeanDefinition def = factory.getBeanDefinition("dataSource");
        def.getPropertyValues().add("url", "jdbc:override:...");
    }
}`,
      },
    },
    remember: [
      'BeanFactoryPostProcessor cannot see actual bean instances — only the definitions describing how to build them',
      'Because it runs so early, a BeanFactoryPostProcessor must not trigger premature bean instantiation itself (a common footgun)',
    ],
    readMinutes: 2,
    related: ['bean-post-processor'],
  },

  // Group: Circular Dependencies
  {
    id: 'circular-dependency-resolution',
    title: 'Circular Dependency Resolution (Setter/Field Injection)',
    group: 'Circular Dependencies',
    definition: 'When singleton beans A and B depend on each other via setter or field injection, Spring resolves the cycle by exposing an early reference to a partially-constructed bean through a layered cache, so the still-instantiating bean can be wired before its own initialization completes.',
    whyItMatters: [
      'The instance handed out early is only instantiated, not yet dependency-injected or initialized — it becomes fully usable only once its own construction phase finishes, which works because Java references let you hand out an object before it\'s "done"',
      'This resolution mechanism only exists because Spring separates instantiation from property population; the exposed object identity doesn\'t change, so wiring completes correctly once both beans finish their own initialization',
    ],
    diagram: 'flowchart LR\n  A[Create A] --> B[Expose Early Reference A]\n  B --> C[Create B]\n  C --> D[Inject Early A Into B]\n  D --> E[Finish B]\n  E --> F[Inject B Into A]\n  F --> G[Finish A]',
    remember: ['Only applies to singleton scope — prototype beans never use this cache and circular prototype dependencies just fail'],
    readMinutes: 3,
    related: ['constructor-injection-circular-failure'],
  },
  {
    id: 'constructor-injection-circular-failure',
    title: 'Why Constructor Injection Fails Fast on Circular Dependencies',
    group: 'Circular Dependencies',
    definition: 'Constructor injection requires a fully-built argument at the moment of construction, so if A\'s constructor needs B and B\'s constructor needs A, neither bean can finish being instantiated first — Spring detects the cycle and throws BeanCurrentlyInCreationException at startup instead of silently resolving it.',
    whyItMatters: [
      'The setter/field-injection resolution trick works only because instantiation and property population are separate steps, giving a window to hand out an early, not-yet-populated reference — constructor injection collapses those two steps into one, so there\'s no such window',
      'This failing fast is actually the point in a well-designed system: a genuine circular dependency between constructor-injected beans is usually a design smell (missing abstraction, or a case for refactoring into a third bean)',
    ],
    remember: [
      'The fix is not "switch to field injection" — it\'s to break the cycle by introducing an interface, an event, or restructuring responsibilities',
      '@Lazy on one of the constructor parameters can defer resolution and technically breaks the deadlock, but it\'s a workaround, not a fix for the underlying design',
    ],
    interviewAngle: {
      q: 'Two singleton beans depend on each other through constructor injection. What happens at startup, and why can\'t Spring resolve it the way it resolves setter-injection cycles?',
      a: 'BeanCurrentlyInCreationException — constructor injection needs a fully-built dependency at construction time, so there\'s no partially-constructed instance Spring can hand out early the way it does for setter/field injection.',
    },
    readMinutes: 2,
    related: ['circular-dependency-resolution'],
  },

  // Group: Lazy Initialization
  {
    id: 'lazy-initialization-tradeoffs',
    title: '@Lazy Initialization Tradeoffs',
    group: 'Lazy Initialization',
    definition: '@Lazy defers a singleton bean\'s creation until it\'s first requested instead of at container startup, trading faster startup time for deferred discovery of configuration/wiring failures.',
    whyItMatters: [
      'Eager (default) initialization is generally preferred in production because it fails fast — a misconfigured bean breaks deployment immediately instead of surfacing as a runtime error under load',
      'Broad use of @Lazy across many beans can mask real dependency problems until they hit a request path, and can also mean startup no longer reflects true readiness',
    ],
    remember: [
      '@Lazy on a whole @Configuration class makes every bean it declares lazy by default',
      'Useful for expensive beans not needed on every code path, or to break certain circular-dependency deadlocks — not a general-purpose startup optimization',
    ],
    readMinutes: 1,
  },
]

const sbAutoconfigurationConcepts: ConceptCard[] = [
// Group: Spring Boot vs Spring
  {
    id: 'spring-boot-vs-spring',
    title: 'What Spring Boot Actually Adds',
    group: 'Spring Boot vs Spring',
    definition: 'Spring Boot is not a replacement for the Spring Framework but a layer on top of it that supplies convention-over-configuration defaults, auto-configuration, embedded servers, and curated starter dependencies so an app runs with near-zero manual XML/Java config.',
    whyItMatters: [
      'Interviewers use this to check you understand Boot is opinionated defaults + tooling, not a different DI container or a different runtime model',
      'Everything Boot does is still plain Spring underneath — beans, ApplicationContext, AOP proxies — Boot just decides what gets registered for you'
    ],
    remember: [
      'Plain Spring: you wire every bean explicitly. Boot: sensible beans are pre-wired, and you override only what differs from the default',
      'Embedded Tomcat/Jetty/Undertow means "runnable jar" instead of "deploy a WAR to an external container" — a packaging/deployment shift, not a framework shift'
    ],
    readMinutes: 2,
  },
  {
    id: 'starter-dependencies',
    title: 'Starters Are Just Dependency Aggregators',
    group: 'Spring Boot vs Spring',
    definition: 'A starter (e.g. spring-boot-starter-web) is a pom/gradle artifact with no code of its own — it exists only to pull in a curated, version-aligned set of transitive dependencies; the actual auto-configuration logic lives separately in spring-boot-autoconfigure.',
    whyItMatters: [
      'Common misconception to clear up in an interview: adding a starter does not itself configure anything — it just puts the right jars (and therefore the right classes) on the classpath, which then makes @ConditionalOnClass checks in spring-boot-autoconfigure pass'
    ],
    remember: [
      'starter-web on the classpath -> Tomcat/Jackson/Spring MVC classes present -> WebMvcAutoConfiguration\'s @ConditionalOnClass conditions now match -> it activates',
      'You can add spring-boot-autoconfigure manually without any starter and still get auto-configuration, as long as the relevant classes are present some other way'
    ],
    readMinutes: 1,
  },

  // Group: The @SpringBootApplication Annotation
  {
    id: 'spring-boot-application-meta-annotation',
    title: '@SpringBootApplication Unpacked',
    group: 'The @SpringBootApplication Annotation',
    definition: '@SpringBootApplication is a meta-annotation combining @SpringBootConfiguration (a specialized @Configuration marking the source class), @EnableAutoConfiguration (triggers the auto-config mechanism), and @ComponentScan (scans for stereotype-annotated beans).',
    whyItMatters: [
      'Knowing the three pieces lets you reason about failures precisely — "is this a scanning problem or an auto-config problem?" instead of treating the annotation as an opaque black box'
    ],
    remember: [
      'You can use the three annotations separately for finer control (e.g. a custom @ComponentScan(basePackages=...)) instead of the bundled meta-annotation',
      '@SpringBootConfiguration itself is just @Configuration plus a marker so tooling (like tests) can find "the" primary configuration class'
    ],
    interviewAngle: {
      q: 'If a teammate asks "what does @SpringBootApplication actually do", what\'s the precise answer?',
      a: 'It is three annotations bundled together: @SpringBootConfiguration (marks this as the primary config class), @EnableAutoConfiguration (kicks off conditional auto-configuration), and @ComponentScan (scans this package and subpackages for beans).',
    },
    readMinutes: 2,
    related: ['component-scan-default-base-package'],
  },
  {
    id: 'component-scan-default-base-package',
    title: 'Component Scan\'s Default Base Package Trap',
    group: 'The @SpringBootApplication Annotation',
    definition: 'The @ComponentScan bundled inside @SpringBootApplication defaults its base package to the package of the class carrying the annotation, so anything outside that package tree is silently never scanned.',
    whyItMatters: [
      'This is the single most common "why isn\'t my bean being picked up" bug: a shared library or a misplaced package puts a @Service/@Component outside the main application class\'s package',
      'It bites teams that put the main class in a top-level package like com.acme.app while a multi-module build contributes beans from com.acme.lib'
    ],
    remember: [
      'Fix options: move the main class to the common root package, add explicit @ComponentScan(basePackages = ...), or use @Import to pull in specific @Configuration classes from outside the tree',
      'This is scanning, not auto-configuration — auto-config classes are found via a completely different mechanism (imports file), unaffected by package location'
    ],
    readMinutes: 2,
    related: ['spring-boot-application-meta-annotation'],
  },

  // Group: Auto-Configuration Mechanism
  {
    id: 'autoconfiguration-discovery-mechanism',
    title: 'How Auto-Configuration Classes Are Discovered',
    group: 'Auto-Configuration Mechanism',
    definition: '@EnableAutoConfiguration triggers Spring Boot to read a list of candidate configuration classes from META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports (the modern mechanism, Boot 2.7+), replacing the older spring.factories key-based registration, and each candidate is then evaluated against its conditional annotations before being applied.',
    whyItMatters: [
      'Interviewers probing internals want to see you know this is a two-phase process: discovery (find every candidate, unconditionally) then evaluation (filter down by conditions) — not that Boot "just knows" what to configure'
    ],
    remember: [
      'spring.factories is still supported for other extension points but auto-configuration itself moved to AutoConfiguration.imports for faster startup (plain text file, no key parsing across all factories)',
      'Every jar on the classpath can contribute its own imports file — this is how third-party libraries plug into Boot\'s auto-config without touching your code'
    ],
    diagram: 'flowchart LR\n  a[Classpath scan] --> b[Read imports file]\n  b --> c[Candidate auto config classes]\n  c --> d[Evaluate conditions]\n  d --> e[Register matching beans]',
    readMinutes: 3,
    related: ['conditional-on-class', 'debugging-auto-configuration'],
  },
  {
    id: 'autoconfiguration-ordering',
    title: 'Auto-Configuration Ordering',
    group: 'Auto-Configuration Mechanism',
    definition: '@AutoConfigureAfter and @AutoConfigureBefore let an auto-configuration class declare its position relative to others, which matters whenever one auto-config\'s conditions or bean definitions depend on beans another auto-config produces.',
    whyItMatters: [
      'Without explicit ordering, two auto-configurations that both react to the same classpath signal could apply in an order where one\'s @ConditionalOnBean check misses a bean that technically will exist, just not yet',
      'Common real example: a caching or datasource auto-config often needs to run after the underlying connection/transaction manager auto-config is in place'
    ],
    remember: [
      '@AutoConfigureOrder sets a numeric priority for coarse-grained ordering across unrelated auto-configs; @AutoConfigureAfter/@AutoConfigureBefore are for specific relative dependencies',
      'Ordering only affects auto-configuration classes relative to each other — it has no effect on regular user @Configuration classes'
    ],
    readMinutes: 2,
  },

  // Group: Conditional Annotations
  {
    id: 'conditional-on-class',
    title: '@ConditionalOnClass / @ConditionalOnMissingClass',
    group: 'Conditional Annotations',
    definition: '@ConditionalOnClass activates a configuration only if a given class is present on the classpath, letting an auto-configuration safely exist even when the library it configures isn\'t there.',
    whyItMatters: [
      'This is what makes starters "just work": adding a starter changes the classpath, which changes which @ConditionalOnClass checks pass, which is the entire activation trigger'
    ],
    remember: [
      'The check happens via ASM bytecode scanning at condition-evaluation time so it can test for a class without triggering classloading of that class if it\'s absent',
      'Pairs with @ConditionalOnMissingClass for the inverse case (e.g. configure a fallback when a preferred library is absent)'
    ],
    readMinutes: 1,
    related: ['autoconfiguration-discovery-mechanism'],
  },
  {
    id: 'conditional-on-missing-bean',
    title: '@ConditionalOnMissingBean Enables User Override',
    group: 'Conditional Annotations',
    definition: 'Auto-configured @Bean methods are annotated @ConditionalOnMissingBean, so if the application context already contains a bean of that type (typically from the user\'s own @Configuration), Boot\'s auto-configured bean backs off entirely rather than conflicting.',
    whyItMatters: [
      'This is the actual mechanism behind "just define your own bean and it overrides the default" — it\'s not magic precedence, it\'s a plain conditional that loses to any bean already registered',
      'Ordering matters here too: user @Configuration classes are processed before auto-configuration classes specifically so this check sees the user bean already present'
    ],
    remember: [
      'Type-matching (and optionally name-matching) determines "missing" — a bean of a different but assignable type can still cause surprising behavior',
      'If you define a bean of the exact same type as an auto-configured one, the auto-configured version silently never gets created — no error, no warning by default'
    ],
    interviewAngle: {
      q: 'Why does defining your own DataSource bean silently disable Boot\'s auto-configured one instead of causing a duplicate-bean conflict?',
      a: 'The auto-configured DataSource bean is annotated @ConditionalOnMissingBean(DataSource.class). Because user configuration classes process before auto-configuration classes, your bean is already registered by the time that condition is evaluated, so it evaluates false and the auto-configured bean method never runs.',
    },
    readMinutes: 2,
    related: ['conditional-on-property', 'debugging-auto-configuration'],
  },
  {
    id: 'conditional-on-property',
    title: '@ConditionalOnProperty',
    group: 'Conditional Annotations',
    definition: '@ConditionalOnProperty activates a configuration based on whether a named property exists and/or matches an expected value, giving external configuration (application.yml, env vars) direct control over which auto-configuration applies.',
    whyItMatters: [
      'This is the hook that lets ops-level config (not code changes) turn entire feature areas of auto-configuration on or off, e.g. management.health.db.enabled'
    ],
    remember: [
      'havingValue defaults to matching "true"; matchIfMissing controls whether absence of the property counts as a match — easy to get backwards under pressure',
      'Distinct from @ConfigurationProperties binding (owned by the properties/profiles subtopic) — this is a pure on/off gate for whether a configuration class activates at all'
    ],
    readMinutes: 1,
  },
  {
    id: 'conditional-on-bean',
    title: '@ConditionalOnBean',
    group: 'Conditional Annotations',
    definition: '@ConditionalOnBean activates a configuration only if a bean of a given type already exists in the context, the positive counterpart to @ConditionalOnMissingBean, typically used to add supplementary beans that only make sense alongside another feature.',
    whyItMatters: [
      'This is fragile across auto-configuration ordering — if the class supplying the required bean hasn\'t been processed yet, the check sees "missing" even though the bean will eventually exist, which is exactly why @AutoConfigureAfter exists'
    ],
    remember: [
      'Using @ConditionalOnBean inside your own application @Configuration (as opposed to inside auto-configuration) is generally discouraged by Spring\'s own docs because ordering of user config classes isn\'t guaranteed the same way'
    ],
    readMinutes: 1,
    related: ['conditional-on-missing-bean', 'autoconfiguration-ordering'],
  },

  // Group: Debugging & Customization
  {
    id: 'debugging-auto-configuration',
    title: 'Debugging With --debug and the Condition Evaluation Report',
    group: 'Debugging & Customization',
    definition: 'Running the app with --debug (or debug=true) prints a Condition Evaluation Report at startup listing every auto-configuration class as either "Positive matches" (applied) or "Negative matches" (why it was rejected, condition by condition).',
    whyItMatters: [
      'This is the practical skill senior engineers are expected to have: diagnosing "why didn\'t my expected auto-configuration apply" by reading which specific @Conditional failed, rather than guessing or randomly adding dependencies'
    ],
    remember: [
      'The report also has an "Unconditional classes" section (classes with no conditions, always applied) and an "Exclusions" section reflecting explicit excludes',
      'For a running app, the same information is exposed via the /actuator/conditions endpoint if Actuator is on the classpath'
    ],
    readMinutes: 2,
    related: ['conditional-on-class', 'excluding-auto-configuration'],
  },
  {
    id: 'excluding-auto-configuration',
    title: 'Excluding Auto-Configuration',
    group: 'Debugging & Customization',
    definition: 'An auto-configuration class can be explicitly excluded via @SpringBootApplication(exclude = ...) / @EnableAutoConfiguration(exclude = ...) at compile time, or via the spring.autoconfigure.exclude property at deploy time, used when its defaults are wrong for your setup or it conflicts with manual configuration.',
    whyItMatters: [
      'Property-based exclusion is preferable when the exclusion needs to differ per environment (e.g. exclude a DataSource auto-config in a test profile) without recompiling',
      'A frequent real scenario: excluding SecurityAutoConfiguration temporarily while bootstrapping a project, or excluding a datasource auto-config when multiple DataSources are configured manually'
    ],
    remember: [
      'The class-based exclude attribute fails fast at startup if the named class isn\'t on the classpath (typo protection); excludeName (String) skips that check for classes you can\'t reference directly'
    ],
    readMinutes: 1,
  },
  {
    id: 'custom-auto-configuration-shape',
    title: 'Shape of a Custom Auto-Configuration/Starter',
    group: 'Debugging & Customization',
    definition: 'A custom auto-configuration is a @Configuration class carrying appropriate @Conditional annotations (and often @AutoConfigureAfter), packaged in a library and registered by listing its fully-qualified name in that library\'s own META-INF/spring/...AutoConfiguration.imports file; a starter around it is just a separate dependency-only module that pulls in the autoconfigure module plus whatever library it configures.',
    whyItMatters: [
      'Senior candidates are expected to understand this shape conceptually — separating "autoconfigure module" (logic) from "starter module" (dependency bundle) mirrors how Spring Boot\'s own starters are structured internally'
    ],
    remember: [
      'Two-module convention: acme-spring-boot-autoconfigure (the @Configuration + conditions) and acme-spring-boot-starter (empty, just depends on the autoconfigure module and acme\'s own client library)',
      'Forgetting to register the class in AutoConfiguration.imports is the most common reason a hand-written auto-configuration "does nothing" — it\'s never discovered'
    ],
    readMinutes: 2,
    related: ['autoconfiguration-discovery-mechanism', 'starter-dependencies'],
  },
]


const sbMvcConcepts: ConceptCard[] = [
// Group: Request Lifecycle
  {
    id: 'dispatcherservlet-front-controller',
    title: 'DispatcherServlet as Front Controller',
    group: 'Request Lifecycle',
    definition: 'A single Servlet registered against the app root that receives every incoming HTTP request and delegates it through handler mapping, invocation, and view/response rendering rather than each URL having its own Servlet.',
    whyItMatters: [
      'Centralizes cross-cutting concerns (exception translation, locale/theme resolution, multipart handling) in one place instead of duplicating them per endpoint',
      'Spring Boot auto-registers and configures it via DispatcherServletAutoConfiguration — no web.xml needed',
    ],
    remember: ['It implements the classic Front Controller pattern', 'One DispatcherServlet per servlet context by default, mapped to "/"'],
    diagram: 'flowchart LR\n  req[Request] --> ds[DispatcherServlet]\n  ds --> hm[HandlerMapping]\n  hm --> ha[HandlerAdapter]\n  ha --> ctrl[Controller]\n  ctrl --> resolve[ViewResolver or MessageConverter]\n  resolve --> resp[Response]',
    readMinutes: 2,
    related: ['handlermapping-handleradapter', 'controller-vs-restcontroller'],
  },
  {
    id: 'handlermapping-handleradapter',
    title: 'HandlerMapping and HandlerAdapter',
    group: 'Request Lifecycle',
    definition: 'HandlerMapping resolves the incoming URL to a specific controller method (a HandlerMethod), and HandlerAdapter is the strategy object that actually knows how to invoke that kind of handler and unwrap its return value.',
    whyItMatters: [
      'The adapter indirection is why Spring MVC can invoke plain @Controller methods, functional RouterFunctions, and legacy Controller-interface beans through the same DispatcherServlet without special-casing each one',
    ],
    remember: ['RequestMappingHandlerMapping matches @RequestMapping-annotated methods by path/method/params/headers/produces', 'RequestMappingHandlerAdapter resolves method arguments and processes the return value'],
    readMinutes: 2,
    related: ['dispatcherservlet-front-controller'],
  },
  {
    id: 'argument-resolvers-return-handlers',
    title: 'HandlerMethodArgumentResolver and ReturnValueHandler',
    group: 'Request Lifecycle',
    definition: 'Pluggable strategy interfaces that let RequestMappingHandlerAdapter populate each controller method parameter (from path, query, body, headers, session, etc.) and interpret each return type, without the adapter hardcoding every annotation.',
    whyItMatters: [
      'Explains how @PathVariable, @RequestParam, @RequestBody, Pageable, and @AuthenticationPrincipal all "just work" as method parameters — each has a dedicated resolver, and you can register your own',
    ],
    remember: ['A custom resolver implements supportsParameter() and resolveArgument()', 'Order matters: resolvers are tried in sequence until one claims the parameter'],
    readMinutes: 2,
    related: ['argument-binding-mechanics'],
  },

  // Group: Controller Mechanics
  {
    id: 'controller-vs-restcontroller',
    title: '@Controller vs @RestController',
    group: 'Controller Mechanics',
    definition: '@RestController is exactly @Controller plus @ResponseBody applied at the type level, so every handler method\'s return value is written straight to the response body via a message converter instead of being resolved as a view name.',
    whyItMatters: [
      'Without @ResponseBody, a @Controller method returning a String is treated as a logical view name and sent to a ViewResolver — a common source of "why did I get a 404 for a view template" bugs when someone forgets it on one method',
      'You can mix: a @Controller class can still expose individual @ResponseBody methods alongside view-returning ones',
    ],
    example: {
      code: {
        language: 'java',
        code: `@Controller\nclass PageController {\n    @GetMapping("/home")\n    String home() { return "home"; } // resolved as a view name, e.g. home.html\n\n    @GetMapping("/health")\n    @ResponseBody\n    String health() { return "OK"; } // written directly to the response body\n}`,
      },
      note: 'Mixing view-returning and body-writing methods in the same @Controller.',
    },
    remember: ['@RestController = @Controller + @ResponseBody, nothing more', '@ResponseBody makes the return value go through HttpMessageConverter selection instead of ViewResolver'],
    interviewAngle: { q: 'What breaks if you accidentally leave @ResponseBody off a JSON-returning method in a @Controller?', a: 'Spring treats the returned string/object as a view name and tries to resolve a template, typically producing a 404 or whitespace response instead of JSON.' },
    readMinutes: 2,
    related: ['dispatcherservlet-front-controller', 'message-converters'],
  },
  {
    id: 'controller-request-scope-thread-safety',
    title: 'Controller Bean Scope and Thread Safety',
    group: 'Controller Mechanics',
    definition: 'A @Controller/@RestController is a singleton bean by default, so a single instance handles every concurrent request on its own thread — any mutable instance field is shared state across requests.',
    whyItMatters: [
      'A field written in one handler method and read in another (instead of using local variables or method parameters) introduces a race condition invisible under low load and load-tested away only by accident',
      'Request-scoped state belongs in method parameters, HttpServletRequest attributes, or an explicitly request-scoped bean, not controller instance fields',
    ],
    remember: ['Controllers are singletons by default like any other @Component', 'Constructor-injected collaborators are fine (assumed stateless/thread-safe); mutable per-request fields are not'],
    readMinutes: 1,
  },
  {
    id: 'requestmapping-specializations',
    title: '@GetMapping/@PostMapping as @RequestMapping Specializations',
    group: 'Controller Mechanics',
    definition: 'The method-specific mapping annotations (@GetMapping, @PostMapping, @PutMapping, @PatchMapping, @DeleteMapping) are meta-annotated @RequestMapping composites that pin the HTTP method attribute, existing purely for readability.',
    whyItMatters: [
      'Understanding the composition means you can build your own meta-annotation (e.g. an @ApiVersion(1) that also fixes a path prefix and a produces type) the same way Spring built these',
    ],
    example: {
      code: {
        language: 'java',
        code: `@Target(ElementType.METHOD)\n@Retention(RetentionPolicy.RUNTIME)\n@RequestMapping(method = RequestMethod.GET)\npublic @interface GetMapping {\n    String[] value() default {};\n}`,
      },
      note: 'Simplified sketch of how @GetMapping is defined as a composed annotation.',
    },
    remember: ['@RequestMapping without a method attribute matches any HTTP method — a frequent source of an endpoint unintentionally accepting POST'],
    readMinutes: 1,
  },

  // Group: Data Binding & Serialization
  {
    id: 'argument-binding-mechanics',
    title: '@PathVariable, @RequestParam, @RequestBody Resolution',
    group: 'Data Binding & Serialization',
    definition: 'Each annotation is handled by a distinct argument resolver: @PathVariable pulls a named segment out of the matched URI template, @RequestParam reads query/form parameters with type conversion via a ConversionService, and @RequestBody hands the raw request body to an HttpMessageConverter for deserialization.',
    whyItMatters: [
      '@RequestBody can only be bound once per method — the input stream is consumed on first read, so you cannot bind two @RequestBody parameters',
      '@RequestParam on a primitive without a default throws MissingServletRequestParameterException (400) rather than silently passing null',
    ],
    example: {
      code: {
        language: 'java',
        code: `@PatchMapping("/orders/{id}")\nResponseEntity<Order> update(@PathVariable Long id,\n                             @RequestParam(defaultValue = "false") boolean notify,\n                             @RequestBody @Valid OrderPatch patch) { ... }`,
      },
    },
    remember: ['@PathVariable name must match the {template} segment unless the class is compiled with -parameters', 'Type mismatches (e.g. non-numeric id) surface as 400 via a TypeMismatchException / MethodArgumentTypeMismatchException'],
    readMinutes: 2,
    related: ['argument-resolvers-return-handlers', 'message-converters'],
  },
  {
    id: 'message-converters',
    title: 'HttpMessageConverter and Content Negotiation',
    group: 'Data Binding & Serialization',
    definition: 'HttpMessageConverter implementations translate between the raw HTTP body and Java objects in both directions; Spring Boot registers MappingJackson2HttpMessageConverter by default, and picks which converter to use for a response by matching the request\'s Accept header against each converter\'s supported media types.',
    whyItMatters: [
      'This is the actual mechanism behind @RequestBody deserialization and @ResponseBody/@RestController serialization — Jackson isn\'t special-cased, it\'s just the converter that wins by default because it\'s on the classpath',
      'Swap in a different converter (or add one, e.g. for Protobuf or XML via Jackson XML) without touching controller code',
    ],
    remember: ['Content negotiation for output is Accept-header driven by default; for input, Content-Type on the request selects the converter', 'No converter matching Accept produces a 406 Not Acceptable; no converter matching Content-Type produces a 415 Unsupported Media Type'],
    interviewAngle: { q: 'A client sends Accept: application/xml but the app only has the Jackson JSON converter on the classpath — what happens?', a: '406 Not Acceptable, because no registered HttpMessageConverter declares support for application/xml.' },
    readMinutes: 2,
    related: ['argument-binding-mechanics', 'controller-vs-restcontroller'],
  },
  {
    id: 'responseentity-vs-plain-return',
    title: 'ResponseEntity vs Plain Return Types',
    group: 'Data Binding & Serialization',
    definition: 'Returning a plain object from a @ResponseBody method always serializes with an inferred 200 OK, while ResponseEntity<T> gives explicit control over status code, headers, and body — required whenever the status isn\'t always 200.',
    whyItMatters: [
      'Correctly modeling REST semantics at the Spring level means reaching for ResponseEntity for 201 with a Location header on create, 204 with no body on delete, or conditional 304s — a plain return type can\'t express any of that',
    ],
    example: {
      code: {
        language: 'java',
        code: `@PostMapping("/orders")\nResponseEntity<Order> create(@RequestBody @Valid NewOrder req) {\n    Order saved = service.create(req);\n    URI location = URI.create("/orders/" + saved.getId());\n    return ResponseEntity.created(location).body(saved); // 201 + Location header\n}\n\n@DeleteMapping("/orders/{id}")\nResponseEntity<Void> delete(@PathVariable Long id) {\n    service.delete(id);\n    return ResponseEntity.noContent().build(); // 204, empty body\n}`,
      },
    },
    remember: ['201 Created pairs with a Location header pointing at the new resource', '204 No Content for a successful delete or an update with nothing meaningful to return', 'PUT is idempotent full-replace semantics; PATCH is a partial, not-necessarily-idempotent update — both usually return 200 (with body) or 204'],
    readMinutes: 2,
    related: ['message-converters'],
  },

  // Group: Interceptors & Filters
  {
    id: 'interceptor-vs-filter',
    title: 'HandlerInterceptor vs Servlet Filter',
    group: 'Interceptors & Filters',
    definition: 'A Servlet Filter runs at the container level before the request ever reaches DispatcherServlet (and can short-circuit it entirely), while a HandlerInterceptor runs inside Spring MVC\'s handling after the handler has been resolved, giving it access to the matched HandlerMethod itself.',
    whyItMatters: [
      'Filters are the right layer for framework-agnostic concerns (raw request/response wrapping, security filter chains, CORS at the edge, compression) since they apply even to requests DispatcherServlet never handles',
      'Interceptors are the right layer when the logic needs to know which controller/method matched (e.g. reading an annotation on the handler for auth or logging) — that information doesn\'t exist yet in a Filter',
    ],
    remember: ['Filter order: Filter chain -> DispatcherServlet -> HandlerInterceptor.preHandle -> controller -> postHandle -> afterCompletion', 'preHandle returning false short-circuits the chain before the controller runs'],
    interviewAngle: { q: 'Why can\'t a Filter read a custom annotation on the matched controller method?', a: 'A Filter runs before DispatcherServlet has resolved the request to a handler at all, so no HandlerMethod exists yet for it to inspect — that resolution only happens inside Spring MVC, which is what HandlerInterceptor has access to.' },
    readMinutes: 2,
    related: ['dispatcherservlet-front-controller'],
  },
  {
    id: 'cors-configuration',
    title: 'CORS Configuration (@CrossOrigin and Global CorsConfiguration)',
    group: 'Interceptors & Filters',
    definition: 'Browsers block cross-origin responses by default (same-origin policy), so Spring MVC must be told explicitly which origins/methods/headers to allow, either per-endpoint via @CrossOrigin or globally via a CorsConfigurationSource/WebMvcConfigurer bean.',
    whyItMatters: [
      'CORS is enforced by the browser, not the server — a curl request or server-to-server call always "succeeds" regardless of CORS config, which is why CORS bugs only show up in browser testing and confuse people expecting the server to reject the request',
      'A preflight OPTIONS request must be allowed through the security filter chain (if Spring Security is present) or it fails before the actual request is even attempted',
    ],
    remember: ['@CrossOrigin on a controller/method scopes to that mapping only; a global CorsConfigurationSource bean applies app-wide and composes better with Spring Security', 'allowCredentials(true) cannot be combined with allowedOrigins("*") — must list explicit origins'],
    readMinutes: 2,
  },
]

const sbValidationExceptionsConcepts: ConceptCard[] = [
// Group: Bean Validation Fundamentals
  {
    id: 'valid-vs-validated',
    title: '@Valid vs @Validated',
    group: 'Bean Validation Fundamentals',
    definition: '@Valid is the standard JSR 380/Jakarta annotation that triggers cascading Bean Validation with no support for validation groups, while @Validated is Spring\'s own annotation that adds group-based validation and, on a class, enables AOP-driven method-parameter validation.',
    whyItMatters: [
      'Choosing @Valid when you actually need groups (e.g. create vs update rules) silently ignores the group and validates everything',
      '@Validated on a class is what makes Spring wrap the bean in a validation-aware proxy for method-level checks',
    ],
    remember: [
      '@Valid = javax/jakarta.validation, no groups, works on method params, fields, and cascades into nested objects',
      '@Validated = org.springframework.validation.annotation, supports groups, required at class level for AOP method validation',
      'You can mix them: @Valid on a nested field, @Validated on the controller/service class',
    ],
    interviewAngle: {
      q: 'Why would @Valid silently fail to apply create-only validation rules?',
      a: '@Valid has no concept of validation groups, so a @NotNull(groups = OnCreate.class) constraint is evaluated against the Default group only and effectively never triggers under @Valid.',
    },
    readMinutes: 2,
    related: ['validation-groups', 'method-level-validation-gotcha'],
  },
  {
    id: 'notnull-notempty-notblank',
    title: '@NotNull vs @NotEmpty vs @NotBlank',
    group: 'Bean Validation Fundamentals',
    definition: '@NotNull rejects only null, @NotEmpty additionally rejects an empty string/collection/array/map, and @NotBlank (strings only) additionally rejects a string that is all whitespace.',
    whyItMatters: [
      'Using @NotNull on a String field silently accepts "" and "   " as valid input — a classic source of downstream blank-string bugs',
      '@NotEmpty is the right choice for collections and arrays since @NotBlank does not apply to them',
    ],
    remember: [
      '@NotBlank trims and checks length > 0, so it is stricter than @NotEmpty for strings',
      '@NotEmpty requires the value to be non-null AND have size/length > 0',
      'None of the three validate format — combine with @Pattern, @Email, @Size as needed',
    ],
    readMinutes: 1,
  },
  {
    id: 'request-body-valid-trigger',
    title: 'Where Validation Auto-Triggers',
    group: 'Bean Validation Fundamentals',
    definition: 'Spring MVC only auto-validates a @RequestBody (or form-backing) argument annotated with @Valid/@Validated on a controller handler method — nothing else runs validation for you.',
    whyItMatters: [
      '@RequestParam, @PathVariable, and @RequestHeader arguments are NOT validated by @Valid on the parameter itself in the same way — they need @Validated on the class plus constraint annotations directly on the parameter',
      'This is where the "validation just didn\'t run" surprise usually starts for a plain object passed around internally',
    ],
    remember: [
      'The interceptor for @RequestBody validation is RequestResponseBodyMethodProcessor, invoked by an ArgumentResolver before the handler body executes',
      'A @ModelAttribute with @Valid uses a different path (WebDataBinder) but still only fires on controller method parameters',
    ],
    readMinutes: 2,
    related: ['method-level-validation-gotcha'],
  },

  // Group: Validation Gotchas
  {
    id: 'method-level-validation-gotcha',
    title: 'Service-Layer Method Validation Requires AOP',
    group: 'Validation Gotchas',
    definition: 'Validating a plain method parameter on a service bean (e.g. @NotBlank String email in a non-controller method) only works if the class is annotated @Validated, because Spring implements method validation via a BeanPostProcessor that wraps the bean in an AOP proxy intercepting calls to check @Constraint-annotated parameters.',
    whyItMatters: [
      'Forgetting the class-level @Validated means the constraint annotations are silently inert — no exception, no validation, code just runs with bad data',
      'Because it is proxy-based, self-invocation (a method calling another method on `this`) bypasses the check entirely, same limitation as @Transactional',
    ],
    example: {
      code: {
        language: 'java',
        code: `@Validated
@Service
public class AccountService {

    public void register(@NotBlank @Email String email, @Min(18) int age) {
        // MethodValidationInterceptor validates args before this runs
    }
}`,
      },
      note: 'Without @Validated on the class, @NotBlank/@Email/@Min here are never evaluated.',
    },
    remember: [
      'Powered by MethodValidationPostProcessor registering a MethodValidationInterceptor around the bean',
      'Throws ConstraintViolationException (not MethodArgumentNotValidException) on failure',
      'Self-invocation and private methods are not intercepted, same as any Spring AOP proxy limitation',
    ],
    interviewAngle: {
      q: 'A senior dev added @NotBlank to a service method parameter and it never fires. Why?',
      a: 'The class is missing @Validated — without it Spring never wraps the bean in the AOP proxy that performs method-parameter validation, so the constraint annotation is just inert metadata.',
    },
    readMinutes: 2,
    related: ['valid-vs-validated', 'constraint-violation-exception'],
  },
  {
    id: 'constraint-violation-exception',
    title: 'ConstraintViolationException vs MethodArgumentNotValidException',
    group: 'Validation Gotchas',
    definition: 'Controller-level @Valid failures on a @RequestBody throw MethodArgumentNotValidException, while class-level @Validated method-parameter failures (service layer) or direct Validator.validate() calls throw ConstraintViolationException — two different exception types requiring two different @ExceptionHandler methods.',
    whyItMatters: [
      'A @ControllerAdvice that only handles MethodArgumentNotValidException lets ConstraintViolationException from a service-layer @Validated method fall through as an unhandled 500',
      'The two exceptions expose errors differently: BindingResult/FieldError vs a Set<ConstraintViolation<?>>, so extraction code cannot be shared as-is',
    ],
    remember: [
      'MethodArgumentNotValidException: controller @RequestBody @Valid failures',
      'ConstraintViolationException: service-layer @Validated method param failures, or manual Validator usage',
      'Both should map to HTTP 400, but need separate handler methods',
    ],
    readMinutes: 1,
  },

  // Group: Custom Validators & Groups
  {
    id: 'custom-constraint-validator',
    title: 'Custom Validators (ConstraintValidator)',
    group: 'Custom Validators & Groups',
    definition: 'A custom validation rule is built by defining an annotation with @Constraint pointing at an implementation of ConstraintValidator<AnnotationType, FieldType>, whose isValid method contains the logic.',
    whyItMatters: [
      'Custom validators can be made Spring-aware (autowire a repository to check DB uniqueness, for example) because Spring manages ConstraintValidator instances as beans via a SpringConstraintValidatorFactory',
      'Cross-field validation (e.g. password == confirmPassword) belongs on a class-level custom constraint, not a field-level one, since it needs access to multiple fields',
    ],
    example: {
      code: {
        language: 'java',
        code: `@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueEmailValidator.class)
public @interface UniqueEmail {
    String message() default "email already registered";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {
    private final UserRepository repo;
    UniqueEmailValidator(UserRepository repo) { this.repo = repo; }

    public boolean isValid(String email, ConstraintValidatorContext ctx) {
        return email == null || !repo.existsByEmail(email);
    }
}`,
      },
      note: 'Constructor injection works because Spring supplies the ConstraintValidatorFactory.',
    },
    remember: [
      'The three attributes message/groups/payload are required on every custom annotation — Bean Validation reflectively expects them',
      'isValid should treat null as valid; pair with @NotNull separately if null is disallowed',
    ],
    readMinutes: 2,
  },
  {
    id: 'validation-groups',
    title: 'Validation Groups',
    group: 'Custom Validators & Groups',
    definition: 'Validation groups let one DTO carry different constraint sets for different operations (e.g. id must be null on create but required on update) by tagging constraints with a group marker interface and selecting the group with @Validated(OnCreate.class).',
    whyItMatters: [
      'Avoids maintaining two near-identical DTOs (CreateUserRequest/UpdateUserRequest) just to vary one or two fields\' rules',
      'Only works with @Validated, not @Valid — a common reason groups appear to be "ignored"',
    ],
    example: {
      code: {
        language: 'java',
        code: `interface OnCreate {}
interface OnUpdate {}

class UserDto {
    @Null(groups = OnCreate.class)
    @NotNull(groups = OnUpdate.class)
    Long id;

    @NotBlank(groups = { OnCreate.class, OnUpdate.class })
    String name;
}

@PostMapping
ResponseEntity<?> create(@Validated(OnCreate.class) @RequestBody UserDto dto) { ... }`,
      },
    },
    remember: [
      'Constraints with no explicit groups() belong to the Default group and always run unless a specific group list excludes them',
      'Group interfaces are pure markers — no methods, just used as type tokens',
    ],
    readMinutes: 2,
    related: ['valid-vs-validated'],
  },
  {
    id: 'nested-validation-cascade',
    title: 'Cascading Validation into Nested Objects',
    group: 'Custom Validators & Groups',
    definition: 'Bean Validation only descends into a nested object or collection element when the field/getter holding it is itself annotated @Valid — validating the parent alone does not automatically validate its children.',
    whyItMatters: [
      'A common bug: top-level DTO fields are validated but a nested Address or a List<LineItem> silently skips its own constraints because @Valid was left off that field',
      'For collections, @Valid must be on the collection field itself; each element is then validated individually',
    ],
    example: {
      code: {
        language: 'java',
        code: `class OrderRequest {
    @NotBlank String customerId;

    @Valid  // required, or Address's constraints never run
    Address shippingAddress;

    @Valid  // required, or each LineItem's constraints never run
    List<LineItem> items;
}`,
      },
    },
    remember: ['Missing @Valid on the nested field is the single most common reason "validation isn\'t working" for a nested DTO'],
    readMinutes: 1,
  },

  // Group: Global Exception Handling
  {
    id: 'controller-advice-exception-handler',
    title: '@ControllerAdvice + @ExceptionHandler',
    group: 'Global Exception Handling',
    definition: '@ControllerAdvice marks a class as a global, cross-controller component whose @ExceptionHandler methods intercept exceptions thrown from any @Controller, letting you centralize error-response construction instead of try/catch in every handler.',
    whyItMatters: [
      'When multiple @ExceptionHandler methods could match a thrown exception, Spring picks the most specific matching exception type in the class\'s type hierarchy, not declaration order',
      '@ControllerAdvice can be scoped with basePackages/assignableTypes/annotations to avoid one advice bean swallowing exceptions meant for a different module',
    ],
    example: {
      code: {
        language: 'java',
        code: `@RestControllerAdvice
class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ProblemDetail> handleValidation(MethodArgumentNotValidException ex) { ... }

    @ExceptionHandler(EntityNotFoundException.class)
    ResponseEntity<ProblemDetail> handleNotFound(EntityNotFoundException ex) { ... }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ProblemDetail> handleFallback(Exception ex) { ... }
}`,
      },
      note: '@RestControllerAdvice = @ControllerAdvice + @ResponseBody on every handler method.',
    },
    remember: [
      'Resolution uses the exception\'s class hierarchy distance, not the order methods appear in the file',
      'A catch-all Exception.class handler is good practice but must never leak stack traces — log server-side, return a generic message',
    ],
    readMinutes: 2,
    related: ['response-entity-exception-handler', 'exception-leakage-risk'],
  },
  {
    id: 'response-entity-exception-handler',
    title: 'ResponseEntityExceptionHandler',
    group: 'Global Exception Handling',
    definition: 'ResponseEntityExceptionHandler is a base class Spring provides with pre-built handling for common Spring MVC exceptions (MethodArgumentNotValidException, HttpMessageNotReadableException, etc.), which you extend and override to customize the response body while inheriting the resolution wiring.',
    whyItMatters: [
      'Extending it instead of writing @ExceptionHandler(MethodArgumentNotValidException.class) from scratch keeps you aligned with framework exceptions Spring itself throws internally (e.g. for unsupported media type, missing params)',
      'The overridable methods (handleMethodArgumentNotValid, handleExceptionInternal) give a single seam to standardize on ProblemDetail across all built-in MVC exceptions',
    ],
    remember: [
      'It only pre-handles exceptions the framework itself throws — your custom business exceptions still need their own @ExceptionHandler',
      'Since Spring 6 / Boot 3, its default handlers already return ProblemDetail-shaped bodies',
    ],
    readMinutes: 2,
    related: ['problem-detail-rfc7807'],
  },
  {
    id: 'method-argument-not-valid-extraction',
    title: 'Extracting Field Errors from MethodArgumentNotValidException',
    group: 'Global Exception Handling',
    definition: 'MethodArgumentNotValidException carries a BindingResult with the failed FieldErrors (and global ObjectErrors for class-level constraints), which must be walked and mapped into a client-friendly field-to-message structure rather than returned as the raw exception.',
    whyItMatters: [
      'The default Spring error page/response for this exception is verbose and not meant for API consumers as-is — real APIs map it into a compact {field, message} list',
      'getFieldErrors() only returns field-level violations; class-level (cross-field) constraint failures show up separately via getGlobalErrors()',
    ],
    example: {
      code: {
        language: 'java',
        code: `@ExceptionHandler(MethodArgumentNotValidException.class)
ResponseEntity<ProblemDetail> handleValidation(MethodArgumentNotValidException ex) {
    Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
        .collect(Collectors.toMap(
            FieldError::getField,
            fe -> Optional.ofNullable(fe.getDefaultMessage()).orElse("invalid"),
            (a, b) -> a));

    ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
    pd.setTitle("Validation failed");
    pd.setProperty("errors", fieldErrors);
    return ResponseEntity.badRequest().body(pd);
}`,
      },
    },
    remember: ['FieldError::getRejectedValue exposes the actual bad input if you want to echo it back (careful with sensitive fields)'],
    readMinutes: 2,
  },

  // Group: Error Response Design
  {
    id: 'problem-detail-rfc7807',
    title: 'ProblemDetail (RFC 7807)',
    group: 'Error Response Design',
    definition: 'ProblemDetail is Spring 6/Boot 3\'s built-in implementation of RFC 7807 "application/problem+json", a standardized error body shape (type, title, status, detail, instance, plus extension properties) that replaces one-off hand-rolled error DTOs.',
    whyItMatters: [
      'Standardizing on it means every error response across the API — validation failures, not-found, business rule violations — shares one predictable, machine-parseable shape instead of each team inventing its own {errorCode, msg} format',
      'setProperty lets you attach extra fields (like the field-error map) while staying spec-compliant, since consumers of RFC 7807 tolerate unknown extension members',
    ],
    example: {
      code: {
        language: 'java',
        code: `ProblemDetail pd = ProblemDetail.forStatusAndDetail(
    HttpStatus.NOT_FOUND, "Order 42 does not exist");
pd.setTitle("Order Not Found");
pd.setProperty("orderId", 42);`,
      },
    },
    remember: [
      'Content type is application/problem+json, distinct from a plain application/json error body',
      'Available out of the box since Spring Framework 6 / Spring Boot 3 — earlier versions need a hand-rolled equivalent',
    ],
    readMinutes: 2,
    related: ['response-entity-exception-handler'],
  },
  {
    id: 'exception-handling-architecture',
    title: 'Where Should Exceptions Be Caught?',
    group: 'Error Response Design',
    definition: 'The recommended default is: let business/validation exceptions propagate unhandled up from services, and catch them exactly once at a global @ControllerAdvice boundary — catching and translating exceptions inline in every controller or service method duplicates error-shaping logic and couples business code to HTTP concerns.',
    whyItMatters: [
      'Service-layer try/catch that builds an HTTP-shaped response leaks a web-layer concern into code that might also be called from a batch job or message listener with no HTTP context',
      'A global filter (pre-DispatcherServlet) can only catch exceptions from filters/security, not exceptions thrown inside a controller method — @ControllerAdvice is the correct layer for handler-thrown exceptions',
    ],
    remember: [
      'Services should throw specific, meaningful exceptions (e.g. OrderNotFoundException) — not build ResponseEntity or HTTP status codes themselves',
      '@ControllerAdvice is a Spring MVC concept and will not catch exceptions thrown by a Filter or by Spring Security\'s own chain — those need a dedicated filter-level handler',
    ],
    interviewAngle: {
      q: 'Why not just catch exceptions in every controller method?',
      a: 'It scatters identical error-shaping logic across every handler, makes response format inconsistent as the codebase grows, and mixes business logic with HTTP-response concerns; a single @ControllerAdvice keeps translation in one place.',
    },
    readMinutes: 2,
  },
  {
    id: 'exception-leakage-risk',
    title: 'Exception Detail Leakage Risk',
    group: 'Error Response Design',
    definition: 'Returning a raw exception message or stack trace in an API error response can leak internal implementation details (SQL fragments, class names, file paths, library versions) that help an attacker map the system, so production error handlers should log the full exception server-side and return a sanitized, generic message to the client.',
    whyItMatters: [
      'Spring Boot\'s default whitelabel error page and default error attributes can include a "trace" field if server.error.include-stacktrace is misconfigured — an easy accidental leak in production',
      'A catch-all Exception.class handler in @ControllerAdvice is exactly the place this gets enforced: never call ex.getMessage() straight into the response body for unexpected exceptions',
    ],
    remember: [
      'Distinguish exceptions safe to expose (validation messages you authored) from ones that are not (a raw DataAccessException or NullPointerException message)',
      'server.error.include-stacktrace and include-message should be never/on-param, not always, outside of local dev',
    ],
    readMinutes: 1,
    related: ['controller-advice-exception-handler'],
  },
]

const sbDataJpaConcepts: ConceptCard[] = [
// --- Repository Hierarchy ---
  {
    id: 'crud-paging-repository-hierarchy',
    title: 'Repository, CrudRepository, PagingAndSortingRepository, JpaRepository',
    group: 'Repository Hierarchy',
    definition: 'Each interface in the Spring Data hierarchy adds a narrow slice of behavior — Repository is a marker, CrudRepository adds basic CRUD, PagingAndSortingRepository adds paging/sorting, and JpaRepository adds JPA-specific extras like batch operations and flushing.',
    whyItMatters: [
      'JpaRepository extends both CrudRepository and PagingAndSortingRepository, so extending it directly gives you everything without picking a level',
      'Extending a narrower interface (e.g. just CrudRepository) is a deliberate API-surface restriction, not the default choice',
    ],
    remember: [
      'JpaRepository adds saveAndFlush(), deleteInBatch(), and getReferenceById() (lazy proxy) on top of the generic CrudRepository',
      'In practice almost every repository just extends JpaRepository<T, ID> — the lower levels matter mainly when you\'re writing generic, storage-agnostic library code',
    ],
    readMinutes: 1,
    related: ['repository-proxy-mechanism'],
  },
  {
    id: 'repository-proxy-mechanism',
    title: 'Repository Proxy Mechanism',
    group: 'Repository Hierarchy',
    definition: 'At startup, Spring Data\'s RepositoryFactoryBean scans for interfaces extending Repository and generates a runtime JDK dynamic proxy for each — you never write an implementation class.',
    whyItMatters: [
      'The proxy delegates CRUD methods to SimpleJpaRepository and routes your custom finder methods through a query-derivation or @Query execution path',
      'Understanding this explains why a repository interface with zero methods still works, and why adding a method with a typo in its name fails at startup, not at call time',
    ],
    remember: [
      'Query derivation and @Query parsing happen eagerly during ApplicationContext startup — a broken method name or invalid JPQL surfaces as a startup failure, not a runtime NoSuchMethodError',
      'Custom logic beyond derivation/@Query requires a fragment interface + impl class that the proxy composes in alongside SimpleJpaRepository',
    ],
    diagram: 'flowchart LR\n  a[Repository Interface] --> b[RepositoryFactoryBean]\n  b --> c[Dynamic Proxy]\n  c --> d[SimpleJpaRepository]\n  c --> e[Derived Query Executor]',
    readMinutes: 2,
    related: ['crud-paging-repository-hierarchy', 'derived-query-methods'],
  },

  // --- Query Methods ---
  {
    id: 'derived-query-methods',
    title: 'Derived Query Methods',
    group: 'Query Methods',
    definition: 'Spring Data parses a repository method\'s name against a fixed grammar (findBy, existsBy, countBy, deleteBy, combined with And/Or, comparison keywords, OrderBy) and generates the corresponding JPQL automatically.',
    whyItMatters: [
      'Zero query code for common filters, and the query is validated at startup against the entity\'s actual property names',
      'Method names balloon past readability once you chain more than 2-3 conditions — findByLastNameAndStatusAndCreatedAtBetweenOrderByLastNameAsc is a maintenance smell that argues for @Query or Specification instead',
    ],
    remember: [
      'Property traversal works across relationships too — findByAddress_City resolves through a nested object via the underscore, needed when the property name itself contains an underscore-adjacent ambiguity',
      'Keywords like Top3, First, Distinct, and IgnoreCase compose into the same naming grammar',
    ],
    interviewAngle: {
      q: 'At what point does a derived query method name become worse than just writing @Query?',
      a: 'Once it needs more than ~2-3 conditions, involves a join across relationships for filtering (not just navigation), or needs a projection/aggregation — @Query becomes more readable and more flexible than continuing to grow the method name.',
    },
    readMinutes: 2,
    related: ['repository-proxy-mechanism', 'query-annotation-jpql-native'],
  },
  {
    id: 'query-annotation-jpql-native',
    title: '@Query — JPQL vs Native SQL',
    group: 'Query Methods',
    definition: '@Query lets you supply JPQL (entity-object-oriented, database-agnostic) or, with nativeQuery = true, raw SQL against the actual schema, for queries too complex for name derivation.',
    whyItMatters: [
      'JPQL operates on entities and their mapped properties, so it stays portable across databases and lets you return entities or DTO projections directly',
      'Native SQL is needed for database-specific features (window functions, CTEs, vendor hints) but couples the repository to a specific SQL dialect and bypasses JPQL\'s entity-graph validation at startup',
    ],
    remember: [
      'Native queries returning something other than a mapped entity typically need a DTO projection interface/class plus a matching column alias, or a @SqlResultSetMapping',
      'JPQL supports constructor expressions (new com.example.SummaryDto(u.id, u.name)) for cheap DTO projection without a native query',
    ],
    example: {
      code: {
        language: 'java',
        code: `@Query("SELECT new com.example.dto.OrderSummary(o.id, o.total, o.customer.name) " +
       "FROM Order o WHERE o.status = :status")
List<OrderSummary> findSummariesByStatus(@Param("status") OrderStatus status);

@Query(value = "SELECT * FROM orders WHERE total > :min ORDER BY total DESC LIMIT :n",
       nativeQuery = true)
List<Order> findTopOrdersNative(@Param("min") BigDecimal min, @Param("n") int n);`,
      },
      note: 'Constructor-expression JPQL avoids a native query for a simple DTO projection.',
    },
    readMinutes: 2,
    related: ['derived-query-methods', 'entity-vs-dto-projection'],
  },

  // --- Entity Mapping ---
  {
    id: 'entity-id-generation-strategies',
    title: '@GeneratedValue Strategies',
    group: 'Entity Mapping',
    definition: '@GeneratedValue(strategy = ...) controls how primary keys are produced — AUTO lets the provider pick, IDENTITY delegates to a DB auto-increment column, SEQUENCE uses a database sequence object, and TABLE simulates a sequence with a lookup table.',
    whyItMatters: [
      'IDENTITY forces Hibernate to insert each row individually to learn the generated key, which disables JDBC batch inserts for that entity — a real throughput cost on bulk-insert workloads',
      'SEQUENCE lets Hibernate pre-allocate a block of IDs (allocationSize) and assign them in memory before hitting the database, preserving batching — which is why it\'s generally preferred over IDENTITY when the database supports sequences (e.g. Postgres, Oracle) but MySQL historically didn\'t, making IDENTITY common there',
    ],
    remember: [
      'allocationSize on @SequenceGenerator must match the database sequence\'s INCREMENT BY, or you get ID gaps or collisions',
      'AUTO defers the choice to the persistence provider/dialect — fine for prototyping, but an explicit strategy is more predictable in production',
    ],
    readMinutes: 2,
    related: ['persistence-context-first-level-cache'],
  },

  // --- Relationship Mapping ---
  {
    id: 'relationship-ownership-mappedby',
    title: 'Relationship Ownership and mappedBy',
    group: 'Relationship Mapping',
    definition: 'In a bidirectional association, the owning side holds the foreign-key column and is what Hibernate actually writes to the database; the inverse side declares mappedBy to say "my counterpart owns this relationship, I\'m just a read view."',
    whyItMatters: [
      'Setting only the inverse side of a bidirectional relationship in application code (e.g. adding to a mappedBy collection but never setting the owning-side reference) silently persists nothing — a classic source of "I set it but the FK is still null" bugs',
      'In @ManyToOne/@OneToMany pairs, the @ManyToOne side is always the owner (it holds the FK column); @OneToMany carries mappedBy pointing at the @ManyToOne field on the other side',
    ],
    remember: [
      '@ManyToMany needs an explicit owner too — one side has @JoinTable, the other has mappedBy referencing it',
      'Keeping both sides in sync (a helper method like addItem() that sets both directions) is the application\'s responsibility; JPA does not do it for you',
    ],
    diagram: 'flowchart LR\n  a[Order owning side] -- holds foreign key --> b[OrderItem]\n  b -- mappedBy order --> a',
    interviewAngle: {
      q: 'You added a child to a parent\'s mappedBy collection and called save on the parent, but the child\'s foreign key is still null. Why?',
      a: 'The mappedBy side is inverse — it doesn\'t control the foreign key. You must set the reference on the owning (@ManyToOne) side of the child entity itself; the parent-side collection is just for object-graph navigation, not for persistence.',
    },
    readMinutes: 2,
    related: ['entity-id-generation-strategies'],
  },

  // --- Projections & API Design ---
  {
    id: 'entity-vs-dto-projection',
    title: 'Entity Exposure vs DTO Projection',
    group: 'Projections',
    definition: 'Repositories can return managed entities directly, but returning them straight through an API layer couples the wire format to the persistence model and risks serializing lazy proxies or unintended fields — interface-based or class-based projections decouple the two.',
    whyItMatters: [
      'An interface projection (a Java interface with getter methods matching a subset of entity properties) lets Spring Data generate an optimized query that selects only those columns',
      'A class-based (DTO) projection via a JPQL constructor expression gives full control over the returned shape, including computed or joined fields, without exposing entity internals',
    ],
    remember: [
      'Returning entities from a @RestController risks LazyInitializationException on unfetched associations once outside the persistence context, plus accidental exposure of internal fields',
      'Interface projections can be "open" (a default method combining fields, evaluated in-memory) or "closed" (only getters matching entity properties, which Spring Data can turn into a column-limited query)',
    ],
    readMinutes: 2,
    related: ['query-annotation-jpql-native'],
  },

  // --- Persistence Context ---
  {
    id: 'persistence-context-first-level-cache',
    title: 'Persistence Context (First-Level Cache)',
    group: 'Persistence Context',
    definition: 'Within a single EntityManager (scoped to one transaction), the persistence context acts as an identity map — loading the same row twice returns the exact same Java object reference, and modifications are tracked for automatic dirty checking.',
    whyItMatters: [
      'Dirty checking means you don\'t call save() to persist a change to a managed entity — mutating a field is enough; the change is written on flush without an explicit call',
      'Flush timing (usually at transaction commit, or before a query that could be affected by pending changes) is what actually hits the database — understanding this explains why a change is visible to code in the same transaction before any SQL has run',
    ],
    remember: [
      'The identity guarantee holds only within one persistence context/transaction — the same row fetched in two separate transactions gives two distinct object instances',
      'A detached entity (after the transaction/session ends) no longer participates in dirty checking — mutating it does nothing until it\'s re-merged',
    ],
    readMinutes: 2,
    related: ['entity-id-generation-strategies'],
  },

  // --- Advanced Querying ---
  {
    id: 'specification-criteria-api',
    title: 'Specification / Criteria API for Dynamic Queries',
    group: 'Advanced Querying',
    definition: 'When filter combinations are only known at runtime (optional search fields, dynamic sort/filter UIs), the JpaSpecificationExecutor lets you compose Specification<T> predicates programmatically instead of writing every combination as a derived method or @Query.',
    whyItMatters: [
      'Derived method names and static @Query can\'t express "filter by whichever of these 5 fields the caller actually supplied" — you\'d need 2^5 method variants',
      'Specifications compose with and()/or(), so a search endpoint builds a predicate tree conditionally based on which filters are non-null, then passes the composed Specification to findAll()',
    ],
    remember: [
      'Built on top of the JPA Criteria API, which is type-safe but verbose — Specifications are the pragmatic middle ground between derived methods and hand-rolled CriteriaBuilder code',
      'A repository must extend JpaSpecificationExecutor<T> in addition to JpaRepository to gain findAll(Specification<T>)',
    ],
    example: {
      code: {
        language: 'java',
        code: `public static Specification<Order> hasStatus(OrderStatus status) {
    return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
}
public static Specification<Order> minTotal(BigDecimal min) {
    return (root, query, cb) -> min == null ? null : cb.ge(root.get("total"), min);
}

Specification<Order> spec = Specification.where(hasStatus(status)).and(minTotal(min));
orderRepository.findAll(spec);`,
      },
      note: 'Returning null from a Specification lambda means "no constraint" — Spring Data\'s and()/or() combinators skip null predicates.',
    },
    readMinutes: 2,
    related: ['derived-query-methods'],
  },
  {
    id: 'jpa-auditing',
    title: 'Spring Data JPA Auditing',
    group: 'Advanced Querying',
    definition: '@EnableJpaAuditing plus @CreatedDate, @LastModifiedDate, @CreatedBy, and @LastModifiedBy fields on an entity (or an @EmbeddedListener base class) automatically populate timestamp and actor metadata on persist/update via an entity listener.',
    whyItMatters: [
      'Removes hand-written boilerplate for setting createdAt/updatedAt in every service method — the AuditingEntityListener intercepts @PrePersist/@PreUpdate',
      '@CreatedBy/@LastModifiedBy require a registered AuditorAware<T> bean telling Spring Data how to resolve "the current user" (e.g. from SecurityContext) — without it those fields silently stay null',
    ],
    remember: [
      'Entities need @EntityListeners(AuditingEntityListener.class) (directly or via a shared @MappedSuperclass) for the annotations to actually fire',
      'Auditing writes happen through the same persistence-context flush as any other change — it doesn\'t create a separate audit trail/history table on its own',
    ],
    readMinutes: 1,
  },
]

export const springBootConcepts: ConceptSection[] = [
  {
    id: 'sb-concept-ioc-di',
    subtopic: 'sb-ioc-di',
    title: 'IoC Container & Dependency Injection',
    intro: 'Spring\'s core value proposition — objects don\'t construct their own dependencies, the container does. This covers injection strategies, component scanning, and the design judgment senior engineers apply when wiring beans.',
    concepts: sbIocDiConcepts,
  },
  {
    id: 'sb-concept-bean-lifecycle',
    subtopic: 'sb-bean-lifecycle',
    title: 'Bean Lifecycle & Scopes',
    intro: 'What actually happens between a bean definition and a bean ready for use — scopes, lifecycle callbacks, post-processors, and the circular dependency resolution mechanics that trip up even experienced Spring developers.',
    concepts: sbBeanLifecycleConcepts,
  },
  {
    id: 'sb-concept-autoconfiguration',
    subtopic: 'sb-autoconfiguration',
    title: 'Auto-Configuration & Starters',
    intro: 'What Spring Boot actually adds on top of plain Spring — the auto-configuration mechanism, conditional annotations, and the debugging skill of figuring out why an expected auto-configuration did or didn\'t apply.',
    concepts: sbAutoconfigurationConcepts,
  },
  {
    id: 'sb-concept-mvc',
    subtopic: 'sb-mvc',
    title: 'Spring MVC & REST Controllers',
    intro: 'How a request actually travels through Spring — the DispatcherServlet front controller, controller mechanics, data binding/serialization, and the interceptor/filter/CORS layer that wraps request handling.',
    concepts: sbMvcConcepts,
  },
  {
    id: 'sb-concept-validation-exceptions',
    subtopic: 'sb-validation-exceptions',
    title: 'Validation & Exception Handling',
    intro: 'Bean Validation and global exception handling as a design discipline — where validation actually triggers (and where it silently doesn\'t), and how to design consistent, safe error responses with @ControllerAdvice.',
    concepts: sbValidationExceptionsConcepts,
  },
  {
    id: 'sb-concept-data-jpa',
    subtopic: 'sb-data-jpa',
    title: 'Spring Data JPA & Repositories',
    intro: 'The repository abstraction that generates data access code at runtime — query methods, entity/relationship mapping, and the Persistence Context that governs how JPA tracks and flushes changes.',
    concepts: sbDataJpaConcepts,
  },
]
