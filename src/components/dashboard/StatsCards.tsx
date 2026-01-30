import { TrendingUp, Activity, Target, AlertTriangle, BarChart3, Zap } from "lucide-react";
import type { Stats } from "@/types/medicine";

interface StatsCardsProps {
  stats: Stats | null;
  hasSpike: boolean;
  isLoading?: boolean;
}

interface StatCardConfig {
  label: string;
  value: string;
  subValue?: string;
  icon: typeof BarChart3;
  color: string;
  bgColor: string;
  borderColor?: string;
}

/**
 * Statistics cards showing key metrics with enhanced visual design
 */
export function StatsCards({ stats, hasSpike, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-10 w-10 bg-muted rounded-xl" />
            </div>
            <div className="h-9 w-20 bg-muted rounded mb-2" />
            <div className="h-3 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
        <BarChart3 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
        <p className="font-medium">Select filters to view statistics</p>
      </div>
    );
  }

  const cards: StatCardConfig[] = [
    {
      label: "Total Usage",
      value: stats.totalUsage.toLocaleString(),
      subValue: `${stats.dataPoints} data points`,
      icon: BarChart3,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Daily Average",
      value: Math.round(stats.averageUsage).toLocaleString(),
      subValue: `Range: ${stats.minUsage.toLocaleString()} - ${stats.maxUsage.toLocaleString()}`,
      icon: Activity,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Baseline Avg",
      value: Math.round(stats.baselineAverage).toLocaleString(),
      subValue: "Historical reference",
      icon: Target,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Spike Threshold",
      value: Math.round(stats.spikeThreshold).toLocaleString(),
      subValue: hasSpike ? "⚠️ Threshold exceeded" : "All within normal",
      icon: hasSpike ? AlertTriangle : Zap,
      color: hasSpike ? "text-warning" : "text-muted-foreground",
      bgColor: hasSpike ? "bg-warning/10" : "bg-muted/50",
      borderColor: hasSpike ? "border-warning/30" : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in">
      {cards.map((card, index) => (
        <div 
          key={card.label} 
          className={`stat-card relative overflow-hidden ${card.borderColor || ''}`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-muted/20 pointer-events-none" />
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                {card.label}
              </span>
              <div className={`p-2.5 rounded-xl ${card.bgColor} transition-transform hover:scale-105`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold font-display text-foreground mb-1">
              {card.value}
            </p>
            {card.subValue && (
              <p className="text-xs text-muted-foreground">
                {card.subValue}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
