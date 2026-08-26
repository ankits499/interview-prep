export function groupBy<T, K extends string>(items: T[], key: (item: T) => K): { key: K; items: T[] }[] {
  const order: K[] = []
  const map = new Map<K, T[]>()
  for (const item of items) {
    const k = key(item)
    if (!map.has(k)) {
      map.set(k, [])
      order.push(k)
    }
    map.get(k)!.push(item)
  }
  return order.map((k) => ({ key: k, items: map.get(k)! }))
}
