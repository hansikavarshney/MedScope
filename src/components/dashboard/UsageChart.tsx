import {
  LineChart,
  Line,
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

interface UsageRecord {
  id: string;
  district: string;
  sub_district: string;
  medicine_name: string;
  date: string;
  quantity_used: number;
  isSpike: boolean;
  percentAboveBaseline: number;
}

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
  if (isLoading) {
    return (
      <div className="chart-container animate-pulse">
        <div className="h-6 w-48 bg-muted rounded mb-4" />
        <div className="h-80 bg-muted rounded" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="flex items-center justify-center h-80 text-muted-foreground">
          <p>Select filters to view usage chart</p>
        </div>
      </div>
    );
  }

  // Format data for the chart
  const chartData = data.map((record) => ({
    date: format(parseISO(record.date), "MMM d"),
    fullDate: record.date,
    usage: record.quantity_used,
    isSpike: record.isSpike,
    spikeUsage: record.isSpike ? record.quantity_used : null,
    normalUsage: !record.isSpike ? record.quantity_used : null,
    percentAbove: record.percentAboveBaseline,
  }));

  const hasSpikes = data.some((d) => d.isSpike);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const record = payload[0].payload;
      const isSpike = record.isSpike;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-lg font-bold text-primary">
            {record.usage.toLocaleString()} units
          </p>
          {isSpike && (
            <p className="text-sm text-warning font-medium mt-1">
              ⚠️ Spike: {record.percentAbove.toFixed(1)}% above baseline
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground">
            Usage Trend
          </h3>
          <p className="text-sm text-muted-foreground">
            Daily medicine consumption over time
          </p>
        </div>
        {hasSpikes && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-primary" />
              <span className="text-muted-foreground">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-spike" />
              <span className="text-muted-foreground">Spike</span>
            </div>
          </div>
        )}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-primary))" stopOpacity={0} />
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
              strokeDasharray="5 5"
              label={{
                value: "Baseline",
                position: "insideTopRight",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 11,
              }}
            />
            
            {/* Threshold reference line */}
            <ReferenceLine
              y={spikeThreshold}
              stroke="hsl(var(--warning))"
              strokeDasharray="3 3"
              strokeOpacity={0.7}
              label={{
                value: "Spike Threshold (+30%)",
                position: "insideTopRight",
                fill: "hsl(var(--warning))",
                fontSize: 11,
              }}
            />

            {/* Area under the line */}
            <Area
              type="monotone"
              dataKey="usage"
              stroke="none"
              fill="url(#usageGradient)"
            />

            {/* Main usage line */}
            <Line
              type="monotone"
              dataKey="usage"
              stroke="hsl(var(--chart-primary))"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: "hsl(var(--chart-primary))" }}
            />

            {/* Spike points highlighted */}
            <Scatter
              dataKey="spikeUsage"
              fill="hsl(var(--chart-spike))"
              shape={(props: any) => {
                if (props.payload.spikeUsage === null) return null;
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={6}
                    fill="hsl(var(--chart-spike))"
                    stroke="white"
                    strokeWidth={2}
                  />
                );
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
