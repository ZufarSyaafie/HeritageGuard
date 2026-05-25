import crypto from 'node:crypto'

import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createObjectAccessUrl, uploadBuffer } from '@/lib/server/r2'
import {
  buildDetectionSummaries,
  buildImageObjectKey,
  buildInferenceReport,
  buildReportObjectKey,
  calculateHealthScore,
  getInferenceUrl,
  normalizeDetections,
} from '@/lib/server/inference'
import { getSupabaseAdminClient, getUserFromBearerToken } from '@/lib/server/supabase'

export const runtime = 'nodejs'

const inferenceRequestSchema = z.object({
  asset_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  asset_name: z.string().trim().min(1).optional(),
  asset_location: z.string().trim().min(1).optional(),
  asset_description: z.string().trim().optional(),
  user_full_name: z.string().trim().min(1).optional(),
  user_email: z.string().email().optional(),
  model_name: z.string().trim().min(1).optional(),
  model_version: z.string().trim().min(1).optional(),
  device_info: z.string().trim().optional(),
  weather_condition: z.string().trim().optional(),
  temperature: z.coerce.number().optional(),
})

function cleanNullableString(value) {
  const text = String(value ?? '').trim()

  return text ? text : null
}

async function callInferenceModel(fileBuffer, fileName, mimeType) {
  const form = new FormData()
  form.append('file', new Blob([fileBuffer], { type: mimeType }), fileName)

  const response = await fetch(getInferenceUrl(), {
    method: 'POST',
    body: form,
  })

  const rawText = await response.text()

  if (!response.ok) {
    throw new Error(`Inference model returned ${response.status}: ${rawText.slice(0, 300)}`)
  }

  try {
    return JSON.parse(rawText)
  } catch {
    throw new Error(`Inference model returned invalid JSON: ${rawText.slice(0, 300)}`)
  }
}

async function upsertAsset(supabase, parsedBody, inspectionId) {
  if (parsedBody.asset_id) {
    const existingAsset = await supabase.from('ASSETS').select('*').eq('id', parsedBody.asset_id).maybeSingle()

    if (existingAsset.error) {
      throw existingAsset.error
    }

    if (existingAsset.data) {
      return existingAsset.data
    }

    const assetPayload = {
      id: parsedBody.asset_id,
      name: parsedBody.asset_name || `Asset ${inspectionId.slice(0, 8)}`,
      location: parsedBody.asset_location || 'Unknown location',
      description: cleanNullableString(parsedBody.asset_description),
    }

    const createdAsset = await supabase.from('ASSETS').insert(assetPayload).select('*').single()

    if (createdAsset.error) {
      throw createdAsset.error
    }

    return createdAsset.data
  }

  const assetPayload = {
    name: parsedBody.asset_name || `Asset ${inspectionId.slice(0, 8)}`,
    location: parsedBody.asset_location || 'Unknown location',
    description: cleanNullableString(parsedBody.asset_description),
  }

  const createdAsset = await supabase.from('ASSETS').insert(assetPayload).select('*').single()

  if (createdAsset.error) {
    throw createdAsset.error
  }

  return createdAsset.data
}

async function resolveUserRecord(supabase, parsedBody, authUser) {
  // 1. Explicit user_id from body (highest priority, usually for admin or testing)
  if (parsedBody.user_id) {
    const explicitUser = await supabase.from('USERS').select('*').eq('id', parsedBody.user_id).maybeSingle()

    if (explicitUser.error) throw explicitUser.error
    if (explicitUser.data) return explicitUser.data
  }

  // 2. Auth user from bearer token (Standard for real usage)
  if (authUser) {
    const matchedUser = await supabase.from('USERS').select('*').eq('id', authUser.id).maybeSingle()

    if (matchedUser.error) throw matchedUser.error
    
    // If user exists in public.USERS, return it
    if (matchedUser.data) return matchedUser.data

    // If not, auto-create it (First time login from Google OAuth)
    const newUserPayload = {
      id: authUser.id,
      full_name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
      email: authUser.email,
      role: 'user'
    }

    const createdUser = await supabase.from('USERS').insert(newUserPayload).select('*').single()

    if (createdUser.error) throw createdUser.error
    return createdUser.data
  }

  throw new Error('Authentication required.')
}

async function getOrCreateModel(supabase, parsedBody) {
  const modelName = parsedBody.model_name || 'yolo12s'
  const modelVersion = parsedBody.model_version || '1'

  const existingModel = await supabase
    .from('AI_MODELS')
    .select('*')
    .eq('model_name', modelName)
    .eq('version', modelVersion)
    .maybeSingle()

  if (existingModel.error) {
    throw existingModel.error
  }

  if (existingModel.data) {
    return existingModel.data
  }

  const createdModel = await supabase
    .from('AI_MODELS')
    .insert({ model_name: modelName, version: modelVersion })
    .select('*')
    .single()

  if (createdModel.error) {
    throw createdModel.error
  }

  return createdModel.data
}

