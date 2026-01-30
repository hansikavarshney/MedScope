import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bug, MapPin, Pill, TrendingUp, ShieldAlert, X, Radio } from "lucide-react";
import { CurrentAlert, detectDiseaseFromMedicine, DiseasePattern } from "@/types/medicine";

interface DiseaseAlertModalProps {
  currentAlert: CurrentAlert | null;
  selectedMedicine: string;
  selectedDistrict: string;
  selectedSubDistrict: string;
}

/**
 * Disease Detection Alert Modal - Command Center Style
 */
export function DiseaseAlertModal({
  currentAlert,
  selectedMedicine,
  selectedDistrict,
  selectedSubDistrict,
}: DiseaseAlertModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [diseasePattern, setDiseasePattern] = useState<DiseasePattern | null>(null);
  const [hasShownForSelection, setHasShownForSelection] = useState(false);

  useEffect(() => {
    setHasShownForSelection(false);
  }, [selectedMedicine, selectedDistrict, selectedSubDistrict]);

  useEffect(() => {
    if (currentAlert?.isSpike && selectedMedicine && !hasShownForSelection) {
      const pattern = detectDiseaseFromMedicine(selectedMedicine);
      if (pattern) {
        setDiseasePattern(pattern);
        const timer = setTimeout(() => {
          setIsOpen(true);
          setHasShownForSelection(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentAlert, selectedMedicine, hasShownForSelection]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (!diseasePattern || !currentAlert) return null;

  const isCritical = currentAlert.severity === "critical";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-card border-border gap-0">
        {/* Header */}
        <div className={`px-5 py-4 border-b border-border ${isCritical ? 'bg-destructive/10' : 'bg-warning/10'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${isCritical ? 'bg-destructive/20' : 'bg-warning/20'}`}>
                <ShieldAlert className={`w-6 h-6 ${isCritical ? 'text-destructive' : 'text-warning'}`} />
              </div>
              <DialogHeader className="text-left space-y-0.5">
                <div className="flex items-center gap-2">
                  <Radio className={`w-3 h-3 ${isCritical ? 'text-destructive' : 'text-warning'} animate-pulse`} />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${isCritical ? 'text-destructive' : 'text-warning'}`}>
                    Alert Detected
                  </span>
                </div>
                <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Potential Outbreak
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Health risk identified in monitored region
                </DialogDescription>
              </DialogHeader>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Location & Medicine Grid */}
          <div className="grid grid-cols-2 gap-3">
            <InfoBox
              icon={MapPin}
              label="Location"
              value={selectedSubDistrict || selectedDistrict}
              subValue={selectedSubDistrict ? selectedDistrict : undefined}
            />
            <InfoBox
              icon={Pill}
              label="Medicine"
              value={selectedMedicine}
              badge={
                <span className={`flex items-center gap-1 text-xs font-mono ${isCritical ? 'text-destructive' : 'text-warning'}`}>
                  <TrendingUp className="w-3 h-3" />
                  +{currentAlert.percentageIncrease.toFixed(0)}%
                </span>
              }
            />
          </div>

          {/* Conditions */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className={`w-3 h-3 ${isCritical ? 'text-destructive' : 'text-warning'}`} />
              Potential Conditions
            </span>
            <div className="flex flex-wrap gap-2">
              {diseasePattern.diseases.map((disease) => (
                <span
                  key={disease}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg border ${
                    isCritical
                      ? "bg-destructive/10 text-destructive border-destructive/30"
                      : "bg-warning/10 text-warning border-warning/30"
                  }`}
                >
                  {disease}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-foreground/80 leading-relaxed">
              {diseasePattern.description}
            </p>
          </div>

          {/* Duration */}
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Duration:</span>{" "}
            {currentAlert.affectedDays} days of elevated usage detected
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border bg-muted/30 flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Dismiss
          </Button>
          <Button
            onClick={handleClose}
            className={`flex-1 ${
              isCritical
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : "bg-warning hover:bg-warning/90 text-warning-foreground"
            }`}
          >
            Acknowledge
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoBox({
  icon: Icon,
  label,
  value,
  subValue,
  badge,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  subValue?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="p-3 rounded-lg bg-muted/30 border border-border">
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
        <Icon className="w-3 h-3" />
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-medium text-foreground truncate">{value}</p>
      {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
      {badge && <div className="mt-1">{badge}</div>}
    </div>
  );
}
