import { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, MapPin, Pill, Calendar, ChevronRight } from "lucide-react";

interface FilterPanelProps {
  districts: string[];
  medicines: string[];
  districtSubDistricts: Record<string, string[]>;
  selectedDistrict: string;
  selectedSubDistrict: string;
  selectedMedicine: string;
  selectedDays: number;
  onDistrictChange: (district: string) => void;
  onSubDistrictChange: (subDistrict: string) => void;
  onMedicineChange: (medicine: string) => void;
  onDaysChange: (days: number) => void;
  isLoading?: boolean;
}

const TIME_RANGES = [
  { value: 7, label: "7D" },
  { value: 14, label: "14D" },
  { value: 30, label: "30D" },
] as const;

/**
 * Filter panel component for selecting district, sub-district, medicine, and time range
 */
export function FilterPanel({
  districts,
  medicines,
  districtSubDistricts,
  selectedDistrict,
  selectedSubDistrict,
  selectedMedicine,
  selectedDays,
  onDistrictChange,
  onSubDistrictChange,
  onMedicineChange,
  onDaysChange,
  isLoading,
}: FilterPanelProps) {
  const subDistricts = useMemo(() => {
    if (selectedDistrict && districtSubDistricts[selectedDistrict]) {
      return districtSubDistricts[selectedDistrict];
    }
    return [];
  }, [selectedDistrict, districtSubDistricts]);

  return (
    <div className="filter-group animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-foreground text-lg">Filters</h2>
            <p className="text-xs text-muted-foreground">Refine your analysis</p>
          </div>
        </div>
        
        {/* Breadcrumb showing current selection */}
        <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{selectedDistrict || "—"}</span>
          <ChevronRight className="w-4 h-4" />
          <span>{selectedSubDistrict || "All"}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary font-medium">{selectedMedicine || "—"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* District Select */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            District
          </label>
          <Select
            value={selectedDistrict}
            onValueChange={onDistrictChange}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-background h-11 border-border/60 focus:border-primary transition-colors">
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-elevated z-50">
              {districts.map((district) => (
                <SelectItem 
                  key={district} 
                  value={district}
                  className="cursor-pointer hover:bg-muted"
                >
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sub-District Select */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <MapPin className="w-4 h-4 text-accent" />
            Sub-District
          </label>
          <Select
            value={selectedSubDistrict}
            onValueChange={onSubDistrictChange}
            disabled={isLoading || !selectedDistrict}
          >
            <SelectTrigger className="bg-background h-11 border-border/60 focus:border-primary transition-colors">
              <SelectValue placeholder={selectedDistrict ? "Select sub-district" : "Select district first"} />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-elevated z-50">
              {subDistricts.map((subDistrict) => (
                <SelectItem 
                  key={subDistrict} 
                  value={subDistrict}
                  className="cursor-pointer hover:bg-muted"
                >
                  {subDistrict}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Medicine Select */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Pill className="w-4 h-4 text-warning" />
            Medicine
          </label>
          <Select
            value={selectedMedicine}
            onValueChange={onMedicineChange}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-background h-11 border-border/60 focus:border-primary transition-colors">
              <SelectValue placeholder="Select medicine" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-elevated z-50">
              {medicines.map((medicine) => (
                <SelectItem 
                  key={medicine} 
                  value={medicine}
                  className="cursor-pointer hover:bg-muted"
                >
                  {medicine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Range Select */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Calendar className="w-4 h-4 text-success" />
            Time Range
          </label>
          <div className="flex gap-2 h-11">
            {TIME_RANGES.map((range) => (
              <Button
                key={range.value}
                variant={selectedDays === range.value ? "default" : "outline"}
                size="sm"
                onClick={() => onDaysChange(range.value)}
                disabled={isLoading}
                className={`flex-1 h-full font-semibold transition-all ${
                  selectedDays === range.value 
                    ? "shadow-md" 
                    : "hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
