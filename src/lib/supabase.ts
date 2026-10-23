import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const isPasswordRecoveryReturn = new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery'

if (!url || !key) {
  throw new Error('Missing Supabase connection settings. Check .env.local.')
}

export const supabase = createClient<Database>(url, key)
