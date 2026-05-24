import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

function isMissingEnv(value) {
  const text = String(value ?? '').trim()
  return !text || text.startsWith('__PASTE_') || text.startsWith('__OPTIONAL_')
}

function validateUrl(value, envName) {
  try {
    let urlString = String(value).trim()
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      urlString = `https://${urlString}`
    }
    return new URL(urlString).toString()
  } catch {
    throw new Error(`${envName} is not a valid URL. Received: ${value}`)
  }
}

function pickEnv(...names) {
  for (const name of names) {
    const value = process.env[name]
    if (!isMissingEnv(value)) {
      return { value: String(value).trim(), source: name }
    }
  }

  return { value: null, source: names[0] }
}

function getR2Config() {
  const endpointEnv = pickEnv('NEXT_R2_ENDPOINT', 'R2_ENDPOINT')
  const accessKeyIdEnv = pickEnv('NEXT_R2_ACCESS_KEY_ID', 'R2_ACCESS_KEY_ID')
  const secretAccessKeyEnv = pickEnv('NEXT_R2_SECRET_ACCESS_KEY', 'R2_SECRET_ACCESS_KEY')
  const bucketEnv = pickEnv('NEXT_R2_BUCKET', 'R2_BUCKET')
  const publicBaseUrlEnv = pickEnv('NEXT_R2_PUBLIC_BASE_URL', 'R2_PUBLIC_BASE_URL')

  const missing = []

  if (isMissingEnv(endpointEnv.value)) {
    missing.push('NEXT_R2_ENDPOINT (or R2_ENDPOINT)')
  }

  if (isMissingEnv(accessKeyIdEnv.value)) {
    missing.push('NEXT_R2_ACCESS_KEY_ID (or R2_ACCESS_KEY_ID)')
  }

  if (isMissingEnv(secretAccessKeyEnv.value)) {
    missing.push('NEXT_R2_SECRET_ACCESS_KEY (or R2_SECRET_ACCESS_KEY)')
  }

  if (isMissingEnv(bucketEnv.value)) {
    missing.push('NEXT_R2_BUCKET (or R2_BUCKET)')
  }

  if (missing.length > 0) {
    throw new Error(`Missing R2 configuration: ${missing.join(', ')}`)
  }

  const validatedEndpoint = validateUrl(endpointEnv.value, endpointEnv.source)
  const validatedPublicBaseUrl = isMissingEnv(publicBaseUrlEnv.value)
    ? null
    : validateUrl(publicBaseUrlEnv.value, publicBaseUrlEnv.source)

  return {
    endpoint: validatedEndpoint,
    accessKeyId: accessKeyIdEnv.value,
    secretAccessKey: secretAccessKeyEnv.value,
    bucket: bucketEnv.value,
    publicBaseUrl: validatedPublicBaseUrl,
  }
}

export function createR2Client() {
  const { endpoint, accessKeyId, secretAccessKey } = getR2Config()

  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

export async function createObjectAccessUrl(key, expiresIn = 900) {
  const { bucket, publicBaseUrl } = getR2Config()

  if (publicBaseUrl) {
    return `${publicBaseUrl.replace(/\/$/, '')}/${key}`
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  })

  return getSignedUrl(createR2Client(), command, { expiresIn })
}

export async function uploadBuffer(key, body, contentType = 'application/octet-stream') {
  const { bucket } = getR2Config()
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  })

  return createR2Client().send(command)
}