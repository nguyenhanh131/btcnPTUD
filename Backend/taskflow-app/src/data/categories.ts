import { Category } from '../domain/types'
export const CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: '#4f46e5' }, { id: 'personal', name: 'Personal', color: '#0d9488' },
  { id: 'health', name: 'Health', color: '#16a34a' }, { id: 'learning', name: 'Learning', color: '#d97706' }, { id: 'finance', name: 'Finance', color: '#9333ea' },
]
export const getCategory = (id: string) => CATEGORIES.find(c => c.id === id) ?? CATEGORIES[0]
