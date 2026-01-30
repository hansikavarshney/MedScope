import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { AlertPanel } from "@/components/dashboard/AlertPanel";
import { DiseaseAlertModal } from "@/components/dashboard/DiseaseAlertModal";
import { useMedicineData } from "@/hooks/useMedicineData";
import { Loader2, Activity, Radio } from "lucide-react";

/**
 * MedScope Sentinel - Command Center Dashboard
 */
const Index = () => {
  const {
    filterOptions,
    selectedDistrict,
    selectedSubDistrict,
    selectedMedicine,
    selectedDays,
    handleDistrictChange,
    setSelectedSubDistrict,
    setSelectedMedicine,
    setSelectedDays,
    usageData,
    stats,
    currentAlert,
    allAlerts,
    filtersLoading,
    usageLoading,
    alertsLoading,
    refresh,
  } = useMedicineData();

  if (filtersLoading) {
    return (
      <div className="min-h-screen bg-background sentinel-grid-bg">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
              <Activity className="w-10 h-10 text-primary" />
              <Loader2 className="w-6 h-6 animate-spin text-primary absolute -bottom-2 -right-2 bg-background rounded-full border border-border p-0.5" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Initializing Sentinel
            </h2>
            <p className="text-sm text-muted-foreground">
              Loading surveillance systems...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background sentinel-grid-bg">
      {/* Header */}
      <DashboardHeader onRefresh={refresh} isLoading={usageLoading} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Filters */}
        <FilterPanel
          districts={filterOptions.districts}
          medicines={filterOptions.medicines}
          districtSubDistricts={filterOptions.districtSubDistricts}
          selectedDistrict={selectedDistrict}
          selectedSubDistrict={selectedSubDistrict}
          selectedMedicine={selectedMedicine}
          selectedDays={selectedDays}
          onDistrictChange={handleDistrictChange}
          onSubDistrictChange={setSelectedSubDistrict}
          onMedicineChange={setSelectedMedicine}
          onDaysChange={setSelectedDays}
          isLoading={usageLoading}
        />

        {/* Stats Row */}
        <StatsCards
          stats={stats}
          hasSpike={currentAlert?.isSpike || false}
          isLoading={usageLoading}
        />

        {/* Main Grid: Chart + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Panel */}
          <div className="lg:col-span-2">
            <UsageChart
              data={usageData}
              baselineAvg={stats?.baselineAverage || 0}
              spikeThreshold={stats?.spikeThreshold || 0}
              isLoading={usageLoading}
            />
          </div>

          {/* Alert Panel */}
          <div className="lg:col-span-1">
            <AlertPanel
              currentAlert={currentAlert}
              allAlerts={allAlerts}
              isLoading={alertsLoading}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-6 pb-4 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-primary" />
              <span>MedScope Sentinel — Real-time Health Surveillance</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Spike Threshold: ≥30%</span>
              <span className="text-muted-foreground/50">|</span>
              <span className="font-mono">v1.0.0</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Disease Modal */}
      <DiseaseAlertModal
        currentAlert={currentAlert}
        selectedMedicine={selectedMedicine}
        selectedDistrict={selectedDistrict}
        selectedSubDistrict={selectedSubDistrict}
      />
    </div>
  );
};

export default Index;
