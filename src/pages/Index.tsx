import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { AlertPanel } from "@/components/dashboard/AlertPanel";
import { DiseaseAlertModal } from "@/components/dashboard/DiseaseAlertModal";
import { useMedicineData } from "@/hooks/useMedicineData";
import { Loader2, Activity } from "lucide-react";

/**
 * Main dashboard page for MedScope medicine usage monitoring
 * Features: Filters, Stats, Usage Chart, Alerts, and Disease Detection Modal
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

  // Show loading state while filters are loading
  if (filtersLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Activity className="w-10 h-10 text-primary" />
              </div>
              <Loader2 className="w-8 h-8 animate-spin text-primary absolute -bottom-2 -right-2 bg-background rounded-full p-1" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">
              Loading MedScope
            </h2>
            <p className="text-muted-foreground">
              Initializing surveillance dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with refresh action */}
      <DashboardHeader onRefresh={refresh} isLoading={usageLoading} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Filter Panel */}
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

        {/* Stats Cards */}
        <StatsCards
          stats={stats}
          hasSpike={currentAlert?.isSpike || false}
          isLoading={usageLoading}
        />

        {/* Main Grid: Chart + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Usage Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <UsageChart
              data={usageData}
              baselineAvg={stats?.baselineAverage || 0}
              spikeThreshold={stats?.spikeThreshold || 0}
              isLoading={usageLoading}
            />
          </div>

          {/* Alerts Panel - Takes 1 column */}
          <div className="lg:col-span-1">
            <AlertPanel
              currentAlert={currentAlert}
              allAlerts={allAlerts}
              isLoading={alertsLoading}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-8 pb-4 border-t border-border">
          <p className="flex items-center justify-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span>
              MedScope — Medicine Usage Surveillance System • 
              Data refreshes on demand • 
              Spike detection threshold: ≥30% above baseline
            </span>
          </p>
        </footer>
      </main>

      {/* Disease Detection Modal */}
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
