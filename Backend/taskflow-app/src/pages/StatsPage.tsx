import { ReactNode, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTasks } from '../context/TasksContext'
import { CATEGORIES } from '../data/categories'
import { dailySeries, isOverdue, kpis, weeklySeries } from '../domain/logic'
import { PRIORITY_LABEL, Priority } from '../domain/types'

const axis = { tickLine: false, axisLine: false, fontSize: 11, stroke: '#78746d' }
const Card = ({ title, sub, children }: { title: string; sub: string; children: ReactNode }) =>
  <div className="card ch"><h3>{title}</h3><p>{sub}</p>{children}</div>

export default function StatsPage() {
  const { tasks, today } = useTasks()
  const [range, setRange] = useState(14)
  const k = kpis(tasks, today)
  const status = [{ name: 'To do', value: tasks.filter(t => t.status === 'todo').length, color: '#a8a29e' }, { name: 'In progress', value: tasks.filter(t => t.status === 'in_progress').length, color: '#3b82f6' }, { name: 'Completed', value: k.completed, color: '#4f46e5' }]
  const pc: Record<Priority, string> = { high: '#dc2626', medium: '#d97706', low: '#16a34a' }
  const pri = (['high', 'medium', 'low'] as Priority[]).map(p => ({ p, n: tasks.filter(t => t.priority === p).length }))
  const mx = Math.max(1, ...pri.map(x => x.n))
  const cards: [string, string | number][] = [['Total tasks', k.total], ['Completed', k.completed], ['Pending', k.pending], ['Overdue', k.overdue], ['Completion rate', k.rate + '%']]
  return (<>
    <div className="top"><div><h1>Statistics</h1><div className="sub">Calculated live from your {tasks.length} tasks</div></div>
      <div className="seg" role="group" aria-label="Range">{[7, 14, 30].map(r => <button key={r} className={range === r ? 'on' : ''} onClick={() => setRange(r)}>{r} days</button>)}</div></div>
    <div className="grid kpis">{cards.map(([a, b], i) => <div className="card kpi" key={a}><small>{a}</small><div style={i === 3 && k.overdue ? { color: 'var(--red)' } : undefined}>{b}</div></div>)}</div>
    <div className="grid cs">
      <Card title="Daily productivity" sub="Tasks completed and created per day">
        <ResponsiveContainer width="100%" height={220}><BarChart data={dailySeries(tasks, range)}><CartesianGrid vertical={false} stroke="#e8e5e0" /><XAxis dataKey="label" interval={range > 14 ? 2 : 0} {...axis} /><YAxis allowDecimals={false} width={26} {...axis} /><Tooltip cursor={{ fill: 'rgba(120,116,109,.08)' }} />
          <Bar dataKey="completed" fill="#4f46e5" radius={[3, 3, 0, 0]} /><Bar dataKey="created" fill="#d6d3cd" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer>
        <div className="lg"><span><i style={{ background: '#4f46e5' }} />Completed</span><span><i style={{ background: '#d6d3cd' }} />Created</span></div></Card>
      <Card title="Status" sub="Where every task stands">
        <div className="flex items-center gap-5 flex-wrap"><PieChart width={140} height={140}><Pie data={status} dataKey="value" innerRadius={42} outerRadius={64} stroke="none">{status.map(s => <Cell key={s.name} fill={s.color} />)}</Pie></PieChart>
          <div>{status.map(s => <div key={s.name} style={{ margin: '6px 0' }}><i className="dot" style={{ background: s.color, display: 'inline-block', marginRight: 8 }} />{s.name} <b>{s.value}</b></div>)}</div></div></Card>
    </div>
    <div className="grid cs">
      <Card title="Weekly productivity" sub="Completed tasks, last 8 weeks (weeks start Monday)">
        <ResponsiveContainer width="100%" height={220}><BarChart data={weeklySeries(tasks)}><CartesianGrid vertical={false} stroke="#e8e5e0" /><XAxis dataKey="label" {...axis} /><YAxis allowDecimals={false} width={26} {...axis} /><Tooltip cursor={{ fill: 'rgba(120,116,109,.08)' }} /><Bar dataKey="completed" fill="#4f46e5" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></Card>
      <Card title="Priority" sub="Tasks by priority level">{pri.map(({ p, n }) => <div className="hbar" key={p}><span>{PRIORITY_LABEL[p]}</span><div className="mb"><i style={{ width: `${(n / mx) * 100}%`, background: pc[p] }} /></div><b>{n}</b></div>)}</Card>
    </div>
    <Card title="Categories" sub="Volume and completion by category">
      <div style={{ overflowX: 'auto' }}><table className="tbl"><thead><tr><th>Category</th><th>Total</th><th>Done</th><th>Overdue</th><th>Completion</th></tr></thead><tbody>
        {CATEGORIES.map(c => { const l = tasks.filter(t => t.categoryId === c.id), d = l.filter(t => t.status === 'completed').length, r = l.length ? Math.round((d / l.length) * 100) : 0
          return <tr key={c.id}><td><i className="dot" style={{ background: c.color, display: 'inline-block', marginRight: 8 }} />{c.name}</td><td>{l.length}</td><td>{d}</td><td>{l.filter(t => isOverdue(t, today)).length}</td>
            <td style={{ minWidth: 150 }}><div className="flex items-center gap-2.5"><div className="mb flex-1"><i style={{ width: `${r}%`, background: c.color }} /></div><b>{r}%</b></div></td></tr> })}</tbody></table></div></Card>
  </>)
}
