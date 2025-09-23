// client/src/pages/Dashboard.tsx
import { FileText, Clock, Layout, Users, Plus } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { AIUsageIndicator } from "@/components/AIUsageIndicator";
import { RecentPiecesTable } from "@/components/RecentPiecesTable";
import { GenerationStatsChart } from "@/components/GenerationStatsChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  // todo: remove mock functionality
  const mockPieces = [
    {
      id: "1",
      cliente: "Maria Santos",
      tipo: "Petição Inicial",
      status: "Finalizado" as const,
      acao: "Ver",
    },
    {
      id: "2",
      cliente: "João Silva",
      tipo: "Contrato",
      status: "Executivo" as const,
      acao: "Editar",
    },
    {
      id: "3",
      cliente: "Ana Costa",
      tipo: "Recurso",
      status: "Recursos" as const,
      acao: "Excluir",
    },
  ];

  const mockChartData = [
    { name: "Petições", value: 35, color: "hsl(var(--chart-1))" },
    { name: "Contratos", value: 25, color: "hsl(var(--chart-2))" },
    { name: "Recursos", value: 20, color: "hsl(var(--chart-3))" },
    { name: "Consultorias", value: 20, color: "hsl(var(--chart-4))" },
  ];

  return (
    <div className="p-6 space-y-6" data-testid="dashboard-page">
      {/* Header com boas-vindas */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Bem-vindo de volta, Dr. João!
              </h1>
              <p className="text-primary-foreground/80">
                Gere peças jurídicas inteligentes e economize tempo valioso.
              </p>
            </div>
            <Button
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
              data-testid="button-nova-peca"
              onClick={() => console.log("Nova Peça Jurídica clicada")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Peça Jurídica
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Peças este mês"
          value="23"
          icon={FileText}
          color="blue"
        />
        <MetricCard
          title="Horas economizadas"
          value="47h"
          icon={Clock}
          color="green"
        />
        <MetricCard
          title="Modelos usados"
          value="8"
          icon={Layout}
          color="purple"
        />
        <MetricCard
          title="Clientes ativos"
          value="12"
          icon={Users}
          color="orange"
        />
      </div>

      {/* Indicador de uso da IA */}
      <AIUsageIndicator currentUsage={23} maxUsage={50} unit="peças" />

      {/* Conteúdo principal - tabela e gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentPiecesTable pieces={mockPieces} />
        </div>
        <div>
          <GenerationStatsChart data={mockChartData} />
        </div>
      </div>
    </div>
  );
}
