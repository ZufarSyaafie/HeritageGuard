import { NextResponse } from 'next/server';
import { getAdminStats } from '@/api/admin';
import { getUserFromBearerToken, getSupabaseAdminClient } from '@/lib/server/supabase';

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

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role from DB (not user_metadata — can be stale)
    const supabaseAdmin = getSupabaseAdminClient();
    const { data: adminCheck } = await supabaseAdmin
      .from('USERS')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!adminCheck || adminCheck.role !== 'admin') {
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
