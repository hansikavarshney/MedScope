/**
 * Shared types for medicine usage data across the application
 */

export interface UsageRecord {
  id: string;
  district: string;
  sub_district: string;
  medicine_name: string;
  date: string;
  quantity_used: number;
  isSpike: boolean;
  percentAboveBaseline: number;
}

export interface Stats {
  totalUsage: number;
  averageUsage: number;
  baselineAverage: number;
  spikeThreshold: number;
  minUsage: number;
  maxUsage: number;
  dataPoints: number;
}

export interface CurrentAlert {
  isSpike: boolean;
  severity: "warning" | "critical";
  message: string;
  affectedDays: number;
  percentageIncrease: number;
}

export interface Alert {
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

export interface FilterOptions {
  districts: string[];
  medicines: string[];
  districtSubDistricts: Record<string, string[]>;
}

/**
 * Disease detection mapping based on medicine usage patterns
 */
export interface DiseasePattern {
  medicine: string;
  diseases: string[];
  description: string;
}

export const MEDICINE_DISEASE_MAP: DiseasePattern[] = [
  { 
    medicine: "Paracetamol", 
    diseases: ["Fever", "Flu", "Viral Infection"],
    description: "Elevated Paracetamol usage may indicate fever or viral infection outbreak"
  },
  { 
    medicine: "ORS Packets", 
    diseases: ["Diarrhea", "Cholera", "Gastroenteritis"],
    description: "Spike in ORS usage suggests potential waterborne disease outbreak"
  },
  { 
    medicine: "Azithromycin", 
    diseases: ["Respiratory Infection", "Typhoid", "Bacterial Infection"],
    description: "Increased Azithromycin demand may indicate bacterial infection spread"
  },
  { 
    medicine: "Metformin", 
    diseases: ["Diabetes Management"],
    description: "Unusual Metformin patterns warrant review of chronic disease management"
  },
  { 
    medicine: "Amoxicillin", 
    diseases: ["Bacterial Infection", "Pneumonia", "ENT Infections"],
    description: "Amoxicillin surge may indicate respiratory or ENT infection outbreak"
  },
  { 
    medicine: "Cetirizine", 
    diseases: ["Allergies", "Seasonal Rhinitis"],
    description: "Cetirizine spike suggests potential allergy season or environmental trigger"
  },
  { 
    medicine: "Ibuprofen", 
    diseases: ["Pain/Inflammation", "Dengue Warning"],
    description: "Ibuprofen increase may indicate pain-related conditions (monitor for dengue)"
  },
  { 
    medicine: "Omeprazole", 
    diseases: ["Gastric Issues", "Acid Reflux"],
    description: "Elevated Omeprazole usage may indicate gastric health concerns"
  },
];

export function detectDiseaseFromMedicine(medicine: string): DiseasePattern | null {
  return MEDICINE_DISEASE_MAP.find(
    pattern => pattern.medicine.toLowerCase() === medicine.toLowerCase()
  ) || null;
}
