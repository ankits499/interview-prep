import type { ConceptComparison } from '../types'

export function ComparisonTable({ comparison }: { comparison: ConceptComparison }) {
  return (
    <figure className="mt-4 max-w-full">
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead className="bg-surface">
            <tr>
              {comparison.columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="border-b border-border px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-ink-muted"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border last:border-b-0">
                {row.map((cell, cellIndex) =>
                  cellIndex === 0 ? (
                    <th key={cellIndex} scope="row" className="px-3 py-2 font-medium text-ink">
                      {cell}
                    </th>
                  ) : (
                    <td key={cellIndex} className="px-3 py-2 text-ink-muted">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {comparison.takeaway && (
        <figcaption className="mt-2 border-l-2 border-accent bg-accent-soft px-3 py-2 text-sm text-ink">
          {comparison.takeaway}
        </figcaption>
      )}
    </figure>
  )
}
