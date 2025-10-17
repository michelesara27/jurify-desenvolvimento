// src/components/clients/EditCasoForm.tsx
import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUpdateCase } from "@/hooks/use-cases";
import { useClients } from "@/hooks/use-clients";
import type { Case } from "@/hooks/use-cases";

const formSchema = z.object({
  client_id: z.string().min(1, "Selecione um cliente"),
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  description: z.string().optional(),
  case_number: z.string().optional(),
  court: z.string().optional(),
  status: z.enum(["active", "pending", "closed", "archived"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditCasoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caso: Case | null;
  onCasoAtualizado?: () => void;
}

const statusOptions = [
  { value: "active", label: "Ativo" },
  { value: "pending", label: "Pendente" },
  { value: "closed", label: "Finalizado" },
  { value: "archived", label: "Arquivado" },
];

const priorityOptions = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
];

export function EditCasoForm({
  open,
  onOpenChange,
  caso,
  onCasoAtualizado,
}: EditCasoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: "",
      title: "",
      description: "",
      case_number: "",
      court: "",
      status: "active",
      priority: "medium",
      start_date: "",
      end_date: "",
    },
  });

  const updateCaseMutation = useUpdateCase();
  const { data: clients, isLoading: clientsLoading } = useClients();

  // Preencher o formulário quando o caso for carregado
  useEffect(() => {
    if (caso && open) {
      form.reset({
        client_id: caso.client_id || "",
        title: caso.title || "",
        description: caso.description || "",
        case_number: caso.case_number || "",
        court: caso.court || "",
        status: caso.status || "active",
        priority: caso.priority || "medium",
        start_date: caso.start_date
          ? new Date(caso.start_date).toISOString().split("T")[0]
          : "",
        end_date: caso.end_date
          ? new Date(caso.end_date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [caso, open, form]);

  async function onSubmit(data: FormValues) {
    if (!caso) return;

    setIsSubmitting(true);

    try {
      // Preparar dados para envio
      const updateData = {
        client_id: data.client_id,
        title: data.title,
        description: data.description || undefined,
        case_number: data.case_number || undefined,
        court: data.court || undefined,
        status: data.status,
        priority: data.priority,
        start_date: data.start_date || undefined,
        end_date: data.end_date || undefined,
      };

      await updateCaseMutation.mutateAsync({
        id: caso.id,
        ...updateData,
      });

      onOpenChange(false);
      if (onCasoAtualizado) onCasoAtualizado();
    } catch (error) {
      console.error("Erro ao atualizar caso:", error);
      // O erro já é tratado pelo hook useUpdateCase
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!caso) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Caso</DialogTitle>
          <DialogDescription>
            Atualize as informações do caso jurídico.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Cliente */}
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clientsLoading ? (
                        <SelectItem value="" disabled>
                          Carregando clientes...
                        </SelectItem>
                      ) : clients && clients.length > 0 ? (
                        clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name} - {client.cpf_cnpj}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          Nenhum cliente encontrado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Título */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Caso *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Ação Trabalhista - Horas Extras"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descrição */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva os detalhes do caso..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Número do Processo e Tribunal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="case_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Processo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 1234567-89.2024.8.26.0001"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="court"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tribunal/Vara</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 1ª Vara do Trabalho de São Paulo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status e Prioridade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorityOptions.map((option) => (
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

            {/* Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Encerramento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Atualizar Caso
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
