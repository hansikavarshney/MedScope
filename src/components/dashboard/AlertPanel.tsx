import { AlertTriangle, CheckCircle, Bell, MapPin, Pill, TrendingUp } from "lucide-react";

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

interface CurrentAlert {
  isSpike: boolean;
  severity: "warning" | "critical";
  message: string;
  affectedDays: number;
  percentageIncrease: number;
}

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
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-muted rounded-xl" />
        <div className="h-48 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Current Selection Alert */}
      {currentAlert ? (
        <div
          className={`alert-card ${
            currentAlert.severity === "critical"
              ? "alert-card-warning border-destructive bg-destructive/10"
              : "alert-card-warning"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg ${
                currentAlert.severity === "critical"
                  ? "bg-destructive/20"
                  : "bg-warning/20"
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${
                  currentAlert.severity === "critical"
                    ? "text-destructive"
                    : "text-warning"
                }`}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-display font-semibold text-foreground">
                  {currentAlert.severity === "critical" ? "Critical Alert" : "Warning Alert"}
                </h4>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    currentAlert.severity === "critical"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-warning text-warning-foreground"
                  }`}
                >
                  +{currentAlert.percentageIncrease.toFixed(0)}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentAlert.message}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Affected {currentAlert.affectedDays} days in the past week
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert-card-success">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-success/20">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground">
                No Anomalies Detected
              </h4>
              <p className="text-sm text-muted-foreground">
                Current selection shows normal consumption patterns
              </p>
            </div>
          </div>
        </div>
      )}

      {/* All Active Alerts */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-foreground">
            All Active Alerts
          </h3>
          <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-full">
            {allAlerts.length} total
          </span>
        </div>

        {allAlerts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success/50" />
            No active alerts across all regions
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {allAlerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border transition-colors hover:bg-muted/50 ${
                  alert.severity === "critical"
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-warning/30 bg-warning/5"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Pill
                      className={`w-4 h-4 ${
                        alert.severity === "critical"
                          ? "text-destructive"
                          : "text-warning"
                      }`}
                    />
                    <span className="font-medium text-sm text-foreground">
                      {alert.medicine}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      alert.severity === "critical"
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-warning text-warning-foreground"
                    }`}
                  >
                    +{alert.percentageIncrease.toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {alert.subDistrict}, {alert.district}
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Peak: {alert.peakUsage.toLocaleString()}
                  </span>
                  <span>Baseline: {alert.baselineAvg.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
