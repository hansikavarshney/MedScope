import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Alert {
  district: string;
  subDistrict: string;
  medicine: string;
  percentageIncrease: number;
  severity: "warning" | "critical";
  message: string;
  peakUsage: number;
  baselineAvg: number;
  detectedAt: string;
}

/**
 * Edge function to get all active alerts across regions
 * GET /get-alerts?district=X&medicine=Y (optional filters)
 */
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse query parameters
    const url = new URL(req.url);
    const districtFilter = url.searchParams.get("district");
    const medicineFilter = url.searchParams.get("medicine");

    // Get all unique district/subDistrict/medicine combinations
    const { data: distinctCombos, error: comboError } = await supabase
      .from("medicine_usage")
      .select("district, sub_district, medicine_name");

    if (comboError) {
      console.error("Database error:", comboError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get unique combinations
    const uniqueCombos = Array.from(
      new Set(
        distinctCombos.map(
          (c) => `${c.district}|${c.sub_district}|${c.medicine_name}`
        )
      )
    ).map((combo) => {
      const [district, subDistrict, medicine] = combo.split("|");
      return { district, subDistrict, medicine };
    });

    // Filter if parameters provided
    const filteredCombos = uniqueCombos.filter((c) => {
      if (districtFilter && c.district !== districtFilter) return false;
      if (medicineFilter && c.medicine !== medicineFilter) return false;
      return true;
    });

    // Analyze each combination for spikes
    const alerts: Alert[] = [];
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    for (const combo of filteredCombos) {
      // Get usage data for this combination
      const { data, error } = await supabase
        .from("medicine_usage")
        .select("*")
        .eq("district", combo.district)
        .eq("sub_district", combo.subDistrict)
        .eq("medicine_name", combo.medicine)
        .gte("date", thirtyDaysAgo.toISOString().split("T")[0])
        .order("date", { ascending: true });

      if (error || !data || data.length < 7) continue;

      // Calculate baseline from first 70% of data
      const quantities = data.map((d) => d.quantity_used);
      const baselineCount = Math.max(1, Math.floor(quantities.length * 0.7));
      const baselineQuantities = quantities.slice(0, baselineCount);
      const baselineAvg =
        baselineQuantities.reduce((sum, q) => sum + q, 0) / baselineQuantities.length;

      // Get recent data (last 7 days)
      const recentData = data.filter(
        (d) => new Date(d.date) >= sevenDaysAgo
      );

      if (recentData.length === 0) continue;

      // Check for spikes (>= 30% above baseline)
      const spikeThreshold = baselineAvg * 1.3;
      const spikeRecords = recentData.filter(
        (d) => d.quantity_used >= spikeThreshold
      );

      if (spikeRecords.length > 0) {
        const peakUsage = Math.max(...spikeRecords.map((d) => d.quantity_used));
        const percentageIncrease = ((peakUsage - baselineAvg) / baselineAvg) * 100;

        alerts.push({
          district: combo.district,
          subDistrict: combo.subDistrict,
          medicine: combo.medicine,
          percentageIncrease,
          severity: percentageIncrease >= 50 ? "critical" : "warning",
          message: `${combo.medicine} usage in ${combo.subDistrict}, ${combo.district} is ${percentageIncrease.toFixed(1)}% above normal levels.`,
          peakUsage,
          baselineAvg: Math.round(baselineAvg),
          detectedAt: spikeRecords[spikeRecords.length - 1].date,
        });
      }
    }

    // Sort by severity and percentage
    alerts.sort((a, b) => {
      if (a.severity !== b.severity) {
        return a.severity === "critical" ? -1 : 1;
      }
      return b.percentageIncrease - a.percentageIncrease;
    });

    return new Response(
      JSON.stringify({
        alerts,
        totalAlerts: alerts.length,
        criticalCount: alerts.filter((a) => a.severity === "critical").length,
        warningCount: alerts.filter((a) => a.severity === "warning").length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
