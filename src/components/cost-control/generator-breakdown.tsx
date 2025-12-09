"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCost, formatTokens } from "@/lib/pricing";
import type { MonthSummary } from "@/lib/types/cost-control";

interface GeneratorBreakdownProps {
  summary: MonthSummary;
  translations: {
    title: string;
    description: string;
    photo: string;
    banner: string;
    logo: string;
    tokens: string;
    cost: string;
    count: string;
    noData: string;
  };
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"]; // blue, green, amber

export function GeneratorBreakdown({ summary, translations: t }: GeneratorBreakdownProps) {
  const data = [
    {
      name: t.photo,
      value: summary.byType.photo.costMicros,
      tokens: summary.byType.photo.tokens,
      count: summary.byType.photo.count,
    },
    {
      name: t.banner,
      value: summary.byType.banner.costMicros,
      tokens: summary.byType.banner.tokens,
      count: summary.byType.banner.count,
    },
    {
      name: t.logo,
      value: summary.byType.logo.costMicros,
      tokens: summary.byType.logo.tokens,
      count: summary.byType.logo.count,
    },
  ].filter((item) => item.value > 0);

  const hasData = data.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pie Chart */}
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCost(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Table */}
            <div className="space-y-4">
              {[
                { label: t.photo, data: summary.byType.photo, color: COLORS[0] },
                { label: t.banner, data: summary.byType.banner, color: COLORS[1] },
                { label: t.logo, data: summary.byType.logo, color: COLORS[2] },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCost(item.data.costMicros)}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatTokens(item.data.tokens)} {t.tokens} | {item.data.count} {t.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            {t.noData}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
