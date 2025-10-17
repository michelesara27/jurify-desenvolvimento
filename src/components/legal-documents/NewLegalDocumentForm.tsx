// src/components/legal-documents/NewLegalDocumentForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2, FileText } from "lucide-react";
import { useCreateLegalDocument } from "@/hooks/use-legal-documents";
import { useTemplates } from "@/hooks/use-templates";
import { useToast } from "@/hooks/use-toast";
import { webhookService } from "@/services/webhook";
import { useCreateWebhookResponse } from "@/hooks/use-webhook-responses";
import { useAuth } from "@/hooks/use-auth";

// Schema de validação
const legalDocumentSchema = z.object({
  title: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(200, "Título muito longo"),
  content: z.string().min(10, "Conteúdo deve ter pelo menos 10 caracteres"),
  document_type: z.enum(
    [
      "peticion",
      "contract",
      "appeal",
      "motion",
      "brief",
      "memorandum",
      "other",
    ],
    {
      required_error: "Selecione um tipo de documento",
    }
  ),
  status: z
    .enum(["draft", "review", "approved", "filed", "archived"])
    .default("draft"),

  // Novos campos obrigatórios
  action_type: z.string().min(1, "Tipo de ação é obrigatório"),
  plaintiff: z.string().min(1, "Autor é obrigatório"),
  defendant: z.string().min(1, "Réu é obrigatório"),
  facts: z.string().min(10, "Fatos devem ter pelo menos 10 caracteres"),
  legal_basis: z
    .string()
    .min(10, "Fundamento legal deve ter pelo menos 10 caracteres"),
  request: z.string().min(10, "Pedido deve ter pelo menos 10 caracteres"),

  // Campos opcionais
  template_id: z.string().optional(),
  client_id: z.string().optional(),
  case_id: z.string().optional(),
  word_count: z.number().min(0).optional(),
  pages_count: z
    .number()
    .min(1, "Documento deve ter pelo menos 1 página")
    .optional(),
  ai_generated: z.boolean().default(false),
  generation_prompt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

type LegalDocumentFormData = z.infer<typeof legalDocumentSchema>;

interface NewLegalDocumentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const documentTypeOptions = [
  { value: "peticion", label: "Petição" },
  { value: "contract", label: "Contrato" },
  { value: "appeal", label: "Recurso" },
  { value: "motion", label: "Moção" },
  { value: "brief", label: "Parecer" },
  { value: "memorandum", label: "Memorando" },
  { value: "other", label: "Outro" },
];

const statusOptions = [
  { value: "draft", label: "Rascunho" },
  { value: "review", label: "Em Revisão" },
  { value: "approved", label: "Aprovado" },
  { value: "filed", label: "Protocolado" },
  { value: "archived", label: "Arquivado" },
];

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

export function NewLegalDocumentForm({
  onSuccess,
  onCancel,
}: NewLegalDocumentFormProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar submissão
  const { toast } = useToast();
  const { user } = useAuth();
  const createDocumentMutation = useCreateLegalDocument();
  const createWebhookResponseMutation = useCreateWebhookResponse();
  const { data: templates, isLoading: templatesLoading } = useTemplates();

  const form = useForm<LegalDocumentFormData>({
    resolver: zodResolver(legalDocumentSchema),
    defaultValues: {
      title: "",
      content: "",
      document_type: "peticion",
      status: "draft",
      action_type: "",
      plaintiff: "",
      defendant: "",
      facts: "",
      legal_basis: "",
      request: "",
      ai_generated: false,
      tags: [],
    },
  });

  // Função para lidar com mudança de template
  const handleTemplateChange = (templateId: string) => {
    if (
      !templateId ||
      templateId === "loading" ||
      templateId === "no-templates"
    )
      return;

    const selectedTemplate = templates?.find((t) => t.id === templateId);
    if (selectedTemplate) {
      // Atualizar o document_type baseado no template selecionado
      if (selectedTemplate.document_type) {
        form.setValue("document_type", selectedTemplate.document_type);
      }

      // Preencher conteúdo baseado no template
      if (selectedTemplate.template_content) {
        form.setValue("content", selectedTemplate.template_content);

        // Calcular word_count e pages_count
        const wordCount = selectedTemplate.template_content
          .split(/\s+/)
          .filter((word) => word.length > 0).length;
        form.setValue("word_count", wordCount);
        form.setValue("pages_count", Math.max(1, Math.ceil(wordCount / 250)));
      }
    }
  };

  // Função para adicionar tag
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const newTags = [...tags, newTag.trim()];
      setTags(newTags);
      form.setValue("tags", newTags);
      setNewTag("");
    }
  };

  // Função para remover tag
  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };

  // Função para estimar contagem de palavras
  const estimateWordCount = (text: string): number => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  // Função para estimar páginas (aproximadamente 250 palavras por página)
  const estimatePageCount = (text: string): number => {
    const wordCount = estimateWordCount(text);
    return Math.max(1, Math.ceil(wordCount / 250));
  };

  const onSubmit = async (data: LegalDocumentFormData) => {
    // Evitar submissões duplicadas
    if (isSubmitting) {
      console.log("Submissão já em andamento, ignorando...");
      return;
    }

    setIsSubmitting(true);

    try {
      // Criar o documento no banco de dados
      const createdDocument = await createDocumentMutation.mutateAsync({
        ...data,
        word_count: estimateWordCount(data.content),
        pages_count: estimatePageCount(data.content),
        tags: tags,
      });

      // Buscar dados do template selecionado (se houver)
      const selectedTemplate = data.template_id
        ? templates?.find((t) => t.id === data.template_id)
        : undefined;

      // Enviar dados para o webhook após sucesso no cadastro e aguardar resposta
      try {
        toast({
          title: "Processando...",
          description:
            "Enviando dados para processamento. Aguarde até 75 segundos...",
          variant: "default",
        });

        const webhookResponse = await webhookService.sendSyncWithData(
          {
            ...createdDocument,
            ...data, // Garantir que todos os dados estejam presentes
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
              document_type: data.document_type,
              webhook_response_content: processedContent.content,
            });

            console.log("Resposta do webhook processada e salva com sucesso");
          } catch (saveError) {
            console.error("Erro ao salvar resposta do webhook:", saveError);
            // Não interromper o fluxo se falhar ao salvar a resposta
          }
        }
      } catch (webhookError) {
        console.error("Erro ao enviar dados para webhook:", webhookError);

        // Verificar se é erro de CORS especificamente
        const errorMessage =
          webhookError instanceof Error
            ? webhookError.message
            : "Erro desconhecido";
        const isCorsError =
          errorMessage.toLowerCase().includes("cors") ||
          errorMessage.toLowerCase().includes("access-control-allow-origin") ||
          errorMessage.toLowerCase().includes("blocked by cors policy");

        if (isCorsError) {
          toast({
            title: "Peça Criada com Sucesso",
            description:
              "A peça foi salva, mas o processamento automático está temporariamente indisponível devido a configurações do servidor.",
            variant: "default",
          });
        } else if (errorMessage.toLowerCase().includes("timeout")) {
          toast({
            title: "Peça Criada com Sucesso",
            description:
              "A peça foi salva, mas o processamento demorou mais que 75 segundos e foi interrompido.",
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

      toast({
        title: "Peça criada com sucesso!",
        description: "A nova peça jurídica foi criada e salva.",
      });

      // Limpar formulário
      form.reset();
      setTags([]);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao criar documento:", error);

      // Feedback de erro mais específico
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao criar peça jurídica.";

      toast({
        title: "Erro ao criar peça",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Nova Peça Jurídica
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Título */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Peça *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Petição Inicial - Ação de Cobrança"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Modelo (Template) */}
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

            {/* Tipo de Ação e Tipo de Documento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="action_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Ação *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de ação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {actionTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="document_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Documento *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {documentTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conteúdo */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo da Peça *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite o conteúdo da peça jurídica..."
                      className="min-h-[200px] resize-y"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        const wordCount = estimateWordCount(e.target.value);
                        const pageCount = estimatePageCount(e.target.value);
                        form.setValue("word_count", wordCount);
                        form.setValue("pages_count", pageCount);
                      }}
                    />
                  </FormControl>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      Palavras: {estimateWordCount(form.watch("content") || "")}
                    </span>
                    <span>
                      Páginas estimadas:{" "}
                      {estimatePageCount(form.watch("content") || "")}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      placeholder="Cite os fundamentos legais aplicáveis..."
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
                      placeholder="Descreva o pedido da ação..."
                      className="min-h-[120px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end gap-4 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando... (até 75s)
                  </>
                ) : (
                  "Criar Peça Jurídica"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
