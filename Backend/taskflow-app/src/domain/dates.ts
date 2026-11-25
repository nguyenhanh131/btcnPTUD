const pad = (n: number) => String(n).padStart(2, '0')
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const todayISO = () => iso(new Date())
export const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
export const mondayOf = (d: Date) => addDays(d, -((d.getDay() + 6) % 7))
export function formatDue(due: string | null, today: string) {
  if (!due) return 'No date'
  if (due === today) return 'Today'
  if (due === iso(addDays(new Date(), 1))) return 'Tomorrow'
  if (due === iso(addDays(new Date(), -1))) return 'Yesterday'
  return new Date(due + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
