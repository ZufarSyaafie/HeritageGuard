import { getSupabaseAdminClient } from "@/lib/server/supabase";

export async function getDashboardData(userId) {
  try {
    const supabaseAdmin = getSupabaseAdminClient();
    
    // 1. Get the latest inspection for the user
    const { data: latestInspection, error: inspectionError } = await supabaseAdmin
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

    if (inspectionError && inspectionError.code !== 'PGRST116') {
      throw inspectionError;
    }

    // 2. Get Aggregate Stats
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

    const [
      { count: totalAssets },
      { count: inspectionsThisMonth },
      { count: criticalCount },
      { count: safeCount }
    ] = await Promise.all([
      // Total Unique Assets for this user
      supabaseAdmin.from('INSPECTIONS').select('asset_id', { count: 'exact', head: true }).eq('user_id', userId),
      // Inspections this month
      supabaseAdmin.from('INSPECTIONS').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('inspection_date', startOfMonth),
      // Critical (Score < 50)
      supabaseAdmin.from('INSPECTIONS').select('*', { count: 'exact', head: true }).eq('user_id', userId).lt('overall_health_score', 50),
      // Safe (Score >= 80)
      supabaseAdmin.from('INSPECTIONS').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('overall_health_score', 80)
    ]);

    const stats = {
      totalAssets: totalAssets || 0,
      inspectionsThisMonth: inspectionsThisMonth || 0,
      criticalCount: criticalCount || 0,
      safeCount: safeCount || 0
    };

    if (!latestInspection) {
      return {
        inspection: null,
        summaries: [],
        detections: [],
        asset: null,
        stats
      };
    }

    // 3. Get analysis summaries for this inspection
    const { data: summaries, error: summariesError } = await supabaseAdmin
      .from('ANALYSIS_SUMMARIES')
      .select('*')
      .eq('inspection_id', latestInspection.id);

    if (summariesError) throw summariesError;

    // 4. Get detections for this inspection
    const { data: detections, error: detectionsError } = await supabaseAdmin
      .from('DETECTIONS')
      .select(`
        *,
        AI_MODELS (model_name, version)
      `)
      .eq('inspection_id', latestInspection.id);

    if (detectionsError) throw detectionsError;

    // 5. Get Trend Data (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0,0,0,0);

    const { data: trendInspections, error: trendError } = await supabaseAdmin
      .from('INSPECTIONS')
      .select(`
        id,
        inspection_date,
        DETECTIONS (type)
      `)
      .eq('user_id', userId)
      .gte('inspection_date', sixMonthsAgo.toISOString())
      .order('inspection_date', { ascending: true });

    if (trendError) throw trendError;

    // Process Trend Data
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const trendMap = {};

    // Initialize last 6 months
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      trendMap[key] = { month: key, crack: 0, spalling: 0, moisture: 0, sortKey: d.getTime() };
    }

    (trendInspections || []).forEach(insp => {
      const date = new Date(insp.inspection_date);
      const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
      
      if (trendMap[key]) {
        (insp.DETECTIONS || []).forEach(det => {
          const type = det.type?.toLowerCase() || "";
          if (type.includes('crack')) {
            trendMap[key].crack++;
          } else if (type.includes('spalling')) {
            trendMap[key].spalling++;
          } else if (type.includes('moisture')) {
            trendMap[key].moisture++;
          }
        });
      }
    });

    const trendData = Object.values(trendMap).sort((a, b) => a.sortKey - b.sortKey);

    return {
      inspection: latestInspection,
      summaries: summaries || [],
      detections: detections || [],
      asset: latestInspection.ASSETS,
      stats,
      trendData
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
