import { NextResponse } from 'next/server';
import { getHistoryDetail } from '@/api/history';
import { getUserFromBearerToken } from '@/lib/server/supabase';
import { createObjectAccessUrl } from '@/lib/server/r2';

export const runtime = 'nodejs';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing inspection ID' }, { status: 400 });
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let user;
    try {
      user = await getUserFromBearerToken(authHeader);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { data, error } = await getHistoryDetail(id);

    if (error || !data) {
      return NextResponse.json({ error: error || 'Not found' }, { status: 404 });
    }

    if (data.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate access URLs for images
    const imageUrl = data.image_url ? await createObjectAccessUrl(data.image_url) : null;
    const reportUrl = data.report_url ? await createObjectAccessUrl(data.report_url) : null;

    return NextResponse.json({ 
      data: {
        ...data,
        image_url: imageUrl,
        report_url: reportUrl
      } 
    });
  } catch (error) {
    console.error('History Detail API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
