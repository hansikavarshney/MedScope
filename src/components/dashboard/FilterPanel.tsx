import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, MapPin, Pill, Calendar } from "lucide-react";

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
  const [subDistricts, setSubDistricts] = useState<string[]>([]);

  // Update sub-districts when district changes
  useEffect(() => {
    if (selectedDistrict && districtSubDistricts[selectedDistrict]) {
      setSubDistricts(districtSubDistricts[selectedDistrict]);
    } else {
      setSubDistricts([]);
    }
  }, [selectedDistrict, districtSubDistricts]);

  const timeRanges = [
    { value: 7, label: "7 Days" },
    { value: 14, label: "14 Days" },
    { value: 30, label: "30 Days" },
  ];

  return (
    <div className="filter-group animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h2 className="font-display font-semibold text-foreground">Filters</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* District Select */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MapPin className="w-4 h-4" />
            District
          </label>
          <Select
            value={selectedDistrict}
            onValueChange={onDistrictChange}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sub-District Select */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MapPin className="w-4 h-4" />
            Sub-District
          </label>
          <Select
            value={selectedSubDistrict}
            onValueChange={onSubDistrictChange}
            disabled={isLoading || !selectedDistrict}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={selectedDistrict ? "Select sub-district" : "Select district first"} />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
              {subDistricts.map((subDistrict) => (
                <SelectItem key={subDistrict} value={subDistrict}>
                  {subDistrict}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Medicine Select */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Pill className="w-4 h-4" />
            Medicine
          </label>
          <Select
            value={selectedMedicine}
            onValueChange={onMedicineChange}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select medicine" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
              {medicines.map((medicine) => (
                <SelectItem key={medicine} value={medicine}>
                  {medicine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Range Select */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Time Range
          </label>
          <div className="flex gap-2">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={selectedDays === range.value ? "default" : "outline"}
                size="sm"
                onClick={() => onDaysChange(range.value)}
                disabled={isLoading}
                className="flex-1"
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
