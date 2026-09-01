import { Code2 } from 'lucide-react'
import { CodeBlock } from '../components/CodeBlock'
import { scrollToId } from '../lib/scrollToId'

interface SyntaxSnippet {
  title: string
  note?: string
  code: string
}

interface SyntaxSection {
  id: string
  title: string
  description: string
  snippets: SyntaxSnippet[]
}

const sections: SyntaxSection[] = [
  {
    id: 'syntax-starter',
    title: 'Coding-round starter',
    description: 'The smallest complete program and fast input shape worth remembering.',
    snippets: [
      {
        title: 'Fast input and output',
        note: 'LeetCode provides the class and method. Use this shape for console-based rounds.',
        code: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int n = Integer.parseInt(st.nextToken());
        long target = Long.parseLong(st.nextToken());

        int[] values = new int[n];
        st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) values[i] = Integer.parseInt(st.nextToken());

        StringBuilder out = new StringBuilder();
        out.append(n).append(' ').append(target).append('\n');
        System.out.print(out);
    }
}`,
      },
    ],
  },
  {
    id: 'syntax-language',
    title: 'Language muscle memory',
    description: 'Types, conversions, loops, records, methods, and lambdas you commonly type under pressure.',
    snippets: [
      {
        title: 'Types, conversions, and loops',
        code: `int x = 10;
long big = 1_000_000_000L;
double ratio = 3.14;
char ch = '7';
int digit = ch - '0';
char letter = (char) ('a' + 2);
int parsed = Integer.parseInt("42");
String text = String.valueOf(parsed);

for (int i = 0; i < n; i++) { }
for (int value : values) { }
while (left < right) { }

static int add(int a, int b) { return a + b; }
record Point(int row, int col) { }
Operation sum = (a, b) -> a + b;`,
      },
      {
        title: 'Small data structures',
        code: `static class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

enum State { NEW, RUNNING, DONE }

interface Operation {
    int apply(int a, int b);
}`,
      },
    ],
  },
  {
    id: 'syntax-collections',
    title: 'Collections',
    description: 'ArrayList for indexed data, HashSet for membership, HashMap for lookup, ArrayDeque for queues/stacks, and PriorityQueue for heaps.',
    snippets: [
      {
        title: 'List, set, map, and frequency counting',
        code: `List<Integer> list = new ArrayList<>();
list.add(7);
int first = list.get(0);

Set<String> seen = new HashSet<>();
if (seen.add(word)) { /* first occurrence */ }

Map<String, Integer> frequency = new HashMap<>();
frequency.merge(word, 1, Integer::sum);
int count = frequency.getOrDefault(word, 0);

Map<Integer, List<Integer>> graph = new HashMap<>();
graph.computeIfAbsent(from, ignored -> new ArrayList<>()).add(to);

for (var entry : frequency.entrySet()) {
    System.out.println(entry.getKey() + "=" + entry.getValue());
}`,
      },
      {
        title: 'Deque and heap',
        code: `Deque<Integer> deque = new ArrayDeque<>();
deque.offerLast(10);       // queue add
int front = deque.pollFirst();
deque.push(20);            // stack push at front
int top = deque.pop();

PriorityQueue<Integer> minHeap = new PriorityQueue<>();
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());

record Entry(int node, long distance) { }
PriorityQueue<Entry> pq = new PriorityQueue<>(
    Comparator.comparingLong(Entry::distance)
);`,
      },
    ],
  },
  {
    id: 'syntax-sorting',
    title: 'Sorting and comparators',
    description: 'Prefer comparator helpers and compare methods; subtraction can overflow.',
    snippets: [
      {
        title: 'Primitive, object, and multi-field sorting',
        code: `Arrays.sort(nums);
Arrays.sort(boxed, Comparator.reverseOrder());

words.sort(Comparator.comparingInt(String::length)
                     .thenComparing(Comparator.naturalOrder()));

record Job(String id, int priority, long createdAt) { }
jobs.sort(Comparator.comparingInt(Job::priority).reversed()
                    .thenComparingLong(Job::createdAt));

