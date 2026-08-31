import { readFileSync } from 'node:fs'
import ts from 'typescript'

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

function property(node, name) {
  return node.properties.find(
    (item) => ts.isPropertyAssignment(item) && ts.isIdentifier(item.name) && item.name.text === name,
  )
}

function stringValue(node) {
  return node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : undefined
}

function validateConceptShape(file) {
  const sourceText = readFileSync(file, 'utf8')
  const source = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true)
  const cards = []

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const id = stringValue(property(node, 'id')?.initializer)
      if (id && property(node, 'title') && property(node, 'group') && property(node, 'definition')) cards.push(node)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)

  const ids = new Set(cards.map((card) => stringValue(property(card, 'id')?.initializer)))
  for (const card of cards) {
    const id = stringValue(property(card, 'id')?.initializer)
    const line = source.getLineAndCharacterOfPosition(card.getStart()).line + 1
    const location = `${file}:${line}`
    const importance = stringValue(property(card, 'importance')?.initializer)

    if (importance && !['must-know', 'useful', 'deep-dive'].includes(importance)) {
      console.error(`${location}: invalid importance '${importance}' on '${id}'`)
      failed = true
    }
    if (importance === 'must-know' && !property(card, 'remember') && !property(card, 'interviewAngle')) {
      console.error(`${location}: must-know card '${id}' needs remember or interviewAngle`)
      failed = true
    }

    const related = property(card, 'related')?.initializer
    if (related && ts.isArrayLiteralExpression(related)) {
      for (const item of related.elements) {
        const relatedId = stringValue(item)
        if (relatedId && !ids.has(relatedId)) {
          console.error(`${location}: '${id}' references missing related card '${relatedId}'`)
          failed = true
        }
      }
    }

    const comparison = property(card, 'comparison')?.initializer
    if (comparison && ts.isObjectLiteralExpression(comparison)) {
      const columns = property(comparison, 'columns')?.initializer
      const rows = property(comparison, 'rows')?.initializer
      if (!columns || !ts.isArrayLiteralExpression(columns) || columns.elements.length < 2) {
        console.error(`${location}: comparison on '${id}' needs at least two columns`)
        failed = true
        continue
      }
      if (!rows || !ts.isArrayLiteralExpression(rows) || rows.elements.length === 0) {
        console.error(`${location}: comparison on '${id}' needs at least one row`)
        failed = true
        continue
      }
      for (const row of rows.elements) {
        if (!ts.isArrayLiteralExpression(row) || row.elements.length !== columns.elements.length) {
          console.error(`${location}: every comparison row on '${id}' must match its column count`)
          failed = true
        }
      }
    }
  }
}

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

for (const file of contentFiles.concepts) validateConceptShape(file)

if (failed) process.exitCode = 1
