// src/components/legal-documents/SimpleLegalDocumentForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, FileText } from "lucide-react";
import {
  useCreateLegalDocument,
  useUpdateLegalDocument,
} from "@/hooks/use-legal-documents";
import { useTemplates } from "@/hooks/use-templates";
import { useToast } from "@/hooks/use-toast";
import { webhookService } from "@/services/webhook";
import { useCreateWebhookResponse } from "@/hooks/use-webhook-responses";
import { useAuth } from "@/hooks/use-auth";

// Schema de validação com apenas os campos essenciais
const simpleLegalDocumentSchema = z.object({
  action_type: z.string().min(1, "Tipo de ação é obrigatório"),
  plaintiff: z.string().min(1, "Autor é obrigatório"),
  defendant: z.string().min(1, "Réu é obrigatório"),
  facts: z.string().min(10, "Fatos devem ter pelo menos 10 caracteres"),
  legal_basis: z
    .string()
    .min(10, "Fundamento legal deve ter pelo menos 10 caracteres"),
  request: z.string().min(10, "Pedido deve ter pelo menos 10 caracteres"),
  template_id: z.string().optional(),
});

type SimpleLegalDocumentFormData = z.infer<typeof simpleLegalDocumentSchema>;

interface SimpleLegalDocumentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<SimpleLegalDocumentFormData>;
  documentId?: string;
  isEditing?: boolean;
}

const actionTypeOptions = [
  { value: "acao_ordinaria", label: "Ação Ordinária" },
  { value: "acao_sumaria", label: "Ação Sumária" },
  { value: "acao_cautelar", label: "Ação Cautelar" },
  { value: "acao_possessoria", label: "Ação Possessória" },
  { value: "acao_indenizatoria", label: "Ação Indenizatória" },
  { value: "acao_trabalhista", label: "Ação Trabalhista" },
  { value: "acao_previdenciaria", label: "Ação Previdenciária" },
  { value: "acao_criminal", label: "Ação Criminal" },
  { value: "mandado_seguranca", label: "Mandado de Segurança" },
  { value: "habeas_corpus", label: "Habeas Corpus" },
  { value: "outras", label: "Outras" },
];

