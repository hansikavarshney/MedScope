import { Activity, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

/**
 * Dashboard header component with branding and actions
 */
export function DashboardHeader({ onRefresh, isLoading }: DashboardHeaderProps) {
  return (
    <header className="dashboard-header relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>
      
      <div className="container mx-auto px-6 py-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              {/* Pulse indicator */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-display tracking-tight">
                MedScope
              </h1>
              <p className="text-sm text-white/80 font-medium">
                Medicine Usage Surveillance & Alert System
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Status Badge */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
              </span>
              <span className="text-sm text-white/95 font-medium">
                Live Monitoring
              </span>
            </div>

            {/* Refresh Button */}
            {onRefresh && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRefresh}
                disabled={isLoading}
                className="text-white/80 hover:text-white hover:bg-white/15 border border-white/20"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            )}

            {/* Shield Badge */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              <Shield className="w-4 h-4 text-white/80" />
              <span className="text-sm text-white/95 font-medium">
                Real-time Protection
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
