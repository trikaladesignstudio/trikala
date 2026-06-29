"use client";

import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { constructionPhases, REFERENCE_TIMELINE_DAYS } from "@/constants";

const chartConfig = {
  timeline: {
    label: "Timeline (Days)",
    color: "#774931",
  },
};

type PhaseRow = {
  id: number;
  phase: string;
  cost: number;
  scaledStart: number;
  scaledDuration: number;
  scaledEnd: number;
  dayLabel: string;
  customBar: [number, number];
  color: string;
  percentage: number;
};

function TimelineDayLabel(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  payload?: PhaseRow;
}) {
  const { x = 0, y = 0, width = 0, height = 0, payload } = props;
  if (!payload) return null;

  const days = payload.dayLabel;
  const barCenterY = y + height / 2;
  const pillWidth = Math.max(36, days.length * 7 + 14);
  const pillHeight = 20;
  const pillY = barCenterY - pillHeight / 2;
  const insideBar = width >= pillWidth + 12;

  if (insideBar) {
    return (
      <g>
        <rect
          x={x + width / 2 - pillWidth / 2}
          y={pillY}
          width={pillWidth}
          height={pillHeight}
          rx={pillHeight / 2}
          fill="rgba(255,255,255,0.22)"
        />
        <text
          x={x + width / 2}
          y={barCenterY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#FFFFFF"
          fontSize={10}
          fontWeight={600}
          fontFamily="ui-monospace, monospace"
        >
          {days}
        </text>
      </g>
    );
  }

  const pillX = x + width + 8;

  return (
    <g>
      <rect
        x={pillX}
        y={pillY}
        width={pillWidth}
        height={pillHeight}
        rx={pillHeight / 2}
        fill="#FAFAFA"
        stroke="#E4E4E7"
        strokeWidth={1}
      />
      <text
        x={pillX + pillWidth / 2}
        y={barCenterY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#774931"
        fontSize={10}
        fontWeight={600}
        fontFamily="ui-monospace, monospace"
      >
        {days}
      </text>
    </g>
  );
}

function PhaseAxisTick({
  x = 0,
  y = 0,
  payload,
  rows,
}: {
  x?: number;
  y?: number;
  payload?: { value: string; index: number };
  rows: PhaseRow[];
}) {
  const row = rows[payload?.index ?? -1];
  if (!row) return null;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-8}
        y={0}
        textAnchor="end"
        dominantBaseline="middle"
        fill="#3F3F46"
        fontSize={11}
        fontWeight={500}
      >
        {row.phase}
      </text>
    </g>
  );
}

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

  const formatDays = (value: number) =>
    Math.max(1, Math.round(value)).toLocaleString("en-IN");

  const scale =
    days > 0 && REFERENCE_TIMELINE_DAYS > 0
      ? days / REFERENCE_TIMELINE_DAYS
      : 1;

  const transformedData: PhaseRow[] = constructionPhases.map((item) => {
    const scaledStart = item.start * scale;
    const scaledDuration = item.days * scale;
    const roundedDays = Math.max(1, Math.round(scaledDuration));
    const cost = (item.percentage / 100) * totalValue;

    return {
      id: item.id,
      phase: item.phase,
      cost,
      scaledStart,
      scaledDuration,
      scaledEnd: scaledStart + scaledDuration,
      dayLabel: `${formatDays(roundedDays)}d`,
      customBar: [scaledStart, scaledStart + scaledDuration],
      color: item.color,
      percentage: item.percentage,
    };
  });

  const timelineMax = Math.max(days, 1);
  const chartHeight = Math.max(320, transformedData.length * 44 + 48);

  return (
    <Card className="flex h-full w-full flex-col border-none shadow-none">
      <CardHeader className="space-y-1 px-6 pb-2 pt-6">
        <CardTitle className="text-left text-base font-medium tracking-tight text-zinc-900 sm:text-lg">
          Construction Timeline
        </CardTitle>
        <p className="text-left text-xs text-zinc-500 sm:text-sm">
          <span className="font-mono tabular-nums">{formatDays(days)}</span>{" "}
          days total ·{" "}
          <span className="font-mono tabular-nums">
            {formatCurrency(totalValue)}
          </span>
        </p>
      </CardHeader>
      <CardContent className="flex-1 px-2 pb-6 pt-2 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto w-full min-h-[280px]"
          style={{ height: chartHeight }}
        >
          <BarChart
            data={transformedData}
            layout="vertical"
            margin={{ top: 8, right: 56, bottom: 28, left: 8 }}
            barSize={18}
          >
            <XAxis
              type="number"
              domain={[0, timelineMax]}
              tickCount={5}
              tick={{ fontSize: 11, fill: "#71717A" }}
              tickFormatter={(value) => formatDays(Number(value))}
              axisLine={{ stroke: "#E4E4E7" }}
              tickLine={{ stroke: "#E4E4E7" }}
              label={{
                value: "Days from start",
                position: "bottom",
                offset: 8,
                style: { fontSize: 11, fill: "#71717A", fontWeight: 500 },
              }}
            />
            <YAxis
              type="category"
              dataKey="phase"
              width={108}
              axisLine={false}
              tickLine={false}
              tick={(tickProps) => (
                <PhaseAxisTick {...tickProps} rows={transformedData} />
              )}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(26,26,26,0.04)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload as PhaseRow;
                return (
                  <div className="rounded-xl border border-zinc-200/80 bg-white px-3 py-2.5 shadow-[0_12px_24px_-12px_rgba(0,0,0,0.15)]">
                    <div className="text-sm font-medium text-zinc-900">
                      {data.phase}
                    </div>
                    <div className="mt-1.5 space-y-1 text-xs text-zinc-600">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-custom-lb/10 px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-custom-lb">
                          {data.dayLabel.replace("d", " days")}
                        </span>
                      </div>
                      <div>
                        Cost:{" "}
                        <span className="font-mono tabular-nums">
                          {formatCurrency(data.cost)}
                        </span>{" "}
                        ({data.percentage}%)
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="customBar" radius={[6, 6, 6, 6]}>
              {transformedData.map((entry) => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
              <LabelList
                content={(labelProps) => {
                  const index = labelProps.index ?? 0;
                  return (
                    <TimelineDayLabel
                      x={Number(labelProps.x ?? 0)}
                      y={Number(labelProps.y ?? 0)}
                      width={Number(labelProps.width ?? 0)}
                      height={Number(labelProps.height ?? 0)}
                      index={index}
                      payload={transformedData[index]}
                    />
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
