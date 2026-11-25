import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

/** False when .env is missing or still has the placeholder values; the app then falls back to localStorage. */
export const isSupabaseConfigured = Boolean(url && key && url.startsWith('http') && !url.includes('your-project-ref') && !key.startsWith('your-'))
export const supabase = isSupabaseConfigured ? createClient(url!, key!) : null
