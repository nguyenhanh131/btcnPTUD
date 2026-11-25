import { CATEGORIES } from '../data/categories'
import { Filters } from '../domain/logic'
import { PRIORITY_LABEL, STATUS_LABEL } from '../domain/types'
import Icon from './Icon'

interface Props { f: Filters; set: (p: Partial<Filters>) => void; showOverdue?: boolean }
export default function FilterBar({ f, set, showOverdue }: Props) {
  return (
    <div className="fb">
      <label className="s"><Icon name="search" /><input value={f.q} onChange={e => set({ q: e.target.value })} placeholder="Search tasks" aria-label="Search tasks" /></label>
      <select aria-label="Status" value={f.status} onChange={e => set({ status: e.target.value as Filters['status'] })}><option value="">All statuses</option>{Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <select aria-label="Priority" value={f.priority} onChange={e => set({ priority: e.target.value as Filters['priority'] })}><option value="">All priorities</option>{Object.entries(PRIORITY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <select aria-label="Category" value={f.categoryId} onChange={e => set({ categoryId: e.target.value })}><option value="">All categories</option>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <select aria-label="Sort" value={f.sort} onChange={e => set({ sort: e.target.value as Filters['sort'] })}><option value="deadline">Sort: deadline</option><option value="priority">Sort: priority</option></select>
      {showOverdue && <button className={`btn ${f.overdueOnly ? 'p' : ''}`} onClick={() => set({ overdueOnly: !f.overdueOnly })}>Overdue only</button>}
    </div>
  )
}
