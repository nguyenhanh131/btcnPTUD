import { useTasks } from '../context/TasksContext'
import { getCategory } from '../data/categories'
import { formatDue } from '../domain/dates'
import { isOverdue } from '../domain/logic'
import { NEXT_STATUS, PRIORITY_LABEL, STATUS_LABEL, Task } from '../domain/types'
import Icon from './Icon'

export default function TaskRow({ task: t }: { task: Task }) {
  const { today, setStatus, remove, openForm } = useTasks()
  const c = getCategory(t.categoryId), od = isOverdue(t, today), done = t.status === 'completed'
  return (
    <div className={`card row ${od ? 'od' : ''} ${done ? 'dn' : ''}`}>
      <button className="ck" aria-label="Toggle complete" onClick={() => setStatus(t, done ? 'todo' : 'completed')}><Icon name="ok" /></button>
      <div className="rb">
        <div className="t">{t.title}</div>
        {t.description && <div className="d">{t.description}</div>}
        <div className="m">
          <span className={`bd ${t.priority}`}>{PRIORITY_LABEL[t.priority]}</span>
          <span className="bd"><i className="dot" style={{ background: c.color }} />{c.name}</span>
          <button className={`bd ${t.status}`} title="Change status" onClick={() => setStatus(t, NEXT_STATUS[t.status])}>{STATUS_LABEL[t.status]}</button>
          {od && <span className="bd late">Overdue</span>}
          <span className={`due ${od ? 'od' : ''}`}>{formatDue(t.dueDate, today)}</span>
        </div>
      </div>
      <div className="ra">
        <button aria-label="Edit task" onClick={() => openForm(t)}><Icon name="edit" /></button>
        <button aria-label="Delete task" onClick={() => remove(t)}><Icon name="del" /></button>
      </div>
    </div>
  )
}
