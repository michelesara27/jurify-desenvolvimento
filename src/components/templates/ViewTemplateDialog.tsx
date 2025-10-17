// src/components/templates/ViewTemplateDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Crown, Calendar, FileText, Copy, Edit } from "lucide-react";
import { DocumentTemplate } from "@/hooks/use-templates";

const documentTypeLabels: Record<string, string> = {
  peticion: "Petição",
  contract: "Contrato",
  appeal: "Recurso",
  motion: "Moção",
  brief: "Memorial",
  memorandum: "Memorando",
  other: "Outro",
};

interface ViewTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: DocumentTemplate | null;
  onEdit?: (template: DocumentTemplate) => void;
  onDuplicate?: (templateId: string) => void;
}

export function ViewTemplateDialog({
  open,
  onOpenChange,
  template,
  onEdit,
  onDuplicate,
}: ViewTemplateDialogProps) {
  if (!template) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl">{template.name}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {documentTypeLabels[template.document_type] ||
                    template.document_type}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    template.is_system_template
                      ? "bg-blue-500/10 text-blue-700 border-blue-200"
                      : "bg-green-500/10 text-green-700 border-green-200"
                  }
                >
                  {template.is_system_template ? (
                    <>
                      <Crown className="w-3 h-3 mr-1" />
                      Sistema
                    </>
                  ) : (
                    "Personalizado"
                  )}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              {!template.is_system_template && onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(template)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
              {onDuplicate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDuplicate(template.id)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicar
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Criado em: {formatDate(template.created_at)}</span>
              </div>
              {template.updated_at !== template.created_at && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Atualizado em: {formatDate(template.updated_at)}</span>
                </div>
              )}
            </div>

            {template.usage_count !== undefined && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Usado {template.usage_count} vezes</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Prompt/Descrição */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Prompt</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm leading-relaxed">
                {template.description || "Nenhuma descrição disponível"}
              </p>
            </div>
          </div>

          {/* Variables */}
          {template.variables && Object.keys(template.variables).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Variáveis</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <pre className="text-sm">
                  {JSON.stringify(template.variables, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
