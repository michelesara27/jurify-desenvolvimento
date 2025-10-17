// src/components/generations/PaginatedLegalDocumentList.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Calendar,
  User,
  Building,
  FileOutput,
  Download,
} from "lucide-react";
import {
  usePaginatedLegalDocuments,
  LegalDocument,
} from "@/hooks/use-paginated-legal-documents";
import {
  useWebhookResponsesByDocument,
  useGenerateFormattedDocument,
} from "@/hooks/use-webhook-responses";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GenerateDocumentButton } from "./GenerateDocumentButton";

interface PaginatedLegalDocumentsListProps {
  searchQuery?: string;
  statusFilter?: string;
  // Quando verdadeiro, lista somente documentos gerados por IA
  onlyAIGenerated?: boolean;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "draft":
      return "secondary";
    case "review":
      return "outline";
    case "approved":
      return "default";
    case "filed":
      return "default";
    case "archived":
      return "secondary";
    default:
      return "secondary";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "draft":
      return "Rascunho";
    case "review":
      return "Em Revisão";
    case "approved":
      return "Aprovado";
    case "filed":
      return "Protocolado";
    case "archived":
      return "Arquivado";
    default:
      return status;
  }
};

const getDocumentTypeLabel = (type: string) => {
  switch (type) {
    case "peticion":
      return "Petição";
    case "contract":
      return "Contrato";
    case "appeal":
      return "Recurso";
    case "motion":
      return "Moção";
    case "brief":
      return "Parecer";
    case "memorandum":
      return "Memorando";
    case "other":
      return "Outro";
    default:
      return type;
  }
};

export function PaginatedLegalDocumentsList({
  searchQuery,
  statusFilter,
  onlyAIGenerated,
  dateRange,
}: PaginatedLegalDocumentsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocument, setSelectedDocument] =
    useState<LegalDocument | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const pageSize = 10;
  const generateDocumentMutation = useGenerateFormattedDocument();

  const {
    data: paginationData,
    isLoading,
    error,
  } = usePaginatedLegalDocuments({
    page: currentPage,
    pageSize,
    searchQuery,
    statusFilter,
    onlyAIGenerated,
    dateRange,
  });

  const handleViewDetails = (document: LegalDocument) => {
    setSelectedDocument(document);
    setIsDetailDialogOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando documentos...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Erro ao carregar documentos</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!paginationData || paginationData.documents.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhum documento encontrado</p>
            <p className="text-sm">Tente ajustar os filtros de busca</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    documents,
    totalCount,
    totalPages,
    currentPage: page,
    hasNextPage,
    hasPreviousPage,
  } = paginationData;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Histórico de Peças Jurídicas</span>
            <Badge variant="outline">
              {totalCount} {totalCount === 1 ? "documento" : "documentos"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lista de Documentos */}
          <div className="space-y-3">
            {documents.map((document) => (
              <div
                key={document.id}
                className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-sm text-foreground line-clamp-1">
                        {document.title || "Documento sem título"}
                      </h3>
                      <Badge
                        variant={getStatusVariant(document.status)}
                        className="text-xs"
                      >
                        {getStatusLabel(document.status)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getDocumentTypeLabel(document.document_type)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(
                          new Date(document.created_at),
                          "dd/MM/yyyy 'às' HH:mm",
                          {
                            locale: ptBR,
                          }
                        )}
                      </div>

                      {document.client && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {document.client.name}
                        </div>
                      )}

                      {document.case && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {document.case.title}
                        </div>
                      )}
                    </div>

                    {document.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {document.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <GenerateDocumentButton
                      documentId={document.id}
                      documentType={document.document_type}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(document)}
                      className="shrink-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controles de Paginação */}
          {totalPages > 1 && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Página {page} de {totalPages} ({totalCount}{" "}
                  {totalCount === 1 ? "documento" : "documentos"})
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!hasPreviousPage}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (page <= 3) {
                        pageNumber = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          variant={page === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!hasNextPage}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalhes do Documento
            </DialogTitle>
          </DialogHeader>

          {selectedDocument && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    TÍTULO
                  </h4>
                  <p className="text-sm">
                    {selectedDocument.title || "Sem título"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    TIPO DE DOCUMENTO
                  </h4>
                  <Badge variant="outline">
                    {getDocumentTypeLabel(selectedDocument.document_type)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    STATUS
                  </h4>
                  <Badge variant={getStatusVariant(selectedDocument.status)}>
                    {getStatusLabel(selectedDocument.status)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    DATA DE CRIAÇÃO
                  </h4>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3" />
                    {format(
                      new Date(selectedDocument.created_at),
                      "dd/MM/yyyy 'às' HH:mm",
                      {
                        locale: ptBR,
                      }
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Descrição */}
              {selectedDocument.description && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    DESCRIÇÃO
                  </h4>
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedDocument.description}
                  </p>
                </div>
              )}

              {/* Cliente e Caso */}
              {(selectedDocument.client || selectedDocument.case) && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDocument.client && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">
                          CLIENTE
                        </h4>
                        <div className="text-sm">
                          <p className="font-medium">
                            {selectedDocument.client.name}
                          </p>
                          {selectedDocument.client.email && (
                            <p className="text-muted-foreground">
                              {selectedDocument.client.email}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedDocument.case && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">
                          CASO
                        </h4>
                        <div className="text-sm">
                          <p className="font-medium">
                            {selectedDocument.case.title}
                          </p>
                          {selectedDocument.case.description && (
                            <p className="text-muted-foreground line-clamp-2">
                              {selectedDocument.case.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Conteúdo do Documento */}
              {selectedDocument.content && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      CONTEÚDO COMPLETO
                    </h4>
                    <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap font-mono">
                        {selectedDocument.content}
                      </pre>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
