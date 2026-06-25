"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { constructionPhases } from "@/constants";

// old total 
// ₹ 29,26,500

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

export function BarGraph({
  totalValue,
  days,
}: {
  totalValue: number;
  days: number;
}) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const transformedData = constructionPhases.map((item) => {
    const cost = (item.percentage / 100) * totalValue;
    return {
      ...item,
      cost,
      customBar: [item.start, item.start + item.days],
      label: `${item.days} Days | ${formatCurrency(cost)}`,
    };
  });

  return (
    <Card className="w-full flex flex-col border-none shadow-none">
      <CardHeader className="sm:p-6">
        <CardTitle className="text-center text-base sm:text-lg md:text-xl font-semibold">
          Construction Timeline & Cost Breakdown
        </CardTitle>
        <div className="text-center text-xs sm:text-sm text-muted-foreground">
          Project Duration: {days} Days | Total Cost: {formatCurrency(totalValue)}
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="w-screen sm:w-[calc(100vw-4rem)] lg:w-full h-[80vh] sm:h-[70vh] max-h-[600px]"
        >
          <BarChart
            data={transformedData}
            layout="vertical"
            margin={{ top: 10, right: 100, bottom: 10, left: 0 }}
            barSize={20}
          >
            <XAxis
              type="number"
              domain={[0, days]}
              tickCount={4}
              tick={{ fontSize: "0.65rem" }}
              label={{
                value: "Timeline (Days)",
                position: "bottom",
                offset: 0,
                style: { fontSize: "0.65rem" }
              }}
            />
            <YAxis
              type="category"
              dataKey="phase"
              tick={{ fontSize: "0.65rem" }}
              width={75}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-black/80 text-white p-2 rounded-lg shadow-lg border border-white/10">
                      <div className="font-semibold text-xs sm:text-sm">{data.phase}</div>
                      <div className="text-xs">Duration: {data.days} Days</div>
                      <div className="text-xs">Cost: {formatCurrency(data.cost)} ({data.percentage}%)</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="customBar"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 4, 4]}
              label={(props) => {
                const { x, y, width } = props;
                const item = transformedData[props.index];
                return (
                  <text
                    x={x + width + 5}
                    y={y + 10}
                    fill="currentColor"
                    fontSize="0.65rem"
                    textAnchor="start"
                  >
                    {item.days} Days | {formatCurrency(item.cost)}
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
