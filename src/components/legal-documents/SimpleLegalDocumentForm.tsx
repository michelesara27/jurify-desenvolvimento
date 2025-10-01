import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useCreateLegalDocument } from "@/hooks/use-legal-documents";
import { useTemplates } from "@/hooks/use-templates";
import { useToast } from "@/hooks/use-toast";

// Schema de validação com apenas os campos essenciais
const simpleLegalDocumentSchema = z.object({
  action_type: z.string().min(1, "Tipo de ação é obrigatório"),
  plaintiff: z.string().min(1, "Autor é obrigatório"),
  defendant: z.string().min(1, "Réu é obrigatório"),
  facts: z.string().min(10, "Fatos devem ter pelo menos 10 caracteres"),
  legal_basis: z.string().min(10, "Fundamento legal deve ter pelo menos 10 caracteres"),
  request: z.string().min(10, "Pedido deve ter pelo menos 10 caracteres"),
  template_id: z.string().optional(),
});

type SimpleLegalDocumentFormData = z.infer<typeof simpleLegalDocumentSchema>;

interface SimpleLegalDocumentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
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

export function SimpleLegalDocumentForm({ onSuccess, onCancel }: SimpleLegalDocumentFormProps) {
  const { toast } = useToast();
  const createDocumentMutation = useCreateLegalDocument();
  const { data: templates, isLoading: templatesLoading } = useTemplates();

  const form = useForm<SimpleLegalDocumentFormData>({
    resolver: zodResolver(simpleLegalDocumentSchema),
    defaultValues: {
      action_type: "",
      plaintiff: "",
      defendant: "",
      facts: "",
      legal_basis: "",
      request: "",
      template_id: "",
    },
  });

  const handleTemplateChange = (templateId: string) => {
    if (!templateId || templateId === "loading" || templateId === "no-templates") return;
    
    const selectedTemplate = templates?.find(t => t.id === templateId);
    if (selectedTemplate) {
      // Preencher apenas o campo de fatos baseado no template
      if (selectedTemplate.content) {
        // Extrair informações do template se disponível
        form.setValue('facts', selectedTemplate.content.substring(0, 500) + "...");
      }
      // Removido: inicialização automática do fundamento legal
    }
  };

  const onSubmit = async (data: SimpleLegalDocumentFormData) => {
    try {
      // Criar documento com campos essenciais + campos padrão necessários
      const documentData = {
        ...data,
        title: `${data.action_type} - ${data.plaintiff} vs ${data.defendant}`,
        content: `FATOS:\n${data.facts}\n\nFUNDAMENTO LEGAL:\n${data.legal_basis}\n\nPEDIDO:\n${data.request}`,
        document_type: "peticion" as const,
        status: "draft" as const,
        ai_generated: false,
        word_count: data.facts.split(' ').length + data.legal_basis.split(' ').length + data.request.split(' ').length,
        pages_count: 1,
      };

      await createDocumentMutation.mutateAsync(documentData);
      
      toast({
        title: "Sucesso!",
        description: "Peça jurídica criada com sucesso.",
      });
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar peça jurídica. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Nova Peça Jurídica</h2>
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
              disabled={createDocumentMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createDocumentMutation.isPending}
              className="min-w-[120px]"
            >
              {createDocumentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
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
