// src/components/generations/PaginatedGenerationsList.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bot,
  Clock,
  Zap,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  Calendar,
  Eye,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePaginatedGenerations } from "@/hooks/use-paginated-generations";
import { useState } from "react";

interface PaginatedGenerationsListProps {
  searchQuery?: string;
  statusFilter?: string;
  modelFilter?: string;
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
}

const statusConfig = {
  completed: {
    label: "Concluído",
    icon: CheckCircle,
    variant: "default" as const,
    color: "text-green-600",
  },
  pending: {
    label: "Pendente",
    icon: Clock,
    variant: "secondary" as const,
    color: "text-blue-600",
  },
  processing: {
    label: "Processando",
    icon: Loader2,
    variant: "secondary" as const,
    color: "text-yellow-600",
  },
  failed: {
    label: "Falhou",
    icon: XCircle,
    variant: "destructive" as const,
    color: "text-red-600",
  },
};

export const PaginatedGenerationsList = ({
  searchQuery,
  statusFilter,
  modelFilter,
  dateRange,
}: PaginatedGenerationsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: result,
    isLoading,
    error,
  } = usePaginatedGenerations({
    page: currentPage,
    pageSize,
    searchQuery,
    statusFilter,
    modelFilter,
    dateRange,
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Histórico de Gerações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Histórico de Gerações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <p>Erro ao carregar gerações</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result || result.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Histórico de Gerações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <p>Nenhuma geração encontrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Histórico de Gerações
          </div>
          <Badge variant="outline">{result.totalCount} registros</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {result.data.map((generation, index) => {
              const config =
                statusConfig[generation.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;

              return (
                <div key={generation.id}>
                  <div className="flex flex-col space-y-3 p-4 rounded-lg border bg-card">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <StatusIcon
                          className={`h-4 w-4 ${config.color} ${
                            generation.status === "processing"
                              ? "animate-spin"
                              : ""
                          }`}
                        />
                        <Badge variant={config.variant} className="text-xs">
                          {config.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {generation.model_used}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes da Geração</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">
                                  Data e Hora
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {format(
                                    new Date(generation.created_at),
                                    "dd/MM/yyyy 'às' HH:mm",
                                    { locale: ptBR }
                                  )}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Prompt</h4>
                                <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                                  {generation.prompt}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Modelo</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {generation.model_used}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Status</h4>
                                  <Badge variant={config.variant}>
                                    {config.label}
                                  </Badge>
                                </div>
                              </div>
                              {generation.tokens_used > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Tokens Utilizados
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {generation.tokens_used.toLocaleString()}{" "}
                                    tokens
                                  </p>
                                </div>
                              )}
                              {generation.generation_time && (
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Tempo de Geração
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {(
                                      generation.generation_time / 1000
                                    ).toFixed(1)}{" "}
                                    segundos
                                  </p>
                                </div>
                              )}
                              {generation.error_message && (
                                <div>
                                  <h4 className="font-medium mb-2 text-destructive">
                                    Erro
                                  </h4>
                                  <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                                    {generation.error_message}
                                  </p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        {generation.document_id && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Prompt */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground line-clamp-2">
                        {generation.prompt}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(generation.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </div>

                      {generation.tokens_used > 0 && (
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {generation.tokens_used.toLocaleString()} tokens
                        </div>
                      )}

                      {generation.generation_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {(generation.generation_time / 1000).toFixed(1)}s
                        </div>
                      )}

                      {generation.document_id && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          Documento criado
                        </div>
                      )}
                    </div>

                    {/* Error message */}
                    {generation.error_message && (
                      <div className="p-2 bg-destructive/10 rounded text-xs text-destructive">
                        {generation.error_message}
                      </div>
                    )}
                  </div>

                  {index < result.data.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Página {result.currentPage} de {result.totalPages} (
            {result.totalCount} registros)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(result.currentPage - 1)}
              disabled={!result.hasPreviousPage}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(result.currentPage + 1)}
              disabled={!result.hasNextPage}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
