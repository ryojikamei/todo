import type { Filter } from '../types'

interface Props {
  filter: Filter
  setFilter: (f: Filter) => void
  search: string
  setSearch: (s: string) => void
  categoryFilter: string
  setCategoryFilter: (c: string) => void
  categories: string[]
}

export function FilterBar({
  filter, setFilter,
  search, setSearch,
  categoryFilter, setCategoryFilter,
  categories,
}: Props) {
  return (
    <div className="filter-bar">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="タスクを検索..."
          className="search-input"
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      <div className="filter-tabs">
        {(['all', 'active', 'completed'] as Filter[]).map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'すべて' : f === 'active' ? '未完了' : '完了'}
          </button>
        ))}
      </div>

      {categories.length > 1 && (
        <div className="category-filter">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="select"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'all' ? '📁 全カテゴリ' : `📁 ${c}`}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
