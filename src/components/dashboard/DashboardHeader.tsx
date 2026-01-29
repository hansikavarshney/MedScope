import { Activity, Shield } from "lucide-react";

/**
 * Dashboard header component with branding and title
 */
export function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-display tracking-tight">
                MedScope
              </h1>
              <p className="text-sm text-white/75">
                Medicine Usage Surveillance & Alert System
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
              <Shield className="w-4 h-4 text-white/80" />
              <span className="text-sm text-white/90 font-medium">
                Real-time Monitoring
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
