import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Edge function to get available filter options (districts, sub-districts, medicines)
 * GET /get-filters
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

    // Get all records to extract unique values
    const { data, error } = await supabase
      .from("medicine_usage")
      .select("district, sub_district, medicine_name");

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch filter data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract unique values
    const districts = [...new Set(data.map((d) => d.district))].sort();
    const medicines = [...new Set(data.map((d) => d.medicine_name))].sort();

    // Build district -> sub-districts mapping
    const districtSubDistricts: Record<string, string[]> = {};
    for (const record of data) {
      if (!districtSubDistricts[record.district]) {
        districtSubDistricts[record.district] = [];
      }
      if (!districtSubDistricts[record.district].includes(record.sub_district)) {
        districtSubDistricts[record.district].push(record.sub_district);
      }
    }

    // Sort sub-districts
    for (const district of Object.keys(districtSubDistricts)) {
      districtSubDistricts[district].sort();
    }

    return new Response(
      JSON.stringify({
        districts,
        medicines,
        districtSubDistricts,
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
