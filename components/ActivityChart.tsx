"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type { DailySummary } from "@/lib/db";

type ActivityChartProps = {
  data: DailySummary[];
};

export function ActivityChart({ data }: ActivityChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
          <defs>
            <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2f81f7" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#2f81f7" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="reportedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f0883e" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#f0883e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2f3943" />
          <XAxis dataKey="date" stroke="#9fb0c3" tickLine={false} axisLine={false} />
          <YAxis stroke="#9fb0c3" tickLine={false} axisLine={false} width={45} />
          <Tooltip
            contentStyle={{
              background: "#111827",
              border: "1px solid #2f3943",
              borderRadius: 8,
              color: "#e6edf3"
            }}
          />
          <Area
            type="monotone"
            dataKey="actualHours"
            stroke="#2f81f7"
            fill="url(#actualFill)"
            strokeWidth={2}
            name="Actual"
          />
          <Area
            type="monotone"
            dataKey="reportedHours"
            stroke="#f0883e"
            fill="url(#reportedFill)"
            strokeWidth={2}
            name="Reported"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