Arrays.sort(intervals, (a, b) -> {
    int byStart = Integer.compare(a[0], b[0]);
    return byStart != 0 ? byStart : Integer.compare(a[1], b[1]);
});`,
      },
    ],
  },
  {
    id: 'syntax-strings',
    title: 'Strings, arrays, and matrices',
    description: 'The APIs behind most parsing, palindrome, frequency, and grid problems.',
    snippets: [
      {
        title: 'String and StringBuilder',
        code: `int n = s.length();
char c = s.charAt(i);
String part = s.substring(left, right); // right is exclusive
String[] tokens = s.trim().split("\\\\s+");
char[] chars = s.toCharArray();

StringBuilder sb = new StringBuilder();
sb.append(c).append(value);
sb.deleteCharAt(sb.length() - 1);
String answer = sb.reverse().toString();

int[] frequency = new int[26];
for (char letter : s.toCharArray()) frequency[letter - 'a']++;`,
      },
      {
        title: 'Arrays and grids',
        code: `int[] values = new int[n];
int[][] grid = new int[rows][cols];
Arrays.fill(values, -1);
int[] copy = Arrays.copyOf(values, values.length);
int[] range = Arrays.copyOfRange(values, left, right);

for (int r = 0; r < grid.length; r++) {
    for (int c = 0; c < grid[0].length; c++) { }
}

static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};`,
      },
    ],
  },
  {
    id: 'syntax-patterns',
    title: 'Core LeetCode patterns',
    description: 'Templates to adapt—not solutions to memorize blindly.',
    snippets: [
      {
        title: 'Two pointers and sliding window',
        code: `// Two pointers on sorted input
int left = 0, right = nums.length - 1;
while (left < right) {
    long sum = (long) nums[left] + nums[right];
    if (sum == target) return new int[] {left, right};
    if (sum < target) left++; else right--;
}

// Variable sliding window
left = 0;
for (right = 0; right < nums.length; right++) {
    add(nums[right]);
    while (windowIsInvalid()) remove(nums[left++]);
    best = Math.max(best, right - left + 1);
}`,
      },
      {
        title: 'Prefix sum and binary search',
        code: `long[] prefix = new long[nums.length + 1];
for (int i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
}
long rangeSum = prefix[right + 1] - prefix[left];

int lo = 0, hi = nums.length - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return -1;`,
      },
      {
        title: 'Merge intervals and monotonic stack',
        code: `Arrays.sort(intervals, Comparator.comparingInt((int[] a) -> a[0]));
List<int[]> merged = new ArrayList<>();
for (int[] current : intervals) {
    if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < current[0]) {
        merged.add(current.clone());
    } else {
        int[] last = merged.get(merged.size() - 1);
        last[1] = Math.max(last[1], current[1]);
    }
}

Deque<Integer> stack = new ArrayDeque<>();
for (int i = 0; i < nums.length; i++) {
    while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
        nextGreater[stack.pop()] = nums[i];
    }
    stack.push(i);
}`,
      },
    ],
  },
  {
    id: 'syntax-graphs',
    title: 'Trees and graphs',
    description: 'Recursive DFS, level-order BFS, adjacency lists, and shortest paths.',
    snippets: [
      {
        title: 'Tree DFS and BFS',
        code: `static int depth(TreeNode node) {
    if (node == null) return 0;
    return 1 + Math.max(depth(node.left), depth(node.right));
}

Queue<TreeNode> queue = new ArrayDeque<>();
if (root != null) queue.offer(root);
while (!queue.isEmpty()) {
    int levelSize = queue.size();
    for (int i = 0; i < levelSize; i++) {
        TreeNode node = queue.poll();
        if (node.left != null) queue.offer(node.left);
        if (node.right != null) queue.offer(node.right);
    }
}`,
      },
      {
        title: 'Graph BFS and Dijkstra',
        note: 'Mark BFS nodes when enqueuing. In Dijkstra, skip stale heap entries.',
        code: `List<List<Integer>> graph = new ArrayList<>();
for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
for (int[] edge : edges) graph.get(edge[0]).add(edge[1]);

