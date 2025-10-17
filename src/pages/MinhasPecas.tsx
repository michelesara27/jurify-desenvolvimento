// src/pages/MinhasPecas.tsx
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  FileText,
  Clock,
  Loader2,
  User,
  Hash,
  FileIcon,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useLegalDocuments,
  useLegalDocumentsStats,
  useUpdateLegalDocument,
  useLegalDocument,
  useDeactivateLegalDocument,
} from "@/hooks/use-legal-documents";
import { SimpleLegalDocumentForm } from "@/components/legal-documents/SimpleLegalDocumentForm";
import { GenerateDocumentButton } from "@/components/generations/GenerateDocumentButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const statusColors = {
  draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
  review: "bg-blue-100 text-blue-800 border-blue-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  filed: "bg-purple-100 text-purple-800 border-purple-200",
  archived: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusLabels = {
  draft: "Rascunho",
  review: "Em Revisão",
  approved: "Aprovado",
  filed: "Protocolado",
  archived: "Arquivado",
};

const categoryColors = {
  civil: "bg-blue-50 text-blue-700 border-blue-200",
  trabalhista: "bg-green-50 text-green-700 border-green-200",
  criminal: "bg-red-50 text-red-700 border-red-200",
  empresarial: "bg-purple-50 text-purple-700 border-purple-200",
  consultivo: "bg-orange-50 text-orange-700 border-orange-200",
  peticion: "bg-indigo-50 text-indigo-700 border-indigo-200",
  contract: "bg-teal-50 text-teal-700 border-teal-200",
  appeal: "bg-pink-50 text-pink-700 border-pink-200",
  motion: "bg-cyan-50 text-cyan-700 border-cyan-200",
  brief: "bg-amber-50 text-amber-700 border-amber-200",
  memorandum: "bg-lime-50 text-lime-700 border-lime-200",
  other: "bg-slate-50 text-slate-700 border-slate-200",
};

const documentTypeLabels = {
  peticion: "Petição",
  contract: "Contrato",
  appeal: "Recurso",
  motion: "Moção",
  brief: "Parecer",
  memorandum: "Memorando",
  other: "Outro",
};

