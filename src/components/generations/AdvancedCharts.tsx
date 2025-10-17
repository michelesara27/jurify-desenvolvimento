// src/components/generations/AdvancedCharts.tsx
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
  Tooltip,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

// Dados de exemplo para os gráficos
const monthlyData = [
  { month: "Jan", tokens: 45000, generations: 32 },
  { month: "Fev", tokens: 52000, generations: 38 },
  { month: "Mar", tokens: 48000, generations: 35 },
  { month: "Abr", tokens: 61000, generations: 42 },
  { month: "Mai", tokens: 55000, generations: 39 },
  { month: "Jun", tokens: 67000, generations: 47 },
  { month: "Jul", tokens: 72000, generations: 51 },
  { month: "Ago", tokens: 80000, generations: 58 },
  { month: "Set", tokens: 94000, generations: 65 },
  { month: "Out", tokens: 125400, generations: 78 },
  { month: "Nov", tokens: 0, generations: 0 },
  { month: "Dez", tokens: 0, generations: 0 },
];

const modelUsageData = [
  { name: "GPT-4", value: 65, color: "hsl(215, 100%, 60%)" },
  { name: "GPT-3.5", value: 25, color: "hsl(262, 80%, 60%)" },
  { name: "Claude", value: 10, color: "hsl(30, 100%, 60%)" },
];

const documentTypeData = [
  { name: "Petição Inicial", tokens: 42500, color: "hsl(215, 100%, 60%)" },
  { name: "Contestação", tokens: 38200, color: "hsl(262, 80%, 60%)" },
  { name: "Recurso", tokens: 25600, color: "hsl(30, 100%, 60%)" },
  { name: "Parecer", tokens: 18700, color: "hsl(150, 80%, 40%)" },
  { name: "Contrato", tokens: 15400, color: "hsl(0, 80%, 60%)" },
  { name: "Outros", tokens: 9800, color: "hsl(180, 70%, 50%)" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ModelUsageChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uso por Modelo de IA</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={modelUsageData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {modelUsageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const UsageTrendChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendência de Uso ao Longo do Tempo</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              className="fill-muted-foreground text-xs"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              className="fill-muted-foreground text-xs"
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="tokens"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Tokens"
            />
            <Line
              type="monotone"
              dataKey="generations"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Gerações"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const DocumentTypeChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Tokens por Tipo de Documento</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={documentTypeData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              className="fill-muted-foreground text-xs"
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              className="fill-muted-foreground text-xs"
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="tokens" name="Tokens" radius={[0, 4, 4, 0]}>
              {documentTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
