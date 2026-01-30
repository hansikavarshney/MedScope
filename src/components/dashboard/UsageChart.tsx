import { useMemo } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
  Scatter,
} from "recharts";
import { format, parseISO } from "date-fns";
import { TrendingUp, Info } from "lucide-react";
import type { UsageRecord } from "@/types/medicine";

interface UsageChartProps {
  data: UsageRecord[];
  baselineAvg: number;
  spikeThreshold: number;
  isLoading?: boolean;
}

/**
 * Line chart component showing medicine usage over time with spike highlighting
 */
export function UsageChart({ data, baselineAvg, spikeThreshold, isLoading }: UsageChartProps) {
  // Memoize chart data transformation
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map((record) => ({
      date: format(parseISO(record.date), "MMM d"),
      fullDate: record.date,
      usage: record.quantity_used,
      isSpike: record.isSpike,
      spikeUsage: record.isSpike ? record.quantity_used : null,
      percentAbove: record.percentAboveBaseline,
    }));
  }, [data]);

  const hasSpikes = useMemo(() => data?.some((d) => d.isSpike) ?? false, [data]);

  if (isLoading) {
    return (
      <div className="chart-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 w-32 bg-muted rounded mb-2 animate-pulse" />
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="h-80 bg-gradient-to-b from-muted/50 to-muted/20 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="flex flex-col items-center justify-center h-80 text-muted-foreground">
          <TrendingUp className="w-16 h-16 mb-4 text-muted-foreground/30" />
          <p className="font-medium text-lg">No usage data available</p>
          <p className="text-sm">Select filters to view the usage chart</p>
        </div>
      </div>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const record = payload[0].payload;
      const isSpike = record.isSpike;
      return (
        <div className="bg-card border border-border rounded-xl p-4 shadow-elevated">
          <p className="font-semibold text-foreground mb-1">{record.date}</p>
          <p className="text-2xl font-bold text-primary font-display">
            {record.usage.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground ml-1">units</span>
          </p>
          {isSpike && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
              <span className="flex h-2 w-2 rounded-full bg-warning animate-pulse" />
              <p className="text-sm text-warning font-medium">
                +{record.percentAbove.toFixed(1)}% above baseline
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container animate-slide-up">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Usage Trend
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Daily medicine consumption over time
          </p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-primary shadow-sm" />
            <span className="text-muted-foreground">Normal</span>
          </div>
          {hasSpikes && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-spike shadow-sm ring-2 ring-chart-spike/30" />
              <span className="text-muted-foreground">Spike</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--chart-grid))"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              dx={-10}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Baseline reference line */}
            <ReferenceLine
              y={baselineAvg}
              stroke="hsl(var(--chart-baseline))"
              strokeDasharray="6 4"
              strokeWidth={2}
              label={{
                value: "Baseline",
                position: "insideTopRight",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 11,
                fontWeight: 500,
              }}
            />
            
            {/* Threshold reference line */}
            <ReferenceLine
              y={spikeThreshold}
              stroke="hsl(var(--warning))"
              strokeDasharray="4 4"
              strokeOpacity={0.8}
              strokeWidth={2}
              label={{
                value: "Spike Threshold (+30%)",
                position: "insideTopRight",
                fill: "hsl(var(--warning))",
                fontSize: 11,
                fontWeight: 500,
              }}
            />

            {/* Area under the line */}
            <Area
              type="monotone"
              dataKey="usage"
              stroke="hsl(var(--chart-primary))"
              strokeWidth={3}
              fill="url(#usageGradient)"
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: "hsl(var(--chart-primary))",
                stroke: "white",
                strokeWidth: 2 
              }}
            />

            {/* Spike points highlighted */}
            <Scatter
              dataKey="spikeUsage"
              fill="hsl(var(--chart-spike))"
              shape={(props: any) => {
                if (props.payload.spikeUsage === null) return null;
                return (
                  <g>
                    {/* Outer glow ring */}
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={12}
                      fill="hsl(var(--chart-spike))"
                      opacity={0.2}
                    />
                    {/* Main dot */}
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={7}
                      fill="hsl(var(--chart-spike))"
                      stroke="white"
                      strokeWidth={2}
                    />
                  </g>
                );
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Info Footer */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
        <Info className="w-3.5 h-3.5" />
        <span>Spike detection triggers when usage exceeds baseline by ≥30%</span>
      </div>
    </div>
  );
}
