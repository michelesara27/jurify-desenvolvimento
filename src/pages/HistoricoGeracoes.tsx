// src/pages/HistoricoGeracoes.tsx
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  RefreshCw,
  FileDown,
  ChevronDown,
  Filter,
  Calendar,
  Search,
} from "lucide-react";
import { useState } from "react";
import { PaginatedLegalDocumentsList } from "@/components/generations/PaginatedLegalDocumentsList";

const HistoricoGeracoes = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
            <h1 className="text-3xl font-bold text-foreground">
              Histórico de Gerações
            </h1>
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
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
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
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="review">Em Revisão</SelectItem>
                      <SelectItem value="approved">Aprovado</SelectItem>
                      <SelectItem value="filed">Protocolado</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
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

        {/* Listagem Paginada de Documentos Gerados por IA */}
        <PaginatedLegalDocumentsList
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onlyAIGenerated
          dateRange={dateRange}
        />
      </div>
    </MainLayout>
  );
};

export default HistoricoGeracoes;
