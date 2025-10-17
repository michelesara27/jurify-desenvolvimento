// src/components/generations/GenerationsChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Mock data for charts
const dailyGenerations = [
  { day: "Seg", generations: 12, tokens: 15400 },
  { day: "Ter", generations: 8, tokens: 9800 },
  { day: "Qua", generations: 15, tokens: 18200 },
  { day: "Qui", generations: 6, tokens: 7300 },
  { day: "Sex", generations: 11, tokens: 13100 },
  { day: "Sáb", generations: 3, tokens: 3200 },
  { day: "Dom", generations: 2, tokens: 2100 },
];

const statusData = [
  { name: "Concluídas", value: 42, color: "hsl(var(--chart-green))" },
  { name: "Falharam", value: 3, color: "hsl(var(--chart-red))" },
  { name: "Processando", value: 2, color: "hsl(var(--chart-yellow))" },
];

const modelData = [
  { name: "GPT-4", value: 35, color: "hsl(var(--chart-blue))" },
  { name: "GPT-3.5", value: 8, color: "hsl(var(--chart-purple))" },
  { name: "Claude", value: 4, color: "hsl(var(--chart-orange))" },
];

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-3">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export const GenerationsChart = () => {
  return (
    <div className="space-y-6">
      {/* Daily Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Atividade Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyGenerations}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  className="fill-muted-foreground text-xs"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  className="fill-muted-foreground text-xs"
                />
                <Bar
                  dataKey="generations"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Status das Gerações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Model Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Modelos Utilizados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {modelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
