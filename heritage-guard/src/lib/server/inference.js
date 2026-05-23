import path from 'node:path'

const DEFAULT_INFERENCE_URL = 'https://mhfzalfrs-heritageguard.hf.space/predict'

function clampNumber(value, fallback = 0) {
  const numberValue = Number(value)

  return Number.isFinite(numberValue) ? numberValue : fallback
}

function normalizeText(value, fallback) {
  const text = String(value ?? '').trim()

  return text || fallback
}

function classifySeverity(averageConfidence) {
  if (averageConfidence >= 0.85) {
    return 'Critical'
  }

  if (averageConfidence >= 0.65) {
    return 'High'
  }

  if (averageConfidence >= 0.4) {
    return 'Moderate'
  }

  return 'Low'
}

export function getInferenceUrl() {
  return process.env.NEXT_HF_INFERENCE_URL || DEFAULT_INFERENCE_URL
}

export function sanitizeFileName(fileName) {
  const baseName = path.basename(fileName || 'upload')
  const cleaned = baseName
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+/, '')

  return cleaned || 'upload'
}

export function buildImageObjectKey(inspectionId, originalName) {
  const extension = path.extname(originalName || '').toLowerCase() || '.jpg'
  const safeName = sanitizeFileName(originalName).replace(extension, '')

  return `inspections/${inspectionId}/image-${safeName || 'upload'}${extension}`
}

export function buildReportObjectKey(inspectionId) {
  return `inspections/${inspectionId}/report.json`
}

export function normalizeDetections(rawPayload) {
  const sourceDetections = Array.isArray(rawPayload)
    ? rawPayload
    : Array.isArray(rawPayload?.detections)
      ? rawPayload.detections
      : []

  return sourceDetections.map((detection, index) => {
    const rawBBox = detection.bbox ?? detection.bounding_box ?? detection.box ?? detection.coords ?? null
    let x = 0
    let y = 0
    let width = 0
    let height = 0

    if (Array.isArray(rawBBox)) {
      x = clampNumber(rawBBox[0])
      y = clampNumber(rawBBox[1])
      width = clampNumber(rawBBox[2])
      height = clampNumber(rawBBox[3])
    } else if (rawBBox && typeof rawBBox === 'object') {
      x = clampNumber(rawBBox.x ?? rawBBox.left ?? rawBBox[0])
      y = clampNumber(rawBBox.y ?? rawBBox.top ?? rawBBox[1])
      width = clampNumber(rawBBox.width ?? rawBBox.w ?? rawBBox[2])
      height = clampNumber(rawBBox.height ?? rawBBox.h ?? rawBBox[3])
    }

    return {
      className: normalizeText(detection.class ?? detection.class_name ?? detection.label ?? detection.type ?? `detection-${index + 1}`, `detection-${index + 1}`),
      confidence: clampNumber(detection.confidence ?? detection.score ?? detection.probability ?? 0),
      bbox: {
        x,
        y,
        width,
        height,
      },
    }
  })
}

export function buildDetectionSummaries(detections) {
  if (!detections.length) {
    return [
      {
        category: 'Overall',
        value: 100,
        status: 'Safe',
      },
    ]
  }

  const grouped = new Map()

  for (const detection of detections) {
    const bucket = grouped.get(detection.className) || []
    bucket.push(detection)
    grouped.set(detection.className, bucket)
  }

  return Array.from(grouped.entries()).map(([category, groupedDetections]) => {
    const averageConfidence = groupedDetections.reduce((sum, detection) => sum + detection.confidence, 0) / groupedDetections.length

    return {
      category,
      value: Math.round(averageConfidence * 100),
      status: classifySeverity(averageConfidence),
    }
  })
}

export function calculateHealthScore(detections) {
  if (!detections.length) {
    return 100
  }

  const averageConfidence = detections.reduce((sum, detection) => sum + detection.confidence, 0) / detections.length
  const severityPenalty = Math.min(25, detections.length * 4)
  const confidencePenalty = Math.round(averageConfidence * 45)

  return Math.max(0, 100 - severityPenalty - confidencePenalty)
}

export function buildInferenceReport({
  inspectionId,
  asset,
  user,
  model,
  detections,
  summaries,
  healthScore,
  imageKey,
  reportKey,
  file,
  inferencePayload,
}) {
  return {
    inspection_id: inspectionId,
    asset,
    user,
    model,
    detections,
    summaries,
    overall_health_score: healthScore,
    storage: {
      image_key: imageKey,
      report_key: reportKey,
      original_name: file.originalname,
      mime_type: file.mimetype,
      size: file.size,
    },
    inference_response: inferencePayload,
    created_at: new Date().toISOString(),
  }
}