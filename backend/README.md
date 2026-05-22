# HeritageGuard Backend

Standalone backend for HeritageGuard. This package is responsible for:

- Supabase relational access and auth-aware server operations
- Cloudflare R2 image uploads
- Small HTTP endpoints to connect the frontend to both services

## Setup

1. Copy `.env.example` to `.env`.
2. Fill in your Supabase and R2 credentials.
3. Use the Supabase project URL, not the `/rest/v1/` API endpoint.
4. Install dependencies with `npm install`.
5. Start the server with `npm run dev`.

## Environment

Required variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `R2_ENDPOINT`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `HF_INFERENCE_URL` optional, defaults to the provided Hugging Face Space endpoint

Optional:

- `PORT` defaults to `4000`
- `R2_PUBLIC_BASE_URL` if you want public image URLs returned after upload

## Inference Endpoint

`POST /api/inference` accepts `multipart/form-data` with:

- `file` required image upload
- `asset_id` optional existing asset UUID
- `asset_name`, `asset_location`, `asset_description` optional fallback asset data
- `user_id` optional existing custom user UUID
- `user_full_name`, `user_email` optional fallback user data
- `model_name`, `model_version` optional AI model metadata
- `device_info`, `weather_condition`, `temperature` optional inspection metadata

The backend will:

1. upload the original image to R2
2. call the Hugging Face model endpoint
3. store the detections report in R2
4. create the `INSPECTIONS` row in Supabase
5. insert rows into `DETECTIONS` and `ANALYSIS_SUMMARIES`

The response includes the inspection row plus R2 access URLs for the image and report.