export function SimpleLegalDocumentForm({
  onSuccess,
  onCancel,
  initialData,
  documentId,
  isEditing = false,
}: SimpleLegalDocumentFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createDocumentMutation = useCreateLegalDocument();
  const updateDocumentMutation = useUpdateLegalDocument();
  const createWebhookResponseMutation = useCreateWebhookResponse();
  const { data: templates, isLoading: templatesLoading } = useTemplates();

  // Função auxiliar para obter document_type do template
  const getDocumentTypeFromTemplate = (templateId?: string) => {
    if (!templateId || !templates) return null;
    const selectedTemplate = templates.find((t) => t.id === templateId);
    return selectedTemplate?.document_type || null;
  };

  const form = useForm<SimpleLegalDocumentFormData>({
    resolver: zodResolver(simpleLegalDocumentSchema),
    defaultValues: {
      action_type: initialData?.action_type || "",
      plaintiff: initialData?.plaintiff || "",
      defendant: initialData?.defendant || "",
      facts: initialData?.facts || "",
      legal_basis: initialData?.legal_basis || "",
      request: initialData?.request || "",
      template_id: initialData?.template_id || "",
    },
  });

  const handleTemplateChange = (templateId: string) => {
    if (
      !templateId ||
      templateId === "loading" ||
      templateId === "no-templates"
    )
      return;

    const selectedTemplate = templates?.find((t) => t.id === templateId);
    if (selectedTemplate) {
      // Preencher apenas o campo de fatos baseado no template
      if (selectedTemplate.template_content) {
        // Extrair informações do template se disponível
        form.setValue(
          "facts",
          selectedTemplate.template_content.substring(0, 500) + "..."
        );
      }
      // Removido: inicialização automática do fundamento legal
    }
  };

  const onSubmit = async (data: SimpleLegalDocumentFormData) => {
    // Prevenir submissões duplicadas
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && documentId) {
        // Atualizar documento existente
        const updateData = {
          ...data,
          title: `${data.action_type} - ${data.plaintiff} vs ${data.defendant}`,
          content: `FATOS:\n${data.facts}\n\nFUNDAMENTO LEGAL:\n${data.legal_basis}\n\nPEDIDO:\n${data.request}`,
          word_count:
            data.facts.split(" ").length +
            data.legal_basis.split(" ").length +
            data.request.split(" ").length,
        };

        await updateDocumentMutation.mutateAsync({
          id: documentId,
          ...updateData,
        });

        toast({
          title: "Sucesso!",
          description: "Peça jurídica atualizada com sucesso.",
        });
      } else {
        // Criar documento com campos essenciais + campos padrão necessários
        const documentData = {
          ...data,
          title: `${data.action_type} - ${data.plaintiff} vs ${data.defendant}`,
          content: `FATOS:\n${data.facts}\n\nFUNDAMENTO LEGAL:\n${data.legal_basis}\n\nPEDIDO:\n${data.request}`,
          document_type:
            getDocumentTypeFromTemplate(data.template_id) ||
            ("peticion" as const),
          status: "draft" as const,
          ai_generated: false,
          word_count:
            data.facts.split(" ").length +
            data.legal_basis.split(" ").length +
            data.request.split(" ").length,
          pages_count: 1,
        };

        // Criar o documento no banco de dados
        const createdDocument = await createDocumentMutation.mutateAsync(
          documentData
        );

        // Buscar dados do template selecionado (se houver)
        const selectedTemplate = data.template_id
          ? templates?.find((t) => t.id === data.template_id)
          : undefined;

        // Mostrar toast de processamento
        toast({
          title: "Processando...",
          description: "Aguardando processamento (até 75 segundos)...",
        });

        // Enviar dados para o webhook após sucesso no cadastro e aguardar resposta
        try {
          const webhookResponse = await webhookService.sendSyncWithData(
            {
              ...createdDocument,
              ...documentData, // Garantir que todos os dados estejam presentes
            },
            selectedTemplate
          );

          console.log(
            "Dados enviados para webhook com sucesso:",
            webhookResponse
          );

          // Salvar resposta do webhook na nova tabela
          if (webhookResponse.success && webhookResponse.data) {
            try {
              // Processar o conteúdo do webhook antes de salvar
              const processedContent = webhookService.processWebhookContent(
                webhookResponse.data
              );

              await createWebhookResponseMutation.mutateAsync({
                legal_document_id: createdDocument.id,
                company_id: user?.user_metadata?.company_id || null,
                document_type: documentData.document_type,
                webhook_response_content: processedContent.content,
              });

              console.log("Resposta do webhook salva com sucesso");
            } catch (saveError) {
              console.error("Erro ao salvar resposta do webhook:", saveError);
              // Não interromper o fluxo se falhar ao salvar a resposta
            }
          }
        } catch (webhookError) {
          console.error("Erro ao enviar dados para webhook:", webhookError);

          // Verificar se é erro de timeout
          const errorMessage =
            webhookError instanceof Error
              ? webhookError.message
              : "Erro desconhecido";
          const isTimeoutError =
            errorMessage.toLowerCase().includes("timeout") ||
            errorMessage.toLowerCase().includes("75 segundos");

          if (isTimeoutError) {
            toast({
              title: "Documento Salvo",
              description:
                "O documento foi salvo com sucesso, mas o processamento foi interrompido devido ao limite de 75 segundos.",
              variant: "default",
            });
          } else {
            // Verificar se é erro de CORS especificamente
            const isCorsError =
              errorMessage.toLowerCase().includes("cors") ||
              errorMessage
                .toLowerCase()
                .includes("access-control-allow-origin") ||
              errorMessage.toLowerCase().includes("blocked by cors policy");

            if (isCorsError) {
              toast({
                title: "Peça Criada com Sucesso",
                description:
                  "A peça foi salva, mas o processamento automático está temporariamente indisponível devido a configurações do servidor.",
                variant: "default",
              });
            } else {
              toast({
                title: "Aviso",
                description:
                  "Peça criada com sucesso, mas houve um problema no processamento automático.",
                variant: "default",
              });
            }
          }
        }

        toast({
          title: "Sucesso!",
          description: "Peça jurídica criada com sucesso.",
        });
      }

      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: isEditing
          ? "Erro ao atualizar peça jurídica. Tente novamente."
          : "Erro ao criar peça jurídica. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">
          {isEditing ? "Editar Peça Jurídica" : "Nova Peça Jurídica"}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Modelo (Opcional) */}
          <FormField
            control={form.control}
            name="template_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo (Opcional)</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleTemplateChange(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um modelo..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {templatesLoading ? (
                      <SelectItem value="loading" disabled>
                        Carregando modelos...
                      </SelectItem>
                    ) : templates && templates.length > 0 ? (
                      templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-templates" disabled>
                        Nenhum modelo disponível
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tipo de Ação */}
          <FormField
            control={form.control}
            name="action_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Ação *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o tipo de ação (ex: Ação Ordinária, Mandado de Segurança, etc.)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Autor e Réu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="plaintiff"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Autor *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do autor da ação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defendant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Réu *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do réu da ação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Fatos */}
          <FormField
            control={form.control}
            name="facts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fatos *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva os fatos relevantes do caso..."
                    className="min-h-[120px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fundamento Legal */}
          <FormField
            control={form.control}
            name="legal_basis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fundamento Legal *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Cite as bases legais e jurisprudências aplicáveis..."
                    className="min-h-[120px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pedido */}
          <FormField
            control={form.control}
            name="request"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pedido *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva o que está sendo solicitado..."
                    className="min-h-[120px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando... (até 75s)
                </>
              ) : isEditing ? (
                "Atualizar Peça"
              ) : (
                "Criar Peça"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
