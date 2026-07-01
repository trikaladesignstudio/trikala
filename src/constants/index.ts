export const constructionPhases = [
    {
        id: 1,
        phase: "Design & Approval",
        title: "Home Design & Approval",
        days: 20,
        percentage: 10,
        start: 0,
        color: "#774931",
    },
    {
        id: 2,
        phase: "Excavation",
        title: "Excavation",
        days: 15,
        percentage: 4,
        start: 20,
        color: "#1A1A1A",
    },
    {
        id: 3,
        phase: "Footing & Foundation",
        title: "Footing & Foundation",
        days: 45,
        percentage: 27,
        start: 35,
        color: "#52525B",
    },
    {
        id: 4,
        phase: "RCC Work",
        title: "RCC Work - Columns & Slabs",
        days: 20,
        percentage: 18,
        start: 80,
        color: "#A38B7A",
    },
    {
        id: 5,
        phase: "Brickwork",
        title: "Brickwork",
        days: 10,
        percentage: 3,
        start: 100,
        color: "#71717A",
    },
    {
        id: 6,
        phase: "Roof Slab",
        title: "Roof Slab",
        days: 20,
        percentage: 15,
        start: 110,
        color: "#D1C1A4",
    },
    {
        id: 7,
        phase: "Electric Wiring",
        title: "Electric Wiring",
        days: 14,
        percentage: 4,
        start: 130,
        color: "#3F3F46",
    },
    {
        id: 8,
        phase: "Water Supply",
        title: "Water Supply & Plumbing",
        days: 30,
        percentage: 2,
        start: 144,
        color: "#9CA3AF",
    },
    {
        id: 9,
        phase: "Interior Design",
        title: "Interior Design (approval & Plastering & Flooring)",
        days: 90,
        percentage: 19,
        start: 174,
        color: "#8B6F5C",
    },
];

export const REFERENCE_TIMELINE_DAYS =
    constructionPhases[constructionPhases.length - 1].start +
    constructionPhases[constructionPhases.length - 1].days;

// Calculate percentages for pie chart
export const pieChartData = constructionPhases.map(phase => ({
    category: phase.id.toString(),
    value: phase.percentage,
    title: phase.phase,
    color: phase.color,
    fill: phase.color, // Adding fill for direct use in recharts
}));