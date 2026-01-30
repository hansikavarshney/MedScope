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
  isHighlighted?: boolean;
}

/**
 * Command Center Statistics Display
 */
export function StatsCards({ stats, hasSpike, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card">
            <div className="animate-pulse space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded-lg" />
              </div>
              <div className="h-8 w-24 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="sentinel-card p-8 text-center">
        <BarChart3 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
        <p className="font-medium text-muted-foreground">Awaiting Data</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Select filters to initialize surveillance
        </p>
      </div>
    );
  }

  const cards: StatCardConfig[] = [
    {
      label: "Total Usage",
      value: stats.totalUsage.toLocaleString(),
      subValue: `${stats.dataPoints} records`,
      icon: BarChart3,
      color: "text-primary",
      bgColor: "bg-primary/10 border-primary/20",
    },
    {
      label: "Daily Average",
      value: Math.round(stats.averageUsage).toLocaleString(),
      subValue: `${stats.minUsage.toLocaleString()} — ${stats.maxUsage.toLocaleString()}`,
      icon: Activity,
      color: "text-accent",
      bgColor: "bg-accent/10 border-accent/20",
    },
    {
      label: "Baseline",
      value: Math.round(stats.baselineAverage).toLocaleString(),
      subValue: "Historical reference",
      icon: Target,
      color: "text-success",
      bgColor: "bg-success/10 border-success/20",
    },
    {
      label: "Threshold",
      value: Math.round(stats.spikeThreshold).toLocaleString(),
      subValue: hasSpike ? "⚠ Exceeded" : "Normal range",
      icon: hasSpike ? AlertTriangle : Zap,
      color: hasSpike ? "text-warning" : "text-muted-foreground",
      bgColor: hasSpike ? "bg-warning/10 border-warning/30" : "bg-muted/50 border-border",
      borderColor: hasSpike ? "border-warning/40" : undefined,
      isHighlighted: hasSpike,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className={`stat-card ${card.borderColor || ''} ${card.isHighlighted ? 'glow-warning' : ''}`}
          style={{ animationDelay: `${index * 75}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {card.label}
            </span>
            <div className={`p-2 rounded-lg border ${card.bgColor}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </div>
          
          <p className={`text-2xl font-semibold font-mono data-value ${card.isHighlighted ? card.color : 'text-foreground'}`}>
            {card.value}
          </p>
          
          {card.subValue && (
            <p className="text-xs text-muted-foreground mt-1">
              {card.subValue}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
