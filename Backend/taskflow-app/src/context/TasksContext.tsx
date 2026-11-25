import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { Status, Task, TaskInput } from '../domain/types'
import { todayISO } from '../domain/dates'
import { repo } from '../data/repository'

interface Toast { msg: string; undo?: () => void }
interface Ctx {
  tasks: Task[]; loading: boolean; today: string
  create: (i: TaskInput) => Promise<void>; update: (id: string, p: Partial<Task>) => Promise<void>
  setStatus: (t: Task, s: Status) => Promise<void>; remove: (t: Task) => Promise<void>
  form: Task | 'new' | null; openForm: (t?: Task) => void; closeForm: () => void
  toast: Toast | null; dismissToast: () => void
}
const TasksCtx = createContext<Ctx>(null as unknown as Ctx)
export const useTasks = () => useContext(TasksCtx)

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]), [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Task | 'new' | null>(null), [toast, setToast] = useState<Toast | null>(null)
  const fail = (e: unknown) => { console.error(e); setToast({ msg: e instanceof Error ? e.message : 'Something went wrong' }) }
  const reload = useCallback(async () => setTasks(await repo.list()), [])
  useEffect(() => { reload().catch(fail).finally(() => setLoading(false)) }, [reload]) // eslint-disable-line react-hooks/exhaustive-deps
  const today = todayISO()
  const update = async (id: string, p: Partial<Task>) => {
    const cur = tasks.find(t => t.id === id)
    if (cur && p.status && p.status !== cur.status) p = { ...p, completedAt: p.status === 'completed' ? todayISO() : null }
    try { await repo.update(id, p); await reload() } catch (e) { fail(e) }
  }
  const value: Ctx = {
    tasks, loading, today, update,
    create: async i => { try { await repo.create(i); await reload() } catch (e) { fail(e) } },
    setStatus: (t, s) => update(t.id, { status: s }),
    remove: async t => { try { await repo.remove(t.id); await reload(); setToast({ msg: 'Task deleted', undo: async () => { try { await repo.insert(t); await reload() } catch (e) { fail(e) } } }) } catch (e) { fail(e) } },
    form, openForm: t => setForm(t ?? 'new'), closeForm: () => setForm(null),
    toast, dismissToast: () => setToast(null),
  }
  return <TasksCtx.Provider value={value}>{children}</TasksCtx.Provider>
}
