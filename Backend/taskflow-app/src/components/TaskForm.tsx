import { FormEvent, useEffect, useRef } from 'react'
import { useTasks } from '../context/TasksContext'
import { CATEGORIES } from '../data/categories'
import { Priority, Status, TaskInput } from '../domain/types'

export default function TaskForm() {
  const { form, closeForm, create, update, today } = useTasks()
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { const d = ref.current; if (!d) return; if (form && !d.open) d.showModal(); if (!form && d.open) d.close() }, [form])
  const t = form && form !== 'new' ? form : null
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const v: TaskInput = { title: String(f.get('title')).trim(), description: String(f.get('description')).trim(), dueDate: String(f.get('dueDate')) || null, categoryId: String(f.get('categoryId')), priority: f.get('priority') as Priority, status: f.get('status') as Status }
    if (!v.title) return
    if (t) await update(t.id, v); else await create(v)
    closeForm()
  }
  return (
    <dialog ref={ref} onClose={closeForm}>
      <form key={form ? (t ? t.id : 'new') : 'closed'} onSubmit={submit}>
        <h2>{t ? 'Edit task' : 'New task'}</h2>
        <label className="fld">Title<input name="title" required maxLength={120} defaultValue={t?.title} placeholder="What needs doing?" /></label>
        <label className="fld">Description<textarea name="description" rows={3} maxLength={500} defaultValue={t?.description} placeholder="Add details (optional)" /></label>
        <div className="two">
          <label className="fld">Due date<input type="date" name="dueDate" defaultValue={t ? t.dueDate ?? '' : today} /></label>
          <label className="fld">Category<select name="categoryId" defaultValue={t?.categoryId ?? 'work'}>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        </div>
        <div className="two">
          <label className="fld">Priority<select name="priority" defaultValue={t?.priority ?? 'medium'}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
          <label className="fld">Status<select name="status" defaultValue={t?.status ?? 'todo'}><option value="todo">To do</option><option value="in_progress">In progress</option><option value="completed">Completed</option></select></label>
        </div>
        <div className="acts"><button type="button" className="btn" onClick={closeForm}>Cancel</button><button className="btn p">Save task</button></div>
      </form>
    </dialog>
  )
}
