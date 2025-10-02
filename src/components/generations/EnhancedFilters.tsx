import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, X, Search, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export interface FilterState {
  search: string;
  status: string;
  model: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  minTokens: string;
  maxTokens: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface EnhancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
  className?: string;
}

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "completed", label: "Concluídas" },
  { value: "failed", label: "Falharam" },
  { value: "processing", label: "Processando" },
  { value: "pending", label: "Pendentes" },
];

const modelOptions = [
  { value: "all", label: "Todos os Modelos" },
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-3", label: "Claude 3" },
  { value: "gemini-pro", label: "Gemini Pro" },
];

const sortOptions = [
  { value: "created_at", label: "Data de Criação" },
  { value: "completed_at", label: "Data de Conclusão" },
  { value: "tokens_used", label: "Tokens Utilizados" },
  { value: "generation_time", label: "Tempo de Geração" },
];

export const EnhancedFilters = ({ 
  filters, 
  onFiltersChange, 
  onReset, 
  className 
}: EnhancedFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== "all") count++;
    if (filters.model !== "all") count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.minTokens) count++;
    if (filters.maxTokens) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Recolher" : "Expandir"}
            </Button>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="text-muted-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Busca - sempre visível */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por prompt, modelo ou ID..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtros básicos - sempre visíveis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => updateFilter('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Modelo</Label>
            <Select
              value={filters.model}
              onValueChange={(value) => updateFilter('model', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ordenar por</Label>
            <div className="flex gap-2">
              <Select
                value={filters.sortBy}
                onValueChange={(value) => updateFilter('sortBy', value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3"
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros avançados - mostrados quando expandido */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Intervalo de datas */}
              <div className="space-y-2">
                <Label>Período</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal",
                          !filters.dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.from ? (
                          format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          "Data inicial"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.from}
                        onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, from: date })}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal",
                          !filters.dateRange.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.to ? (
                          format(filters.dateRange.to, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          "Data final"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.to}
                        onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, to: date })}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Intervalo de tokens */}
              <div className="space-y-2">
                <Label>Tokens Utilizados</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Mín"
                    value={filters.minTokens}
                    onChange={(e) => updateFilter('minTokens', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Máx"
                    value={filters.maxTokens}
                    onChange={(e) => updateFilter('maxTokens', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros ativos */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Busca: "{filters.search}"
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('search', '')}
                />
              </Badge>
            )}
            {filters.status !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Status: {statusOptions.find(o => o.value === filters.status)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('status', 'all')}
                />
              </Badge>
            )}
            {filters.model !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Modelo: {modelOptions.find(o => o.value === filters.model)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('model', 'all')}
                />
              </Badge>
            )}
            {(filters.dateRange.from || filters.dateRange.to) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Período: {filters.dateRange.from ? format(filters.dateRange.from, "dd/MM", { locale: ptBR }) : "..."} - {filters.dateRange.to ? format(filters.dateRange.to, "dd/MM", { locale: ptBR }) : "..."}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('dateRange', { from: undefined, to: undefined })}
                />
              </Badge>
            )}
            {(filters.minTokens || filters.maxTokens) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Tokens: {filters.minTokens || "0"} - {filters.maxTokens || "∞"}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    updateFilter('minTokens', '');
                    updateFilter('maxTokens', '');
                  }}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
