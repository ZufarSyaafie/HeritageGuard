import { NextResponse } from 'next/server';
import { getHistoryData } from '@/api/history';
import { getUserFromBearerToken } from '@/lib/server/supabase';
import { createObjectAccessUrl } from '@/lib/server/r2';

export const runtime = 'nodejs';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    let user = null;

    if (authHeader) {
      try {
        user = await getUserFromBearerToken(authHeader);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid bearer token', details: error.message },
          { status: 401 }
        );
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await getHistoryData(user.id);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    // Transform data to include full URLs
    const transformedData = await Promise.all(
      (data || []).map(async (item) => {
        const imageUrl = item.image_url ? await createObjectAccessUrl(item.image_url) : null;
        const reportUrl = item.report_url ? await createObjectAccessUrl(item.report_url) : null;
        
        return {
          ...item,
          image_url: imageUrl,
          report_url: reportUrl,
        };
      })
    );

    return NextResponse.json({ data: transformedData });
  } catch (error) {
    console.error('History API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
