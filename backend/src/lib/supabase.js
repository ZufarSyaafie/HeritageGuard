import { createClient } from '@supabase/supabase-js'

function createSupabaseClient(key) {
  const supabaseUrl = process.env.SUPABASE_URL

  if (!supabaseUrl || !key) {
    throw new Error('SUPABASE_URL and Supabase keys must be set')
  }

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export function getSupabaseAdminClient() {
  return createSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export function getSupabasePublicClient() {
  return createSupabaseClient(process.env.SUPABASE_ANON_KEY)
}

export async function getUserFromBearerToken(authorizationHeader) {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null
  }

  const accessToken = authorizationHeader.slice('Bearer '.length)
  const supabasePublic = getSupabasePublicClient()
  const { data, error } = await supabasePublic.auth.getUser(accessToken)

  if (error) {
    throw error
  }

  return data.user
}
