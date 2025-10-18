// src/components/templates/EditTemplateForm.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateTemplate, DocumentTemplate } from "@/hooks/use-templates";

const templateSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z.string().min(1, "Prompt é obrigatório"),
  document_type: z.string().min(1, "Tipo de documento é obrigatório"),
});

type TemplateFormData = z.infer<typeof templateSchema>;

const documentTypeOptions = [
  { value: "peticion", label: "Petição" },
  { value: "contract", label: "Contrato" },
  { value: "appeal", label: "Recurso" },
  { value: "motion", label: "Moção" },
  { value: "brief", label: "Memorial" },
  { value: "memorandum", label: "Memorando" },
  { value: "other", label: "Outro" },
];

interface EditTemplateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: DocumentTemplate | null;
}

export function EditTemplateForm({
  open,
  onOpenChange,
  template,
}: EditTemplateFormProps) {
  const updateTemplateMutation = useUpdateTemplate();

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: "",
      document_type: "",
    },
  });

  // Atualizar formulário quando template mudar
  useEffect(() => {
    if (template) {
      form.reset({
        name: template.name,
        description: template.description || "",
        document_type: template.document_type,
      });
    }
  }, [template, form]);

  const onSubmit = async (data: TemplateFormData) => {
    if (!template) return;

    try {
      const templateData = {
        id: template.id,
        name: data.name,
        description: data.description,
        document_type: data.document_type,
      };

      await updateTemplateMutation.mutateAsync(templateData);

      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao atualizar template:", error);
    }
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Template</DialogTitle>
          <DialogDescription>
            Edite as informações do template
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Template *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Petição Inicial Trabalhista"
                        {...field}
                      />
                    </FormControl>
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o propósito e contexto deste template..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateTemplateMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateTemplateMutation.isPending}>
                {updateTemplateMutation.isPending
                  ? "Salvando..."
                  : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
