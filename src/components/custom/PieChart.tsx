"use client";

import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { pieChartData } from "@/constants";
import { useEffect, useMemo, useState } from "react";

export type PieChartSlice = {
  category: string;
  value: number;
  title: string;
  color: string;
  fill?: string;
};

const RADIAN = Math.PI / 180;

const wrapText = (text: string, maxLength: number = 12): string[] => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0] ?? "";

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const newLine = `${currentLine} ${word}`;

    if (newLine.length <= maxLength) {
      currentLine = newLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  title,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  title: string;
  percent?: number;
}) => {
  if ((percent ?? 0) < 0.06) return null;

  const radius2 = innerRadius + (outerRadius - innerRadius) * 1.35;
  const x2 = cx + radius2 * Math.cos(-midAngle * RADIAN);
  const y2 = cy + radius2 * Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
  const textAnchor = cos >= 0 ? "start" : "end";
  const lines = wrapText(title, 14);
  const lineHeight = 12;

  return (
    <g>
      {lines.map((line, index) => (
        <text
          key={index}
          x={x2 + (cos >= 0 ? 4 : -4)}
          y={y2 + (index - (lines.length - 1) / 2) * lineHeight}
          textAnchor={textAnchor}
          className="fill-zinc-600 text-[11px] font-medium"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

export function PieChartComponent({
  totalValue,
  data,
  compact = false,
}: {
  totalValue: string;
  data?: PieChartSlice[];
  compact?: boolean;
}) {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(
    null
  );
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const chartData = useMemo(
    () =>
      (data ?? pieChartData)
        .map((item) => ({
          ...item,
          fill: item.fill ?? item.color,
        }))
        .sort((a, b) => b.value - a.value),
    [data]
  );

  const chartConfig = useMemo(
    () =>
      chartData.reduce((obj, item) => {
        obj[item.category] = {
          label: item.title,
          color: item.color,
        };
        return obj;
      }, {} as ChartConfig),
    [chartData]
  );

  useEffect(() => {
    if (!containerRef) return;

    const updateDimensions = () => {
      const { width, height } = containerRef.getBoundingClientRect();
      setDimensions({
        width,
        height: Math.max(height, compact ? 220 : 280),
      });
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef);

    return () => resizeObserver.disconnect();
  }, [containerRef, compact]);

  const chartSize = Math.min(dimensions.width, dimensions.height) || 240;
  const innerRadius = chartSize * (compact ? 0.28 : 0.22);
  const outerRadius = chartSize * (compact ? 0.42 : 0.38);

  return (
    <Card className="flex h-full w-full flex-col border-none shadow-none">
      <CardContent className="flex-1 p-0" ref={setContainerRef}>
        {dimensions.width > 0 && (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <PieChart
              width={dimensions.width}
              height={dimensions.height}
              margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const slice = payload[0].payload as PieChartSlice;
                  return (
                    <div className="rounded-lg border border-zinc-200/80 bg-white px-3 py-2 shadow-[0_12px_24px_-12px_rgba(0,0,0,0.15)]">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: slice.color }}
                        />
                        <div className="text-sm font-medium text-zinc-900">
                          {slice.title}
                        </div>
                      </div>
                      <div className="mt-1 font-mono text-xs tabular-nums text-zinc-600">
                        {slice.value}%
                      </div>
                    </div>
                  );
                }}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="category"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={2}
                strokeWidth={2}
                stroke="#FFFFFF"
                label={renderCustomizedLabel}
                labelLine={false}
              >
                <Label
                  content={({ viewBox }) => {
                    if (
                      !viewBox ||
                      !("cx" in viewBox) ||
                      !("cy" in viewBox)
                    ) {
                      return null;
                    }
                    const { cx, cy } = viewBox;
                    if (cx == null || cy == null) return null;
                    return (
                      <g>
                        <text
                          x={cx}
                          y={cy - (compact ? 6 : 8)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-zinc-500 text-[10px] uppercase tracking-[0.12em]"
                        >
                          Total
                        </text>
                        <text
                          x={cx}
                          y={cy + (compact ? 10 : 12)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-zinc-900 text-xl font-semibold tracking-tight sm:text-2xl"
                        >
                          {totalValue}
                        </text>
                      </g>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
