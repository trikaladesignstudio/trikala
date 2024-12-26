"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { category: "A", value: 30, fill: "#FF6384" },
  { category: "B", value: 25, fill: "#36A2EB" },
  { category: "C", value: 20, fill: "#FFCE56" },
  { category: "D", value: 15, fill: "#4BC0C0" },
  { category: "E", value: 10, fill: "#9966FF" },
];

const chartConfig = {
  value: {
    label: "Value",
  },
  A: {
    label: "Category A",
    color: "#FF6384",
  },
  B: {
    label: "Category B",
    color: "#36A2EB",
  },
  C: {
    label: "Category C",
    color: "#FFCE56",
  },
  D: {
    label: "Category D",
    color: "#4BC0C0",
  },
  E: {
    label: "Category E",
    color: "#9966FF",
  },
} satisfies ChartConfig;

export function PieChartComponent() {
  const totalValue = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  return (
    <Card className="flex flex-col lg:w-1/3 w-full border-none shadow-none">
      <CardHeader className="items-center pb-0">
        {/* <CardTitle>Simple Pie Chart</CardTitle>
        <CardDescription>Custom Colors</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  className="text-white bg-black"
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalValue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing simplified data with custom colors
        </div>
      </CardFooter> */}
    </Card>
  );
}
