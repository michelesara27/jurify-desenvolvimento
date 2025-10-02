import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DailyGeneration {
  day: string;
  generations: number;
  tokens: number;
  date: string;
}

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface ModelData {
  name: string;
  value: number;
  color: string;
}

const fetchChartData = async (userId?: string) => {
  // Buscar dados dos últimos 7 dias
  const endDate = new Date();
  const startDate = subDays(endDate, 6);

  let query = supabase
    .from('ai_generations')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data: generations, error } = await query;

  if (error) {
    console.error('Erro ao buscar dados do gráfico:', error);
    throw error;
  }

  const allGenerations = generations || [];

  // Preparar dados diários
  const dailyData: DailyGeneration[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(endDate, i);
    const dayStart = startOfDay(date);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000 - 1);

    const dayGenerations = allGenerations.filter(gen => {
      const genDate = new Date(gen.created_at);
      return genDate >= dayStart && genDate <= dayEnd;
    });

    const dayName = format(date, 'EEE', { locale: ptBR });
    const dayTokens = dayGenerations.reduce((sum, gen) => sum + (gen.tokens_used || 0), 0);

    dailyData.push({
      day: dayName,
      generations: dayGenerations.length,
      tokens: dayTokens,
      date: format(date, 'dd/MM'),
    });
  }

  // Preparar dados de status
  const statusCounts = {
    completed: allGenerations.filter(gen => gen.status === 'completed').length,
    failed: allGenerations.filter(gen => gen.status === 'failed').length,
    processing: allGenerations.filter(gen => gen.status === 'processing').length,
    pending: allGenerations.filter(gen => gen.status === 'pending').length,
  };

  const statusData: StatusData[] = [
    { name: "Concluídas", value: statusCounts.completed, color: "hsl(142, 76%, 36%)" },
    { name: "Falharam", value: statusCounts.failed, color: "hsl(0, 84%, 60%)" },
    { name: "Processando", value: statusCounts.processing, color: "hsl(48, 96%, 53%)" },
    { name: "Pendentes", value: statusCounts.pending, color: "hsl(221, 83%, 53%)" },
  ].filter(item => item.value > 0);

  // Preparar dados de modelos
  const modelCounts: { [key: string]: number } = {};
  allGenerations.forEach(gen => {
    const model = gen.model_used || 'Desconhecido';
    modelCounts[model] = (modelCounts[model] || 0) + 1;
  });

  const colors = [
    "hsl(221, 83%, 53%)",
    "hsl(262, 83%, 58%)",
    "hsl(25, 95%, 53%)",
    "hsl(142, 76%, 36%)",
    "hsl(0, 84%, 60%)",
  ];

  const modelData: ModelData[] = Object.entries(modelCounts)
    .map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }))
    .sort((a, b) => b.value - a.value);

  return {
    dailyData,
    statusData,
    modelData,
  };
};

export const RealTimeGenerationsChart = () => {
  const { user } = useAuth();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['generations-chart-data', user?.id],
    queryFn: () => fetchChartData(user?.id),
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="lg:col-span-3">
          <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Erro ao carregar dados dos gráficos</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { dailyData, statusData, modelData } = data || { dailyData: [], statusData: [], modelData: [] };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Gráfico de Gerações Diárias */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Gerações dos Últimos 7 Dias</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'generations' ? `${value} gerações` : `${value} tokens`,
                  name === 'generations' ? 'Gerações' : 'Tokens'
                ]}
                labelFormatter={(label, payload) => {
                  const data = payload?.[0]?.payload;
                  return data ? `${label} (${data.date})` : label;
                }}
              />
              <Bar dataKey="generations" fill="hsl(221, 83%, 53%)" name="generations" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status das Gerações</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} gerações`, 'Quantidade']} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span style={{ fontSize: '12px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Nenhum dado disponível</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Modelos */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Uso por Modelo de IA</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {modelData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip formatter={(value) => [`${value} gerações`, 'Quantidade']} />
                <Bar dataKey="value" fill="hsl(262, 83%, 58%)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Nenhum dado disponível</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
