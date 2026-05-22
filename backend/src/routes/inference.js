import crypto from 'node:crypto'

import express from 'express'
import multer from 'multer'
import { z } from 'zod'

import { getSupabaseAdminClient, getUserFromBearerToken } from '../lib/supabase.js'
import { createObjectAccessUrl, uploadBuffer } from '../lib/r2.js'
import {
  buildDetectionSummaries,
  buildImageObjectKey,
  buildInferenceReport,
  buildReportObjectKey,
  calculateHealthScore,
  getInferenceUrl,
  normalizeDetections,
} from '../lib/inference.js'

const router = express.Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
})

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

function getResponseText(response) {
  return response.text()
}

async function callInferenceModel(file) {
  const form = new FormData()
  form.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname)

  const response = await fetch(getInferenceUrl(), {
    method: 'POST',
    body: form,
  })

  const rawText = await getResponseText(response)

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
  if (parsedBody.user_id) {
    const explicitUser = await supabase.from('USERS').select('*').eq('id', parsedBody.user_id).maybeSingle()

    if (explicitUser.error) {
      throw explicitUser.error
    }

    if (explicitUser.data) {
      return explicitUser.data
    }
  }

  const lookupEmail = parsedBody.user_email || authUser?.email || null

  if (lookupEmail) {
    const matchedUser = await supabase.from('USERS').select('*').eq('email', lookupEmail).maybeSingle()

    if (matchedUser.error) {
      throw matchedUser.error
    }

    if (matchedUser.data) {
      return matchedUser.data
    }
  }

  const fallbackUser = await supabase.from('USERS').select('*').order('created_at', { ascending: true }).limit(1).maybeSingle()

  if (fallbackUser.error) {
    throw fallbackUser.error
  }

  if (fallbackUser.data) {
    return fallbackUser.data
  }

  throw new Error('No USERS row is available. Create at least one application user in the USERS table first.')
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

router.post('/', upload.single('file'), async (req, res, next) => {
  const supabase = getSupabaseAdminClient()
  const parsedBody = inferenceRequestSchema.safeParse(req.body)

  if (!parsedBody.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: parsedBody.error.flatten(),
    })
  }

  if (!req.file) {
    return res.status(400).json({
      error: 'Missing image file. Send multipart/form-data with field name "file".',
    })
  }

  if (!req.file.mimetype || !req.file.mimetype.startsWith('image/')) {
    return res.status(400).json({
      error: 'Only image uploads are allowed.',
    })
  }

  let authUser = null

  if (req.headers.authorization) {
    try {
      authUser = await getUserFromBearerToken(req.headers.authorization)
    } catch (error) {
      return res.status(401).json({
        error: 'Invalid bearer token',
        details: error.message,
      })
    }
  }

  try {
    const inspectionId = crypto.randomUUID()
    const asset = await upsertAsset(supabase, parsedBody.data, inspectionId)
    const user = await resolveUserRecord(supabase, parsedBody.data, authUser)
    const model = await getOrCreateModel(supabase, parsedBody.data)
    const imageKey = buildImageObjectKey(inspectionId, req.file.originalname)
    const reportKey = buildReportObjectKey(inspectionId)

    await uploadBuffer(imageKey, req.file.buffer, req.file.mimetype)

    const inferencePayload = await callInferenceModel(req.file)
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
      file: req.file,
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

    return res.status(201).json({
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
    })
  } catch (error) {
    return next(error)
  }
})

export default router