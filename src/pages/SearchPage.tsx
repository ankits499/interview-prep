import { Breadcrumbs } from '../components/Breadcrumbs'
import { SearchPalette } from '../components/SearchPalette'

export function SearchPage() {
  return (
    <div>
      <Breadcrumbs crumbs={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />
      <h1 className="mb-4 text-lg font-semibold text-ink">Search</h1>
      <SearchPalette />
    </div>
  )
}
