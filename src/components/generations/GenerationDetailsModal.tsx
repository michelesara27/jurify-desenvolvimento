import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Clock, Zap, FileText, AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

interface GenerationDetailsModalProps {
  generation: any;
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig = {
  completed: {
    label: "Concluída",
    color: "bg-green-500",
    icon: CheckCircle,
    variant: "default" as const,
  },
  failed: {
    label: "Falhou",
    color: "bg-red-500",
    icon: XCircle,
    variant: "destructive" as const,
  },
  processing: {
    label: "Processando",
    color: "bg-yellow-500",
    icon: Loader2,
    variant: "secondary" as const,
  },
  pending: {
    label: "Pendente",
    color: "bg-blue-500",
    icon: Clock,
    variant: "outline" as const,
  },
};

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`,
    });
  }).catch(() => {
    toast({
      title: "Erro ao copiar",
      description: "Não foi possível copiar o texto.",
      variant: "destructive",
    });
  });
};

export const GenerationDetailsModal = ({ generation, isOpen, onClose }: GenerationDetailsModalProps) => {
  if (!generation) return null;

  const status = statusConfig[generation.status as keyof typeof statusConfig];
  const StatusIcon = status?.icon || AlertCircle;

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}min`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalhes da Geração
            <Badge variant={status?.variant} className="ml-2">
              <StatusIcon className="h-3 w-3 mr-1" />
              {status?.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Informações Gerais
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">ID:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">{generation.id}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(generation.id, "ID")}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Modelo:</span>
                    <Badge variant="outline">{generation.model_used || "N/A"}</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Criado em:</span>
                    <span className="text-sm">
                      {format(new Date(generation.created_at), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR })}
                    </span>
                  </div>

                  {generation.completed_at && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Concluído em:</span>
                      <span className="text-sm">
                        {format(new Date(generation.completed_at), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Métricas
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      Tokens:
                    </span>
                    <Badge variant="secondary">{generation.tokens_used?.toLocaleString() || "0"}</Badge>
                  </div>

                  {generation.generation_time && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Tempo:
                      </span>
                      <Badge variant="secondary">{formatDuration(generation.generation_time)}</Badge>
                    </div>
                  )}

                  {generation.document_id && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Documento:</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">{generation.document_id}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generation.document_id, "ID do Documento")}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Prompt */}
            {generation.prompt && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Prompt Utilizado
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generation.prompt, "Prompt")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                    {generation.prompt}
                  </pre>
                </div>
              </div>
            )}

            {/* Erro (se houver) */}
            {generation.error_message && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Mensagem de Erro
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generation.error_message, "Erro")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <pre className="text-sm text-red-800 whitespace-pre-wrap font-mono leading-relaxed">
                    {generation.error_message}
                  </pre>
                </div>
              </div>
            )}

            {/* Informações Técnicas */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Informações Técnicas
              </h3>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-xs text-muted-foreground font-mono">
{JSON.stringify({
  id: generation.id,
  user_id: generation.user_id,
  document_id: generation.document_id,
  status: generation.status,
  model_used: generation.model_used,
  tokens_used: generation.tokens_used,
  generation_time: generation.generation_time,
  created_at: generation.created_at,
  completed_at: generation.completed_at,
}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