const MinhasPecas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isNewDocumentDialogOpen, setIsNewDocumentDialogOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(
    null
  );
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [documentToDeactivate, setDocumentToDeactivate] = useState<any>(null);

  // Hooks para buscar dados do Supabase
  const {
    data: documents = [],
    isLoading: documentsLoading,
    error: documentsError,
  } = useLegalDocuments(5);
  const { data: stats, isLoading: statsLoading } = useLegalDocumentsStats();
  const { data: selectedDocument } = useLegalDocument(selectedDocumentId || "");
  const { data: editingDocument } = useLegalDocument(editingDocumentId || "");
  const deactivateDocument = useDeactivateLegalDocument();

  // Filtrar documentos baseado na busca e filtros
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      "";
    const matchesStatus = !statusFilter || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleNewDocumentSuccess = () => {
    setIsNewDocumentDialogOpen(false);
  };

  if (documentsError) {
    console.error("Erro ao carregar documentos:", documentsError);
  }

  const handleViewDetails = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };

  const handleEditDocument = (documentId: string) => {
    setEditingDocumentId(documentId);
  };

  const handleEditSuccess = () => {
    setEditingDocumentId(null);
  };

  const handleDeactivateDocument = (document: any) => {
    setDocumentToDeactivate(document);
    setIsDeactivateDialogOpen(true);
  };

  const confirmDeactivation = async () => {
    if (documentToDeactivate) {
      await deactivateDocument.mutateAsync(documentToDeactivate.id);
      setIsDeactivateDialogOpen(false);
      setDocumentToDeactivate(null);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Minhas Peças</h1>
            <p className="text-muted-foreground">
              Gerencie todos os documentos jurídicos criados com IA
            </p>
          </div>
          <Dialog
            open={isNewDocumentDialogOpen}
            onOpenChange={setIsNewDocumentDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Peça Jurídica
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Nova Peça Jurídica</DialogTitle>
                <DialogDescription>
                  Preencha os campos abaixo para criar uma nova peça jurídica
                </DialogDescription>
              </DialogHeader>
              <SimpleLegalDocumentForm
                onSuccess={handleNewDocumentSuccess}
                onCancel={() => setIsNewDocumentDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards - Removido o card "Total de Páginas" */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total de Peças
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      stats?.total || 0
                    )}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Em Andamento
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      (stats?.draft || 0) + (stats?.review || 0)
                    )}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Finalizadas
                  </p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      (stats?.approved || 0) + (stats?.filed || 0)
                    )}
                  </p>
                </div>
                <FileIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por título ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="">Todos os Status</option>
              <option value="draft">Rascunho</option>
              <option value="review">Em Revisão</option>
              <option value="approved">Aprovado</option>
              <option value="filed">Protocolado</option>
              <option value="archived">Arquivado</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Últimas 5 Peças Jurídicas</CardTitle>
          </CardHeader>
          <CardContent>
            {documentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Carregando peças...</span>
              </div>
            ) : documentsError ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-destructive mx-auto mb-4" />
                <p className="text-destructive font-medium mb-2">
                  Erro ao carregar peças jurídicas
                </p>
                <p className="text-muted-foreground text-sm">
                  Verifique sua conexão e tente novamente.
                </p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter
                    ? "Nenhuma peça encontrada com os filtros aplicados."
                    : "Nenhuma peça jurídica cadastrada ainda."}
                </p>
                {!searchTerm && !statusFilter && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Clique em "Nova Peça" para criar sua primeira peça jurídica.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{doc.title}</h3>
                          <Badge
                            variant="outline"
                            className={
                              statusColors[
                                doc.status as keyof typeof statusColors
                              ]
                            }
                          >
                            {
                              statusLabels[
                                doc.status as keyof typeof statusLabels
                              ]
                            }
                          </Badge>
                          {doc.document_type && (
                            <Badge
                              variant="outline"
                              className={
                                categoryColors[
                                  doc.document_type as keyof typeof categoryColors
                                ]
                              }
                            >
                              {
                                documentTypeLabels[
                                  doc.document_type as keyof typeof documentTypeLabels
                                ]
                              }
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>
                              {doc.client?.name || "Cliente não informado"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Hash className="h-4 w-4" />
                            <span>{doc.word_count || 0} palavras</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileIcon className="h-4 w-4" />
                            <span>{doc.pages_count || 0} páginas</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {doc.created_at
                                ? format(
                                    new Date(doc.created_at),
                                    "dd/MM/yyyy",
                                    { locale: ptBR }
                                  )
                                : "Data não informada"}
                            </span>
                          </div>
                        </div>

                        {doc.updated_at &&
                          doc.updated_at !== doc.created_at && (
                            <p className="text-xs text-muted-foreground">
                              Atualizado em{" "}
                              {format(
                                new Date(doc.updated_at),
                                "dd/MM/yyyy 'às' HH:mm",
                                { locale: ptBR }
                              )}
                            </p>
                          )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(doc.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[600px] sm:w-[800px] overflow-y-auto">
                            <SheetHeader>
                              <SheetTitle>Detalhes da Peça Jurídica</SheetTitle>
                              <SheetDescription>
                                Visualize todas as informações da peça
                                selecionada
                              </SheetDescription>
                            </SheetHeader>
                            {selectedDocument && (
                              <div className="mt-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Título
                                    </h4>
                                    <p className="text-sm">
                                      {selectedDocument.title}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Status
                                    </h4>
                                    <Badge
                                      variant="outline"
                                      className={
                                        statusColors[
                                          selectedDocument.status as keyof typeof statusColors
                                        ]
                                      }
                                    >
                                      {
                                        statusLabels[
                                          selectedDocument.status as keyof typeof statusLabels
                                        ]
                                      }
                                    </Badge>
                                  </div>
                                </div>

                                {selectedDocument.action_type && (
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Tipo de Ação
                                    </h4>
                                    <p className="text-sm">
                                      {selectedDocument.action_type}
                                    </p>
                                  </div>
                                )}

                                {selectedDocument.plaintiff && (
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Autor
                                    </h4>
                                    <p className="text-sm">
                                      {selectedDocument.plaintiff}
                                    </p>
                                  </div>
                                )}

                                {selectedDocument.defendant && (
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Réu
                                    </h4>
                                    <p className="text-sm">
                                      {selectedDocument.defendant}
                                    </p>
                                  </div>
                                )}

                                {selectedDocument.facts && (
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Fatos
                                    </h4>
                                    <p className="text-sm whitespace-pre-wrap">
                                      {selectedDocument.facts}
                                    </p>
                                  </div>
                                )}

                                {selectedDocument.legal_basis && (
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Fundamento Legal
                                    </h4>
                                    <p className="text-sm whitespace-pre-wrap">
                                      {selectedDocument.legal_basis}
                                    </p>
                                  </div>
                                )}

                                {selectedDocument.request && (
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Pedido
                                    </h4>
                                    <p className="text-sm whitespace-pre-wrap">
                                      {selectedDocument.request}
                                    </p>
                                  </div>
                                )}

                                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Palavras
                                    </h4>
                                    <p className="text-sm">
                                      {selectedDocument.word_count || 0}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Páginas
                                    </h4>
                                    <p className="text-sm">
                                      {selectedDocument.pages_count || 0}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Criado em
                                    </h4>
                                    <p className="text-sm">
                                      {selectedDocument.created_at
                                        ? format(
                                            new Date(
                                              selectedDocument.created_at
                                            ),
                                            "dd/MM/yyyy",
                                            { locale: ptBR }
                                          )
                                        : "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </SheetContent>
                        </Sheet>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditDocument(doc.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Editar Peça Jurídica</DialogTitle>
                              <DialogDescription>
                                Modifique os campos abaixo para atualizar a peça
                                jurídica
                              </DialogDescription>
                            </DialogHeader>
                            {editingDocument && (
                              <SimpleLegalDocumentForm
                                initialData={{
                                  action_type:
                                    editingDocument.action_type || "",
                                  plaintiff: editingDocument.plaintiff || "",
                                  defendant: editingDocument.defendant || "",
                                  facts: editingDocument.facts || "",
                                  legal_basis:
                                    editingDocument.legal_basis || "",
                                  request: editingDocument.request || "",
                                  template_id:
                                    editingDocument.template_id || undefined,
                                }}
                                documentId={editingDocument.id}
                                onSuccess={handleEditSuccess}
                                onCancel={() => setEditingDocumentId(null)}
                                isEditing={true}
                              />
                            )}
                          </DialogContent>
                        </Dialog>

                        <GenerateDocumentButton documentId={doc.id} />

                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeactivateDocument(doc)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diálogo de confirmação para inativação */}
        <Dialog
          open={isDeactivateDialogOpen}
          onOpenChange={setIsDeactivateDialogOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar Inativação</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja inativar a peça jurídica "
                {documentToDeactivate?.title}"? Esta ação não pode ser desfeita
                e a peça não aparecerá mais na listagem.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeactivateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeactivation}
                disabled={deactivateDocument.isPending}
              >
                {deactivateDocument.isPending ? "Inativando..." : "Inativar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default MinhasPecas;
