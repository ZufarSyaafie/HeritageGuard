import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/supabase';
import { getUserFromBearerToken } from '@/lib/server/supabase';

export const runtime = 'nodejs';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let authUser = null;
    try {
      authUser = await getUserFromBearerToken(authHeader);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdminClient();

    // Verify admin role from USERS table (not user_metadata — can be spoofed by client)
    const { data: adminCheck } = await supabaseAdmin
      .from('USERS')
      .select('role')
      .eq('id', authUser.id)
      .single();

    if (!adminCheck || adminCheck.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access only' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('USERS')
      .select('id, email, full_name, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Admin Users API Error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
