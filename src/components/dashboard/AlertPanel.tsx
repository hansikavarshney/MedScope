import { AlertTriangle, CheckCircle, Bell, MapPin, Pill, TrendingUp, ShieldCheck, Radio } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Alert, CurrentAlert } from "@/types/medicine";

interface AlertPanelProps {
  currentAlert: CurrentAlert | null;
  allAlerts: Alert[];
  isLoading?: boolean;
}

/**
 * Command Center Alert Console
 */
export function AlertPanel({ currentAlert, allAlerts, isLoading }: AlertPanelProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-28 bg-muted rounded-xl" />
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Current Selection Status */}
      {currentAlert ? (
        <CurrentAlertCard alert={currentAlert} />
      ) : (
        <AllClearCard />
      )}

      {/* Alert Feed */}
      <div className="sentinel-card flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Alert Feed</h3>
          </div>
          <span className={`px-2 py-0.5 text-xs font-mono rounded ${
            allAlerts.length > 0
              ? "bg-warning/10 text-warning border border-warning/30"
              : "bg-muted text-muted-foreground"
          }`}>
            {allAlerts.length}
          </span>
        </div>

        {allAlerts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle className="w-10 h-10 text-success/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No Active Alerts</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              All regions operating normally
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {allAlerts.map((alert, index) => (
                <AlertFeedItem key={index} alert={alert} />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

function CurrentAlertCard({ alert }: { alert: CurrentAlert }) {
  const isCritical = alert.severity === "critical";

  return (
    <div className={`rounded-xl overflow-hidden ${isCritical ? 'alert-card-critical' : 'alert-card-warning'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isCritical ? 'bg-destructive/20' : 'bg-warning/20'}`}>
          <AlertTriangle className={`w-5 h-5 ${isCritical ? 'text-destructive' : 'text-warning'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isCritical ? 'text-destructive' : 'text-warning'}`}>
              {isCritical ? 'Critical' : 'Warning'}
            </span>
            <span className={`px-1.5 py-0.5 text-xs font-mono rounded ${isCritical ? 'bg-destructive text-destructive-foreground' : 'bg-warning text-warning-foreground'}`}>
              +{alert.percentageIncrease.toFixed(0)}%
            </span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {alert.message}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {alert.affectedDays} days elevated
          </p>
        </div>
      </div>
    </div>
  );
}

function AllClearCard() {
  return (
    <div className="alert-card-success">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-success/20">
          <ShieldCheck className="w-5 h-5 text-success" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-success">
            All Clear
          </span>
          <p className="text-sm text-foreground/80 mt-1">
            Current selection shows normal consumption. No anomalies detected.
          </p>
        </div>
      </div>
    </div>
  );
}

function AlertFeedItem({ alert }: { alert: Alert }) {
  const isCritical = alert.severity === "critical";

  return (
    <div className={`p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
      isCritical
        ? "border-destructive/20 bg-destructive/5"
        : "border-warning/20 bg-warning/5"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Pill className={`w-3.5 h-3.5 ${isCritical ? "text-destructive" : "text-warning"}`} />
          <span className="text-sm font-medium text-foreground">{alert.medicine}</span>
        </div>
        <span className={`px-1.5 py-0.5 text-xs font-mono rounded ${
          isCritical
            ? "bg-destructive/20 text-destructive"
            : "bg-warning/20 text-warning"
        }`}>
          +{alert.percentageIncrease.toFixed(0)}%
        </span>
      </div>

      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
        <MapPin className="w-3 h-3" />
        <span>{alert.subDistrict}, {alert.district}</span>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span className="font-mono">{alert.peakUsage.toLocaleString()}</span>
        </span>
        <span className="text-muted-foreground/50">vs</span>
        <span className="font-mono">{alert.baselineAvg.toLocaleString()}</span>
      </div>
    </div>
  );
}
