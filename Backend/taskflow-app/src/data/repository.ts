import { Task, TaskInput } from '../domain/types'
import { todayISO } from '../domain/dates'
import { buildSeed } from './seed'
import { isSupabaseConfigured } from './supabaseClient'
import { SupabaseRepository } from './supabaseRepository'

/** The only thing the UI knows about storage. Swap the adapter below for Supabase in Stage 2. */
export interface TaskRepository {
  list(): Promise<Task[]>
  create(input: TaskInput): Promise<Task>
  update(id: string, patch: Partial<Task>): Promise<Task>
  remove(id: string): Promise<void>
  insert(task: Task): Promise<void> // used by "Undo delete"
}
const KEY = 'taskflow:v1:tasks'
const read = (): Task[] | null => { try { const r = localStorage.getItem(KEY); const v = r && JSON.parse(r); return Array.isArray(v) ? v : null } catch { return null } }
const write = (t: Task[]) => { try { localStorage.setItem(KEY, JSON.stringify(t)) } catch (e) { console.error('Storage write failed', e) } }

export class LocalStorageRepository implements TaskRepository {
  async list() { let t = read(); if (!t) { t = buildSeed(); write(t) } return t }
  async create(i: TaskInput) {
    const t: Task = { ...i, id: crypto.randomUUID(), createdAt: todayISO(), completedAt: i.status === 'completed' ? todayISO() : null }
    write([...(await this.list()), t]); return t
  }
  async update(id: string, p: Partial<Task>) {
    const all = await this.list(), i = all.findIndex(t => t.id === id)
    if (i < 0) throw new Error('Task not found')
    all[i] = { ...all[i], ...p }; write(all); return all[i]
  }
  async remove(id: string) { write((await this.list()).filter(t => t.id !== id)) }
  async insert(t: Task) { write([...(await this.list()), t]) }
}
/** Supabase when VITE_SUPABASE_* are set, otherwise localStorage. The UI never knows which. */
export const repo: TaskRepository = isSupabaseConfigured ? new SupabaseRepository() : new LocalStorageRepository()
export const storageMode: 'supabase' | 'local' = isSupabaseConfigured ? 'supabase' : 'local'
