import { readFileSync } from 'node:fs'

const contentFiles = {
  concepts: [
    'src/content/concepts/java.ts',
    'src/content/concepts/spring-boot.ts',
    'src/content/concepts/system-design.ts',
  ],
  questions: [
    'src/content/questions/java.ts',
    'src/content/questions/spring-boot.ts',
    'src/content/questions/system-design.ts',
  ],
}

function collectIds(files, indentation) {
  const ids = new Map()
  const pattern = new RegExp(`^${' '.repeat(indentation)}id: '([^']+)'`, 'gm')

  for (const file of files) {
    const source = readFileSync(file, 'utf8')
    for (const match of source.matchAll(pattern)) {
      const line = source.slice(0, match.index).split('\n').length
      const locations = ids.get(match[1]) ?? []
      locations.push(`${file}:${line}`)
      ids.set(match[1], locations)
    }
  }

  return ids
}

let failed = false

for (const [kind, files] of Object.entries(contentFiles)) {
  const ids = collectIds(files, 4)
  const duplicates = [...ids].filter(([, locations]) => locations.length > 1)

  if (duplicates.length > 0) {
    failed = true
    for (const [id, locations] of duplicates) {
      console.error(`Duplicate ${kind} id '${id}': ${locations.join(', ')}`)
    }
  } else {
    console.log(`${kind}: ${ids.size} unique ids`)
  }
}

if (failed) process.exitCode = 1
