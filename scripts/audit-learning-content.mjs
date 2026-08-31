import { readFileSync } from 'node:fs'
import ts from 'typescript'

const files = [
  'src/content/concepts/java.ts',
  'src/content/concepts/spring-boot.ts',
  'src/content/concepts/system-design.ts',
  'src/content/questions/java.ts',
  'src/content/questions/spring-boot.ts',
  'src/content/questions/system-design.ts',
]

const limits = { definition: 35, shortAnswer: 45 }
const totals = { definition: [], shortAnswer: [] }
const warnings = []

function property(node, name) {
  return node.properties.find(
    (item) => ts.isPropertyAssignment(item) && ts.isIdentifier(item.name) && item.name.text === name,
  )
}

function stringValue(node) {
  return node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : undefined
}

function highPrioritySubtopics() {
  const file = 'src/content/subtopics.ts'
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true)
  const ids = new Set()
  function visit(node) {
    if (ts.isObjectLiteralExpression(node) && stringValue(property(node, 'priority')?.initializer) === 'high') {
      const id = stringValue(property(node, 'id')?.initializer)
      if (id) ids.add(id)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  return ids
}

const highPriority = highPrioritySubtopics()

function wordCount(value) {
  return value.trim().split(/\s+/).filter(Boolean).length
}

for (const file of files) {
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true)
  const conceptArrays = new Map()

  function collectArrays(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      conceptArrays.set(node.name.text, node.initializer)
    }
    ts.forEachChild(node, collectArrays)
  }
  collectArrays(source)

  function record(node, field) {
    const value = stringValue(property(node, field)?.initializer)
    if (!value) return
    const words = wordCount(value)
    totals[field].push(words)
    if (words > limits[field]) {
      const line = source.getLineAndCharacterOfPosition(property(node, field).getStart()).line + 1
      warnings.push({ file, line, field, words })
    }
  }

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const subtopic = stringValue(property(node, 'subtopic')?.initializer)
      if (subtopic && highPriority.has(subtopic)) {
        record(node, 'shortAnswer')
        const concepts = property(node, 'concepts')?.initializer
        const conceptArray = concepts && ts.isIdentifier(concepts) ? conceptArrays.get(concepts.text) : concepts
        if (conceptArray && ts.isArrayLiteralExpression(conceptArray)) {
          for (const concept of conceptArray.elements) {
            if (ts.isObjectLiteralExpression(concept)) record(concept, 'definition')
          }
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
}

for (const warning of warnings.sort((a, b) => b.words - a.words).slice(0, 30)) {
  console.warn(`${warning.file}:${warning.line} ${warning.field} is ${warning.words} words (guide: ${limits[warning.field]})`)
}
if (warnings.length > 30) console.warn(`... ${warnings.length - 30} more entries exceed the editorial guide`)

console.log(`Audited ${highPriority.size} high-priority subtopics`)

for (const [field, counts] of Object.entries(totals)) {
  const average = counts.reduce((sum, count) => sum + count, 0) / counts.length
  const over = counts.filter((count) => count > limits[field]).length
  console.log(`${field}: ${counts.length} entries, ${average.toFixed(1)} words average, ${over} over ${limits[field]}`)
}
