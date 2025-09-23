// client/src/components/ClientsFilterBar.tsx
import { Search, Plus, Users } from "lucide-react";
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

interface ClientsFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewClient: () => void;
}

export function ClientsFilterBar({
  searchTerm,
  onSearchChange,
  onNewClient,
}: ClientsFilterBarProps) {
  return (
    <Card data-testid="clients-filter-bar">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nome, email ou CPF/CNPJ..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
              data-testid="input-search-clients"
            />
          </div>

          {/* Botão Novo Cliente */}
          <Button onClick={onNewClient} data-testid="button-new-client">
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
