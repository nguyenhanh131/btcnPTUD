import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTasks } from '../context/TasksContext'
import { CATEGORIES } from '../data/categories'
import Icon from './Icon'
import TaskForm from './TaskForm'

const NAV = [{ to: '/', label: 'Today', tab: 'Today', icon: 'today' }, { to: '/tasks', label: 'All tasks', tab: 'Tasks', icon: 'list' }, { to: '/stats', label: 'Statistics', tab: 'Stats', icon: 'stats' }] as const
const cls = ({ isActive }: { isActive: boolean }) => 'nav' + (isActive ? ' on' : '')

export default function Layout() {
  const { tasks, today, openForm, toast, dismissToast } = useTasks()
  const { pathname } = useLocation()
  useEffect(() => { if (!toast) return; const id = setTimeout(dismissToast, 5000); return () => clearTimeout(id) }, [toast, dismissToast])
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === 'n' && !/INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement).tagName)) { e.preventDefault(); openForm() } }; addEventListener('keydown', h); return () => removeEventListener('keydown', h) }, [openForm])
  const todayLeft = tasks.filter(t => t.dueDate === today && t.status !== 'completed').length
  return (
    <div className="app">
      <aside>
        <div className="logo"><b><Icon name="ok" /></b><span>TaskFlow</span></div>
        {NAV.map(n => <NavLink key={n.to} to={n.to} end={n.to === '/'} className={cls}><Icon name={n.icon} /><span>{n.label}</span><em className="n">{n.to === '/' ? todayLeft : n.to === '/tasks' ? tasks.length : ''}</em></NavLink>)}
        <div className="sec">Categories</div>
        {CATEGORIES.map(c => <NavLink key={c.id} to={`/tasks?cat=${c.id}`} className="nav"><i className="dot" style={{ background: c.color }} /><span>{c.name}</span><em className="n">{tasks.filter(t => t.categoryId === c.id).length}</em></NavLink>)}
      </aside>
      <main><Outlet /></main>
      <nav className="tabs">{NAV.map(n => <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => (isActive ? 'on' : '')}><Icon name={n.icon} />{n.tab}</NavLink>)}</nav>
      {pathname !== '/stats' && <button className="fab" aria-label="New task" onClick={() => openForm()}><Icon name="plus" /></button>}
      <TaskForm />
      {toast && <div id="toast" style={{ display: 'flex' }}><span>{toast.msg}</span>{toast.undo && <button onClick={() => { toast.undo?.(); dismissToast() }}>Undo</button>}</div>}
    </div>
  )
}
