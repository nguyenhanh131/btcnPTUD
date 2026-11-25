import { Priority, Status, Task } from './types'
import { addDays, iso, mondayOf } from './dates'
export interface Filters { q: string; status: '' | Status; priority: '' | Priority; categoryId: string; sort: 'deadline' | 'priority'; overdueOnly: boolean }
export const emptyFilters: Filters = { q: '', status: '', priority: '', categoryId: '', sort: 'deadline', overdueOnly: false }
export const isOverdue = (t: Task, today: string) => !!t.dueDate && t.dueDate < today && t.status !== 'completed'
const RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
const due = (t: Task) => t.dueDate ?? '9'
export function applyFilters(list: Task[], f: Filters, today: string) {
  const q = f.q.trim().toLowerCase()
  return list
    .filter(t => (!q || (t.title + ' ' + t.description).toLowerCase().includes(q)) && (!f.status || t.status === f.status) && (!f.priority || t.priority === f.priority) && (!f.categoryId || t.categoryId === f.categoryId) && (!f.overdueOnly || isOverdue(t, today)))
    .sort(f.sort === 'priority' ? (a, b) => RANK[a.priority] - RANK[b.priority] || due(a).localeCompare(due(b)) : (a, b) => due(a).localeCompare(due(b)) || RANK[a.priority] - RANK[b.priority])
}
export function kpis(t: Task[], today: string) {
  const completed = t.filter(x => x.status === 'completed').length
  return { total: t.length, completed, pending: t.length - completed, overdue: t.filter(x => isOverdue(x, today)).length, rate: t.length ? Math.round((completed / t.length) * 100) : 0 }
}
export const dailySeries = (t: Task[], n: number) => Array.from({ length: n }, (_, i) => {
  const d = addDays(new Date(), i - n + 1), k = iso(d)
  return { label: n > 14 ? String(d.getDate()) : d.toLocaleDateString('en-US', { weekday: 'short' }), completed: t.filter(x => x.completedAt === k).length, created: t.filter(x => x.createdAt === k).length }
})
export const weeklySeries = (t: Task[]) => Array.from({ length: 8 }, (_, i) => {
  const w = addDays(mondayOf(new Date()), (i - 7) * 7), a = iso(w), b = iso(addDays(w, 7))
  return { label: w.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), completed: t.filter(x => x.completedAt && x.completedAt >= a && x.completedAt < b).length }
})
