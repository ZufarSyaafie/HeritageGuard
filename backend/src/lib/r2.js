import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

function getR2Config() {
  const endpoint = process.env.R2_ENDPOINT
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucket = process.env.R2_BUCKET
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error('R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET must be set')
  }

  return { endpoint, accessKeyId, secretAccessKey, bucket, publicBaseUrl }
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

export async function createUploadUrl(key, contentType, expiresIn = 900) {
  const { bucket, publicBaseUrl } = getR2Config()
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  })

  const url = await getSignedUrl(createR2Client(), command, { expiresIn })

  return {
    uploadUrl: url,
    publicUrl: publicBaseUrl ? `${publicBaseUrl.replace(/\/$/, '')}/${key}` : null,
  }
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
