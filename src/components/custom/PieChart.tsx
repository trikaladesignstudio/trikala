"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const cData = [
  {
    category: "A",
    value: 15.74,
    title: "Brickwork and Plastering",
    color: "#FF6384",
  },
  {
    category: "D",
    value: 9.26,
    title: "Water Supply & Plumbing",
    color: "#4BC0C0",
  },
  {
    category: "G",
    value: 9.26,
    title: "RCC Work - Columns & Slabs",
    color: "#4DFF9F",
  },
  {
    category: "H",
    value: 9.26,
    title: "Footing & Foundation",
    color: "#0ACE19",
  },
  {
    category: "J",
    value: 9.26,
    title: "Home Design & Approval",
    color: "#AF6384",
  },
  { category: "I", value: 9.26, title: "Excavation", color: "#36FFEB" },
  { category: "E", value: 9.26, title: "Door", color: "#9966FF" },
  { category: "F", value: 12.04, title: "Roof Slab", color: "#FF9F40" },
  { category: "B", value: 9.26, title: "Flooring & Tiling", color: "#36A2EB" },
  { category: "C", value: 7.41, title: "Electric Wiring", color: "#FFCE56" },
];

const chartData = cData.map((item) => {
  return {
    category: item.category,
    value: item.value,
    fill: item.color,
  };
});

const chartConfig = cData.reduce((obj, item) => {
  obj[item.category] = {
    label: `${item.title}`,
    color: item.color,
  };
  return obj;
}, {} as Record<string, Record<string, string>>) satisfies ChartConfig;

export function PieChartComponent({ totalValue }: { totalValue: string }) {
  React.useEffect(() => {
    console.log("Total Value:", chartConfig);
  }, []);

  return (
    <Card className="flex flex-col w-full border-none shadow-none">
      <CardHeader className="items-center pb-0">
        {/* <CardTitle>Simple Pie Chart</CardTitle>
        <CardDescription>Custom Colors</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1 pb-0 p-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="text-white bg-black" />}
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
                          {totalValue}
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
            {/* <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="flex w-full p-0  flex-wrap gap-1 [&>*]:basis-1/4 [&>*]:justify-left"
            /> */}
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
