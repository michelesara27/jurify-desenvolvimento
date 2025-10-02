import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  ChevronRight
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePaginatedGenerations } from "@/hooks/use-paginated-generations";
import { GenerationDetailsModal } from "./GenerationDetailsModal";
import { useState } from "react";

interface PaginatedGenerationsListProps {
  searchQuery?: string;
  statusFilter?: string;
  modelFilter?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minTokens?: number;
  maxTokens?: number;
}

const statusConfig = {
  completed: {
    label: "Concluído",
    icon: CheckCircle,
    variant: "default" as const,
    color: "text-green-600"
  },
  pending: {
    label: "Pendente",
    icon: Clock,
    variant: "secondary" as const,
    color: "text-blue-600"
  },
  processing: {
    label: "Processando",
    icon: Loader2,
    variant: "secondary" as const,
    color: "text-yellow-600"
  },
  failed: {
    label: "Falhou",
    icon: XCircle,
    variant: "destructive" as const,
    color: "text-red-600"
  }
};

export const PaginatedGenerationsList = ({ 
  searchQuery, 
  statusFilter, 
  modelFilter, 
  dateRange,
  sortBy,
  sortOrder,
  minTokens,
  maxTokens
}: PaginatedGenerationsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedGeneration, setSelectedGeneration] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (generation: any) => {
    setSelectedGeneration(generation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGeneration(null);
  };

  const { data, isLoading, error } = usePaginatedGenerations({
    page: currentPage,
    limit: itemsPerPage,
    searchQuery,
    statusFilter,
    modelFilter,
    dateRange,
    sortBy,
    sortOrder,
    minTokens,
    maxTokens
  });

  const totalPages = data?.totalPages || 0;

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Carregando gerações...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Erro ao carregar gerações: {error.message}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Bot className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhuma geração encontrada
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Gerações de IA ({data?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {data.data.map((generation, index) => {
                const config = statusConfig[generation.status as keyof typeof statusConfig];
                const StatusIcon = config.icon;
                
                return (
                  <div key={generation.id}>
                    <div className="flex flex-col space-y-3 p-4 rounded-lg border bg-card">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <StatusIcon 
                            className={`h-4 w-4 ${config.color} ${generation.status === 'processing' ? 'animate-spin' : ''}`} 
                          />
                          <Badge variant={config.variant} className="text-xs">
                            {config.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {generation.model_used}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(generation)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Download className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Exportar Geração</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                  Escolha o formato para exportar esta geração:
                                </p>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <FileText className="h-4 w-4 mr-2" />
                                    TXT
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <FileText className="h-4 w-4 mr-2" />
                                    JSON
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Prompt:</span>
                          <p className="text-muted-foreground mt-1 line-clamp-2">
                            {generation.prompt || "Sem prompt disponível"}
                          </p>
                        </div>
                        
                        {generation.response && (
                          <div className="text-sm">
                            <span className="font-medium">Resposta:</span>
                            <p className="text-muted-foreground mt-1 line-clamp-3">
                              {generation.response}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Metrics */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            <span>{generation.tokens_used || 0} tokens</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {generation.generation_time 
                                ? `${generation.generation_time}ms` 
                                : "N/A"
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {formatDistanceToNow(new Date(generation.created_at), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs">
                          {format(new Date(generation.created_at), "dd/MM/yyyy HH:mm", {
                            locale: ptBR
                          })}
                        </div>
                      </div>
                    </div>
                    {index < data.data.length - 1 && <Separator className="my-2" />}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages} ({data.total} registros)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <GenerationDetailsModal
        generation={selectedGeneration}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};
