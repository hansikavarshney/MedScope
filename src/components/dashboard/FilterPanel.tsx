import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin, Pill, Clock, Layers } from "lucide-react";

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
  { value: 7, label: "7D", full: "7 Days" },
  { value: 14, label: "14D", full: "14 Days" },
  { value: 30, label: "30D", full: "30 Days" },
] as const;

/**
 * Command Center Filter Controls
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
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
          <Layers className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Data Filters</h2>
          <p className="text-xs text-muted-foreground">Configure surveillance parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* District */}
        <FilterSelect
          icon={MapPin}
          label="District"
          placeholder="Select district"
          value={selectedDistrict}
          onValueChange={onDistrictChange}
          options={districts}
          disabled={isLoading}
          iconColor="text-primary"
        />

        {/* Sub-District */}
        <FilterSelect
          icon={MapPin}
          label="Sub-District"
          placeholder={selectedDistrict ? "Select sub-district" : "Select district first"}
          value={selectedSubDistrict}
          onValueChange={onSubDistrictChange}
          options={subDistricts}
          disabled={isLoading || !selectedDistrict}
          iconColor="text-accent"
        />

        {/* Medicine */}
        <FilterSelect
          icon={Pill}
          label="Medicine"
          placeholder="Select medicine"
          value={selectedMedicine}
          onValueChange={onMedicineChange}
          options={medicines}
          disabled={isLoading}
          iconColor="text-warning"
        />

        {/* Time Range */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-success" />
            Time Range
          </label>
          <div className="flex gap-1.5 p-1 bg-muted/50 rounded-lg border border-border">
            {TIME_RANGES.map((range) => (
              <Button
                key={range.value}
                variant="ghost"
                size="sm"
                onClick={() => onDaysChange(range.value)}
                disabled={isLoading}
                className={`flex-1 h-9 font-mono text-sm transition-all ${
                  selectedDays === range.value
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedDistrict || selectedMedicine) && (
        <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Active:</span>
          {selectedDistrict && (
            <FilterTag label={selectedDistrict} type="location" />
          )}
          {selectedSubDistrict && (
            <FilterTag label={selectedSubDistrict} type="sublocation" />
          )}
          {selectedMedicine && (
            <FilterTag label={selectedMedicine} type="medicine" />
          )}
          <FilterTag label={`${selectedDays} days`} type="time" />
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  icon: Icon,
  label,
  placeholder,
  value,
  onValueChange,
  options,
  disabled,
  iconColor,
}: {
  icon: typeof MapPin;
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
  iconColor: string;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="h-10 bg-muted/30 border-border hover:border-primary/50 focus:border-primary transition-colors">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border shadow-xl">
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="cursor-pointer focus:bg-primary/10 focus:text-foreground"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function FilterTag({ label, type }: { label: string; type: 'location' | 'sublocation' | 'medicine' | 'time' }) {
  const colors = {
    location: 'bg-primary/10 text-primary border-primary/30',
    sublocation: 'bg-accent/10 text-accent border-accent/30',
    medicine: 'bg-warning/10 text-warning border-warning/30',
    time: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-md border ${colors[type]}`}>
      {label}
    </span>
  );
}
