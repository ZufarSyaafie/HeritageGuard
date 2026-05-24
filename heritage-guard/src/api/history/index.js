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
