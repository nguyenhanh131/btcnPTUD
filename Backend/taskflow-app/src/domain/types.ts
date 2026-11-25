export type Priority = 'low' | 'medium' | 'high'
export type Status = 'todo' | 'in_progress' | 'completed'
export interface Task { id: string; title: string; description: string; dueDate: string | null; priority: Priority; status: Status; categoryId: string; createdAt: string; completedAt: string | null }
export type TaskInput = Omit<Task, 'id' | 'createdAt' | 'completedAt'>
export interface Category { id: string; name: string; color: string }
export const STATUS_LABEL: Record<Status, string> = { todo: 'To do', in_progress: 'In progress', completed: 'Completed' }
export const PRIORITY_LABEL: Record<Priority, string> = { low: 'Low', medium: 'Medium', high: 'High' }
export const NEXT_STATUS: Record<Status, Status> = { todo: 'in_progress', in_progress: 'completed', completed: 'todo' }
