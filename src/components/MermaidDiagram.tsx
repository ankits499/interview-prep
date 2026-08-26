import { useEffect, useId, useState } from 'react'
import { useTheme } from '../hooks/useTheme'

const palettes = {
  light: {
    background: '#faf9f7',
    mainBkg: '#ffffff',
    primaryColor: '#e7efec',
    primaryTextColor: '#1c1b1a',
    primaryBorderColor: '#2a5c4b',
    lineColor: '#6b6862',
    textColor: '#1c1b1a',
    secondaryColor: '#e7efec',
    tertiaryColor: '#faf9f7',
    clusterBkg: '#faf9f7',
    clusterBorder: '#e4e1db',
    edgeLabelBackground: '#faf9f7',
  },
  dark: {
    background: '#17171a',
    mainBkg: '#1e1e22',
    primaryColor: '#22322c',
    primaryTextColor: '#ededec',
    primaryBorderColor: '#5fae93',
    lineColor: '#9b9995',
    textColor: '#ededec',
    secondaryColor: '#22322c',
    tertiaryColor: '#17171a',
    clusterBkg: '#17171a',
    clusterBorder: '#2e2e33',
    edgeLabelBackground: '#17171a',
  },
}

export function MermaidDiagram({ code }: { code: string }) {
  const { theme } = useTheme()
  const rawId = useId()
  const id = `mermaid-${rawId.replace(/[:]/g, '')}`
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    import('mermaid').then(({ default: mermaid }) => {
      if (cancelled) return
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          ...palettes[theme],
          fontFamily: 'IBM Plex Mono, ui-monospace, monospace',
          fontSize: '12px',
        },
        // Tight spacing keeps diagrams compact by default — content should stay small
        // (few nodes, short labels) rather than relying on this to shrink a big diagram.
        flowchart: { nodeSpacing: 16, rankSpacing: 20, padding: 6, htmlLabels: true },
        sequence: { actorMargin: 40, messageMargin: 20, boxMargin: 6 },
        state: { nodeSpacing: 16, rankSpacing: 20, padding: 6 },
        securityLevel: 'strict',
      })
      mermaid
        .render(id, code.trim())
        .then(({ svg: rendered }) => {
          if (!cancelled) {
            setSvg(rendered)
            setError(null)
          }
        })
        .catch((err) => {
          if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to render diagram')
        })
    })
    return () => {
      cancelled = true
    }
  }, [code, theme, id])

  return (
    <div className="max-w-xs overflow-hidden rounded-md border border-border sm:max-w-sm">
      <div className="flex items-center border-b border-border bg-accent-soft px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">Diagram</span>
      </div>
      <div className="max-h-80 overflow-auto bg-surface px-3 py-2.5">
        {error ? (
          <p className="font-mono text-xs text-ink-muted">Diagram failed to render: {error}</p>
        ) : svg ? (
          <div className="[&_svg]:mx-auto" dangerouslySetInnerHTML={{ __html: svg }} />
        ) : (
          <p className="font-mono text-xs text-ink-muted">Rendering…</p>
        )}
      </div>
    </div>
  )
}
