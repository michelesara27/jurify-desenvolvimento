import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { GenerationsList } from "@/components/generations/GenerationsList";
import { RealTimeGenerationsChart } from "@/components/generations/RealTimeGenerationsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RefreshCw, FileDown, ChevronDown, Eye, Download, Trash, Filter, Calendar, Search, Bot, Zap, Clock, FileText } from "lucide-react";
import { useState } from "react";
import { PaginatedGenerationsList } from "@/components/generations/PaginatedGenerationsList";
import { EnhancedFilters, FilterState } from "@/components/generations/EnhancedFilters";
import { ExportButton } from "@/components/generations/ExportButton";
import { useFormattedStats } from "@/hooks/use-ai-generations-stats";

const HistoricoGeracoes = () => {
  const { formatted: stats, isLoading: statsLoading } = useFormattedStats();
  
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    model: "all",
    dateRange: {
      from: undefined,
      to: undefined,
    },
    minTokens: "",
    maxTokens: "",
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const handleExportData = (format: string) => {
    // Implementação da exportação de dados
    console.log(`Exportando dados em formato ${format}`);
    // Aqui seria implementada a lógica real de exportação
  };

  const handleRefreshData = () => {
    // Implementação da atualização de dados
    console.log("Atualizando dados");
    // Aqui seria implementada a lógica real de atualização
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      model: "all",
      dateRange: {
        from: undefined,
        to: undefined,
      },
      minTokens: "",
      maxTokens: "",
      sortBy: "created_at",
      sortOrder: "desc",
    });
    setSearchQuery("");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header com Filtros e Ações */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">Histórico de Gerações</h1>
            <p className="text-muted-foreground">
              Acompanhe e analise todas as suas gerações de documentos com IA
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <ExportButton filters={filters} />
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleRefreshData}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Atualizar</span>
              <span className="sm:hidden">Atual.</span>
            </Button>
          </div>
        </div>

        {/* Filtros Avançados */}
        <EnhancedFilters
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
          className="mb-6"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatsCard
            title="Total de Gerações"
            value={statsLoading ? "..." : (stats?.totalGenerations || "0")}
            icon={Bot}
            iconColor="blue"
            description={statsLoading ? "Carregando..." : `${stats?.monthlyGrowth || "+0%"} este mês`}
          />
          <StatsCard
            title="Tokens Utilizados"
            value={statsLoading ? "..." : (stats?.totalTokens || "0")}
            icon={Zap}
            iconColor="yellow"
            description={statsLoading ? "Carregando..." : `${stats?.tokensGrowth || "+0%"} este mês`}
          />
          <StatsCard
            title="Tempo Médio"
            value={statsLoading ? "..." : (stats?.averageGenerationTime || "0ms")}
            icon={Clock}
            iconColor="green"
            description={statsLoading ? "Carregando..." : `${stats?.averageTimeThisWeek || "0ms"} esta semana`}
          />
          <StatsCard
            title="Documentos Criados"
            value={statsLoading ? "..." : (stats?.completedDocuments || "0")}
            icon={FileText}
            iconColor="purple"
            description={statsLoading ? "Carregando..." : `${stats?.newDocumentsThisMonth || "0"} este mês`}
          />
        </div>

        {/* Tabs para diferentes visualizações */}
        <div className="overflow-x-auto">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="detailed">Detalhado</TabsTrigger>
              <TabsTrigger value="analytics">Análises</TabsTrigger>
            </TabsList>
            
            {/* Tab: Visão Geral */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <GenerationsList />
                <Card>
                  <CardHeader>
                    <CardTitle>Atividade Recente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Última geração</span>
                        <span className="text-sm font-medium">Há 2 minutos</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Documentos hoje</span>
                        <span className="text-sm font-medium">{stats.totalGenerations}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Taxa de sucesso</span>
                        <span className="text-sm font-medium text-green-600">98.5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Tab: Detalhado */}
            <TabsContent value="detailed" className="space-y-4">
              <PaginatedGenerationsList 
                searchQuery={filters.search}
                statusFilter={filters.status}
                modelFilter={filters.model}
                dateRange={filters.dateRange}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                minTokens={filters.minTokens ? parseInt(filters.minTokens) : undefined}
                maxTokens={filters.maxTokens ? parseInt(filters.maxTokens) : undefined}
              />
            </TabsContent>
            
            {/* Tab: Análises */}
            <TabsContent value="analytics" className="space-y-4">
              <RealTimeGenerationsChart />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default HistoricoGeracoes;
