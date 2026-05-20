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

Optional:

- `PORT` defaults to `4000`
- `R2_PUBLIC_BASE_URL` if you want public image URLs returned after upload
