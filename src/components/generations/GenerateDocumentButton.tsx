// src/components/generations/GenerateDocumentButton.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileOutput,
  Download,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  useWebhookResponsesByDocument,
  useGenerateFormattedDocument,
  useCreateWebhookResponse,
} from "@/hooks/use-webhook-responses";
import { useLegalDocument } from "@/hooks/use-legal-documents";
import { webhookService } from "@/services/webhook";
import { DocumentWordGenerator } from "@/services/document-word-generator";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GenerateDocumentButtonProps {
  documentId: string;
  documentType: string;
}

export function GenerateDocumentButton({
  documentId,
  documentType,
}: GenerateDocumentButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWebhookResponse, setSelectedWebhookResponse] = useState<
    string | null
  >(null);
  const [isCreatingWebhook, setIsCreatingWebhook] = useState(false);

  const { toast } = useToast();
  const { data: webhookResponses, isLoading: isLoadingResponses } =
    useWebhookResponsesByDocument(documentId);
  const { data: legalDocument } = useLegalDocument(documentId);
  const generateDocumentMutation = useGenerateFormattedDocument();
  const createWebhookResponseMutation = useCreateWebhookResponse();

  const handleGenerateDocument = async (webhookResponseId: string) => {
    try {
      await generateDocumentMutation.mutateAsync(webhookResponseId);
      setIsDialogOpen(false);
      setSelectedWebhookResponse(null);
    } catch (error) {
      console.error("Erro ao gerar documento:", error);
    }
  };

  const handleCreateWebhookResponse = async () => {
    if (!legalDocument) {
      toast({
        title: "Erro",
        description: "Documento não encontrado",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingWebhook(true);

    try {
      // Preparar payload para o webhook
      const payload = webhookService.preparePayload(legalDocument);

      // Enviar para o webhook
      const webhookResponse = await webhookService.sendToWebhook(payload);

      if (webhookResponse.success) {
        // Processar o conteúdo do webhook antes de salvar
        const processedContent = webhookService.processWebhookContent(
          webhookResponse.data || {}
        );

        // Criar webhook response no banco
        await createWebhookResponseMutation.mutateAsync({
          legal_document_id: documentId,
          document_type: documentType,
          webhook_response_content: processedContent.content,
        });

        toast({
          title: "Sucesso",
          description: "Webhook processado com sucesso!",
        });
      } else {
        throw new Error(webhookResponse.message || "Erro no webhook");
      }
    } catch (error) {
      console.error("Erro ao criar webhook response:", error);
      toast({
        title: "Erro",
        description: "Erro ao processar documento no webhook",
        variant: "destructive",
      });
    } finally {
      setIsCreatingWebhook(false);
    }
  };

  const handleDownloadDocument = async (
    documentoFormatado: string,
    documentId: string
  ) => {
    try {
      // Gerar documento Word usando o serviço
      const wordBlob = await DocumentWordGenerator.generateWordDocument(
        documentoFormatado,
        `Petição Jurídica - ${documentId}`
      );

      // Fazer o download do documento Word
      DocumentWordGenerator.downloadWordDocument(
        wordBlob,
        `peticao_formatada_${documentId}`
      );

      toast({
        title: "Sucesso",
        description: "Documento Word gerado e baixado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao gerar documento Word:", error);
      toast({
        title: "Erro",
        description: "Falha ao gerar documento Word. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Sempre mostrar o botão ativo, independente de haver webhook responses
  const hasWebhookData = webhookResponses && webhookResponses.length > 0;

  // Verificar se há pelo menos uma resposta não gerada
  const hasUngenerated =
    hasWebhookData && webhookResponses.some((response) => !response.gerado);
  const hasGenerated =
    hasWebhookData && webhookResponses.some((response) => response.gerado);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        className="shrink-0"
        title="Gerar documento formatado"
      >
        {hasGenerated ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <FileOutput className="h-4 w-4" />
        )}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileOutput className="h-5 w-5" />
              Gerar Documento Formatado
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Selecione uma resposta do webhook para gerar o documento formatado
              com base no template de petição.
            </p>

            {webhookResponses && webhookResponses.length > 0 ? (
              webhookResponses.map((response) => (
                <div
                  key={response.id}
                  className="border rounded-lg p-3 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {response.document_type}
                        </Badge>
                        {response.gerado ? (
                          <Badge
                            variant="default"
                            className="text-xs bg-green-100 text-green-800"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Gerado
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Pendente
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Criado em{" "}
                        {format(
                          new Date(response.created_at!),
                          "dd/MM/yyyy 'às' HH:mm",
                          { locale: ptBR }
                        )}
                      </p>
                      {response.data_geracao && (
                        <p className="text-xs text-muted-foreground">
                          Documento gerado em{" "}
                          {format(
                            new Date(response.data_geracao),
                            "dd/MM/yyyy 'às' HH:mm",
                            { locale: ptBR }
                          )}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {response.gerado && response.documento_formatado ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDownloadDocument(
                              response.documento_formatado!,
                              response.id!
                            )
                          }
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Baixar
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleGenerateDocument(response.id!)}
                          disabled={generateDocumentMutation.isPending}
                          className="flex items-center gap-1"
                        >
                          {generateDocumentMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <FileOutput className="h-3 w-3" />
                          )}
                          Gerar
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Preview dos dados do webhook */}
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-muted-foreground">
                      DADOS DO WEBHOOK
                    </h4>
                    <div className="bg-muted/50 rounded p-2 max-h-32 overflow-y-auto">
                      <pre className="text-xs whitespace-pre-wrap">
                        {JSON.stringify(
                          response.webhook_response_content,
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  </div>

                  {/* Preview do documento gerado */}
                  {response.gerado && response.documento_formatado && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground">
                          DOCUMENTO GERADO
                        </h4>
                        <div className="bg-muted/50 rounded p-2 max-h-48 overflow-y-auto">
                          <pre className="text-xs whitespace-pre-wrap">
                            {response.documento_formatado}
                          </pre>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 space-y-4">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <div>
                  <p className="text-muted-foreground mb-2">
                    Nenhuma resposta de webhook encontrada para este documento.
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    O documento precisa ser processado pelo webhook primeiro.
                  </p>
                </div>
                <Button
                  onClick={handleCreateWebhookResponse}
                  disabled={isCreatingWebhook}
                  className="w-full max-w-xs"
                >
                  {isCreatingWebhook ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <FileOutput className="h-4 w-4 mr-2" />
                      Processar Documento
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
