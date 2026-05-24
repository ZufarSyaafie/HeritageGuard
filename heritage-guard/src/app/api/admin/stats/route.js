import { NextResponse } from 'next/server';
import { getAdminStats } from '@/api/admin';
import { getUserFromBearerToken } from '@/lib/server/supabase';

export const runtime = 'nodejs';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let user = null;
    try {
      user = await getUserFromBearerToken(authHeader);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Verify if user is actually an admin
    if (user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access only' }, { status: 403 });
    }

    const stats = await getAdminStats();

    if (stats.error) {
      return NextResponse.json({ error: stats.error }, { status: 500 });
    }

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error('Admin API Error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
