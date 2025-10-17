// src/pages/ModelosTemplates.tsx
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Copy,
  FileText,
  Crown,
  Trash2,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  useTemplates,
  useDuplicateTemplate,
  useDeleteTemplate,
  DocumentTemplate,
} from "@/hooks/use-templates";
import { NovoTemplateForm } from "@/components/templates/NovoTemplateForm";
import { EditTemplateForm } from "@/components/templates/EditTemplateForm";
import { ViewTemplateDialog } from "@/components/templates/ViewTemplateDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const documentTypeLabels: Record<string, string> = {
  petition: "Petição",
  contract: "Contrato",
  appeal: "Recurso",
  motion: "Moção",
  brief: "Memorial",
  complaint: "Denúncia",
  response: "Contestação",
};

const statusVariants: Record<string, string> = {
  system: "bg-blue-500/10 text-blue-700 border-blue-200",
  user: "bg-green-500/10 text-green-700 border-green-200",
};

export default function ModelosTemplates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showNovoForm, setShowNovoForm] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<DocumentTemplate | null>(null);
  const [viewingTemplate, setViewingTemplate] =
    useState<DocumentTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] =
    useState<DocumentTemplate | null>(null);

  const { data: templates = [], isLoading } = useTemplates();
  const duplicateTemplateMutation = useDuplicateTemplate();
  const deleteTemplateMutation = useDeleteTemplate();

  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    if (searchTerm) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(
        (template) => template.document_type === selectedType
      );
    }

    return filtered;
  }, [templates, searchTerm, selectedType]);

  const handleDuplicate = async (templateId: string) => {
    try {
      await duplicateTemplateMutation.mutateAsync(templateId);
    } catch (error) {
      console.error("Erro ao duplicar template:", error);
    }
  };

  const handleDelete = async (template: DocumentTemplate) => {
    try {
      await deleteTemplateMutation.mutateAsync(template.id);
      setTemplateToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir template:", error);
    }
  };

  const handleEdit = (templateId: string) => {
    // Implementar navegação para edição
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição de templates será implementada em breve.",
    });
  };

  const handleView = (templateId: string) => {
    // Implementar visualização
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A visualização de templates será implementada em breve.",
    });
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Modelos e Templates
            </h1>
            <p className="text-muted-foreground">
              Gerencie seus templates de documentos jurídicos
            </p>
          </div>
          <Button onClick={() => setShowNovoForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Template
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Templates
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Templates do Sistema
              </CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {templates.filter((t) => t.is_system_template).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Meus Templates
              </CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {templates.filter((t) => !t.is_system_template).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {Object.entries(documentTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Templates Table */}
        <Card>
          <CardHeader>
            <CardTitle>Templates Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Carregando templates...</p>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Nenhum template encontrado.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Prompt</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {template.name}
                          {template.is_system_template && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {documentTypeLabels[template.document_type] ||
                            template.document_type}
                        </Badge>
                      </TableCell>

                      <TableCell className="max-w-xs truncate">
                        {template.description || "Sem prompt"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingTemplate(template)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!template.is_system_template && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingTemplate(template)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTemplateToDelete(template)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicate(template.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Formulário de Novo Template */}
      {showNovoForm && (
        <NovoTemplateForm open={showNovoForm} onOpenChange={setShowNovoForm} />
      )}

      {/* Formulário de Edição */}
      {editingTemplate && (
        <EditTemplateForm
          template={editingTemplate}
          open={!!editingTemplate}
          onOpenChange={(open) => !open && setEditingTemplate(null)}
        />
      )}

      {/* Dialog de Visualização */}
      {viewingTemplate && (
        <ViewTemplateDialog
          template={viewingTemplate}
          open={!!viewingTemplate}
          onOpenChange={(open) => !open && setViewingTemplate(null)}
          onEdit={(template) => {
            setViewingTemplate(null);
            setEditingTemplate(template);
          }}
          onDuplicate={(templateId) => {
            setViewingTemplate(null);
            handleDuplicate(templateId);
          }}
        />
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog
        open={!!templateToDelete}
        onOpenChange={(open) => !open && setTemplateToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o template "
              {templateToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => templateToDelete && handleDelete(templateToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
