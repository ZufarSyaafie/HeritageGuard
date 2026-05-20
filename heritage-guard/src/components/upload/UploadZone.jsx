"use client";

import { useRef, useState } from 'react';
import { AlertCircle, BarChart3, CheckCircle2, ChevronDown, Eye, ExternalLink, FileImage, FileText, Loader2, UploadCloud, X } from 'lucide-react';

const MODEL_OPTIONS = [
  {
    value: 'yolo12s',
    label: 'YOLO12S Building',
    version: '1',
  },
]

export default function UploadZone() {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [result, setResult] = useState(null)
  const [annotatedImageSize, setAnnotatedImageSize] = useState({ width: 0, height: 0 })
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0].value)
  const fileInputRef = useRef(null)
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('File terlalu besar! Maksimal 10MB.')
        return
      }

      setFile(selectedFile)
      setUploadError('')
      setResult(null)
      setAnnotatedImageSize({ width: 0, height: 0 })

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
      return
    }

    alert('Hanya file citra (JPG, PNG) yang diizinkan.')
  }

  const onDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => {
    setIsDragging(false)
  }

  const onDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    const droppedFile = event.dataTransfer.files[0]
    handleFile(droppedFile)
  }

  const onFileSelect = (event) => {
    const selectedFile = event.target.files[0]
    handleFile(selectedFile)
  }

  const removeFile = (event) => {
    event.stopPropagation()
    setFile(null)
    setPreview(null)
    setResult(null)
    setUploadError('')
    setAnnotatedImageSize({ width: 0, height: 0 })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadClick = async () => {
    if (!file) {
      fileInputRef.current?.click()
      return
    }

    setIsUploading(true)
    setUploadError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('model_name', selectedModel)
      formData.append('model_version', MODEL_OPTIONS.find((option) => option.value === selectedModel)?.version || '1')

      const response = await fetch(`${backendBaseUrl.replace(/\/$/, '')}/api/inference`, {
        method: 'POST',
        body: formData,
      })

      let payload = null

      try {
        payload = await response.json()
      } catch {
        payload = null
      }

      if (!response.ok) {
        throw new Error(payload?.error || `Upload gagal (${response.status})`)
      }

      setResult(payload)
    } catch (error) {
      setUploadError(error.message || 'Terjadi kesalahan saat memproses citra.')
    } finally {
      setIsUploading(false)
    }
  }

  const selectedModelLabel = MODEL_OPTIONS.find((option) => option.value === selectedModel)?.label || 'Model'

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
      />

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed p-10 transition-all lg:p-16 ${isDragging ? 'scale-[0.99] border-primary bg-blue-50/50' : 'border-gray-200 bg-gray-50/30 hover:border-primary/40 hover:bg-blue-50/30'}`}
      >
        {preview ? (
          <div className="flex w-full flex-col items-center">
            <div className="group/preview relative mb-6">
              <div className="h-64 w-64 overflow-hidden rounded-2xl border-4 border-white shadow-xl">
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              </div>
              <button
                onClick={removeFile}
                className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-colors hover:bg-red-600 active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-1 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" />
                <span className="font-bold text-gray-900">{file.name}</span>
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • Siap dianalisis
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className={`mb-8 flex h-24 w-24 items-center justify-center rounded-3xl transition-all duration-500 ${isDragging ? 'scale-110 rotate-12 bg-primary text-white' : 'bg-blue-50 text-primary'}`}>
              {isDragging ? <FileImage size={48} /> : <UploadCloud size={48} />}
            </div>

            <h3 className="mb-3 text-2xl font-black tracking-tight text-gray-900">
              {isDragging ? 'Lepaskan untuk Upload' : 'Tarik & Lepas Citra'}
            </h3>
            <p className="mb-10 max-w-sm text-center font-medium text-gray-500">
              Seret foto bangunan ke area ini atau <span className="font-bold text-primary">telusuri file</span> dari komputer Anda.
            </p>

            <div className="flex gap-4">
              <Badge text="JPG" />
              <Badge text="PNG" />
              <Badge text="MAX 10MB" />
            </div>
          </>
        )}

        {isDragging && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-primary/5">
            <div className="absolute inset-4 animate-pulse rounded-[2rem] border-4 border-dashed border-primary/20" />
          </div>
        )}
      </div>

      <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Model Detection</p>
            <p className="mt-1 text-sm font-bold text-gray-900">Pilih model yang digunakan</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-primary">
            <ChevronDown size={18} />
          </div>
        </div>

        <label className="relative block">
          <span className="sr-only">Pilih model</span>
          <select
            value={selectedModel}
            onChange={(event) => setSelectedModel(event.target.value)}
            className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 pr-12 text-sm font-bold text-gray-900 outline-none transition focus:border-primary focus:bg-white"
          >
            {MODEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} v{option.version}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </label>

        <p className="mt-3 text-xs leading-relaxed text-gray-500">
          Model yang dipilih akan dikirim ke backend bersama gambar. API inference yang dipakai tetap endpoint Hugging Face yang sama.
        </p>
      </div>

      <button
        onClick={handleUploadClick}
        disabled={isDragging || isUploading}
        className={`group mt-8 flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-5 font-bold transition-all active:scale-[0.98] shadow-xl ${file ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-200/50' : 'bg-primary text-white hover:bg-blue-700 shadow-blue-200/50'}`}
      >
        {isUploading ? (
          <>
            <Loader2 size={24} className="animate-spin" />
            <span className="text-lg">Memproses Citra...</span>
          </>
        ) : file ? (
          <>
            <CheckCircle2 size={24} />
            <span className="text-lg">Mulai Analisis Kerusakan</span>
          </>
        ) : (
          <>
            <UploadCloud size={24} className="transition-transform group-hover:translate-y-[-2px]" />
            <span className="text-lg">Pilih Citra Bangunan</span>
          </>
        )}
      </button>

      {file && (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-gray-400">
          <AlertCircle size={14} />
          Klik tombol di atas untuk memproses citra dengan {selectedModelLabel}
        </p>
      )}

      {uploadError && (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {uploadError}
        </div>
      )}

      {result && (
        <div className="mt-8 rounded-3xl border border-green-100 bg-green-50/60 p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-green-700">Inference Selesai</p>
              <h3 className="mt-1 text-2xl font-extrabold text-gray-900">Inspection {result.inspection?.id?.slice?.(0, 8) || 'Created'}</h3>
              <p className="mt-1 text-sm text-gray-600">
                {result.asset?.name || 'Asset baru'} · {result.asset?.location || 'Lokasi tidak tersedia'} · {result.model?.model_name || selectedModel}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ResultLink href={result.r2?.imageUrl} label="Lihat Citra R2" icon={<Eye size={16} />} />
              <ResultLink href={result.r2?.reportUrl} label="Lihat Report R2" icon={<FileText size={16} />} />
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-green-100 bg-white p-4">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Annotated Image</p>
            <AnnotatedImage
              src={result.r2?.imageUrl}
              detections={result.detections || []}
              naturalSize={annotatedImageSize}
              onImageLoad={setAnnotatedImageSize}
            />
            <p className="mt-3 text-xs text-gray-500">
              Kotak ditarik dari kolom bbox di tabel `DETECTIONS`.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <ResultStat label="Health Score" value={`${Math.round(result.healthScore ?? result.inspection?.overall_health_score ?? 0)}/100`} />
            <ResultStat label="Detections" value={String(result.detections?.length || 0)} />
            <ResultStat label="Summaries" value={String(result.summaries?.length || 0)} />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-green-100 bg-white p-5">
              <div className="mb-4 flex items-center gap-2 font-bold text-green-700">
                <BarChart3 size={18} />
                Ringkasan Analisis
              </div>
              <div className="space-y-3">
                {(result.summaries || []).map((summary, index) => (
                  <div key={`${summary.category}-${index}`} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{summary.category}</p>
                      <p className="text-xs text-gray-500">Status: {summary.status}</p>
                    </div>
                    <span className="text-sm font-black text-gray-900">{summary.value}%</span>
                  </div>
                ))}
                {(!result.summaries || result.summaries.length === 0) && (
                  <p className="text-sm text-gray-500">Tidak ada ringkasan yang dikembalikan model.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-green-100 bg-white p-5">
              <div className="mb-4 flex items-center gap-2 font-bold text-green-700">
                <Eye size={18} />
                Deteksi Model
              </div>
              <div className="max-h-80 space-y-3 overflow-auto pr-1">
                {(result.detections || []).map((detection, index) => (
                  <div key={`${detection.className}-${index}`} className="rounded-xl border border-gray-100 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{detection.className}</p>
                        <p className="text-xs text-gray-500">
                          bbox: {detection.bbox?.x ?? 0}, {detection.bbox?.y ?? 0}, {detection.bbox?.width ?? 0}, {detection.bbox?.height ?? 0}
                        </p>
                      </div>
                      <span className="text-sm font-black text-primary">{Math.round((detection.confidence || 0) * 100)}%</span>
                    </div>
                  </div>
                ))}
                {(!result.detections || result.detections.length === 0) && (
                  <p className="text-sm text-gray-500">Model tidak mengembalikan deteksi apa pun.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function Badge({ text }) {
  return (
    <span className="rounded-xl border border-gray-100 bg-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 shadow-sm">
      {text}
    </span>
  )
}

function ResultStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5">
      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</p>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
    </div>
  )
}

function ResultLink({ href, label, icon }) {
  if (!href) {
    return null
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-2xl border border-green-200 bg-white px-4 py-3 text-sm font-bold text-green-700 transition-colors hover:bg-green-100"
    >
      {icon}
      {label}
      <ExternalLink size={14} />
    </a>
  )
}

function AnnotatedImage({ src, detections, naturalSize, onImageLoad }) {
  if (!src) {
    return null
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
      <img
        src={src}
        alt="Annotated detection result"
        className="block h-auto w-full"
        onLoad={(event) => {
          onImageLoad({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })
        }}
      />

      <div className="absolute inset-0">
        {detections.map((detection, index) => {
          const style = getDetectionBoxStyle(detection.bbox, naturalSize)

          if (!style) {
            return null
          }

          const color = detectionColor(index)

          return (
            <div
              key={`${detection.className}-${index}`}
              className="absolute rounded-md border-2"
              style={{
                ...style,
                borderColor: color,
                boxShadow: `0 0 0 1px rgba(255,255,255,0.6), 0 0 18px ${color}55`,
              }}
            >
              <div
                className="absolute -top-7 left-0 max-w-[90%] rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white"
                style={{ backgroundColor: color }}
              >
                {detection.className} • {Math.round((detection.confidence || 0) * 100)}%
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getDetectionBoxStyle(bbox, naturalSize) {
  if (!bbox) {
    return null
  }

  const x = Number(bbox.x || 0)
  const y = Number(bbox.y || 0)
  const width = Number(bbox.width || 0)
  const height = Number(bbox.height || 0)

  if (width <= 0 || height <= 0) {
    return null
  }

  const normalized = x <= 1.5 && y <= 1.5 && width <= 1.5 && height <= 1.5

  if (normalized) {
    return {
      left: `${x * 100}%`,
      top: `${y * 100}%`,
      width: `${width * 100}%`,
      height: `${height * 100}%`,
    }
  }

  if (!naturalSize.width || !naturalSize.height) {
    return {
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`,
    }
  }

  return {
    left: `${(x / naturalSize.width) * 100}%`,
    top: `${(y / naturalSize.height) * 100}%`,
    width: `${(width / naturalSize.width) * 100}%`,
    height: `${(height / naturalSize.height) * 100}%`,
  }
}

function detectionColor(index) {
  const palette = ['#dc2626', '#d97706', '#2563eb', '#16a34a', '#7c3aed']

  return palette[index % palette.length]
}