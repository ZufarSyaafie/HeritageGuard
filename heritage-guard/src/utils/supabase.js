import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

const missingEnvError = new Error(
  'Supabase frontend belum dikonfigurasi. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY ke heritage-guard/.env.local.'
)

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase frontend belum dikonfigurasi. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY ke heritage-guard/.env.local.'
  )
}

const createMissingSupabaseClient = () => ({
  auth: {
    getUser: async () => ({ data: { user: null }, error: missingEnvError }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: missingEnvError }),
    signUp: async () => ({ data: { user: null, session: null }, error: missingEnvError }),
    signInWithOAuth: async () => ({ data: null, error: missingEnvError }),
    updateUser: async () => ({ data: { user: null }, error: missingEnvError }),
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    select: async () => ({ data: [], error: missingEnvError, count: 0 }),
  }),
})

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMissingSupabaseClient()

export { isSupabaseConfigured }
