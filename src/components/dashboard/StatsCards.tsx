import { TrendingUp, TrendingDown, Activity, Target, BarChart3, AlertTriangle } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalUsage: number;
    averageUsage: number;
    baselineAverage: number;
    spikeThreshold: number;
    minUsage: number;
    maxUsage: number;
    dataPoints: number;
  } | null;
  hasSpike: boolean;
  isLoading?: boolean;
}

/**
 * Statistics cards showing key metrics
 */
export function StatsCards({ stats, hasSpike, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card animate-pulse">
            <div className="h-4 w-20 bg-muted rounded mb-3" />
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Select filters to view statistics
      </div>
    );
  }

  const cards = [
    {
      label: "Total Usage",
      value: stats.totalUsage.toLocaleString(),
      icon: BarChart3,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Average Daily",
      value: Math.round(stats.averageUsage).toLocaleString(),
      icon: Activity,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Baseline Avg",
      value: Math.round(stats.baselineAverage).toLocaleString(),
      icon: Target,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Spike Threshold",
      value: Math.round(stats.spikeThreshold).toLocaleString(),
      icon: hasSpike ? AlertTriangle : TrendingUp,
      color: hasSpike ? "text-warning" : "text-muted-foreground",
      bgColor: hasSpike ? "bg-warning/10" : "bg-muted",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {cards.map((card) => (
        <div key={card.label} className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              {card.label}
            </span>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-foreground">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
