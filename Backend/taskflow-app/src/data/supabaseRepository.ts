import { Task, TaskInput, Priority, Status } from '../domain/types'
import { todayISO } from '../domain/dates'
import type { TaskRepository } from './repository'
import { supabase } from './supabaseClient'

interface Row { id: string; title: string; description: string | null; due_date: string | null; priority: Priority; status: Status; category_id: string; created_at: string; completed_at: string | null }
const fromRow = (r: Row): Task => ({ id: r.id, title: r.title, description: r.description ?? '', dueDate: r.due_date, priority: r.priority, status: r.status, categoryId: r.category_id, createdAt: r.created_at, completedAt: r.completed_at })
/** Maps only the fields present, so partial updates stay partial. */
const toRow = (p: Partial<Task>) => {
  const o: Record<string, unknown> = {}
  if (p.title !== undefined) o.title = p.title
  if (p.description !== undefined) o.description = p.description
  if (p.dueDate !== undefined) o.due_date = p.dueDate
  if (p.priority !== undefined) o.priority = p.priority
  if (p.status !== undefined) o.status = p.status
  if (p.categoryId !== undefined) o.category_id = p.categoryId
  if (p.createdAt !== undefined) o.created_at = p.createdAt
  if (p.completedAt !== undefined) o.completed_at = p.completedAt
  return o
}
const db = () => { if (!supabase) throw new Error('Supabase is not configured'); return supabase }
const check = (error: { message: string } | null) => { if (error) throw new Error(`Supabase: ${error.message}`) }

export class SupabaseRepository implements TaskRepository {
  async list() {
    const { data, error } = await db().from('tasks').select('*').order('created_at', { ascending: true })
    check(error); return (data as Row[]).map(fromRow)
  }
  async create(i: TaskInput) {
    const row = { ...toRow(i), created_at: todayISO(), completed_at: i.status === 'completed' ? todayISO() : null }
    const { data, error } = await db().from('tasks').insert(row).select().single()
    check(error); return fromRow(data as Row)
  }
  async update(id: string, p: Partial<Task>) {
    const { data, error } = await db().from('tasks').update(toRow(p)).eq('id', id).select().single()
    check(error); return fromRow(data as Row)
  }
  async remove(id: string) { const { error } = await db().from('tasks').delete().eq('id', id); check(error) }
  async insert(t: Task) { const { error } = await db().from('tasks').insert({ id: t.id, ...toRow(t) }); check(error) }
}
