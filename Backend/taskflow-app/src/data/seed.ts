import { Task, Status } from '../domain/types'
import { addDays, iso } from '../domain/dates'
const TT: Record<string, [string, string][]> = {
  work: [['Review Q4 roadmap draft', 'Comment on scope and sequencing before Thursday’s sync.'], ['Send client proposal', 'Final pricing check with Dana first.'], ['Prepare sprint demo', ''], ['Write onboarding doc', 'Cover access, tooling and first-week checklist.'], ['Triage support backlog', 'Tag by severity and assign owners.'], ['1:1 notes with Priya', 'Career growth and the Q1 project.']],
  personal: [['Book dentist appointment', ''], ['Renew passport', 'Photos and form are in the drawer.'], ['Plan weekend trip', 'Check train times and a place near the lake.'], ['Call parents', ''], ['Declutter the closet', 'Donate anything unworn this year.']],
  health: [['Morning run, 5 km', ''], ['Meal prep for the week', 'Chicken, rice, roasted vegetables.'], ['Stretch routine, 15 min', ''], ['Schedule annual check-up', '']],
  learning: [['Finish TypeScript generics chapter', 'Do the exercises, not just the reading.'], ['Practice Spanish, 20 min', ''], ['Watch system design lecture', 'Take notes on caching trade-offs.'], ['Read two pages of the design book', '']],
  finance: [['Pay credit card bill', 'Autopay failed last month; check the account.'], ['Categorize November expenses', 'Export the CSV and tag every line.'], ['Review subscriptions', 'Cancel anything unused for 60 days.'], ['File quarterly estimated tax', 'Gather invoices and deductions.']],
}
const RATE: Record<string, number> = { work: .78, personal: .82, health: .93, learning: .8, finance: .55 }
/** Deterministic demo data with dates relative to today. */
export function buildSeed(): Task[] {
  let s = 11
  const rnd = () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)]
  const T = new Date(), today = iso(T), out: Task[] = []
  const mk = (c: string, off: number, force?: Status) => {
    const [title, description] = pick(TT[c])
    const status: Status = force ?? (off < 0 ? (rnd() < RATE[c] ? 'completed' : pick<Status>(['todo', 'in_progress'])) : pick<Status>(['todo', 'todo', 'in_progress']))
    out.push({ id: crypto.randomUUID(), title, description, dueDate: iso(addDays(T, off)), priority: rnd() < .2 ? 'high' : rnd() < .62 ? 'medium' : 'low', status, categoryId: c,
      createdAt: iso(addDays(T, off - 1 - Math.floor(rnd() * 5))), completedAt: status === 'completed' ? iso(addDays(T, Math.min(0, off + (rnd() < .2 ? 1 : 0)))) : null })
  }
  const ids = Object.keys(TT)
  for (let i = 0; i < 64; i++) mk(rnd() < .34 ? 'work' : pick(ids), -Math.floor(Math.pow(rnd(), .8) * 52) + (rnd() < .14 ? Math.ceil(rnd() * 10) : 0))
  ;([['work', 'in_progress'], ['work', 'todo'], ['health', 'completed'], ['personal', 'todo'], ['learning', 'completed'], ['finance', 'todo'], ['work', 'completed'], ['learning', 'in_progress']] as [string, Status][]).forEach(([c, st]) => mk(c, 0, st))
  ;([['work', -1], ['finance', -2], ['personal', -3]] as [string, number][]).forEach(([c, o]) => mk(c, o, 'todo'))
  out.push({ id: crypto.randomUUID(), title: 'Draft the long-form announcement covering the new pricing tiers, migration steps and FAQ for existing customers', description: '', dueDate: today, priority: 'high', status: 'todo', categoryId: 'work', createdAt: today, completedAt: null },
    { id: crypto.randomUUID(), title: 'Brainstorm side-project ideas', description: 'No deadline, just capture ideas.', dueDate: null, priority: 'low', status: 'todo', categoryId: 'personal', createdAt: today, completedAt: null })
  return out
}
