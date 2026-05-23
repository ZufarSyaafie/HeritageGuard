import { createClient } from '@supabase/supabase-js'

const RETRY_DELAYS_MS = [300, 900]

function shouldRetryFetch(error) {
  const message = String(error?.message || '')
  const cause = String(error?.cause?.message || '')
  const combined = `${message} ${cause}`

  return (
    combined.includes('UND_ERR_CONNECT_TIMEOUT') ||
    combined.includes('Connect Timeout Error') ||
    combined.includes('fetch failed')
  )
}

async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function retryingFetch(input, init) {
  let lastError = null

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      return await fetch(input, init)
    } catch (error) {
      lastError = error

      if (!shouldRetryFetch(error) || attempt === RETRY_DELAYS_MS.length) {
        throw error
      }

      await wait(RETRY_DELAYS_MS[attempt])
    }
  }

  throw lastError
}

function createSupabaseClient(url, key) {
  const supabaseUrl = url

  if (!supabaseUrl || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and Supabase keys must be set')
  }

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: retryingFetch,
    },
  })
}

export function getSupabaseAdminClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY)
}

export function getSupabasePublicClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
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