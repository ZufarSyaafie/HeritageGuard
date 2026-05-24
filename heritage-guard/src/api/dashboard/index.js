import { supabase } from "@/utils/supabase";

export async function getDashboardData(userId) {
  try {
    // 1. Get the latest inspection for the user
    const { data: latestInspection, error: inspectionError } = await supabase
      .from('INSPECTIONS')
      .select(`
        *,
        ASSETS (*),
        USERS (full_name, email)
      `)
      .eq('user_id', userId)
      .order('inspection_date', { ascending: false })
      .limit(1)
      .single();

    if (inspectionError && inspectionError.code !== 'PGRST116') { // PGRST116 is 'no rows returned'
      throw inspectionError;
    }

    if (!latestInspection) {
      return {
        inspection: null,
        summaries: [],
        detections: [],
        asset: null
      };
    }

    // 2. Get analysis summaries for this inspection
    const { data: summaries, error: summariesError } = await supabase
      .from('ANALYSIS_SUMMARIES')
      .select('*')
      .eq('inspection_id', latestInspection.id);

    if (summariesError) throw summariesError;

    // 3. Get detections for this inspection
    const { data: detections, error: detectionsError } = await supabase
      .from('DETECTIONS')
      .select(`
        *,
        AI_MODELS (model_name, version)
      `)
      .eq('inspection_id', latestInspection.id);

    if (detectionsError) throw detectionsError;

    return {
      inspection: latestInspection,
      summaries: summaries || [],
      detections: detections || [],
      asset: latestInspection.ASSETS
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      error: error.message,
      inspection: null,
      summaries: [],
      detections: [],
      asset: null
    };
  }
}
