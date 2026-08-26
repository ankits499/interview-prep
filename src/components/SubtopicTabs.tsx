interface Props {
  active: 'concepts' | 'qna'
  onChange: (tab: 'concepts' | 'qna') => void
  questionCount: number
}

export function SubtopicTabs({ active, onChange, questionCount }: Props) {
  const tabClass = (tab: 'concepts' | 'qna') =>
    `border-b-2 px-1 pb-2 font-mono text-xs uppercase tracking-wide transition-colors ${
      active === tab ? 'border-accent text-accent' : 'border-transparent text-ink-muted hover:text-ink'
    }`

  return (
    <div className="flex gap-6 border-b border-border">
      <button onClick={() => onChange('concepts')} className={tabClass('concepts')}>
        Concepts
      </button>
      <button onClick={() => onChange('qna')} className={tabClass('qna')}>
        Q&amp;A ({questionCount})
      </button>
    </div>
  )
}
