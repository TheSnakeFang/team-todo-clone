import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_[REDACTED SECRET]_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_[REDACTED SECRET]_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