export async function POST(req) {
  try {
    const formData = await req.formData()
    const fileField = formData.get('file')

    if (!fileField || typeof fileField === 'string') {
      return NextResponse.json({ error: 'Missing image file. Send multipart/form-data with field name "file".' }, { status: 400 })
    }

    if (!fileField.type || !fileField.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image uploads are allowed.' }, { status: 400 })
    }

    if (fileField.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 })
    }

    const parsedBody = inferenceRequestSchema.safeParse(Object.fromEntries(formData.entries()))

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: 'Invalid request body',
          details: parsedBody.error.flatten(),
        },
        { status: 400 }
      )
    }

    let authUser = null

    if (req.headers.get('authorization')) {
      try {
        authUser = await getUserFromBearerToken(req.headers.get('authorization'))
      } catch (error) {
        return NextResponse.json(
          {
            error: 'Invalid bearer token',
            details: error.message,
          },
          { status: 401 }
        )
      }
    }

    const supabase = getSupabaseAdminClient()
    const inspectionId = crypto.randomUUID()
    const asset = await upsertAsset(supabase, parsedBody.data, inspectionId)
    const user = await resolveUserRecord(supabase, parsedBody.data, authUser)
    const model = await getOrCreateModel(supabase, parsedBody.data)
    const imageKey = buildImageObjectKey(inspectionId, fileField.name)
    const reportKey = buildReportObjectKey(inspectionId)
    const fileBuffer = Buffer.from(await fileField.arrayBuffer())

    await uploadBuffer(imageKey, fileBuffer, fileField.type)

    const inferencePayload = await callInferenceModel(fileBuffer, fileField.name, fileField.type)
    const detections = normalizeDetections(inferencePayload.detections)
    const summaries = buildDetectionSummaries(detections)
    const healthScore = calculateHealthScore(detections)

    const reportPayload = buildInferenceReport({
      inspectionId,
      asset,
      user,
      model,
      detections,
      summaries,
      healthScore,
      imageKey,
      reportKey,
      file: {
        originalname: fileField.name,
        mimetype: fileField.type,
        size: fileField.size,
      },
      inferencePayload,
    })

    await uploadBuffer(reportKey, Buffer.from(JSON.stringify(reportPayload, null, 2), 'utf8'), 'application/json')

    const inspectionPayload = {
      id: inspectionId,
      asset_id: asset.id,
      user_id: user.id,
      inspection_date: new Date().toISOString(),
      image_url: imageKey,
      device_info: cleanNullableString(parsedBody.data.device_info),
      weather_condition: cleanNullableString(parsedBody.data.weather_condition),
      temperature: parsedBody.data.temperature ?? null,
      overall_health_score: healthScore,
      report_url: reportKey,
    }

    const inspectionInsert = await supabase.from('INSPECTIONS').insert(inspectionPayload).select('*').single()

    if (inspectionInsert.error) {
      throw inspectionInsert.error
    }

    if (detections.length > 0) {
      const detectionRows = detections.map((detection) => ({
        inspection_id: inspectionId,
        model_id: model.id,
        type: detection.className,
        confidence_score: detection.confidence,
        bbox_x: detection.bbox.x,
        bbox_y: detection.bbox.y,
        bbox_width: detection.bbox.width,
        bbox_height: detection.bbox.height,
      }))

      const detectionsInsert = await supabase.from('DETECTIONS').insert(detectionRows)

      if (detectionsInsert.error) {
        throw detectionsInsert.error
      }
    }

    if (summaries.length > 0) {
      const summaryRows = summaries.map((summary) => ({
        inspection_id: inspectionId,
        category: summary.category,
        value: summary.value,
        status: summary.status,
      }))

      const summariesInsert = await supabase.from('ANALYSIS_SUMMARIES').insert(summaryRows)

      if (summariesInsert.error) {
        throw summariesInsert.error
      }
    }

    const imageUrl = await createObjectAccessUrl(imageKey)
    const reportUrl = await createObjectAccessUrl(reportKey)

    return NextResponse.json(
      {
        message: 'Inference completed successfully',
        inspection: inspectionInsert.data,
        asset,
        user,
        model,
        detections,
        summaries,
        healthScore,
        r2: {
          imageKey,
          reportKey,
          imageUrl,
          reportUrl,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: error?.message || 'Internal server error',
      },
      { status: 500 }
    )
  }
}