import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Edge function to get medicine usage data with spike detection
 * GET /get-usage?district=X&subDistrict=Y&medicine=Z&days=N
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

    // Parse parameters from either query string or request body
    const url = new URL(req.url);
    let district: string | null = url.searchParams.get("district");
    let subDistrict: string | null = url.searchParams.get("subDistrict");
    let medicine: string | null = url.searchParams.get("medicine");
    let daysParam: string | null = url.searchParams.get("days");

    // Always try to parse body for flexibility
    try {
      const contentType = req.headers.get("content-type") || "";
      if (contentType.includes("application/json") || req.method === "POST") {
        const text = await req.text();
        if (text) {
          const body = JSON.parse(text);
          district = body.district || district;
          subDistrict = body.subDistrict || subDistrict;
          medicine = body.medicine || medicine;
          daysParam = body.days?.toString() || daysParam;
        }
      }
    } catch {
      // No body or invalid JSON, continue with URL params
    }

    const days = parseInt(daysParam || "30");

    // Validate required parameters
    if (!district || !medicine) {
      return new Response(
        JSON.stringify({ error: "district and medicine are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Build query
    let query = supabase
      .from("medicine_usage")
      .select("*")
      .eq("district", district)
      .eq("medicine_name", medicine)
      .gte("date", startDate.toISOString().split("T")[0])
      .lte("date", endDate.toISOString().split("T")[0])
      .order("date", { ascending: true });

    // Add sub-district filter if provided
    if (subDistrict) {
      query = query.eq("sub_district", subDistrict);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ 
          usage: [], 
          stats: null,
          alert: null 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Perform spike detection analysis
    const quantities = data.map((d) => d.quantity_used);
    const totalUsage = quantities.reduce((sum, q) => sum + q, 0);
    const avgUsage = totalUsage / quantities.length;

    // Calculate baseline from first 70% of data (historical)
    const baselineCount = Math.max(1, Math.floor(quantities.length * 0.7));
    const baselineQuantities = quantities.slice(0, baselineCount);
    const baselineAvg = baselineQuantities.reduce((sum, q) => sum + q, 0) / baselineQuantities.length;

    // Detect spikes (>= 30% above baseline)
    const spikeThreshold = baselineAvg * 1.3;
    const usageWithSpikes = data.map((record) => ({
      ...record,
      isSpike: record.quantity_used >= spikeThreshold,
      percentAboveBaseline: ((record.quantity_used - baselineAvg) / baselineAvg) * 100,
    }));

    // Check if there's an active spike (recent data)
    const recentData = usageWithSpikes.slice(-7); // Last 7 days
    const hasActiveSpike = recentData.some((d) => d.isSpike);
    const maxSpike = Math.max(...recentData.map((d) => d.percentAboveBaseline));

    // Build alert message if spike detected
    let alert = null;
    if (hasActiveSpike) {
      const spikeRecords = recentData.filter((d) => d.isSpike);
      const peakUsage = Math.max(...spikeRecords.map((d) => d.quantity_used));
      alert = {
        isSpike: true,
        severity: maxSpike >= 50 ? "critical" : "warning",
        message: `Abnormal ${medicine} consumption detected in ${subDistrict || district}. Usage is ${maxSpike.toFixed(1)}% above baseline. Peak: ${peakUsage} units.`,
        affectedDays: spikeRecords.length,
        percentageIncrease: maxSpike,
      };
    }

    // Calculate statistics
    const stats = {
      totalUsage,
      averageUsage: avgUsage,
      baselineAverage: baselineAvg,
      spikeThreshold,
      minUsage: Math.min(...quantities),
      maxUsage: Math.max(...quantities),
      dataPoints: data.length,
    };

    return new Response(
      JSON.stringify({
        usage: usageWithSpikes,
        stats,
        alert,
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
