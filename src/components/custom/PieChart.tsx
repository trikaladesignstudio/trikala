"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { useState, useEffect } from "react";
import { pieChartData } from "@/constants";

const chartData = pieChartData.sort((a, b) => b.value - a.value); // Sort by value to optimize label placement

const chartConfig = pieChartData.reduce((obj, item) => {
  obj[item.category] = {
    label: item.title,
    color: item.color,
  };
  return obj;
}, {} as Record<string, Record<string, string>>) satisfies ChartConfig;

const RADIAN = Math.PI / 180;
const wrapText = (text: string, maxLength: number = 10): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

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
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  title: string;
}) => {
  const radius2 = innerRadius + (outerRadius - innerRadius) * 1.3;
  const x2 = cx + radius2 * Math.cos(-midAngle * RADIAN);
  const y2 = cy + radius2 * Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
  const textAnchor = cos >= 0 ? 'start' : 'end';
  const lines = wrapText(title);
  const lineHeight = 11;

  return (
    <g>
      {lines.map((line, index) => (
        <text
          key={index}
          x={x2 + (cos >= 0 ? 2 : -2)}
          y={y2 + (index - (lines.length - 1) / 2) * lineHeight}
          textAnchor={textAnchor}
          className="fill-muted-foreground text-[12px] font-medium"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

export function PieChartComponent({ totalValue }: { totalValue: string }) {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef) return;

    const updateDimensions = () => {
      const { width, height } = containerRef.getBoundingClientRect();
      setDimensions({
        width: width,
        height: Math.min(width, height),
      });
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef);

    return () => resizeObserver.disconnect();
  }, [containerRef]);

  return (
    <Card className="flex flex-col w-full h-full border-none shadow-none">
      <CardContent className="flex-1 p-0" ref={setContainerRef}>
        <ChartContainer config={chartConfig} className="w-full h-full">
          <PieChart width={dimensions.width} height={dimensions.height} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-black/80 text-white p-1 rounded-lg shadow-lg border border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></div>
                        <div className="font-medium">{data.title}</div>
                      </div>
                      <div className="text-sm opacity-90">{data.value}%</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              innerRadius={Math.min(dimensions.width, dimensions.height) * 0.15}
              outerRadius={Math.min(dimensions.width, dimensions.height) * 0.3}
              paddingAngle={2}
              strokeWidth={1}
              stroke="white"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                  const { cx, cy } = viewBox;
                  return (
                    <g>
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-foreground text-4xl font-bold"
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
      </CardContent>
    </Card>
  );
}
