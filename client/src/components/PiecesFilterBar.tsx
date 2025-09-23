// client/src/components/PiecesFilterBar.tsx
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface PiecesFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  onNewPiece: () => void;
}

export function PiecesFilterBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  onNewPiece,
}: PiecesFilterBarProps) {
  return (
    <Card data-testid="pieces-filter-bar">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por cliente, título ou tipo..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
              data-testid="input-search-pieces"
            />
          </div>

          {/* Filtro por Status */}
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-40" data-testid="select-status-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="Finalizado">Finalizado</SelectItem>
              <SelectItem value="Executivo">Executivo</SelectItem>
              <SelectItem value="Recursos">Recursos</SelectItem>
              <SelectItem value="Rascunho">Rascunho</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtro por Tipo */}
          <Select value={typeFilter} onValueChange={onTypeChange}>
            <SelectTrigger className="w-48" data-testid="select-type-filter">
              <SelectValue placeholder="Tipo de Peça" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Tipos</SelectItem>
              <SelectItem value="Petição Inicial">Petição Inicial</SelectItem>
              <SelectItem value="Contrato">Contrato</SelectItem>
              <SelectItem value="Recurso">Recurso</SelectItem>
              <SelectItem value="Parecer">Parecer</SelectItem>
              <SelectItem value="Consultoria">Consultoria</SelectItem>
            </SelectContent>
          </Select>

          {/* Botão Nova Peça */}
          <Button onClick={onNewPiece} data-testid="button-new-piece">
            <Plus className="h-4 w-4 mr-2" />
            Nova Peça
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
