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
import { TrendingUp, Activity } from "lucide-react";
import type { UsageRecord } from "@/types/medicine";

interface UsageChartProps {
  data: UsageRecord[];
  baselineAvg: number;
  spikeThreshold: number;
  isLoading?: boolean;
}

/**
 * Command Center Usage Trend Visualization
 */
export function UsageChart({ data, baselineAvg, spikeThreshold, isLoading }: UsageChartProps) {
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
      <div className="chart-container h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-5 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-80 bg-muted/30 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-container h-full flex flex-col items-center justify-center py-16">
        <div className="p-4 rounded-xl bg-muted/30 border border-border mb-4">
          <Activity className="w-10 h-10 text-muted-foreground/40" />
        </div>
        <p className="font-medium text-muted-foreground">No Data Available</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Configure filters to visualize trends
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const record = payload[0].payload;
      const isSpike = record.isSpike;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-xl">
          <p className="text-xs text-muted-foreground mb-1">{record.date}</p>
          <p className="text-xl font-semibold font-mono text-primary">
            {record.usage.toLocaleString()}
            <span className="text-xs font-normal text-muted-foreground ml-1">units</span>
          </p>
          {isSpike && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
              <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
              <span className="text-xs text-warning font-medium">
                +{record.percentAbove.toFixed(1)}% above baseline
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container h-full">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Usage Trend</h3>
            <p className="text-xs text-muted-foreground">Daily consumption analysis</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4">
          <LegendItem color="bg-chart-primary" label="Normal" />
          {hasSpikes && <LegendItem color="bg-chart-spike" label="Spike" glow />}
          <LegendItem color="bg-chart-baseline" label="Baseline" dashed />
        </div>
      </div>

      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--chart-primary))" stopOpacity={0} />
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
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              dy={8}
            />
            
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              width={50}
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }} />

            {/* Baseline Reference */}
            <ReferenceLine
              y={baselineAvg}
              stroke="hsl(var(--chart-baseline))"
              strokeDasharray="6 4"
              strokeWidth={2}
            />

            {/* Threshold Reference */}
            <ReferenceLine
              y={spikeThreshold}
              stroke="hsl(var(--warning))"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              strokeOpacity={0.7}
            />

            {/* Main Area */}
            <Area
              type="monotone"
              dataKey="usage"
              stroke="hsl(var(--chart-primary))"
              strokeWidth={2.5}
              fill="url(#usageGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "hsl(var(--chart-primary))",
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
              }}
            />

            {/* Spike Points */}
            <Scatter
              dataKey="spikeUsage"
              fill="hsl(var(--chart-spike))"
              shape={(props: any) => {
                if (props.payload.spikeUsage === null) return null;
                return (
                  <g>
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={10}
                      fill="hsl(var(--chart-spike))"
                      opacity={0.2}
                    />
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={6}
                      fill="hsl(var(--chart-spike))"
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                  </g>
                );
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Spike threshold: ≥30% above baseline</span>
        <span className="font-mono">{data.length} data points</span>
      </div>
    </div>
  );
}

function LegendItem({ color, label, dashed, glow }: { color: string; label: string; dashed?: boolean; glow?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color} ${glow ? 'glow-warning' : ''} ${dashed ? 'border-2 border-dashed border-chart-baseline bg-transparent' : ''}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
