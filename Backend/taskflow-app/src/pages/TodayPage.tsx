import { useMemo, useState } from 'react'
import FilterBar from '../components/FilterBar'
import Icon from '../components/Icon'
import TaskRow from '../components/TaskRow'
import { useTasks } from '../context/TasksContext'
import { applyFilters, emptyFilters, Filters, isOverdue } from '../domain/logic'
import { Task } from '../domain/types'

const Group = ({ label, danger, items }: { label: string; danger?: boolean; items: Task[] }) =>
  items.length ? <><div className={`gh ${danger ? 'od' : ''}`}>{label}<span>{items.length}</span></div>{items.map(t => <TaskRow key={t.id} task={t} />)}</> : null

export default function TodayPage() {
  const { tasks, today, create, openForm } = useTasks()
  const [f, setF] = useState<Filters>(emptyFilters)
  const list = useMemo(() => applyFilters(tasks, f, today), [tasks, f, today])
  const od = list.filter(t => isOverdue(t, today)), due = list.filter(t => t.dueDate === today && t.status !== 'completed'), done = list.filter(t => t.dueDate === today && t.status === 'completed')
  const td = tasks.filter(t => t.dueDate === today), dn = td.filter(t => t.status === 'completed').length
  const overdueAll = tasks.filter(t => isOverdue(t, today)).length
  const h = new Date().getHours(), C = 2 * Math.PI * 26, p = td.length ? dn / td.length : 0
  return (<>
    <div className="top"><div><h1>{h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'}</h1><div className="sub">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div></div>
      <button className="btn p" onClick={() => openForm()}><Icon name="plus" />New task</button></div>
    <div className="hero">
      <div className="card prog-c"><div className="prog">
        <svg width="64" height="64" viewBox="0 0 64 64" role="img" aria-label={`${dn} of ${td.length} done`}><circle cx="32" cy="32" r="26" fill="none" stroke="var(--line)" strokeWidth="7" /><circle cx="32" cy="32" r="26" fill="none" stroke="var(--acc)" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${C * p} ${C}`} transform="rotate(-90 32 32)" /></svg>
        <div><small>Today’s progress</small><div className="v">{dn} of {td.length} done</div></div></div></div>
      <div className="card"><small>Remaining</small><div className="v">{td.length - dn}</div></div>
      <div className="card"><small>In progress</small><div className="v">{td.filter(t => t.status === 'in_progress').length}</div></div>
      <div className="card"><small>Overdue</small><div className="v" style={{ color: overdueAll ? 'var(--red)' : undefined }}>{overdueAll}</div></div>
    </div>
    <div className="card qa"><Icon name="plus" /><input aria-label="Quick add" placeholder="Add a task for today and press Enter"
      onKeyDown={e => { const el = e.currentTarget; if (e.key === 'Enter' && el.value.trim()) { create({ title: el.value.trim(), description: '', dueDate: today, priority: 'medium', status: 'todo', categoryId: 'work' }); el.value = '' } }} /><span className="bd">Enter</span></div>
    <FilterBar f={f} set={x => setF(v => ({ ...v, ...x }))} />
    <Group label="Overdue" danger items={od} /><Group label="Due today" items={due} /><Group label="Completed today" items={done} />
    {!list.length && <div className="card empty"><b>Nothing here</b>Try clearing a filter or add a task above.</div>}
  </>)
}
