import { getSupabaseAdminClient } from "@/lib/server/supabase";

export async function getAdminStats() {
  try {
    const supabaseAdmin = getSupabaseAdminClient();

    // 1. Get Overall Totals
    const [
      { count: totalUsers },
      { count: totalInspections },
      { count: criticalIssues },
      { count: safeAssets }
    ] = await Promise.all([
      supabaseAdmin.from('USERS').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('INSPECTIONS').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('INSPECTIONS').select('*', { count: 'exact', head: true }).lt('overall_health_score', 50),
      supabaseAdmin.from('INSPECTIONS').select('*', { count: 'exact', head: true }).gte('overall_health_score', 80)
    ]);

    // 2. Get Last 7 Days Activity
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      last7Days.push({
        date: d.toISOString(),
        label: `H-${i}`,
        count: 0
      });
    }

    const startDate = last7Days[0].date;
    const { data: recentInspections, error: trendError } = await supabaseAdmin
      .from('INSPECTIONS')
      .select('inspection_date')
      .gte('inspection_date', startDate);

    if (trendError) throw trendError;

    // Aggregate counts by day
    recentInspections.forEach(insp => {
      const inspDate = new Date(insp.inspection_date);
      inspDate.setHours(0, 0, 0, 0);
      const isoDate = inspDate.toISOString();
      
      const dayEntry = last7Days.find(d => d.date === isoDate);
      if (dayEntry) {
        dayEntry.count++;
      }
    });

    // 3. Get 5 Most Recent Inspections Global
    const { data: recentList, error: recentError } = await supabaseAdmin
      .from('INSPECTIONS')
      .select(`
        id,
        inspection_date,
        overall_health_score,
        USERS (full_name, email),
        ASSETS (name)
      `)
      .order('inspection_date', { ascending: false })
      .limit(5);

    if (recentError) throw recentError;

    return {
      totalUsers: totalUsers || 0,
      totalInspections: totalInspections || 0,
      criticalIssues: criticalIssues || 0,
      safeAssets: safeAssets || 0,
      weeklyActivity: last7Days.map(d => d.count),
      recentInspections: recentList || [],
      error: null
    };
  } catch (error) {
    console.error("Admin stats fetch error:", error);
    return { error: error.message };
  }
}