Queue<Integer> queue = new ArrayDeque<>();
boolean[] visited = new boolean[n];
queue.offer(start);
visited[start] = true;
while (!queue.isEmpty()) {
    int node = queue.poll();
    for (int next : graph.get(node)) {
        if (!visited[next]) {
            visited[next] = true;
            queue.offer(next);
        }
    }
}

record State(int node, long distance) { }
PriorityQueue<State> pq = new PriorityQueue<>(Comparator.comparingLong(State::distance));
pq.offer(new State(start, 0));`,
      },
    ],
  },
  {
    id: 'syntax-dp',
    title: 'DP and backtracking',
    description: 'Make state, choices, base case, and undo step explicit.',
    snippets: [
      {
        title: 'Memoization and bottom-up DP',
        code: `static int solve(int i, int[] nums, int[] memo) {
    if (i >= nums.length) return 0;
    if (memo[i] != -1) return memo[i];
    return memo[i] = Math.max(
        solve(i + 1, nums, memo),
        nums[i] + solve(i + 2, nums, memo)
    );
}

int previousTwo = 0, previousOne = 0;
for (int value : nums) {
    int current = Math.max(previousOne, previousTwo + value);
    previousTwo = previousOne;
    previousOne = current;
}`,
      },
      {
        title: 'Backtracking',
        code: `static void subsets(int index, int[] nums, List<Integer> path,
                    List<List<Integer>> result) {
    if (index == nums.length) {
        result.add(new ArrayList<>(path));
        return;
    }
    subsets(index + 1, nums, path, result); // skip
    path.add(nums[index]);
    subsets(index + 1, nums, path, result); // take
    path.remove(path.size() - 1);           // undo
}`,
      },
    ],
  },
  {
    id: 'syntax-concurrency',
    title: 'Concurrency and producer–consumer',
    description: 'Prefer high-level concurrency utilities. Use BlockingQueue before hand-writing wait/notify coordination.',
    snippets: [
      {
        title: 'Producer–consumer with BlockingQueue',
        code: `BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(10);
int poison = -1;

