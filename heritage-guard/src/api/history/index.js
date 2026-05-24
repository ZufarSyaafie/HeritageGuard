import { getSupabaseAdminClient } from "@/lib/server/supabase";

export async function getHistoryData(userId) {
  try {
    const supabaseAdmin = getSupabaseAdminClient();
    const { data, error } = await supabaseAdmin
      .from('INSPECTIONS')
      .select(`
        id,
        inspection_date,
        overall_health_score,
        report_url,
        image_url,
        ASSETS (name, location)
      `)
      .eq('user_id', userId)
      .order('inspection_date', { ascending: false });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error) {
    console.error("Error fetching history data:", error);
    return { data: [], error: error.message };
  }
}

export async function getHistoryDetail(inspectionId) {
  try {
    const supabaseAdmin = getSupabaseAdminClient();
    const { data, error } = await supabaseAdmin
      .from('INSPECTIONS')
      .select(`
        *,
        ASSETS (*),
        DETECTIONS (*),
        ANALYSIS_SUMMARIES (*),
        USERS (full_name, email)
      `)
      .eq('id', inspectionId)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching history detail:", error);
    return { data: null, error: error.message };
  }
}
