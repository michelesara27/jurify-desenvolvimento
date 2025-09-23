// src/components/examples/GenerationStatsChart.tsx
import { GenerationStatsChart } from "../GenerationStatsChart";

export default function GenerationStatsChartExample() {
  // todo: remove mock functionality
  const mockData = [
    { name: "Petições", value: 35, color: "hsl(var(--chart-1))" },
    { name: "Contratos", value: 25, color: "hsl(var(--chart-2))" },
    { name: "Recursos", value: 20, color: "hsl(var(--chart-3))" },
    { name: "Consultorias", value: 20, color: "hsl(var(--chart-4))" },
  ];

  return (
    <div className="p-4 max-w-md">
      <GenerationStatsChart data={mockData} />
    </div>
  );
}
