import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = {
    labels: [
      "Home Design & Approval",
      "Excavation",
      "Footing & Foundation",
      "RCC Work - Columns & Slabs",
      "Roof Slab",
      "Door",
      "Water Supply & Plumbing",
      "Electric Wiring",
      "Flooring & Tiling",
      "Brickwork and Plastering",
    ],
    datasets: [
      {
        data: [10, 15, 20, 25, 30, 10, 15, 20, 25, 30],
        backgroundColor: [
          "#FFD700", // Home Design
          "#228B22", // Excavation
          "#000000", // Footing
          "#FF0000", // RCC Work
          "#0000FF", // Roof Slab
          "#8B4513", // Door
          "#A9A9A9", // Water Supply
          "#FFA500", // Electric Wiring
          "#800080", // Flooring
          "#FFB6C1", // Brickwork
        ],
        borderWidth: 0,
      },
    ],
  };

  const total = data.datasets[0].data.reduce((a, b) => a + b, 0);

  const handleHover = (event: any, elements: any) => {
    if (elements.length > 0) {
      setHoveredIndex(elements[0].index);
    } else {
      setHoveredIndex(null);
    }
  };

  return (
    <div className="w-[30vw] h-full flex items-center justify-center">
      <div className="relative flex flex-col items-center w-full h-full">
        {/* Donut Chart */}
        <Doughnut
          data={data}
          options={{
            maintainAspectRatio: true, // Prevent size changes
            plugins: {
              tooltip: {
                enabled: false,
              },
            },
            cutout: "50%",
            onHover: handleHover,
          }}
        />

        {/* Tooltip (custom) */}
        {hoveredIndex !== null && (
          <div
            className="absolute bg-white text-gray-800 shadow-md rounded-md px-3 py-2 font-bold text-sm z-10"
            style={{
              top: "50%", // Centering relative to the donut chart
              left: "50%",
              transform: "translate(-50%, -120%)", // Position tooltip above the chart
              pointerEvents: "none", // Prevent tooltip from affecting hover
            }}
          >
            {/* <strong>{data.labels[hoveredIndex]}</strong> */}
            {/* <br /> */}
            {(
              ((data.datasets[0].data[hoveredIndex] as number) / total) *
              100
            ).toFixed(1)}
            %
          </div>
        )}

        {/* Titles around the chart */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
          {data.labels.map((label, index) => {
            const angle = (360 / data.labels.length) * index; // Evenly distribute labels around the circle
            const radius = 120; // Adjust for position
            const x = radius * Math.cos((angle * Math.PI) / 180);
            const y = radius * Math.sin((angle * Math.PI) / 180);

            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  transform: `translate(${x}px, ${y}px)`,
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
                className="text-xs text-gray-800"
              >
                {/* {label} */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
