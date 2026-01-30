import { Activity, RefreshCw, Radio, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

/**
 * Sentinel Command Center Header
 */
export function DashboardHeader({ onRefresh, isLoading }: DashboardHeaderProps) {
  return (
    <header className="sentinel-header">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              {/* Live indicator */}
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success status-dot-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-gradient-primary">MedScope</span>
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  SENTINEL
                </span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Real-time Health Surveillance Command Center
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Status Indicators - Desktop */}
            <div className="hidden lg:flex items-center gap-4 mr-4">
              <StatusBadge icon={Radio} label="Live Feed" status="active" />
              <StatusBadge icon={Shield} label="Monitoring" status="active" />
            </div>

            {/* Refresh Button */}
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="gap-2 bg-muted/50 border-border hover:bg-muted hover:border-primary/50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            )}

            {/* System Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/30">
              <Zap className="w-3.5 h-3.5 text-success" />
              <span className="text-xs font-medium text-success">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatusBadge({ 
  icon: Icon, 
  label, 
  status 
}: { 
  icon: typeof Radio; 
  label: string; 
  status: 'active' | 'warning' | 'error';
}) {
  const colors = {
    active: 'text-success bg-success/10 border-success/30',
    warning: 'text-warning bg-warning/10 border-warning/30',
    error: 'text-destructive bg-destructive/10 border-destructive/30',
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${colors[status]}`}>
      <Icon className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}
