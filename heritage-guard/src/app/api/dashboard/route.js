import { NextResponse } from 'next/server';
import { getDashboardData } from '@/api/dashboard';
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
        return NextResponse.json({ error: 'Invalid bearer token', details: error.message }, { status: 401 });
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dashboardData = await getDashboardData(user.id);

    if (dashboardData.error) {
      return NextResponse.json({ error: dashboardData.error }, { status: 500 });
    }

    // Generate access URL for the latest inspection image if it exists
    if (dashboardData.inspection?.image_url) {
      dashboardData.inspection.image_url = await createObjectAccessUrl(dashboardData.inspection.image_url);
    }

    return NextResponse.json({ data: dashboardData });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
