export const startAProjectLink = "https://wa.me/message/XYR3GG2PO7KRC1";

export const constructionPhases = [
    {
        id: 1,
        phase: "Design & Approval",
        title: "Home Design & Approval",
        days: 20,
        percentage: 10,
        start: 0,
        color: "#AF6384",
    },
    {
        id: 2,
        phase: "Excavation",
        title: "Excavation",
        days: 15,
        percentage: 4,
        start: 20,
        color: "#36FFEB",
    },
    {
        id: 3,
        phase: "Footing & Foundation",
        title: "Footing & Foundation",
        days: 45,
        percentage: 27,
        start: 35,
        color: "#0ACE19",
    },
    {
        id: 4,
        phase: "RCC Work",
        title: "RCC Work - Columns & Slabs",
        days: 20,
        percentage: 18,
        start: 80,
        color: "#4DFF9F",
    },
    {
        id: 5,
        phase: "Brickwork",
        title: "Brickwork",
        days: 10,
        percentage: 3,
        start: 100,
        color: "#FF6384",
    },
    {
        id: 6,
        phase: "Roof Slab",
        title: "Roof Slab",
        days: 20,
        percentage: 15,
        start: 110,
        color: "#FF9F40",
    },
    {
        id: 7,
        phase: "Electric Wiring",
        title: "Electric Wiring",
        days: 14,
        percentage: 4,
        start: 130,
        color: "#FFCE56",
    },
    {
        id: 8,
        phase: "Water Supply",
        title: "Water Supply & Plumbing",
        days: 30,
        percentage: 2,
        start: 144,
        color: "#4BC0C0",
    },
    {
        id: 9,
        phase: "Interior Design",
        title: "Interior Design (approval & Plastering & Flooring)",
        days: 90,
        percentage: 19,
        start: 174,
        color: "#36A2EB",
    },
];

// Calculate total days and cost
export const totalDays = constructionPhases.reduce((sum, phase) => sum + phase.days, 0);

// Calculate percentages for pie chart
export const pieChartData = constructionPhases.map(phase => ({
    category: phase.id.toString(),
    value: phase.percentage,
    title: phase.phase,
    color: phase.color,
    fill: phase.color, // Adding fill for direct use in recharts
}));