import { AlertTriangle, CheckCircle, Bell, MapPin, Pill, TrendingUp, Shield } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Alert, CurrentAlert } from "@/types/medicine";

interface AlertPanelProps {
  currentAlert: CurrentAlert | null;
  allAlerts: Alert[];
  isLoading?: boolean;
}

/**
 * Alert panel showing current spike alert and list of all active alerts
 */
export function AlertPanel({ currentAlert, allAlerts, isLoading }: AlertPanelProps) {
  if (isLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-32 bg-muted rounded-xl" />
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Current Selection Alert */}
      {currentAlert ? (
        <div
          className={`rounded-xl overflow-hidden border-2 ${
            currentAlert.severity === "critical"
              ? "border-destructive bg-destructive/5"
              : "border-warning bg-warning/5"
          }`}
        >
          {/* Alert Header */}
          <div
            className={`px-4 py-3 ${
              currentAlert.severity === "critical"
                ? "bg-destructive/10"
                : "bg-warning/10"
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle
                className={`w-5 h-5 ${
                  currentAlert.severity === "critical"
                    ? "text-destructive"
                    : "text-warning"
                }`}
              />
              <span className="font-display font-bold text-foreground">
                {currentAlert.severity === "critical" ? "Critical Alert" : "Warning Alert"}
              </span>
              <span
                className={`ml-auto px-2.5 py-1 text-xs font-bold rounded-full ${
                  currentAlert.severity === "critical"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-warning text-warning-foreground"
                }`}
              >
                +{currentAlert.percentageIncrease.toFixed(0)}%
              </span>
            </div>
          </div>
          
          {/* Alert Content */}
          <div className="p-4">
            <p className="text-sm text-foreground leading-relaxed">
              {currentAlert.message}
            </p>
            <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
              ⏱ {currentAlert.affectedDays} days with elevated usage detected
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-success/30 bg-success/5 p-5">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-success/15">
              <Shield className="w-6 h-6 text-success" />
            </div>
            <div>
              <h4 className="font-display font-bold text-foreground text-lg">
                All Clear
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Current selection shows normal consumption patterns. No anomalies detected.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* All Active Alerts */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-foreground">
              Active Alerts
            </h3>
          </div>
          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
            allAlerts.length > 0 
              ? "bg-warning/20 text-warning" 
              : "bg-muted text-muted-foreground"
          }`}>
            {allAlerts.length} total
          </span>
        </div>

        {allAlerts.length === 0 ? (
          <div className="text-center py-10 px-4">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-success/40" />
            <p className="font-medium text-foreground">No active alerts</p>
            <p className="text-sm text-muted-foreground mt-1">
              All regions showing normal patterns
            </p>
          </div>
        ) : (
          <ScrollArea className="h-72">
            <div className="p-3 space-y-3">
              {allAlerts.map((alert, index) => (
                <AlertCard key={index} alert={alert} />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

/**
 * Individual alert card component
 */
function AlertCard({ alert }: { alert: Alert }) {
  const isCritical = alert.severity === "critical";
  
  return (
    <div
      className={`p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer ${
        isCritical
          ? "border-destructive/30 bg-destructive/5 hover:bg-destructive/10"
          : "border-warning/30 bg-warning/5 hover:bg-warning/10"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Pill className={`w-4 h-4 ${isCritical ? "text-destructive" : "text-warning"}`} />
          <span className="font-semibold text-foreground">{alert.medicine}</span>
        </div>
        <span
          className={`px-2 py-0.5 text-xs font-bold rounded-full ${
            isCritical
              ? "bg-destructive text-destructive-foreground"
              : "bg-warning text-warning-foreground"
          }`}
        >
          +{alert.percentageIncrease.toFixed(0)}%
        </span>
      </div>
      
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
        <MapPin className="w-3.5 h-3.5" />
        <span>{alert.subDistrict}, {alert.district}</span>
      </div>
      
      <div className="flex items-center gap-4 pt-2 border-t border-border text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Peak: <strong className="text-foreground">{alert.peakUsage.toLocaleString()}</strong>
        </span>
        <span>
          Baseline: <strong className="text-foreground">{alert.baselineAvg.toLocaleString()}</strong>
        </span>
      </div>
    </div>
  );
}
