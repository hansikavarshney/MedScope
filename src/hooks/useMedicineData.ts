import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UsageRecord {
  id: string;
  district: string;
  sub_district: string;
  medicine_name: string;
  date: string;
  quantity_used: number;
  isSpike: boolean;
  percentAboveBaseline: number;
}

interface Stats {
  totalUsage: number;
  averageUsage: number;
  baselineAverage: number;
  spikeThreshold: number;
  minUsage: number;
  maxUsage: number;
  dataPoints: number;
}

interface CurrentAlert {
  isSpike: boolean;
  severity: "warning" | "critical";
  message: string;
  affectedDays: number;
  percentageIncrease: number;
}

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

interface FilterOptions {
  districts: string[];
  medicines: string[];
  districtSubDistricts: Record<string, string[]>;
}

/**
 * Custom hook to manage medicine usage data and alerts
 */
export function useMedicineData() {
  // Filter state
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [selectedDays, setSelectedDays] = useState(30);

  // Data state
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    districts: [],
    medicines: [],
    districtSubDistricts: {},
  });
  const [usageData, setUsageData] = useState<UsageRecord[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [currentAlert, setCurrentAlert] = useState<CurrentAlert | null>(null);
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);

  // Loading states
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [usageLoading, setUsageLoading] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(true);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Fetch filter options on mount
  useEffect(() => {
    async function fetchFilters() {
      try {
        setFiltersLoading(true);
        const { data, error } = await supabase.functions.invoke("get-filters");

        if (error) throw error;

        setFilterOptions({
          districts: data.districts || [],
          medicines: data.medicines || [],
          districtSubDistricts: data.districtSubDistricts || {},
        });

        // Set default selections
        if (data.districts?.length > 0) {
          setSelectedDistrict(data.districts[0]);
          if (data.districtSubDistricts?.[data.districts[0]]?.length > 0) {
            setSelectedSubDistrict(data.districtSubDistricts[data.districts[0]][0]);
          }
        }
        if (data.medicines?.length > 0) {
          setSelectedMedicine(data.medicines[0]);
        }
      } catch (err) {
        console.error("Error fetching filters:", err);
        setError("Failed to load filter options");
      } finally {
        setFiltersLoading(false);
      }
    }

    fetchFilters();
  }, []);

  // Fetch all alerts on mount
  useEffect(() => {
    async function fetchAlerts() {
      try {
        setAlertsLoading(true);
        const { data, error } = await supabase.functions.invoke("get-alerts");

        if (error) throw error;

        setAllAlerts(data.alerts || []);
      } catch (err) {
        console.error("Error fetching alerts:", err);
      } finally {
        setAlertsLoading(false);
      }
    }

    fetchAlerts();
  }, []);

  // Fetch usage data when filters change
  const fetchUsageData = useCallback(async () => {
    if (!selectedDistrict || !selectedMedicine) return;

    try {
      setUsageLoading(true);
      setError(null);

      const params: Record<string, string> = {
        district: selectedDistrict,
        medicine: selectedMedicine,
        days: selectedDays.toString(),
      };

      if (selectedSubDistrict) {
        params.subDistrict = selectedSubDistrict;
      }

      const { data, error } = await supabase.functions.invoke("get-usage", {
        body: params,
      });

      if (error) throw error;

      setUsageData(data.usage || []);
      setStats(data.stats || null);
      setCurrentAlert(data.alert || null);
    } catch (err) {
      console.error("Error fetching usage data:", err);
      setError("Failed to load usage data");
      setUsageData([]);
      setStats(null);
      setCurrentAlert(null);
    } finally {
      setUsageLoading(false);
    }
  }, [selectedDistrict, selectedSubDistrict, selectedMedicine, selectedDays]);

  // Trigger data fetch when filters change
  useEffect(() => {
    fetchUsageData();
  }, [fetchUsageData]);

  // Reset sub-district when district changes
  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedSubDistrict("");
    // Auto-select first sub-district
    if (filterOptions.districtSubDistricts[district]?.length > 0) {
      setSelectedSubDistrict(filterOptions.districtSubDistricts[district][0]);
    }
  };

  return {
    // Filters
    filterOptions,
    selectedDistrict,
    selectedSubDistrict,
    selectedMedicine,
    selectedDays,
    handleDistrictChange,
    setSelectedSubDistrict,
    setSelectedMedicine,
    setSelectedDays,

    // Data
    usageData,
    stats,
    currentAlert,
    allAlerts,

    // Loading states
    filtersLoading,
    usageLoading,
    alertsLoading,
    isLoading: filtersLoading || usageLoading,

    // Error
    error,

    // Actions
    refresh: fetchUsageData,
  };
}
