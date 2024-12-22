"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

const data = [
  {
    id: 1,
    phase: "Home Design & Approval",
    days: 46,
    cost: 215000,
    start: 0,
    label: "46 Days | ₹ 2,15,000",
  },
  {
    id: 2,
    phase: "Excavation",
    days: 14,
    cost: 105750,
    start: 46,
    label: "14 Days | ₹ 1,05,750",
  },
  {
    id: 3,
    phase: "Footing & Foundation",
    days: 41,
    cost: 786000,
    start: 60,
    label: "41 Days | ₹ 7,86,000",
  },
  {
    id: 4,
    phase: "RCC Work - Columns & Slabs",
    days: 17,
    cost: 525000,
    start: 101,
    label: "17 Days | ₹ 5,25,000",
  },
  {
    id: 5,
    phase: "Roof Slab",
    days: 37,
    cost: 438000,
    start: 118,
    label: "37 Days | ₹ 4,38,000",
  },
  {
    id: 6,
    phase: "Brickwork and Plastering",
    days: 8,
    cost: 85500,
    start: 155,
    label: "08 Days | ₹ 85,500",
  },
  {
    id: 7,
    phase: "Flooring & Tiling",
    days: 25,
    cost: 380000,
    start: 163,
    label: "25 Days | ₹ 3,80,000",
  },
  {
    id: 8,
    phase: "Electric Wiring",
    days: 14,
    cost: 105750,
    start: 188,
    label: "14 Days | ₹ 1,05,750",
  },
  {
    id: 9,
    phase: "Water Supply & Plumbing",
    days: 30,
    cost: 65500,
    start: 202,
    label: "30 Days | ₹ 65,500",
  },
  {
    id: 10,
    phase: "Door",
    days: 15,
    cost: 220000,
    start: 232,
    label: "15 Days | ₹ 2,20,000",
  },
];

const chartConfig = {
  days: {
    label: "Duration (Days)",
    color: "black",
  },
  phase: {
    label: "Construction Phase",
  },
  cost: {
    label: "Cost (INR)",
  },
};

export function BarGraph() {
  // Transform data to create bars with custom start points
  const transformedData = data.map((item) => ({
    ...item,
    customBar: [item.start, item.start + item.days],
  }));

  return (
    <Card className="w-full flex flex-col border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-center">
          Construction Timeline & Cost Breakdown
        </CardTitle>
        <div className="text-center text-sm text-muted-foreground">
          Total Project Duration: 247 Days | Total Cost: ₹ 29,26,500
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={transformedData}
            layout="vertical"
            margin={{ top: 10, right: 150, bottom: 10, left: 180 }}
          >
            <XAxis
              type="number"
              domain={[0, 250]}
              tickCount={10}
              tick={{ fontSize: 12 }}
              label={{ value: "Days", position: "bottom", offset: 0 }}
            />
            <YAxis
              type="category"
              dataKey="phase"
              tick={{ fontSize: 12 }}
              width={170}
            />
            <Bar
              dataKey="customBar"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 4, 4]}
              label={(props) => {
                const { x, y, width, value, label } = props;
                const item = transformedData[props.index];
                return (
                  <text
                    x={x + width + 10}
                    y={y + 12}
                    fill="currentColor"
                    fontSize={12}
                    textAnchor="start"
                  >
                    {item.label}
                  </text>
                );
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
