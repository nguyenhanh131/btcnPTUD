import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterBar from '../components/FilterBar'
import Icon from '../components/Icon'
import TaskRow from '../components/TaskRow'
import { useTasks } from '../context/TasksContext'
import { CATEGORIES } from '../data/categories'
import { applyFilters, emptyFilters, Filters } from '../domain/logic'
import { STATUS_LABEL, Status } from '../domain/types'

export default function TasksPage() {
  const { tasks, today, openForm } = useTasks()
  const [sp, setSp] = useSearchParams()
  const [view, setView] = useState<'list' | 'board'>('list')
  const [rest, setRest] = useState<Filters>(emptyFilters)
  const cat = sp.get('cat') ?? ''   // category lives in the URL so views are shareable
  const f: Filters = { ...rest, categoryId: cat }
  const set = (p: Partial<Filters>) => { const { categoryId, ...r } = p; if (categoryId !== undefined) setSp(categoryId ? { cat: categoryId } : {}); setRest(v => ({ ...v, ...r })) }
  const list = useMemo(() => applyFilters(tasks, { ...rest, categoryId: cat }, today), [tasks, rest, cat, today])
  const chips = [{ id: '', name: 'All', color: '' }, ...CATEGORIES]
  return (<>
    <div className="top"><div><h1>All tasks</h1><div className="sub">{tasks.length} tasks across {CATEGORIES.length} categories</div></div>
      <div className="flex gap-2"><div className="seg" role="group" aria-label="View">{(['list', 'board'] as const).map(v => <button key={v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>{v === 'list' ? 'List' : 'Board'}</button>)}</div>
        <button className="btn p" onClick={() => openForm()}><Icon name="plus" />New task</button></div></div>
    <div className="chips">{chips.map(c => <button key={c.id} className={`chip ${cat === c.id ? 'on' : ''}`} onClick={() => set({ categoryId: c.id })}>{c.color && <i className="dot" style={{ background: c.color }} />}{c.name} <span style={{ opacity: .6 }}>{c.id ? tasks.filter(t => t.categoryId === c.id).length : tasks.length}</span></button>)}</div>
    <FilterBar f={f} set={set} showOverdue />
    {!list.length ? <div className="card empty"><b>No tasks match</b>Adjust your filters or create a new task.</div>
      : view === 'list' ? list.map(t => <TaskRow key={t.id} task={t} />)
      : <div className="board">{(Object.keys(STATUS_LABEL) as Status[]).map(s => { const c = list.filter(t => t.status === s); return <div className="col" key={s}><div className="gh">{STATUS_LABEL[s]}<span>{c.length}</span></div>{c.map(t => <TaskRow key={t.id} task={t} />)}{!c.length && <div className="empty">No tasks</div>}</div> })}</div>}
  </>)
}
