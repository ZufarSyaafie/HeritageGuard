import { NextResponse } from 'next/server';
import { getUserFromBearerToken, getSupabaseAdminClient } from '@/lib/server/supabase';

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
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdminClient();

    const { data: dbUser, error } = await supabaseAdmin
      .from('USERS')
      .select('role, full_name')
      .eq('id', authUser.id)
      .single();

    if (error || !dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Sync user_metadata if role is out of date
    const metadataRole = authUser.user_metadata?.role;
    if (dbUser.role !== metadataRole) {
      await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
        user_metadata: { role: dbUser.role },
      });
    }

    return NextResponse.json({ role: dbUser.role, synced: dbUser.role !== metadataRole });
  } catch (error) {
    console.error('GET /api/me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
