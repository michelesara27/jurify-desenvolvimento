import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { GenerationsList } from "@/components/generations/GenerationsList";
import { GenerationsChart } from "@/components/generations/GenerationsChart";
import { ModelUsageChart, UsageTrendChart, DocumentTypeChart } from "@/components/generations/AdvancedCharts";
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

const HistoricoGeracoes = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modelFilter, setModelFilter] = useState("all");

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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <FileDown className="h-4 w-4" />
                  <span className="hidden sm:inline">Exportar</span>
                  <span className="sm:hidden">Exp.</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExportData("csv")}>
                  Exportar como CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportData("excel")}>
                  Exportar como Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportData("pdf")}>
                  Exportar como PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por prompt ou ID..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="w-full sm:w-auto">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <Filter className="h-4 w-4 mr-2 text-muted-foreground hidden sm:inline" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="processing">Processando</SelectItem>
                      <SelectItem value="failed">Falhou</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full sm:w-auto">
                  <Select value={modelFilter} onValueChange={setModelFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <Filter className="h-4 w-4 mr-2 text-muted-foreground hidden sm:inline" />
                      <SelectValue placeholder="Modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os modelos</SelectItem>
                      <SelectItem value="gpt4">GPT-4</SelectItem>
                      <SelectItem value="gpt35">GPT-3.5</SelectItem>
                      <SelectItem value="claude">Claude</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full sm:w-auto">
                  <DatePicker 
                    placeholder="Filtrar por período"
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    className="w-full sm:w-[200px]"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatsCard
            title="Total de Gerações"
            value="47"
            icon={Bot}
            iconColor="blue"
            description="+12% este mês"
          />
          <StatsCard
            title="Tokens Utilizados"
            value="125.4k"
            icon={Zap}
            iconColor="green"
            description="-5% em relação ao mês anterior"
          />
          <StatsCard
            title="Tempo Médio"
            value="3.2s"
            icon={Clock}
            iconColor="purple"
            description="2.8s na última semana"
          />
          <StatsCard
            title="Documentos Criados"
            value="23"
            icon={FileText}
            iconColor="orange"
            description="+8 novos documentos"
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
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="lg:col-span-2">
                  <GenerationsList />
                </div>
                <div className="lg:col-span-1">
                  <GenerationsChart />
                </div>
              </div>
            </TabsContent>
            
            {/* Tab: Detalhado */}
            <TabsContent value="detailed" className="mt-6">
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                    <span>Histórico Detalhado</span>
                    <Badge variant="outline" className="ml-2">47 gerações</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                  <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-10 px-2 sm:px-4 text-left font-medium whitespace-nowrap">Data</th>
                          <th className="h-10 px-2 sm:px-4 text-left font-medium">Prompt</th>
                          <th className="h-10 px-2 sm:px-4 text-left font-medium whitespace-nowrap">Modelo</th>
                          <th className="h-10 px-2 sm:px-4 text-left font-medium whitespace-nowrap">Tokens</th>
                          <th className="h-10 px-2 sm:px-4 text-left font-medium whitespace-nowrap">Status</th>
                          <th className="h-10 px-2 sm:px-4 text-left font-medium whitespace-nowrap">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Dados de exemplo - seriam substituídos por dados reais */}
                        {[1, 2, 3, 4, 5].map((i) => (
                          <tr key={i} className="border-b">
                            <td className="p-2 sm:p-4 align-middle whitespace-nowrap">{`${i}/10/2023`}</td>
                            <td className="p-2 sm:p-4 align-middle">
                              <div className="max-w-[100px] sm:max-w-[200px] truncate">Petição inicial para processo de divórcio</div>
                            </td>
                            <td className="p-2 sm:p-4 align-middle whitespace-nowrap">GPT-4</td>
                            <td className="p-2 sm:p-4 align-middle whitespace-nowrap">2.4k</td>
                            <td className="p-2 sm:p-4 align-middle whitespace-nowrap">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs sm:text-sm">
                                Concluído
                              </Badge>
                            </td>
                            <td className="p-2 sm:p-4 align-middle">
                              <div className="flex gap-1 sm:gap-2">
                                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                                  <Trash className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-2 py-4">
                    <div className="text-sm text-muted-foreground sm:mr-4 block sm:hidden">
                      Página 1 de 5
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      Próximo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tab: Análises */}
            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Uso por Modelo de IA</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[250px] sm:h-80">
                    <ModelUsageChart />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Tendência de Uso ao Longo do Tempo</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[250px] sm:h-80">
                    <UsageTrendChart />
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Distribuição de Tokens por Tipo de Documento</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[250px] sm:h-80">
                    <DocumentTypeChart />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default HistoricoGeracoes;
