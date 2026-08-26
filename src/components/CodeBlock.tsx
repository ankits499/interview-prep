import { Highlight, themes, type Language } from 'prism-react-renderer'
import { useTheme } from '../hooks/useTheme'

export function CodeBlock({ language, code }: { language: string; code: string }) {
  const { theme } = useTheme()
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="flex items-center border-b border-border bg-accent-soft px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">{language}</span>
      </div>
      <Highlight theme={theme === 'dark' ? themes.vsDark : themes.vsLight} code={code.trim()} language={language as Language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} overflow-x-auto px-4 py-3 text-[13px] leading-relaxed`}
            style={{ ...style, background: 'transparent' }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
