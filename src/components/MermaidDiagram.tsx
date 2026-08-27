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

// A long left-right chain (many nodes in one row) reads fine up to a point,
// but mermaid's responsive sizing *shrinks* an overly long one to fit the
// container rather than scrolling — cramming every node into one row at an
// illegibly small size instead. Flip it to a top-down layout past a node
// budget, so it stacks and scrolls vertically instead of squeezing
// horizontally. Threshold is edges, not nodes (a chain of N nodes has N-1
// edges) — mobile has less width to work with, so its budget is lower.
const LONG_CHAIN_EDGE_THRESHOLD_MOBILE = 3
const LONG_CHAIN_EDGE_THRESHOLD_DESKTOP = 5

function countEdges(code: string): number {
  return (code.match(/--[-.>]*>|---/g) || []).length
}

function forceVerticalIfLong(code: string, threshold: number): string {
  if (countEdges(code) < threshold) return code
  return code.replace(/^(flowchart|graph)\s+(LR|RL)\b/, '$1 TD')
}

function useIsNarrowViewport(breakpointPx = 640): boolean {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpointPx,
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`)
    const handler = () => setNarrow(mq.matches)
    handler()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpointPx])
  return narrow
}

export function MermaidDiagram({ code }: { code: string }) {
  const { theme } = useTheme()
  const isNarrow = useIsNarrowViewport()
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
          fontSize: '13px',
        },
        // Moderate spacing bump over mermaid's defaults (16/20/6) — enough
        // that short labels don't feel cramped, without inflating a diagram's
        // natural canvas so much that it needs heavy shrinking to fit.
        flowchart: { nodeSpacing: 20, rankSpacing: 26, padding: 8, htmlLabels: true, useMaxWidth: true },
        sequence: { actorMargin: 44, messageMargin: 24, boxMargin: 8, useMaxWidth: true },
        state: { nodeSpacing: 20, rankSpacing: 26, padding: 8, useMaxWidth: true },
        securityLevel: 'strict',
      })
      const threshold = isNarrow ? LONG_CHAIN_EDGE_THRESHOLD_MOBILE : LONG_CHAIN_EDGE_THRESHOLD_DESKTOP
      const diagramCode = forceVerticalIfLong(code.trim(), threshold)
      mermaid
        .render(id, diagramCode)
        .then(({ svg: rendered }) => {
          // Mermaid's own output already carries width="100%" plus an inline
          // style="max-width: <natural-px>" (from useMaxWidth) — that pairing
          // IS the correct responsive behavior (fill available space, never
          // grow past natural size). Don't strip or override it with our own
          // CSS/attributes — every previous attempt to do that either forced
          // small diagrams to stretch far past their intended size, or fought
          // mermaid's sizing unpredictably. Pass it straight through.
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
  }, [code, theme, id, isNarrow])

  return (
    <div className="w-full max-w-[65ch] overflow-hidden rounded-md border border-border">
      <div className="flex items-center border-b border-border bg-accent-soft px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">Diagram</span>
      </div>
      <div className="max-h-[28rem] overflow-auto bg-surface px-3 py-3">
        {error ? (
          <p className="font-mono text-xs text-ink-muted">Diagram failed to render: {error}</p>
        ) : svg ? (
          <div className="text-center [&_svg]:inline-block" dangerouslySetInnerHTML={{ __html: svg }} />
        ) : (
          <p className="font-mono text-xs text-ink-muted">Rendering…</p>
        )}
      </div>
    </div>
  )
}