Thread producer = new Thread(() -> {
    try {
        for (int i = 0; i < 100; i++) queue.put(i); // blocks when full
        queue.put(poison);
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}, "producer");

Thread consumer = new Thread(() -> {
    try {
        while (true) {
            int value = queue.take(); // blocks when empty
            if (value == poison) break;
            process(value);
        }
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}, "consumer");

producer.start();
consumer.start();
producer.join();
consumer.join();`,
      },
      {
        title: 'Bounded buffer with wait/notifyAll',
        note: 'Use while, not if. wait releases the monitor; sleep does not.',
        code: `static class BoundedBuffer<T> {
    private final Queue<T> queue = new ArrayDeque<>();
    private final int capacity;

    BoundedBuffer(int capacity) { this.capacity = capacity; }

    public synchronized void put(T item) throws InterruptedException {
        while (queue.size() == capacity) wait();
        queue.offer(item);
        notifyAll();
    }

    public synchronized T take() throws InterruptedException {
        while (queue.isEmpty()) wait();
        T item = queue.poll();
        notifyAll();
        return item;
    }
}`,
      },
      {
        title: 'ExecutorService and lock safety',
        code: `ExecutorService pool = Executors.newFixedThreadPool(4);
try {
    Future<Integer> future = pool.submit(() -> expensiveCalculation());
    int result = future.get(2, TimeUnit.SECONDS);
} finally {
    pool.shutdown();
}

Lock lock = new ReentrantLock();
lock.lock();
try {
    updateSharedState();
} finally {
    lock.unlock();
}`,
      },
    ],
  },
  {
    id: 'syntax-practical',
    title: 'Practical Java',
    description: 'Resource handling, streams, money, and tests for machine-coding rounds.',
    snippets: [
      {
        title: 'Resources and streams',
        code: `try (BufferedReader reader = Files.newBufferedReader(Path.of("input.txt"))) {
    for (String line; (line = reader.readLine()) != null; ) {
        System.out.println(line);
    }
} catch (IOException e) {
    throw new UncheckedIOException("Could not read input", e);
}

List<String> names = users.stream()
    .filter(User::active)
    .sorted(Comparator.comparing(User::name))
    .map(User::name)
    .distinct()
    .toList();`,
      },
      {
        title: 'Money and JUnit 5',
        code: `BigDecimal price = new BigDecimal("10.25");
BigDecimal total = price.multiply(BigDecimal.valueOf(quantity));
boolean overLimit = total.compareTo(limit) > 0;

@Test
void addsTwoNumbers() {
    Calculator calculator = new Calculator();
    assertEquals(5, calculator.add(2, 3));
    assertThrows(IllegalArgumentException.class, () -> calculator.divide(1, 0));
}`,
      },
    ],
  },
]

const traps = [
  'Use .equals() for object values; == compares references.',
  'Promote before arithmetic: (long) a * b.',
  'List.of is immutable; copy it before sorting or modifying.',
  'PriorityQueue iteration is not sorted; poll() provides heap order.',
  'Copy a mutable path before adding it to backtracking results.',
  'Mark BFS nodes visited when enqueuing, not dequeuing.',
  'Restore the interrupt flag after catching InterruptedException.',
  'Release locks, permits, and resources in finally or try-with-resources.',
]

export function JavaSyntaxPage() {
  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-8 max-w-[75ch]">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent"><Code2 size={20} /></div>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">Coding-round toolkit</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Java syntax refresher</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">Copy-ready Java 17+ templates for experienced developers rebuilding syntax muscle memory. Focus on the shape of each solution, then type it yourself.</p>
      </div>

      <nav className="mb-10 rounded-lg border border-border bg-surface p-4" aria-label="Syntax sections">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">Jump to section</p>
          <button onClick={() => scrollToId('syntax-top')} className="font-mono text-[10px] text-accent hover:underline">Top</button>
        </div>
        <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <button key={section.id} onClick={() => scrollToId(section.id)} className="min-h-10 rounded-md px-2 text-left text-sm text-ink-muted hover:bg-accent-soft hover:text-accent">
              <span className="mr-2 font-mono text-[10px] text-accent">{String(index + 1).padStart(2, '0')}</span>{section.title}
            </button>
          ))}
          <button onClick={() => scrollToId('syntax-traps')} className="min-h-10 rounded-md px-2 text-left text-sm text-ink-muted hover:bg-accent-soft hover:text-accent"><span className="mr-2 font-mono text-[10px] text-accent">11</span>Last-minute traps</button>
        </div>
      </nav>

      <div id="syntax-top">
        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className="scroll-mt-6 border-t border-border py-9 first:border-t-0 first:pt-0">
            <div className="mb-6 max-w-[70ch]">
              <p className="font-mono text-[10px] uppercase tracking-wide text-accent">Section {index + 1}</p>
              <h2 className="mt-1 text-xl font-semibold text-ink">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{section.description}</p>
            </div>
            <div className="space-y-7">
              {section.snippets.map((snippet) => (
                <article key={snippet.title} className="max-w-[85ch]">
                  <h3 className="mb-2 text-sm font-semibold text-ink">{snippet.title}</h3>
                  <CodeBlock language="java" code={snippet.code} />
                  {snippet.note && <p className="mt-2 rounded-md border-l-2 border-accent bg-accent-soft px-3 py-2 text-sm text-ink-muted">{snippet.note}</p>}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section id="syntax-traps" className="scroll-mt-6 border-t border-border py-9">
        <p className="font-mono text-[10px] uppercase tracking-wide text-accent">Section 11</p>
        <h2 className="mt-1 text-xl font-semibold text-ink">Last-minute traps</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {traps.map((trap) => <p key={trap} className="rounded-md border border-border bg-surface p-3 text-sm leading-relaxed text-ink-muted">{trap}</p>)}
        </div>
        <p className="mt-6 max-w-[70ch] rounded-md border-l-2 border-accent bg-accent-soft px-4 py-3 text-sm text-ink"><strong>Practice rule:</strong> re-type one algorithm template and one practical Java template daily. Reading restores recognition; typing restores recall.</p>
      </section>
    </div>
  )
}
