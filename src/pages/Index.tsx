import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { AlertPanel } from "@/components/dashboard/AlertPanel";
import { useMedicineData } from "@/hooks/useMedicineData";
import { Loader2 } from "lucide-react";

/**
 * Main dashboard page for MedScope medicine usage monitoring
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
  } = useMedicineData();

  // Show loading state while filters are loading
  if (filtersLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-6">
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
        <footer className="text-center text-sm text-muted-foreground pt-6 border-t border-border">
          <p>
            MedScope - Medicine Usage Surveillance System • 
            Data refreshes automatically • 
            Spike detection threshold: ≥30% above baseline
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
