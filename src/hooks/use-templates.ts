// src/hooks/use-templates.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string | null;
  document_type: string;
  template_content?: string | null;
  variables?: any;
  is_system_template: boolean;
  user_id?: string | null;
  usage_count?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateData {
  name: string;
  description: string;
  document_type: string;
  variables?: any;
}

export interface UpdateTemplateData extends Partial<CreateTemplateData> {
  id: string;
}

// Hook para buscar todos os templates
export const useTemplates = () => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async (): Promise<DocumentTemplate[]> => {
      const { data, error } = await supabase
        .from("document_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Erro ao buscar templates: ${error.message}`);
      }

      return data || [];
    },
  });
};

// Hook para buscar um template específico
export const useTemplate = (id: string) => {
  return useQuery({
    queryKey: ["template", id],
    queryFn: async (): Promise<DocumentTemplate | null> => {
      const { data, error } = await supabase
        .from("document_templates")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null;
        }
        throw new Error(`Erro ao buscar template: ${error.message}`);
      }

      return data;
    },
    enabled: !!id,
  });
};

// Hook para criar um novo template
export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { getCurrentUserId, isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: async (
      templateData: CreateTemplateData
    ): Promise<DocumentTemplate> => {
      // Verificar se o usuário está autenticado
      if (!isAuthenticated()) {
        // Para demonstração, definir user_id como null quando não autenticado
        // Em produção, isso deve redirecionar para login

        const insertData = {
          ...templateData,
          user_id: null, // Definir como null para evitar violação de chave estrangeira
          is_system_template: false,
          is_active: true,
          usage_count: 0,
        };

        const { data, error } = await supabase
          .from("document_templates")
          .insert(insertData)
          .select()
          .single();

        if (error) {
          throw new Error(`Erro ao criar template: ${error.message}`);
        }

        return data;
      }

      // Usuário autenticado - usar o ID real
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("Usuário não encontrado");
      }

      const insertData = {
        ...templateData,
        user_id: userId,
        is_system_template: false,
        is_active: true,
        usage_count: 0,
      };

      const { data, error } = await supabase
        .from("document_templates")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar template: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Sucesso",
        description: "Template criado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook para atualizar um template
export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      ...updateData
    }: UpdateTemplateData): Promise<DocumentTemplate> => {
      const { data, error } = await supabase
        .from("document_templates")
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar template: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["template", data.id] });
      toast({
        title: "Sucesso",
        description: "Template atualizado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook para deletar um template
export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from("document_templates")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(`Erro ao deletar template: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Sucesso",
        description: "Template deletado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook para duplicar um template
export const useDuplicateTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { getCurrentUserId } = useAuth();

  return useMutation({
    mutationFn: async (templateId: string): Promise<DocumentTemplate> => {
      // Primeiro, buscar o template original
      const { data: originalTemplate, error: fetchError } = await supabase
        .from("document_templates")
        .select("*")
        .eq("id", templateId)
        .single();

      if (fetchError) {
        throw new Error(
          `Erro ao buscar template original: ${fetchError.message}`
        );
      }

      const userId = getCurrentUserId();

      // Criar uma cópia do template
      const duplicateData = {
        name: `${originalTemplate.name} (Cópia)`,
        description: originalTemplate.description,
        document_type: originalTemplate.document_type,
        variables: originalTemplate.variables,
        user_id: userId || null,
        is_system_template: false,
        is_active: true,
        usage_count: 0,
      };

      const { data, error } = await supabase
        .from("document_templates")
        .insert(duplicateData)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao duplicar template: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Sucesso",
        description: "Template duplicado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook para buscar categorias de templates
export const useTemplateCategories = () => {
  return useQuery({
    queryKey: ["template-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("template_categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        throw new Error(`Erro ao buscar categorias: ${error.message}`);
      }

      return data || [];
    },
  });
};
