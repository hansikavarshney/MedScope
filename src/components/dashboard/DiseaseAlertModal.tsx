import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bug, MapPin, Pill, TrendingUp, ShieldAlert, X } from "lucide-react";
import { CurrentAlert, detectDiseaseFromMedicine, DiseasePattern } from "@/types/medicine";
import { Badge } from "@/components/ui/badge";

interface DiseaseAlertModalProps {
  currentAlert: CurrentAlert | null;
  selectedMedicine: string;
  selectedDistrict: string;
  selectedSubDistrict: string;
}

/**
 * Disease detection modal that triggers when a spike indicates potential disease outbreak
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

  // Reset when selection changes
  useEffect(() => {
    setHasShownForSelection(false);
  }, [selectedMedicine, selectedDistrict, selectedSubDistrict]);

  // Trigger modal when spike is detected
  useEffect(() => {
    if (currentAlert?.isSpike && selectedMedicine && !hasShownForSelection) {
      const pattern = detectDiseaseFromMedicine(selectedMedicine);
      if (pattern) {
        setDiseasePattern(pattern);
        // Small delay for better UX
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
      <DialogContent className="sm:max-w-lg border-0 p-0 overflow-hidden bg-card">
        {/* Alert Header Banner */}
        <div
          className={`px-6 py-5 ${
            isCritical
              ? "bg-gradient-to-r from-destructive to-destructive/80"
              : "bg-gradient-to-r from-warning to-warning/80"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <Bug className="w-5 h-5" />
                  Disease Alert Detected
                </DialogTitle>
                <DialogDescription className="text-white/90 text-sm">
                  Potential outbreak identified in your region
                </DialogDescription>
              </DialogHeader>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white/80 hover:text-white hover:bg-white/20 -mt-1 -mr-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Location & Medicine Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Location</span>
              </div>
              <p className="font-semibold text-foreground">
                {selectedSubDistrict || selectedDistrict}
              </p>
              <p className="text-sm text-muted-foreground">{selectedDistrict}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Pill className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Medicine</span>
              </div>
              <p className="font-semibold text-foreground">{selectedMedicine}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className={`w-3 h-3 ${isCritical ? "text-destructive" : "text-warning"}`} />
                <span className={`text-sm font-medium ${isCritical ? "text-destructive" : "text-warning"}`}>
                  +{currentAlert.percentageIncrease.toFixed(0)}% above baseline
                </span>
              </div>
            </div>
          </div>

          {/* Potential Diseases */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${isCritical ? "text-destructive" : "text-warning"}`} />
              Potential Conditions
            </h4>
            <div className="flex flex-wrap gap-2">
              {diseasePattern.diseases.map((disease) => (
                <Badge
                  key={disease}
                  variant="secondary"
                  className={`px-3 py-1.5 text-sm font-medium ${
                    isCritical
                      ? "bg-destructive/10 text-destructive border-destructive/20"
                      : "bg-warning/10 text-warning border-warning/20"
                  }`}
                >
                  {disease}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
            <p className="text-sm text-foreground leading-relaxed">
              {diseasePattern.description}
            </p>
          </div>

          {/* Alert Details */}
          <div className="text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Affected period:</span>{" "}
              {currentAlert.affectedDays} days showing elevated usage
            </p>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-muted/30 border-t border-border">
          <div className="flex w-full gap-3">
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
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-warning hover:bg-warning/90 text-warning-foreground"
              }`}
            >
              Acknowledge Alert
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
