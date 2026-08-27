import type { Difficulty, Question, Seniority } from '../types'

export type QuestionSort = 'default' | 'alphabetical' | 'difficulty'

export interface QuestionViewState {
  difficulty: Difficulty | 'All'
  seniority: Seniority | 'All'
  sortBy: QuestionSort
}

export const DEFAULT_QUESTION_VIEW: QuestionViewState = {
  difficulty: 'All',
  seniority: 'All',
  sortBy: 'difficulty',
}

const difficulties: Difficulty[] = ['Basic', 'Intermediate', 'Advanced', 'Expert']
const seniorities: Seniority[] = ['Mid', 'Senior', 'Lead', 'Staff']
const sorts: QuestionSort[] = ['default', 'alphabetical', 'difficulty']

function isOneOf<T extends string>(value: string | null, values: readonly T[]): value is T {
  return value !== null && values.includes(value as T)
}

export function readQuestionViewState(params: URLSearchParams): QuestionViewState {
  const difficulty = params.get('difficulty')
  const seniority = params.get('seniority')
  const sortBy = params.get('sort')

  return {
    difficulty: difficulty === 'All' || isOneOf(difficulty, difficulties) ? difficulty : 'All',
    seniority: seniority === 'All' || isOneOf(seniority, seniorities) ? seniority : 'All',
    sortBy: isOneOf(sortBy, sorts) ? sortBy : 'difficulty',
  }
}

export function writeQuestionViewState(state: QuestionViewState, includeQnaTab = false): URLSearchParams {
  const params = new URLSearchParams()
  if (includeQnaTab) params.set('tab', 'qna')
  if (state.difficulty !== 'All') params.set('difficulty', state.difficulty)
  if (state.seniority !== 'All') params.set('seniority', state.seniority)
  if (state.sortBy !== 'difficulty') params.set('sort', state.sortBy)
  return params
}

export function orderQuestions(questions: Question[], view: QuestionViewState): Question[] {
  let result = questions.filter(
    (question) =>
      (view.difficulty === 'All' || question.difficulty === view.difficulty) &&
      (view.seniority === 'All' || question.seniority === view.seniority),
  )

  if (view.sortBy === 'default') return result

  result = [...result]
  if (view.sortBy === 'alphabetical') {
    return result.sort((a, b) => a.question.localeCompare(b.question))
  }

  return result.sort((a, b) => {
    const byDifficulty = difficulties.indexOf(a.difficulty) - difficulties.indexOf(b.difficulty)
    if (byDifficulty !== 0) return byDifficulty
    const bySeniority = seniorities.indexOf(a.seniority) - seniorities.indexOf(b.seniority)
    if (bySeniority !== 0) return bySeniority
    return a.question.localeCompare(b.question)
  })
}
